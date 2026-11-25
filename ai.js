// Gọi Claude từ trình duyệt bằng khoá API của chính người dùng (lưu trong localStorage của máy họ).
// Khoá không bao giờ được ghi vào repo hay gửi đi đâu ngoài api.anthropic.com.
import Anthropic from "./vendor/anthropic-sdk-1.7.0.js";

const MODEL = "claude-opus-5-5";
const KEY_STORE = "anthropicKey";

function getKey() { try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; } }
function setKey(k) { try { k ? localStorage.setItem(KEY_STORE, k.trim()) : localStorage.removeItem(KEY_STORE); } catch {} }

function client() {
  const apiKey = getKey();
  if (!apiKey) throw new Error("NO_KEY");
  // dangerouslyAllowBrowser: app chỉ chạy trên máy của chủ khoá, khoá không nằm trong mã nguồn.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

// Gọi chung: có fallback mặc định khi bị từ chối, kiểm tra stop_reason trước khi đọc nội dung.
async function ask(params) {
  const res = await client().beta.messages.create({
    model: MODEL,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    ...params,
  });
  if (res.stop_reason === "refusal") throw new Error("REFUSED");
  if (res.stop_reason === "max_tokens") throw new Error("TOO_LONG");
  return res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

// Thu nhỏ ảnh chụp màn hình (tối đa 1568px cạnh dài) để gửi nhanh và rẻ hơn.
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 1568 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("BAD_IMAGE")); };
    img.src = url;
  });
}

const SALE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["deals"],
  properties: {
    deals: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "size", "price", "was", "half", "match_id", "label_vi"],
        properties: {
          name: { type: "string", description: "Tên sản phẩm đúng như trên ảnh" },
          size: { type: ["string", "null"] },
          price: { type: "number", description: "Giá sale hiện tại (AUD)" },
          was: { type: ["number", "null"], description: "Giá gốc nếu có" },
          half: { type: "boolean", description: "Có phải nửa giá (Half Price) không" },
          match_id: { type: ["string", "null"], description: "id món trong danh sách đi chợ nếu khớp, ngược lại null" },
          label_vi: { type: "string", description: "Tên ngắn tiếng Việt, ví dụ 'Cá hồi'" },
        },
      },
    },
  },
};

// Đọc 1 hoặc nhiều ảnh chụp trang Specials của Woolworths.
async function scanSale(files, shoppingItems) {
  const images = [];
  for (const f of files) {
    images.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: await imageToBase64(f) } });
  }
  const list = shoppingItems.map((it) => `${it.id}: ${it.name}`).join("\n");
  const text = await ask({
    max_tokens: 16000,
    output_config: { effort: "low", format: { type: "json_schema", schema: SALE_SCHEMA } },
    messages: [{
      role: "user",
      content: [
        ...images,
        { type: "text", text:
`Đây là ảnh chụp màn hình trang giảm giá trong app Woolworths (Úc).
Liệt kê mọi sản phẩm THỰC PHẨM đang giảm giá nhìn thấy trong ảnh, bỏ qua đồ không phải thực phẩm.
Chỉ ghi giá đọc được rõ ràng trên ảnh, không đoán.
Với mỗi sản phẩm, nếu nó thay được cho một món trong danh sách đi chợ dưới đây thì ghi id món đó vào match_id, nếu không thì null.

Danh sách đi chợ (id: tên):
${list}` },
      ],
    }],
  });
  return JSON.parse(text).deals;
}

// Gợi ý món từ đồ có sẵn trong tủ lạnh.
async function fridgeIdeas({ fridge, question, menuToday, sales }) {
  return ask({
    max_tokens: 16000,
    output_config: { effort: "medium" },
    system:
`Bạn là trợ lý bếp cho một gia đình Việt ở Melbourne: 2 người lớn 36 tuổi và 1 bé 5 tuổi sắp vào tiểu học.
Ngân sách đi chợ khoảng $150/tuần ở Woolworths. Ăn kiểu Việt, thường với cơm hoặc miến, nhiều rau và chất xơ.
Không dùng yến mạch (không thích). Hộp cơm của bé phải không có các loại hạt (trường nut-free).
Ưu tiên món nấu nhanh, ít nồi: hấp trên xửng nồi cơm điện, 1 chảo, 1 khay lò.
Trả lời bằng tiếng Việt, ngắn gọn, dễ đọc trên điện thoại. Ưu tiên dùng hết đồ sắp hỏng trước.
Nếu đồ có sẵn chưa đủ, nói rõ cần mua thêm gì.`,
    messages: [{
      role: "user",
      content:
`Đồ đang có ở nhà:
${fridge.length ? fridge.map((f) => `- ${f.name}${f.qty ? ` (${f.qty})` : ""}`).join("\n") : "(chưa ghi gì)"}

Thực đơn dự kiến hôm nay: ${menuToday}
${sales && sales.length ? `Đang giảm giá ở Woolworths: ${sales.join(", ")}` : ""}

${question || "Gợi ý 2–3 món cho bữa tối nay và hộp cơm trưa mai, dùng đồ đang có."}`,
    }],
  });
}

window.AI = { getKey, setKey, scanSale, fridgeIdeas, ready: true };
window.dispatchEvent(new Event("ai-ready"));
