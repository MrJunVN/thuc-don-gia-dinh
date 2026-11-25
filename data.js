// Dữ liệu thực đơn — sửa file này để đổi món, giá, danh sách mua.
// Gia đình: 2 người lớn (36t) + 1 bé 5 tuổi. Ngân sách ~ $150/tuần. Không yến mạch.

window.APP_DATA = {
  budget: 150,

  shoppingSchedule: [
    { when: "Chủ nhật (lần lớn)", what: "Thịt, trứng, đậu hũ, rau củ cứng, sữa, bánh mì, trái cây", why: "Có thời gian sơ chế cho cả tuần" },
    { when: "Thứ Tư (mua thêm)", what: "Xà lách, rau thơm, cải thìa, dưa leo, tôm, cá", why: "Catalogue mới bắt đầu thứ Tư; rau lá tươi đến thứ Bảy" },
    { when: "1 lần/tháng", what: "Gạo 5kg (+ gạo lứt), miến, nước mắm, xì dầu, dầu hào, dầu mè", why: "Đồ khô để lâu được" }
  ],

  // trip: "cn" = Chủ nhật, "t4" = Thứ Tư, "thang" = mua theo tháng
  shopping: [
    { group: "Đạm", items: [
      { id: "ga-thigh", name: "Đùi gà rút xương (thigh fillet) 1.5kg", price: 21, trip: "cn", note: "Chia 2 túi: gà hấp T2, miến gà T6" },
      { id: "ga-drum", name: "Đùi gà (drumsticks) 1kg", price: 6, trip: "cn" },
      { id: "heo-xay", name: "Thịt heo xay 500g", price: 6, trip: "cn", note: "200g rim CN, 300g sốt cà T5" },
      { id: "tom", name: "Tôm sống đông lạnh bóc vỏ 500g", price: 13, trip: "t4" },
      { id: "ca", name: "Cá phi lê đông lạnh (basa/barramundi) 500g", price: 8, trip: "cn" },
      { id: "trung", name: "Trứng 18 quả", price: 9, trip: "cn" },
      { id: "dau-hu", name: "Đậu hũ cứng 2 hộp", price: 6, trip: "cn" }
    ]},
    { group: "Rau củ & trái cây", items: [
      { id: "bong-cai", name: "Bông cải 2 cây", price: 6, trip: "cn" },
      { id: "ca-rot", name: "Cà rốt 1kg", price: 2, trip: "cn" },
      { id: "khoai-lang", name: "Khoai lang 2kg", price: 6, trip: "cn" },
      { id: "bap", name: "Bắp 4 trái", price: 4, trip: "cn" },
      { id: "xa-lach", name: "Xà lách cos (gói 2)", price: 4, trip: "cn", note: "Mua thêm 1 gói T4 nếu hết" },
      { id: "dua-leo", name: "Dưa leo 3 trái", price: 4, trip: "t4" },
      { id: "ca-chua", name: "Cà chua bi + cà chua thường", price: 5, trip: "cn" },
      { id: "nam", name: "Nấm (nút/đông cô) 400g", price: 5, trip: "cn" },
      { id: "kim-cham", name: "Nấm kim châm 2 gói", price: 5, trip: "t4" },
      { id: "cai-thia", name: "Cải thìa 2 bó", price: 6, trip: "cn" },
      { id: "rau-thom", name: "Hành lá, ngò, gừng, tỏi", price: 5, trip: "t4" },
      { id: "chuoi", name: "Chuối 1kg", price: 4, trip: "cn" },
      { id: "tao", name: "Táo 1kg", price: 5, trip: "cn" },
      { id: "dau", name: "Dâu tây 1 hộp", price: 4, trip: "t4" }
    ]},
    { group: "Sữa & bánh", items: [
      { id: "sua", name: "Sữa 3L", price: 5, trip: "cn" },
      { id: "yoghurt", name: "Yoghurt Hy Lạp 1kg", price: 6, trip: "cn" },
      { id: "banh-mi", name: "Bánh mì nguyên cám", price: 4, trip: "cn" },
      { id: "pho-mai", name: "Phô mai lát", price: 4, trip: "cn" }
    ]},
    { group: "Đồ khô (mua theo tháng — không tính vào $150)", monthly: true, items: [
      { id: "gao", name: "Gạo trắng 5kg + gạo lứt 1kg", price: 18, trip: "thang", note: "Nấu 70% trắng + 30% lứt" },
      { id: "mien", name: "Miến", price: 4, trip: "thang" },
      { id: "nuoc-cham", name: "Nước mắm, xì dầu, dầu hào, dầu mè", price: 12, trip: "thang", note: "Đợi nửa giá thì mua dự trữ" },
      { id: "chia", name: "Hạt chia (tuỳ chọn)", price: 5, trip: "thang" }
    ]}
  ],

  prep: [
    "Rửa xà lách, thấm thật khô bằng khăn giấy, cho vào hộp (giữ 4–5 ngày)",
    "Cắt cà rốt + dưa leo thành que, cho vào hộp",
    "Ướp đùi gà rút xương, chia 2 túi cấp đông (gà hấp T2, miến gà T6)",
    "Luộc 6 quả trứng + hấp khoai lang (cho sáng T2)",
    "Làm thịt băm rim (200g) để cuốn xà lách T4",
    "Pha 1 hũ nước chấm (mắm, đường, chanh, tỏi)"
  ],

  // Mỗi ngày: sáng, trưa người lớn, trưa bé, recess bé, tối
  week: [
    { day: "Thứ 2", short: "T2",
      breakfast: "Khoai lang hấp + trứng luộc + sữa",
      lunchAdult: "Cuốn xà lách gà xé + miến + nước chấm",
      lunchKid: "Cơm nắm gà xé, dưa leo, cà chua bi",
      recess: "Táo cắt + phô mai",
      dinner: "Gà hấp xì dầu nấm + cải thìa (xửng trên nồi cơm điện)" },
    { day: "Thứ 3", short: "T3",
      breakfast: "Bánh mì nguyên cám + trứng + cà chua",
      lunchAdult: "Cơm hộp gà hấp nấm (dư từ tối T2)",
      lunchKid: "Cơm gà hấp cắt nhỏ",
      recess: "Chuối + yoghurt",
      dinner: "Cá hấp gừng hành + bông cải (nồi cơm điện)" },
    { day: "Thứ 4", short: "T4",
      breakfast: "Yoghurt Hy Lạp + dâu + chuối",
      lunchAdult: "Cuốn xà lách thịt băm rim + trứng + cà rốt dưa leo",
      lunchKid: "Trứng chiên cuộn + cơm + cà rốt que",
      recess: "Dâu + phô mai",
      dinner: "Miến xào tôm nấm kim châm rau củ (1 chảo) — để dư tôm" },
    { day: "Thứ 5", short: "T5",
      breakfast: "Bánh mì + trứng + chuối",
      lunchAdult: "Cuốn xà lách tôm + miến trộn",
      lunchKid: "Cơm + tôm + bắp",
      recess: "Khoai lang hấp",
      dinner: "Đậu hũ sốt cà chua thịt băm (1 chảo) + bông cải hấp" },
    { day: "Thứ 6", short: "T6",
      breakfast: "Cháo gạo lứt gà nấm (nồi cơm điện hẹn giờ từ tối T5)",
      lunchAdult: "Cơm đậu hũ sốt cà (dư từ tối T5)",
      lunchKid: "Cơm đậu hũ cắt nhỏ",
      recess: "Táo + yoghurt",
      dinner: "Miến gà nấm (1 nồi)" },
    { day: "Thứ 7", short: "T7",
      breakfast: "Bánh mì ốp la",
      lunchAdult: "Ở nhà: miến gà còn dư",
      lunchKid: "Ở nhà: miến gà còn dư",
      recess: "",
      dinner: "Dọn tủ lạnh: cơm chiên trứng rau củ + canh trứng cà chua" },
    { day: "Chủ nhật", short: "CN",
      breakfast: "Pancake chuối trứng (2 chuối + 3 trứng) + dâu",
      lunchAdult: "Ở nhà: cơm chiên trứng rau củ",
      lunchKid: "Ở nhà: cơm chiên trứng rau củ",
      recess: "",
      dinner: "Gà đùi nướng khay + khoai lang + bắp + bông cải (1 khay lò) — để dư gà cho trưa T2" }
  ],

  tips: [
    "Cuốn xà lách: để xà lách, nhân và nước chấm riêng; đến trưa mới cuốn để không úng.",
    "Bé 5 tuổi: cơm nắm / trứng cuộn dễ ăn hơn cuốn xà lách.",
    "Trường tiểu học thường nut-free: không đậu phộng, không sốt có đậu phộng.",
    "Hộp cơm bé có túi đá (ice pack); cho bé tập tự mở hộp trước.",
    "Sau ~7h tối hay có thịt dán nhãn vàng giảm giá — mua chia túi cấp đông.",
    "Mỗi thứ Tư: app Woolworths → chọn cửa hàng gần nhà → Specials → Half Price / Prices Dropped. Thay món cùng loại (cá ↔ cá, gà ↔ gà).",
    "South Melbourne Market gần nhà — rau củ thường rẻ hơn, ghé cuối tuần nếu tiện.",
    "Nếu kiêng gluten: đổi bánh mì, kiểm tra miến, dùng tamari thay xì dầu."
  ]
};
