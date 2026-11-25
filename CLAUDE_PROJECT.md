# Trợ lý bếp bằng giọng nói (Claude Project)

Dùng app **Claude** trên Android, không cần code và không cần khoá API.

## Cài đặt (5 phút, làm 1 lần)

1. Cài app **Claude** từ Google Play và đăng nhập.
2. Mở menu → **Projects** → **Create project**. Đặt tên: `Bếp nhà mình`.
3. Mở web app https://mrjunvn.github.io/thuc-don-gia-dinh/ → tab **Mẹo** → **🛠️ Cài trợ lý bếp**:
   - Bấm **Copy hướng dẫn**, quay lại app Claude, dán vào mục **Instructions** của Project.
   - Bấm **Tải data.js**, rồi tải file đó lên mục **Files / Knowledge** của Project. File này chứa thực đơn tuần và danh sách đi chợ.
4. Mỗi khi đổi thực đơn trong `data.js`, nhớ tải lại file này lên Project.

## Cách dùng giọng nói

- Mở Project **Bếp nhà mình**, bắt đầu chat mới.
- Bấm biểu tượng **giọng nói** (hình sóng âm cạnh ô nhập) để nói chuyện qua lại.
- Ví dụ:
  - *"Nhà còn 3 quả trứng, nửa cây bông cải, 300 gam thịt xay. Tối nay nấu gì?"*
  - *"Woolworths đang giảm cá hồi còn 12 đô, có nên đổi món tối thứ Ba không?"*
  - *"Làm hộp cơm cho bé mai thế nào với đồ đang có?"*
- Có thể gửi ảnh tủ lạnh hoặc ảnh chụp màn hình trang Specials của Woolworths cho Claude đọc.

## Đưa kết quả vào web app (không tốn tiền API)

1. Nói chuyện xong, nói hoặc gõ: **"xuất cho app"**.
2. Claude trả về một đoạn mã bắt đầu bằng `{"app":"thuc-don"`. Bấm nút **Copy** ở góc đoạn mã.
3. Mở web app https://mrjunvn.github.io/thuc-don-gia-dinh/, ở tab **Thực đơn** bấm **📋 Dán từ Claude**. Lần đầu Chrome hỏi quyền đọc clipboard thì bấm **Cho phép**.
4. App tự cập nhật: món đang sale, đồ trong tủ lạnh, gợi ý món hôm nay, và bữa nào được đổi món.

---

## Phần hướng dẫn để dán vào Project

Nội dung nằm trong file **[project-instructions.txt](project-instructions.txt)**.
Cách nhanh nhất trên điện thoại: mở web app → tab **Mẹo** → **🛠️ Cài trợ lý bếp** → bấm **Copy hướng dẫn** rồi dán vào ô Instructions của Project.
