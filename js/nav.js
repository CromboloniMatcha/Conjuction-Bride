/* Navigation: About (description) -> Play -> Edit (password protected). */
(function () {
  const $ = id => document.getElementById(id);
  const IDS = { home: "homeView", play: "playView", edit: "editView" };
  const TAB = { home: "tabHome", play: "tabPlay", edit: "tabEdit" };
  const SUB = {
    home: "Build bridges between sentences with the right conjunction.",
    play: "Drag a conjunction piece into the gap to build a bridge between the two sentences.",
    edit: "Add, change or delete questions. Changes save automatically."
  };
  let current = "home";
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function renderHome() {
    $("qCount").textContent = QUESTIONS.length;
    $("guide").innerHTML = Object.entries(CONJ).map(([w, c]) =>
      `<div class="guideRow"><b>${esc(w)}</b> — ${esc(c.use)}${c.syn ? ` <i class="muted">Similar: ${esc(c.syn)}</i>` : ""}</div>`).join("");
  }
  function show(name) {
    if (name === "edit" && !Auth.isUnlocked()) { ask(() => show("edit")); return; }
    current = name;
    Object.keys(IDS).forEach(k => { $(IDS[k]).hidden = k !== name; $(TAB[k]).classList.toggle("active", k === name); });
    $("tabEdit").textContent = (Auth.isUnlocked() ? "✏️" : "🔒") + " Edit questions";
    $("subTitle").textContent = SUB[name];
    if (name === "home") renderHome();
    if (name === "edit") Editor.enter();
    window.scrollTo(0, 0);
  }
  // Leaving the editor: check the questions are valid; reload if changed so the game uses the new data.
  function leaveEdit(target) {
    if (!Editor.validate()) return;
    if (Editor.isDirty()) { try { sessionStorage.setItem("cc.view", target); } catch (e) {} location.reload(); }
    else show(target);
  }
  function go(name) { if (current === "edit" && name !== "edit") leaveEdit(name); else show(name); }

  // Password dialog
  let after = null, attempts = 0, until = 0;
  const modal = $("lockModal"), input = $("lockInput"), msg = $("lockMsg");
  function ask(cb) { after = cb; msg.textContent = ""; input.value = ""; modal.hidden = false; input.focus(); }
  function close() { modal.hidden = true; after = null; }
  function submit() {
    const now = Date.now();
    if (now < until) { msg.textContent = "Too many tries. Wait " + Math.ceil((until - now) / 1000) + "s."; return; }
    if (Auth.check(input.value)) { const f = after; Auth.unlock(); close(); attempts = 0; if (f) f(); return; }
    attempts++; input.select();
    const box = modal.firstElementChild; box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
    if (attempts >= 3) { attempts = 0; until = now + 10000; msg.textContent = "Too many tries. Wait 10s."; }
    else msg.textContent = "Wrong password.";
  }
  $("lockOk").onclick = submit;
  $("lockCancel").onclick = close;
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) close(); });
  modal.addEventListener("click", e => { if (e.target === modal) close(); });

  $("tabHome").onclick = () => go("home");
  $("tabPlay").onclick = () => go("play");
  $("tabEdit").onclick = () => go("edit");
  $("startBtn").onclick = () => go("play");
  $("lockBtn").onclick = () => { if (!Editor.validate()) return; Auth.lock(); leaveEdit("home"); };

  let start = "home";
  try { const v = sessionStorage.getItem("cc.view"); if (v) { start = v; sessionStorage.removeItem("cc.view"); } } catch (e) {}
  show(start === "edit" ? "home" : start);
})();
