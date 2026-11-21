var ADMIN_EMAIL = "radha051104@gmail.com";   // the account with this email becomes the admin

var SESSION = (function () {
  try { return JSON.parse(localStorage.getItem("shopease_session")); } catch (e) { return null; }
})();

function logout() {
  localStorage.removeItem("shopease_session");
  location.replace("login.html");
}

/* page guard + header fill */
(function () {
  var ADMIN_PAGES = ["admin.html", "products.html", "customers.html", "reports.html"];
  var page = location.pathname.split("/").pop() || "index.html";
  if (page === "login.html") {
    if (SESSION) location.replace(SESSION.role === "admin" ? "admin.html" : "index.html");
    return;
  }
  if (!SESSION) { location.replace("login.html"); return; }
  if (ADMIN_PAGES.indexOf(page) > -1 && SESSION.role !== "admin") { location.replace("index.html"); return; }
  document.addEventListener("DOMContentLoaded", function () {
    var who = document.getElementById("who");
    if (who) who.textContent = "Hi, " + SESSION.name;
    var link = document.getElementById("adminLink");
    if (link && SESSION.role === "admin") link.style.display = "";
  });
})();

var Auth = (function () {
  var ROOT = "https://firestore.googleapis.com/v1/projects/e-commerce-743a1/databases/(default)/documents/Customers";
  var RULES = "Firestore rules are blocking the request. Publish the open rules in Firestore > Rules.";
  function no(m) { return { ok: false, msg: m }; }

  function toVal(v) {
    if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    return { stringValue: String(v) };
  }
  function toPlain(d) {
    var o = {}, f = d.fields || {};
    Object.keys(f).forEach(function (k) {
      var x = f[k];
      o[k] = x.stringValue !== undefined ? x.stringValue :
             x.integerValue !== undefined ? Number(x.integerValue) :
             x.doubleValue !== undefined ? x.doubleValue :
             x.booleanValue !== undefined ? x.booleanValue : null;
    });
    o._id = d.name.split("/").pop();
    return o;
  }
  async function all() {
    var list = [], token = "";
    do {
      var r = await fetch(ROOT + "?pageSize=300" + (token ? "&pageToken=" + encodeURIComponent(token) : ""));
      if (!r.ok) throw new Error("rules");
      var j = await r.json();
      (j.documents || []).forEach(function (d) { list.push(toPlain(d)); });
      token = j.nextPageToken || "";
    } while (token);
    return list;
  }
  async function save(id, obj, onlyThese) {
    var f = {}; Object.keys(obj).forEach(function (k) { f[k] = toVal(obj[k]); });
    var mask = onlyThese ? "?" + Object.keys(obj).map(function (k) { return "updateMask.fieldPaths=" + encodeURIComponent(k); }).join("&") : "";
    var r = await fetch(ROOT + "/" + encodeURIComponent(id) + mask, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: f })
    });
    if (!r.ok) throw new Error("rules");
  }
  async function hash(pw, salt) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + pw));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }
  function newSalt() {
    var a = new Uint8Array(8); crypto.getRandomValues(a);
    return Array.from(a).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }
  function nextCust(list) {
    var max = 0;
    list.forEach(function (u) { var n = parseInt(String(u._id).replace("CUST", ""), 10); if (!isNaN(n) && n > max) max = n; });
    return "CUST" + String(max + 1).padStart(3, "0");
  }
  function goodPw(p) { return typeof p === "string" && p.length >= 6 && /[A-Za-z]/.test(p) && /\d/.test(p); }
  var PW_MSG = "Password needs at least 6 characters with a letter and a number.";
  function secure() { return window.crypto && crypto.subtle; }
  var SECURE_MSG = "Open this page with Live Server (localhost) or https, not by double-clicking the file.";
  function find(list, email) { return list.filter(function (u) { return String(u.email || "").toLowerCase() === email; })[0]; }

  function start(u) {
    localStorage.setItem("shopease_session", JSON.stringify({ uid: u.id || u._id, name: u.name, email: u.email, role: u.role || "customer" }));
    location.replace((u.role === "admin") ? "admin.html" : "index.html");
  }

  async function signUp(name, mobile, email, pw) {
    name = (name || "").trim(); mobile = (mobile || "").trim(); email = (email || "").trim().toLowerCase();
    if (!name) return no("Enter your name.");
    if (!/^\d{10}$/.test(mobile)) return no("Mobile must be 10 digits.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return no("Enter a valid email.");
    if (!goodPw(pw)) return no(PW_MSG);
    if (!secure()) return no(SECURE_MSG);
    try {
      var list = await all();
      if (find(list, email)) return no("This email is already registered. Please sign in.");
      var isAdmin = email === ADMIN_EMAIL.toLowerCase();
      var id = isAdmin ? "ADMIN" : nextCust(list), salt = newSalt();
      var rec = { id: id, name: name, email: email, mobile: mobile, role: isAdmin ? "admin" : "customer",
                  status: "active", credit_limit: 0, salt: salt, password_hash: await hash(pw, salt) };
      await save(id, rec);
      start(rec);
      return { ok: true };
    } catch (e) { return no(RULES); }
  }

  async function signIn(email, pw) {
    email = (email || "").trim().toLowerCase();
    if (!email || !pw) return no("Enter your email and password.");
    if (!secure()) return no(SECURE_MSG);
    try {
      var u = find(await all(), email);
      if (!u || !u.password_hash || (await hash(pw, u.salt)) !== u.password_hash) return no("Wrong email or password.");
      if (u.status === "inactive") return no("Your account is inactive. Please contact the admin.");
      start(u);
      return { ok: true };
    } catch (e) { return no(RULES); }
  }

  async function reset(email, mobile, pw) {
    email = (email || "").trim().toLowerCase(); mobile = (mobile || "").trim();
    if (!secure()) return no(SECURE_MSG);
    try {
      var u = find(await all(), email);
      if (!u || String(u.mobile) !== mobile) return no("The email and registered mobile do not match.");
      if (!goodPw(pw)) return no(PW_MSG);
      var salt = newSalt();
      await save(u._id, { salt: salt, password_hash: await hash(pw, salt) }, true);
      return { ok: true, msg: "Password changed. Please sign in." };
    } catch (e) { return no(RULES); }
  }

  return { signUp: signUp, signIn: signIn, reset: reset };
})();