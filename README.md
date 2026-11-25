# Thực đơn gia đình 🍚

Web app nhỏ để lên thực đơn tuần cho gia đình 2 người lớn và 1 bé 5 tuổi, ngân sách khoảng $150/tuần, đi chợ ở Woolworths.

## Tính năng
- **Thực đơn**: sáng, trưa mang đi (người lớn và bé, có bữa phụ recess) và tối cho từng ngày. App tự mở đúng ngày hôm nay.
- **Đi chợ**: danh sách có check-box, lọc theo lần đi chợ (Chủ nhật, Thứ Tư, theo tháng). Bấm vào giá để sửa theo giá thực tế. Thanh ngân sách tính tổng số tiền.
- **Sơ chế CN**: checklist các việc làm sẵn chiều Chủ nhật.
- **📋 Dán từ Claude** (tab Thực đơn): chat với Claude trong Project **Bếp nhà mình** (app Claude, dùng gói đăng ký, không tốn tiền API), nói "xuất cho app", copy đoạn mã rồi bấm nút này. App tự cập nhật món đang sale, đồ trong tủ lạnh, gợi ý món hôm nay và bữa nào được đổi món (có nhãn "đã đổi", bấm để về thực đơn gốc).
- **🏷️ Đang sale**: món đang sale (từ mã dán vào). Món có trong danh sách đi chợ có nhãn sale trong tab Đi chợ, giá ước tính tự giảm theo %.
- **🧊 Tủ lạnh**: danh sách đồ đang có ở nhà. Tự thêm/xoá tay được, hoặc cập nhật qua mã dán từ Claude.
- **Mẹo**: mẹo làm hộp cơm cho bé và cách săn đồ giảm giá ở Woolworths.

Trạng thái tick và giá đã sửa được lưu trong `localStorage`, tức là chỉ lưu trên trình duyệt của máy đang dùng.

Mở trên điện thoại: **https://mrjunvn.github.io/thuc-don-gia-dinh/**

## Trợ lý bếp bằng giọng nói
Xem **[CLAUDE_PROJECT.md](CLAUDE_PROJECT.md)**: tạo Project trong app Claude trên điện thoại, nói chuyện qua lại bằng giọng nói, rồi "xuất cho app" để đưa kết quả vào web app. Không cần khoá API.

## Chạy thử
Không cần cài đặt gì, chỉ cần mở `index.html` bằng trình duyệt. Hoặc chạy:

```bash
python3 -m http.server 8000
```

rồi vào http://localhost:8000

## Sửa thực đơn
Toàn bộ món ăn, giá và danh sách mua nằm trong **`data.js`**. Sửa file này là app tự cập nhật.

## Cấu trúc
- `index.html`: khung trang
- `style.css`: giao diện, có hỗ trợ dark mode
- `app.js`: phần xử lý
- `CLAUDE_PROJECT.md`: hướng dẫn tạo trợ lý bếp giọng nói trong app Claude, kèm định dạng mã "xuất cho app"
- `data.js`: dữ liệu thực đơn
- `CONVERSATION.md`: lịch sử trao đổi với Claude để làm tiếp

## Ý tưởng làm tiếp
- [ ] Nhiều tuần thực đơn xoay vòng (tuần A / tuần B)
- [ ] Trang công thức chi tiết cho từng món
- [ ] ~~Tự quét sale Woolworths~~: đã thử, Woolworths chặn (403), không lách. Thay bằng đọc ảnh chụp màn hình
- [ ] Chọn đúng cửa hàng Woolworths gần nhà để giá chính xác hơn
- [ ] Đồng bộ danh sách đi chợ giữa 2 điện thoại
- [x] Deploy lên GitHub Pages (workflow `.github/workflows/pages.yml`, chỉ đưa file của app lên web)
- [x] Tab Tủ lạnh + 📋 Dán kết quả từ Claude Project (không dùng API trả tiền)
- [x] Trợ lý giọng nói qua Claude Project (CLAUDE_PROJECT.md)
