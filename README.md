# Thực đơn gia đình 🍚

Web app nhỏ để lên thực đơn tuần cho gia đình 2 người lớn và 1 bé 5 tuổi, ngân sách khoảng $150/tuần, đi chợ ở Woolworths.

## Tính năng
- **Thực đơn**: sáng, trưa mang đi (người lớn và bé, có bữa phụ recess) và tối cho từng ngày. App tự mở đúng ngày hôm nay.
- **Đi chợ**: danh sách có check-box, lọc theo lần đi chợ (Chủ nhật, Thứ Tư, theo tháng). Bấm vào giá để sửa theo giá thực tế. Thanh ngân sách tính tổng số tiền.
- **Sơ chế CN**: checklist các việc làm sẵn chiều Chủ nhật.
- **Mẹo**: mẹo làm hộp cơm cho bé và cách săn đồ giảm giá ở Woolworths.

Trạng thái tick và giá đã sửa được lưu trong `localStorage`, tức là chỉ lưu trên trình duyệt của máy đang dùng.

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
- `data.js`: dữ liệu thực đơn
- `CONVERSATION.md`: lịch sử trao đổi với Claude để làm tiếp

## Ý tưởng làm tiếp
- [ ] Nhiều tuần thực đơn xoay vòng (tuần A / tuần B)
- [ ] Trang công thức chi tiết cho từng món
- [ ] Dán danh sách specials của Woolworths vào để tự gợi ý đổi món
- [ ] Đồng bộ danh sách đi chợ giữa 2 điện thoại
- [ ] Deploy lên GitHub Pages
