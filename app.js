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
      $("#sale-meta").textContent = "Chưa có dữ liệu sale. Dữ liệu được quét tự động mỗi sáng khi app chạy trên GitHub Pages.";
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
      ? `<div class="card">${SP.extras.map((p) => `<div class="sale-row"><div class="vn">${esc(p.label)}</div>${product(p)}</div>`).join("")}</div>`
      : `<p class="muted">Không có gợi ý.</p>`;
  }
  fetch("specials.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => { SP = j; })
    .catch(() => {})
    .finally(() => { renderSale(); renderShop(); });

  // Tips
  $("#tips-list").innerHTML = D.tips.map((t) => `<li>${esc(t)}</li>`).join("");
})();
