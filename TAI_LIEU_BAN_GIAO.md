# Tài liệu bàn giao: App thực đơn gia đình

File này gom mọi thứ cần biết để làm tiếp app với một trợ lý AI khác (ví dụ ChatGPT).
Cách dùng: tải file này (và các file code nếu cần sửa) lên ChatGPT, rồi nói *"Đọc tài liệu bàn giao này. Mình muốn làm tiếp: ..."*.

---

## 1. Bối cảnh gia đình và yêu cầu

- Gia đình Việt ở Melbourne (Úc): 2 người lớn 36 tuổi (nam, nữ) và 1 bé 5 tuổi sắp vào tiểu học.
- Đi chợ ở **Woolworths** gần nhà. Ngân sách khoảng **$150/tuần**, hơn kém một chút được.
- Ăn kiểu Việt: thường với cơm (70% gạo trắng + 30% gạo lứt) hoặc miến, nhiều rau, nấm, chất xơ.
- **Không dùng yến mạch** (không thích, không phải kiêng gluten). Bánh mì, miến, xì dầu dùng bình thường.
- Hộp cơm trưa của bé: trường **nut-free** (không đậu phộng hay các loại hạt), có túi đá. Bé dễ ăn cơm nắm, trứng cuộn hơn cuốn xà lách.
- Người lớn mang cơm trưa đi làm, thích **cuốn xà lách** nhân tôm, gà, thịt băm. Thích món kiểu **gà hấp xì dầu với rau, nấm**.
- Nấu nhanh, ít nồi: hấp trên xửng nồi cơm điện, 1 chảo, 1 khay lò. Bữa tối nấu dư để làm cơm trưa hôm sau.

## 2. Kế hoạch đã chốt

**Lịch đi chợ:**
- **Chủ nhật** (lần lớn): thịt, trứng, đậu hũ, rau củ cứng, sữa, bánh mì, trái cây.
- **Thứ Tư** (mua thêm): xà lách, rau thơm, cải thìa, dưa leo, tôm, cá. Woolworths đổi catalogue vào thứ Tư.
- **1 lần/tháng**: gạo, miến, nước mắm, xì dầu, dầu hào, dầu mè (đợi nửa giá thì mua dự trữ).
- Sau khoảng 7h tối hay có thịt dán nhãn vàng giảm giá.

**Sơ chế chiều Chủ nhật (45 phút):** rửa và thấm khô xà lách; cắt que cà rốt, dưa leo; ướp gà chia 2 túi cấp đông; luộc trứng và hấp khoai lang; làm thịt băm rim; pha nước chấm.

**Thực đơn tối:**

| Ngày | Tối |
|---|---|
| T2 | Gà hấp xì dầu nấm + cải thìa (xửng nồi cơm điện) |
| T3 | Cá hấp gừng hành + bông cải |
| T4 | Miến xào tôm nấm kim châm (1 chảo) |
| T5 | Đậu hũ sốt cà chua thịt băm + bông cải hấp |
| T6 | Miến gà nấm (1 nồi) |
| T7 | Dọn tủ lạnh: cơm chiên trứng rau củ + canh trứng cà chua |
| CN | Gà đùi nướng khay + khoai lang + bắp + bông cải |

Toàn bộ bữa sáng, trưa (người lớn, bé, recess), danh sách đi chợ có giá ước tính và mẹo nằm trong file **`data.js`**.

## 3. Web app

- Địa chỉ: **https://mrjunvn.github.io/thuc-don-gia-dinh/**
- Mã nguồn: **https://github.com/MrJunVN/thuc-don-gia-dinh** (repo Public của tài khoản cá nhân).
- HTML/CSS/JS thuần, không cần build. Mỗi lần push lên nhánh `main`, GitHub Actions tự deploy lên GitHub Pages.

**Các tab:**
- **Thực đơn**: món từng ngày, tự mở đúng hôm nay. Có nút **📋 Dán từ ChatGPT** và thẻ gợi ý món. Bữa bị đổi có nhãn "đã đổi" và nút về thực đơn gốc.
- **🏷️ Đang sale**: món đang giảm giá (từ mã dán vào).
- **Đi chợ**: check-box, lọc theo lần đi chợ, sửa giá, thanh ngân sách. Món đang sale có nhãn, giá ước tính giảm theo %.
- **🧊 Tủ lạnh**: đồ đang có ở nhà.
- **Sơ chế CN**: checklist.
- **Mẹo**: mục 🛠️ Cài trợ lý bếp (Copy hướng dẫn, Tải data.js) và mẹo nấu, săn sale.

Tick, giá đã sửa, sale, tủ lạnh, đổi món đều lưu trong `localStorage`, tức là chỉ trên trình duyệt của máy đó, không đồng bộ giữa các điện thoại.

**Các file:**

| File | Nội dung |
|---|---|
| `index.html` | Khung trang |
| `style.css` | Giao diện, có dark mode |
| `app.js` | Toàn bộ xử lý |
| `data.js` | Dữ liệu: thực đơn, danh sách đi chợ (mỗi món có `id`), sơ chế, mẹo. **Sửa thực đơn thì sửa file này.** |
| `project-instructions.txt` | Hướng dẫn để dán vào ChatGPT Project, có định dạng mã "xuất cho app" |
| `TRO_LY_BEP_CHATGPT.md` | Hướng dẫn tạo và dùng trợ lý bếp trong ChatGPT |
| `.github/workflows/pages.yml` | Tự deploy, chỉ đưa file của app lên web (không đưa tài liệu) |
| `CONVERSATION.md` | Lịch sử trao đổi |

## 4. Luồng dùng hằng ngày (không tốn tiền API)

1. Mở ChatGPT Project **Bếp nhà mình**, nói chuyện bằng giọng: đồ đang có ở nhà, đồ Woolworths đang sale (có thể gửi ảnh chụp màn hình), muốn đổi món gì.
2. Nói **"xuất cho app"**. ChatGPT trả về đúng một khối mã JSON.
3. Copy, vào web app bấm **📋 Dán từ ChatGPT**.

**Định dạng mã** (app đọc từ dấu `{` đầu tiên đến dấu `}` cuối cùng, nên có chữ thừa xung quanh cũng không sao):

```json
{
  "app": "thuc-don",
  "sale": [{"name": "Tassal Salmon", "size": "500g", "price": 12, "was": 18, "half": false, "match_id": "ca", "label_vi": "Cá hồi"}],
  "tu_lanh": [{"name": "Trứng", "qty": "3 quả"}],
  "goi_y": "Gợi ý món, mỗi món 1 dòng",
  "doi_mon": [{"ngay": "T4", "bua": "toi", "mon": "Cá hồi áp chảo"}]
}
```

- `sale`: cùng ngày thì cộng dồn, sang ngày khác thì thay mới. `match_id` là `id` món trong `data.js`, hoặc `null`.
- `tu_lanh`: thay toàn bộ danh sách cũ.
- `doi_mon`: `ngay` là T2…T7, CN; `bua` là `sang`, `trua`, `trua_be`, `recess`, `toi`.
- Khoá nào không có thì app bỏ qua.

## 5. Những gì đã thử và bỏ

- **Quét giá Woolworths tự động** (từ máy chủ hay GitHub Actions): Woolworths chặn (HTTP 403). Không nên tìm cách lách hệ thống chống bot của họ.
- **Gọi API AI trả tiền ngay trong app** (đọc ảnh sale, gợi ý món): đã làm rồi gỡ, vì không muốn trả tiền API hằng tháng. Thay bằng luồng dán mã ở mục 4.
- Web app không thể đọc dữ liệu bên trong app Woolworths trên điện thoại. Cách thay thế là chụp màn hình rồi gửi cho ChatGPT.

## 6. Lưu ý

- Repo là **Public**. Không ghi địa chỉ nhà, số điện thoại hay thông tin riêng vào bất kỳ file nào trong repo.
- Đổi thực đơn trong `data.js` thì nhớ tải lại file này lên ChatGPT Project.

## 7. Việc làm tiếp

- [ ] Tạo ChatGPT Project "Bếp nhà mình" và thử luồng "xuất cho app" với cuộc trò chuyện thật. Nếu mã sai định dạng thì chỉnh `project-instructions.txt`.
- [ ] Thực đơn xoay vòng 2 tuần (tuần A / tuần B).
- [ ] Công thức chi tiết từng món (bấm vào món để xem).
- [ ] Đồng bộ danh sách đi chợ giữa 2 điện thoại.

## 8. Cách sửa app khi làm với ChatGPT

ChatGPT không tự đẩy code lên GitHub được. Cách đơn giản nhất:
1. Tải file cần sửa lên ChatGPT (thường là `data.js`, `app.js`, `index.html`), nói muốn sửa gì.
2. Nhận file đã sửa, rồi vào GitHub mở đúng file đó, bấm biểu tượng bút chì, dán nội dung mới và bấm **Commit changes**.
3. Khoảng 1 phút sau, web app tự cập nhật.
