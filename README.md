# Thực đơn gia đình 🍚

Web app nhỏ để lên thực đơn tuần cho gia đình 2 người lớn và 1 bé 5 tuổi, ngân sách khoảng $150/tuần, đi chợ ở Woolworths.

## Tính năng
- **Thực đơn**: sáng, trưa mang đi (người lớn và bé, có bữa phụ recess) và tối cho từng ngày. App tự mở đúng ngày hôm nay.
- **Đi chợ**: danh sách có check-box, lọc theo lần đi chợ (Chủ nhật, Thứ Tư, theo tháng). Bấm vào giá để sửa theo giá thực tế. Thanh ngân sách tính tổng số tiền.
- **Sơ chế CN**: checklist các việc làm sẵn chiều Chủ nhật.
- **🏷️ Đang sale**: bấm **📷 Quét ảnh sale**, chọn ảnh chụp màn hình trang Specials trong app Woolworths. Claude đọc ảnh, đánh dấu món đang sale trong tab Đi chợ (giá ước tính tự giảm theo %) và gợi ý món có thể đổi. Chụp nhiều trang trong cùng ngày thì cộng dồn, sang ngày mới thì thay mới.
- **🧊 Tủ lạnh**: ghi đồ đang có ở nhà, bấm **🍳 Gợi ý món** để Claude gợi ý bữa tối và hộp cơm trưa từ đồ có sẵn.
- **Mẹo**: mẹo làm hộp cơm cho bé và cách săn đồ giảm giá ở Woolworths.

Trạng thái tick và giá đã sửa được lưu trong `localStorage`, tức là chỉ lưu trên trình duyệt của máy đang dùng.

Mở trên điện thoại: **https://mrjunvn.github.io/thuc-don-gia-dinh/**

## Khoá Claude API (cho 📷 và 🍳)
1. Vào https://console.anthropic.com, đăng nhập.
2. **Billing**: nạp tiền (mức tối thiểu khoảng $5 là dùng được rất lâu).
3. **API Keys** → **Create Key**, sao chép khoá (bắt đầu bằng `sk-ant-`).
4. Trong app: tab **Mẹo** → **⚙️ Cài đặt khoá Claude API** → dán khoá → **Lưu**.

- App dùng model `claude-opus-5-5`. Mỗi lần quét ảnh hay gợi ý món tốn khoảng vài cent.
- Khoá chỉ lưu trong trình duyệt của máy đó, không lên GitHub. Tất cả trang GitHub Pages của tài khoản `mrjunvn` dùng chung địa chỉ `mrjunvn.github.io`, nên về lý thuyết các trang khác của bạn trên đó cũng đọc được khoá này. Có thể đặt giới hạn chi tiêu (spend limit) trong Console cho yên tâm.

## Trợ lý bếp bằng giọng nói
Xem **[CLAUDE_PROJECT.md](CLAUDE_PROJECT.md)**: tạo Project trong app Claude trên điện thoại rồi nói chuyện qua lại bằng giọng nói.

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
- `ai.js`: gọi Claude (quét ảnh sale, gợi ý món)
- `vendor/anthropic-sdk-1.7.0.js`: thư viện Claude (`@anthropic-ai/sdk` 1.7.0) đóng gói sẵn cho trình duyệt
- `CLAUDE_PROJECT.md`: hướng dẫn tạo trợ lý bếp giọng nói trong app Claude
- `data.js`: dữ liệu thực đơn
- `CONVERSATION.md`: lịch sử trao đổi với Claude để làm tiếp

## Ý tưởng làm tiếp
- [ ] Nhiều tuần thực đơn xoay vòng (tuần A / tuần B)
- [ ] Trang công thức chi tiết cho từng món
- [ ] ~~Tự quét sale Woolworths~~: đã thử, Woolworths chặn (403), không lách. Thay bằng đọc ảnh chụp màn hình
- [ ] Chọn đúng cửa hàng Woolworths gần nhà để giá chính xác hơn
- [ ] Đồng bộ danh sách đi chợ giữa 2 điện thoại
- [x] Deploy lên GitHub Pages (workflow `.github/workflows/pages.yml`, chỉ đưa file của app lên web)
- [x] Quét ảnh sale + tab Tủ lạnh
- [x] Trợ lý giọng nói qua Claude Project (CLAUDE_PROJECT.md)
- [ ] Nút 🎤 nói chuyện bằng giọng ngay trong web app
