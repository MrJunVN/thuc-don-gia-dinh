# Trợ lý bếp bằng giọng nói (ChatGPT Project)

Dùng app **ChatGPT** trên Android, không cần code và không tốn tiền API.

## Cài đặt (5 phút, làm 1 lần)

1. Cài app **ChatGPT** từ Google Play và đăng nhập bằng tài khoản cá nhân.
2. Mở menu → **Projects** → **New project**. Đặt tên: `Bếp nhà mình`.
   - Nếu app trên điện thoại không cho tạo Project, làm bước 2 đến 3 trên **chatgpt.com** bằng trình duyệt. Project tạo xong sẽ tự có trên điện thoại.
3. Mở web app https://mrjunvn.github.io/thuc-don-gia-dinh/ → tab **Mẹo** → **🛠️ Cài trợ lý bếp**:
   - Bấm **Copy hướng dẫn**, quay lại ChatGPT, dán vào mục **Instructions** của Project.
   - Bấm **Tải data.js**, rồi thêm file đó vào mục **Files** của Project. File này chứa thực đơn tuần và danh sách đi chợ.
4. Mỗi khi đổi thực đơn trong `data.js`, nhớ tải lại file này lên Project.

## Cách dùng giọng nói

- Mở Project **Bếp nhà mình**, bắt đầu chat mới.
- Bấm biểu tượng **giọng nói** (hình sóng âm cạnh ô nhập) để nói chuyện qua lại.
- Nếu trong Project không thấy nút giọng nói, bấm nút **micro** để đọc thay vì gõ.
- Nói chuyện bằng giọng xong, đoạn mã "xuất cho app" sẽ hiện trong khung chat. Thoát chế độ giọng nói để thấy nút Copy.
- Ví dụ:
  - *"Nhà còn 3 quả trứng, nửa cây bông cải, 300 gam thịt xay. Tối nay nấu gì?"*
  - *"Woolworths đang giảm cá hồi còn 12 đô, có nên đổi món tối thứ Ba không?"*
  - *"Làm hộp cơm cho bé mai thế nào với đồ đang có?"*
- Có thể gửi ảnh tủ lạnh hoặc ảnh chụp màn hình trang Specials của Woolworths cho ChatGPT đọc.

## Đưa kết quả vào web app (không tốn tiền API)

1. Nói chuyện xong, nói hoặc gõ: **"xuất cho app"**.
2. ChatGPT trả về một đoạn mã bắt đầu bằng `{"app":"thuc-don"`. Bấm nút **Copy** ở góc đoạn mã.
3. Mở web app https://mrjunvn.github.io/thuc-don-gia-dinh/, ở tab **Thực đơn** bấm **📋 Dán từ ChatGPT**. Lần đầu Chrome hỏi quyền đọc clipboard thì bấm **Cho phép**.
4. App tự cập nhật: món đang sale, đồ trong tủ lạnh, gợi ý món hôm nay, và bữa nào được đổi món.

---

## Phần hướng dẫn để dán vào Project

Nội dung nằm trong file **[project-instructions.txt](project-instructions.txt)**.
Cách nhanh nhất trên điện thoại: mở web app → tab **Mẹo** → **🛠️ Cài trợ lý bếp** → bấm **Copy hướng dẫn** rồi dán vào ô Instructions của Project.
