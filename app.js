(function () {
  const D = window.APP_DATA;
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);

  $("#budget-label").textContent = money(D.budget);

  // Tabs
  document.querySelectorAll("nav button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach((x) => x.classList.toggle("active", x === b));
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + b.dataset.tab));
    store.set("tab", b.dataset.tab);
  }));
  const savedTab = store.get("tab", "menu");
  const tb = document.querySelector(`nav button[data-tab="${savedTab}"]`);
  if (tb) tb.click();

  // Menu
  const jsDay = new Date().getDay(); // 0=CN
  let dayIdx = jsDay === 0 ? 6 : jsDay - 1;
  function renderDay() {
    $("#day-pills").innerHTML = D.week.map((d, i) =>
      `<button data-i="${i}" class="${i === dayIdx ? "active" : ""}">${esc(d.short)}</button>`).join("");
    const d = D.week[dayIdx];
    const kidLunch = d.lunchKid && d.lunchKid !== d.lunchAdult
      ? `<span class="kid"><span class="badge">Bé</span>${esc(d.lunchKid)}${d.recess ? ` · <span class="badge">Recess</span>${esc(d.recess)}` : ""}</span>` : "";
    $("#day-card").innerHTML = `<div class="card"><h2 style="margin:0 0 4px">${esc(d.day)}</h2>
      <div class="meal"><div class="label">Sáng</div>${esc(d.breakfast)}</div>
      <div class="meal"><div class="label">Trưa (mang đi)</div>${esc(d.lunchAdult)}${kidLunch}</div>
      <div class="meal"><div class="label">Tối</div>${esc(d.dinner)}</div></div>`;
  }
  $("#day-pills").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    dayIdx = +b.dataset.i; renderDay();
  });
  renderDay();

  // Shopping
  let checked = store.get("checked", {});
  let prices = store.get("prices", {});
  let trip = "all";
  let SP = null; // dữ liệu specials.json
  const saleOf = (id) => (SP && SP.items && SP.items[id] && SP.items[id].specials[0]) || null;
  // Giá ước tính khi sale: giảm theo đúng tỉ lệ sale (giá mới / giá cũ), vì gói sale có thể khác cỡ gói cần mua.
  const saleRatio = (id) => { const sp = saleOf(id); return sp && sp.was ? sp.price / sp.was : 1; };
  const priceOf = (it) => prices[it.id] ?? Math.round(it.price * saleRatio(it.id) * 2) / 2;

  function saleTag(id) {
    const sp = saleOf(id); if (!sp) return "";
    const off = sp.was ? ` -${Math.round((1 - sp.price / sp.was) * 100)}%` : "";
    return `<span class="sale-tag">${sp.half ? "½ giá" : "Sale" + off}</span>`;
  }
  function renderShop() {
    let planned = 0, spent = 0;
    $("#shop-list").innerHTML = D.shopping.map((g) => {
      const items = g.items.filter((it) => trip === "all" || it.trip === trip);
      g.items.forEach((it) => { if (!g.monthly) { planned += priceOf(it); if (checked[it.id]) spent += priceOf(it); } });
      if (!items.length) return "";
      return `<div class="group"><h3>${esc(g.group)}</h3>` + items.map((it) => `
        <label class="item ${checked[it.id] ? "done" : ""}">
          <input type="checkbox" data-id="${it.id}" ${checked[it.id] ? "checked" : ""}>
          <span class="name">${esc(it.name)}${saleTag(it.id)}${it.note ? `<span class="note">${esc(it.note)}</span>` : ""}</span>
          <input class="price" inputmode="decimal" data-price="${it.id}" value="${priceOf(it)}" aria-label="Giá">
        </label>`).join("") + `</div>`;
    }).join("");
    $("#spent").textContent = money(spent);
    $("#planned").textContent = money(planned) + " / " + money(D.budget);
    const fill = $("#bar-fill");
    fill.style.width = Math.min(100, (spent / D.budget) * 100) + "%";
    fill.classList.toggle("over", planned > D.budget);
  }
  $("#shop-list").addEventListener("change", (e) => {
    if (e.target.dataset.id) { checked[e.target.dataset.id] = e.target.checked; store.set("checked", checked); renderShop(); }
    if (e.target.dataset.price) {
      const v = parseFloat(e.target.value.replace(",", "."));
      if (!isNaN(v)) prices[e.target.dataset.price] = v; else delete prices[e.target.dataset.price];
      store.set("prices", prices); renderShop();
    }
  });
  document.querySelectorAll(".filter button").forEach((b) => b.addEventListener("click", () => {
    trip = b.dataset.trip;
    document.querySelectorAll(".filter button").forEach((x) => x.classList.toggle("active", x === b));
    renderShop();
  }));
  $("#reset-shop").addEventListener("click", () => { checked = {}; store.set("checked", checked); renderShop(); });
  $("#schedule").innerHTML = D.shoppingSchedule.map((s) =>
    `<div class="card sched"><strong>${esc(s.when)}</strong><br>${esc(s.what)}<br><span class="muted small">${esc(s.why)}</span></div>`).join("");
  renderShop();

  // Prep
  let prepDone = store.get("prep", {});
  function renderPrep() {
    $("#prep-list").innerHTML = D.prep.map((p, i) =>
      `<li class="${prepDone[i] ? "done" : ""}"><input type="checkbox" data-p="${i}" ${prepDone[i] ? "checked" : ""}><span>${esc(p)}</span></li>`).join("");
  }
  $("#prep-list").addEventListener("change", (e) => { prepDone[e.target.dataset.p] = e.target.checked; store.set("prep", prepDone); renderPrep(); });
  renderPrep();

  // Sale tab
  const names = {}; D.shopping.forEach((g) => g.items.forEach((it) => { names[it.id] = it.name; }));
  function product(p) {
    const link = p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>` : esc(p.name);
    return `${link}${p.size ? ` <span class="muted small">${esc(p.size)}</span>` : ""}<br>
      <strong>${money(p.price)}</strong>${p.was ? `<span class="was">${money(p.was)}</span>` : ""}
      ${p.half ? '<span class="sale-tag">½ giá</span>' : ""}${p.cup ? ` <span class="muted small">· ${esc(p.cup)}</span>` : ""}`;
  }
  function renderSale() {
    if (!SP || !SP.items) {
      $("#sale-meta").textContent = "Chưa có dữ liệu sale. Chụp màn hình trang Specials trong app Woolworths rồi bấm 📷 bên trên.";
      return;
    }
    const when = SP.updated ? new Date(SP.updated).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "?";
    let meta = `Cập nhật: ${when} · ${esc(SP.source || "")}`;
    if (SP.last_error) meta += ` · ⚠️ lần quét gần nhất có lỗi`;
    $("#sale-meta").innerHTML = meta;
    const rows = Object.entries(SP.items).filter(([, v]) => v.specials && v.specials.length);
    $("#sale-list").innerHTML = rows.length
      ? `<div class="card">${rows.map(([id, v]) => `<div class="sale-row"><div class="vn">${esc(names[id] || id)}</div>${product(v.specials[0])}</div>`).join("")}</div>`
      : `<p class="muted">Hôm nay không có món nào trong danh sách đang sale.</p>`;
    $("#sale-extras").innerHTML = (SP.extras || []).length
      ? `<div class="card">${SP.extras.map((p) => `<div class="sale-row"><div class="vn">${esc(p.label || p.name)}</div>${product(p)}</div>`).join("")}</div>`
      : `<p class="muted">Không có gợi ý.</p>`;
  }
  // Dữ liệu sale: ưu tiên kết quả quét ảnh lưu trên máy; không có thì dùng specials.json (nếu có).
  function salesFromDeals(deals, when) {
    const items = {}, extras = [];
    deals.forEach((d) => {
      const p = { name: d.name, size: d.size, price: d.price, was: d.was, half: d.half, special: true, label: d.label_vi };
      if (d.match_id && names[d.match_id]) (items[d.match_id] = items[d.match_id] || { specials: [] }).specials.push(p);
      else extras.push(p);
    });
    Object.values(items).forEach((v) => v.specials.sort((a, b) => a.price - b.price));
    return { updated: when, source: "từ ảnh chụp màn hình app Woolworths", items, extras };
  }
  function loadSales() {
    const mine = store.get("saleScan", null);
    if (mine && mine.deals) { SP = salesFromDeals(mine.deals, mine.updated); renderSale(); renderShop(); return; }
    fetch("specials.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { SP = j; })
      .catch(() => {})
      .finally(() => { renderSale(); renderShop(); });
  }
  loadSales();

  const aiError = (e) => {
    const m = String(e && e.message || e);
    if (m === "NO_KEY") return "Chưa có khoá Claude API. Vào tab Mẹo → Cài đặt để nhập khoá.";
    if (m === "REFUSED") return "Claude từ chối yêu cầu này. Thử lại với ảnh khác.";
    if (e && e.status === 401) return "Khoá API không đúng. Kiểm tra lại trong tab Mẹo → Cài đặt.";
    if (e && e.status === 429) return "Gọi hơi nhiều, đợi 1 phút rồi thử lại.";
    if (e && (e.status === 400) && /credit/i.test(m)) return "Tài khoản API hết tiền. Nạp thêm ở console.anthropic.com.";
    if (m === "BAD_IMAGE") return "Không đọc được ảnh này.";
    return "Lỗi: " + m;
  };
  const withAI = (fn) => (window.AI ? fn() : window.addEventListener("ai-ready", fn, { once: true }));

  $("#scan-input").addEventListener("change", (e) => {
    const files = [...e.target.files]; e.target.value = "";
    if (!files.length) return;
    const st = $("#scan-status"); st.textContent = `⏳ Đang đọc ${files.length} ảnh… (khoảng 10–30 giây)`;
    const items = []; D.shopping.forEach((g) => g.items.forEach((it) => items.push({ id: it.id, name: it.name })));
    withAI(() => window.AI.scanSale(files, items)
      .then((deals) => {
        const prev = store.get("saleScan", null);
        // Cùng ngày thì cộng dồn (chụp nhiều trang), khác ngày thì thay mới.
        const today = new Date().toDateString();
        const keep = prev && prev.deals && new Date(prev.updated).toDateString() === today ? prev.deals : [];
        const seen = new Set(keep.map((d) => d.name + d.price));
        const all = keep.concat(deals.filter((d) => !seen.has(d.name + d.price)));
        store.set("saleScan", { updated: new Date().toISOString(), deals: all });
        st.textContent = `✅ Đọc được ${deals.length} món đang sale.`;
        loadSales();
      })
      .catch((err) => { st.textContent = "⚠️ " + aiError(err); }));
  });
  $("#scan-clear").addEventListener("click", () => {
    store.set("saleScan", null); SP = null; $("#scan-status").textContent = "Đã xoá dữ liệu sale."; loadSales();
  });

  // Tủ lạnh
  let fridge = store.get("fridge", []);
  function renderFridge() {
    $("#fridge-list").innerHTML = fridge.length
      ? fridge.map((f, i) => `<li><span>${esc(f.name)}${f.qty ? ` <span class="muted small">${esc(f.qty)}</span>` : ""}</span>
          <button class="link" data-del="${i}" aria-label="Xoá">Xoá</button></li>`).join("")
      : `<li class="muted">Chưa có gì. Thêm đồ đang có ở nhà ở ô bên trên.</li>`;
  }
  $("#fridge-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fridge-name").value.trim(); if (!name) return;
    fridge.push({ name, qty: $("#fridge-qty").value.trim() });
    store.set("fridge", fridge); $("#fridge-name").value = ""; $("#fridge-qty").value = ""; renderFridge();
    $("#fridge-name").focus();
  });
  $("#fridge-list").addEventListener("click", (e) => {
    const i = e.target.dataset.del; if (i === undefined) return;
    fridge.splice(+i, 1); store.set("fridge", fridge); renderFridge();
  });
  $("#fridge-ask").addEventListener("click", () => {
    const out = $("#fridge-answer"); out.textContent = "⏳ Claude đang nghĩ món…";
    const d = D.week[(new Date().getDay() + 6) % 7];
    const sales = SP && SP.items ? Object.entries(SP.items).filter(([, v]) => v.specials && v.specials.length)
      .map(([id, v]) => `${names[id] || id} ${money(v.specials[0].price)}`).concat((SP.extras || []).map((p) => `${p.label || p.name} ${money(p.price)}`)) : [];
    withAI(() => window.AI.fridgeIdeas({
      fridge, question: $("#fridge-question").value.trim(),
      menuToday: `sáng: ${d.breakfast}; trưa: ${d.lunchAdult}; tối: ${d.dinner}`, sales,
    }).then((t) => { out.textContent = t; }).catch((err) => { out.textContent = "⚠️ " + aiError(err); }));
  });
  renderFridge();

  // Cài đặt khoá API
  function renderKey() {
    const k = window.AI ? window.AI.getKey() : "";
    $("#key-status").textContent = k ? `Đã lưu khoá (…${k.slice(-4)}) trên máy này.` : "Chưa có khoá.";
  }
  $("#key-save").addEventListener("click", () => withAI(() => {
    window.AI.setKey($("#key-input").value); $("#key-input").value = ""; renderKey();
  }));
  $("#key-remove").addEventListener("click", () => withAI(() => { window.AI.setKey(""); renderKey(); }));
  withAI(renderKey);

  // Tips
  $("#tips-list").innerHTML = D.tips.map((t) => `<li>${esc(t)}</li>`).join("");
})();
