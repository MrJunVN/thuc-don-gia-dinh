"""Quét giá Woolworths cho các món trong danh sách đi chợ, ghi ra specials.json.

Chạy hằng ngày bằng GitHub Actions (.github/workflows/pages.yml).
Dùng trình duyệt thật (Playwright) mở trang Woolworths rồi gọi API tìm kiếm
từ chính trang đó, để có cookie hợp lệ.

Nếu bị chặn hoặc lỗi: giữ lại dữ liệu cũ, ghi lỗi vào trường "last_error",
và thoát với mã 0 để web vẫn deploy được.

Chạy tay:  python scripts/scan_specials.py [đường_dẫn_ra]
"""
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "specials.json")

# id trong data.js -> các từ khoá tìm trên Woolworths
ITEMS = {
    "ga-thigh": ["chicken thigh fillet"],
    "ga-drum": ["chicken drumsticks"],
    "heo-xay": ["pork mince"],
    "tom": ["raw prawns frozen"],
    "ca": ["basa fillets", "barramundi fillets"],
    "trung": ["free range eggs 12"],
    "dau-hu": ["firm tofu"],
    "bong-cai": ["broccoli"],
    "ca-rot": ["carrots"],
    "khoai-lang": ["sweet potato"],
    "bap": ["corn cobs"],
    "xa-lach": ["cos lettuce"],
    "dua-leo": ["cucumber"],
    "ca-chua": ["cherry tomatoes"],
    "nam": ["cup mushrooms"],
    "kim-cham": ["enoki mushroom"],
    "cai-thia": ["bok choy"],
    "rau-thom": ["spring onions"],
    "chuoi": ["bananas"],
    "tao": ["apples"],
    "dau": ["strawberries"],
    "sua": ["full cream milk 3l"],
    "yoghurt": ["greek yoghurt 1kg"],
    "banh-mi": ["wholemeal bread"],
    "pho-mai": ["cheese slices"],
    "gao": ["jasmine rice 5kg", "brown rice"],
    "mien": ["vermicelli"],
    "nuoc-cham": ["oyster sauce", "soy sauce", "fish sauce"],
    "chia": ["chia seeds"],
}

# Món có thể đổi sang nếu đang sale (gợi ý thêm)
EXTRAS = {
    "Cá hồi": "salmon fillets",
    "Ức gà": "chicken breast fillet",
    "Bò xay": "beef mince",
    "Ba chỉ heo": "pork belly",
    "Cá barramundi": "barramundi",
    "Bánh tráng": "rice paper",
    "Bún gạo": "rice noodles",
    "Đậu que": "green beans",
    "Bí ngòi": "zucchini",
    "Dưa hấu": "watermelon",
}

TOP_N = 8  # số kết quả đầu mỗi lần tìm được xét

SEARCH_JS = """
async (term) => {
  const r = await fetch('/apis/ui/Search/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify({
      SearchTerm: term, PageSize: 24, PageNumber: 1, SortType: 'TraderRelevance',
      Location: '/shop/search/products?searchTerm=' + encodeURIComponent(term),
      Filters: [], IsSpecial: false, EnableAdReRanking: false, GroupEdmVariants: true
    })
  });
  if (!r.ok) return {error: 'HTTP ' + r.status};
  return await r.json();
}
"""


def simplify(p):
    price = p.get("Price") or p.get("InstorePrice")
    was = p.get("WasPrice") or p.get("InstoreWasPrice")
    stock = p.get("Stockcode")
    return {
        "name": p.get("DisplayName") or p.get("Name"),
        "size": p.get("PackageSize"),
        "price": price,
        "was": was if was and price and was > price else None,
        "cup": p.get("CupString"),
        "special": bool(p.get("IsOnSpecial") or p.get("InstoreIsOnSpecial")),
        "half": bool(p.get("IsHalfPrice") or p.get("InstoreIsHalfPrice")),
        "url": f"https://www.woolworths.com.au/shop/productdetails/{stock}/{p.get('UrlFriendlyName', '')}" if stock else None,
    }


def parse(data):
    out = []
    for bundle in (data or {}).get("Products") or []:
        for p in bundle.get("Products") or []:
            s = simplify(p)
            if s["price"] and p.get("IsAvailable", True):
                out.append(s)
    return out[:TOP_N]


def load_old():
    try:
        return json.loads(OUT.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main():
    now = datetime.now(timezone.utc).isoformat(timespec="minutes")
    old = load_old()
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        old["last_error"] = "Chưa cài playwright"
        old["checked_at"] = now
        OUT.write_text(json.dumps(old, ensure_ascii=False, indent=1), encoding="utf-8")
        return

    items, extras, errors = {}, [], []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            page = browser.new_page(
                locale="en-AU",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                           "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            )
            page.goto("https://www.woolworths.com.au/", wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(3000)

            def search(term):
                res = page.evaluate(SEARCH_JS, term)
                time.sleep(1.2)  # lịch sự với server
                if isinstance(res, dict) and res.get("error"):
                    errors.append(f"{term}: {res['error']}")
                    return []
                return parse(res)

            for item_id, terms in ITEMS.items():
                found = []
                for t in terms:
                    found += search(t)
                specials = [p for p in found if p["special"]]
                items[item_id] = {
                    "regular": found[0] if found else None,
                    "specials": sorted(specials, key=lambda p: (not p["half"], p["price"]))[:3],
                }

            for label, term in EXTRAS.items():
                for p in search(term):
                    if p["special"]:
                        extras.append({"label": label, **p})
                        break
            browser.close()
    except Exception as e:  # bị chặn / timeout
        errors.append(f"{type(e).__name__}: {e}"[:300])

    got_any = any(v["regular"] for v in items.values())
    if not got_any:
        old["checked_at"] = now
        old["last_error"] = "; ".join(errors[:3]) or "Không lấy được dữ liệu"
        OUT.write_text(json.dumps(old, ensure_ascii=False, indent=1), encoding="utf-8")
        print("SCAN FAILED:", old["last_error"])
        return

    result = {
        "updated": now,
        "checked_at": now,
        "source": "woolworths.com.au (giá online mặc định, có thể lệch theo cửa hàng)",
        "last_error": "; ".join(errors[:3]) or None,
        "items": items,
        "extras": extras,
    }
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    n = sum(1 for v in items.values() if v["specials"])
    print(f"OK: {len(items)} món, {n} món đang sale, {len(extras)} gợi ý")


if __name__ == "__main__":
    main()
