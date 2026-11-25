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
    const base = D.week[dayIdx];
    const ov = store.get("menuOverrides", {})[base.short] || {};
    const d = Object.assign({}, base, ov);
    const mark = (k) => (ov[k] ? ' <span class="badge">đã đổi</span>' : "");
    const kidLunch = d.lunchKid && d.lunchKid !== d.lunchAdult
      ? `<span class="kid"><span class="badge">Bé</span>${esc(d.lunchKid)}${mark("lunchKid")}${d.recess ? ` · <span class="badge">Recess</span>${esc(d.recess)}${mark("recess")}` : ""}</span>` : "";
    $("#day-card").innerHTML = `<div class="card"><h2 style="margin:0 0 4px">${esc(d.day)}</h2>
      <div class="meal"><div class="label">Sáng</div>${esc(d.breakfast)}${mark("breakfast")}</div>
      <div class="meal"><div class="label">Trưa (mang đi)</div>${esc(d.lunchAdult)}${mark("lunchAdult")}${kidLunch}</div>
      <div class="meal"><div class="label">Tối</div>${esc(d.dinner)}${mark("dinner")}</div>
      ${Object.keys(ov).length ? '<button class="link small" id="reset-day">Về thực đơn gốc của ngày này</button>' : ""}</div>`;
    const rd = $("#reset-day");
    if (rd) rd.addEventListener("click", () => {
      const all = store.get("menuOverrides", {}); delete all[base.short]; store.set("menuOverrides", all); renderDay();
    });
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
  renderFridge();

  // ---- Dán kết quả từ ChatGPT Project ----
  const DAYS = D.week.map((d) => d.short); // T2..CN
  const MEALS = { sang: "breakfast", trua: "lunchAdult", trua_be: "lunchKid", recess: "recess", toi: "dinner" };
  function extractPayload(text) {
    const a = text.indexOf("{"), b = text.lastIndexOf("}");
    if (a < 0 || b <= a) throw new Error("Không thấy mã. Hãy copy cả đoạn mã ChatGPT đưa (bắt đầu bằng {).");
    let j;
    try { j = JSON.parse(text.slice(a, b + 1)); } catch { throw new Error("Mã bị thiếu hoặc lỗi. Copy lại cả đoạn mã nhé."); }
    if (j.app !== "thuc-don") throw new Error("Đây không phải mã của app thực đơn.");
    return j;
  }
  function applyPayload(j) {
    const done = [];
    const num = (v) => (typeof v === "number" ? v : v == null || v === "" ? null : parseFloat(String(v).replace(/[^0-9.]/g, "")));
    if (Array.isArray(j.sale)) {
      const deals = j.sale.filter((d) => d && d.name && num(d.price) != null).map((d) => ({
        name: String(d.name), size: d.size || null, price: num(d.price), was: num(d.was), half: !!d.half,
        match_id: d.match_id && names[d.match_id] ? d.match_id : null, label_vi: d.label_vi || d.name }));
      const prev = store.get("saleScan", null);
      const today = new Date().toDateString();
      const keep = prev && prev.deals && new Date(prev.updated).toDateString() === today ? prev.deals : [];
      const seen = new Set(keep.map((d) => d.name + d.price));
      store.set("saleScan", { updated: new Date().toISOString(), deals: keep.concat(deals.filter((d) => !seen.has(d.name + d.price))) });
      done.push(`${deals.length} món sale`);
      loadSales();
    }
    if (Array.isArray(j.tu_lanh)) {
      fridge = j.tu_lanh.filter((f) => f && f.name).map((f) => ({ name: String(f.name), qty: f.qty ? String(f.qty) : "" }));
      store.set("fridge", fridge); renderFridge(); done.push(`tủ lạnh ${fridge.length} món`);
    }
    if (Array.isArray(j.doi_mon)) {
      const ov = store.get("menuOverrides", {}); let n = 0;
      j.doi_mon.forEach((c) => {
        const day = String(c.ngay || "").toUpperCase().replace("CHỦ NHẬT", "CN"); const meal = MEALS[c.bua];
        if (DAYS.includes(day) && meal && c.mon) { (ov[day] = ov[day] || {})[meal] = String(c.mon); n++; }
      });
      store.set("menuOverrides", ov); renderDay(); if (n) done.push(`đổi ${n} bữa`);
    }
    if (typeof j.goi_y === "string" && j.goi_y.trim()) {
      store.set("suggest", { text: j.goi_y.trim(), at: new Date().toISOString() }); renderSuggest(); done.push("gợi ý món");
    }
    return done;
  }
  function handlePaste(text) {
    const st = $("#paste-status");
    try {
      const done = applyPayload(extractPayload(text));
      st.textContent = done.length ? "✅ Đã cập nhật: " + done.join(", ") + "." : "Mã không có gì để cập nhật.";
      $("#paste-text").value = ""; $("#paste-manual").open = false;
    } catch (e) { st.textContent = "⚠️ " + e.message; }
  }
  $("#paste-btn").addEventListener("click", async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (!t) throw new Error("empty");
      handlePaste(t);
    } catch {
      $("#paste-manual").open = true; $("#paste-text").focus();
      $("#paste-status").textContent = "Trình duyệt không cho đọc clipboard. Dán tay vào ô bên dưới (giữ ngón tay → Dán).";
    }
  });
  $("#paste-apply").addEventListener("click", () => handlePaste($("#paste-text").value));

  function renderSuggest() {
    const sg = store.get("suggest", null);
    if (!sg) { $("#suggest-card").innerHTML = ""; return; }
    const when = new Date(sg.at).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
    $("#suggest-card").innerHTML = `<div class="card"><div class="label muted small">💡 GỢI Ý TỪ CHATGPT · ${esc(when)}</div>
      <div class="answer">${esc(sg.text)}</div><button class="link small" id="suggest-clear">Ẩn gợi ý</button></div>`;
    $("#suggest-clear").addEventListener("click", () => { store.set("suggest", null); renderSuggest(); });
  }
  renderSuggest();


  // Copy hướng dẫn Project
  $("#copy-instr").addEventListener("click", async () => {
    const st = $("#copy-status");
    try {
      const t = await (await fetch("project-instructions.txt", { cache: "no-store" })).text();
      await navigator.clipboard.writeText(t);
      st.textContent = "✅ Đã copy. Giờ dán vào mục Instructions của Project.";
    } catch { st.textContent = "⚠️ Không copy được. Mở project-instructions.txt trên GitHub để copy tay."; }
  });

  // Tips
  $("#tips-list").innerHTML = D.tips.map((t) => `<li>${esc(t)}</li>`).join("");
})();
