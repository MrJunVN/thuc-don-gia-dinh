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
  const priceOf = (it) => prices[it.id] ?? it.price;

  function renderShop() {
    let planned = 0, spent = 0;
    $("#shop-list").innerHTML = D.shopping.map((g) => {
      const items = g.items.filter((it) => trip === "all" || it.trip === trip);
      g.items.forEach((it) => { if (!g.monthly) { planned += priceOf(it); if (checked[it.id]) spent += priceOf(it); } });
      if (!items.length) return "";
      return `<div class="group"><h3>${esc(g.group)}</h3>` + items.map((it) => `
        <label class="item ${checked[it.id] ? "done" : ""}">
          <input type="checkbox" data-id="${it.id}" ${checked[it.id] ? "checked" : ""}>
          <span class="name">${esc(it.name)}${it.note ? `<span class="note">${esc(it.note)}</span>` : ""}</span>
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

  // Tips
  $("#tips-list").innerHTML = D.tips.map((t) => `<li>${esc(t)}</li>`).join("");
})();
