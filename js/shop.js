// ================= PICTURES =================
const KEYWORDS = [
  ["sneaker","👟"],["shoe","👟"],["jacket","🧥"],["wallet","👛"],["t-shirt","👕"],["tshirt","👕"],
  ["shirt","👕"],["handbag","👜"],["bag","👜"],["sunglass","🕶️"],["lipstick","💄"],["serum","💧"],
  ["hair","💇‍♀️"],["sunscreen","🧴"],["perfume","🌸"],["brush","🖌️"],["bottle","🥤"],["yoga","🧘"],
  ["backpack","🎒"],["candle","🕯️"],["earbud","🎧"],["headphone","🎧"],["watch","⌚"],
  ["power bank","🔋"],["speaker","🔊"],["bluetooth","🔊"],["mouse","🖱️"],["keyboard","⌨️"],
  ["laptop","💻"],["phone","📱"],["javascript","📘"],["database","🗄️"],["book","📚"]
];
const CAT_ICONS = { Fashion:"👗", Beauty:"💄", Lifestyle:"🏠", Electronics:"🔌", Books:"📚", Home:"🏠" };

const ART = {
  kettle: `
    <ellipse cx='200' cy='338' rx='105' ry='14' fill='#00000022'/>
    <rect x='95' y='300' width='210' height='34' rx='10' fill='#2b2d42'/>
    <path d='M115 300 L130 170 Q200 140 270 170 L285 300 Z' fill='#e8ecf1' stroke='#2b2d42' stroke-width='6'/>
    <path d='M130 170 Q200 140 270 170 L262 130 Q200 110 138 130 Z' fill='#c3ccd8' stroke='#2b2d42' stroke-width='6'/>
    <circle cx='200' cy='112' r='12' fill='#2b2d42'/>
    <path d='M122 215 L62 150 L92 132 L140 195 Z' fill='#e8ecf1' stroke='#2b2d42' stroke-width='6'/>
    <path d='M280 165 C350 165 350 275 282 275' fill='none' stroke='#2b2d42' stroke-width='16' stroke-linecap='round'/>
    <rect x='185' y='200' width='30' height='70' rx='10' fill='#9ad1ff' stroke='#2b2d42' stroke-width='4'/>
    <circle cx='200' cy='317' r='7' fill='#e63946'/>`,
  mixer: `
    <ellipse cx='200' cy='350' rx='115' ry='12' fill='#00000022'/>
    <path d='M138 60 L262 60 L248 232 L152 232 Z' fill='#dff3ff' stroke='#2b2d42' stroke-width='6'/>
    <rect x='128' y='42' width='144' height='22' rx='8' fill='#2b2d42'/>
    <path d='M262 85 C318 85 318 175 254 180' fill='none' stroke='#2b2d42' stroke-width='14' stroke-linecap='round'/>
    <path d='M165 215 L235 215 M200 190 L200 232' stroke='#8d99ae' stroke-width='6' stroke-linecap='round'/>
    <rect x='100' y='232' width='200' height='112' rx='16' fill='#e63946' stroke='#2b2d42' stroke-width='6'/>
    <circle cx='150' cy='292' r='17' fill='#fff' stroke='#2b2d42' stroke-width='5'/>
    <circle cx='200' cy='292' r='17' fill='#fff' stroke='#2b2d42' stroke-width='5'/>
    <circle cx='250' cy='292' r='17' fill='#fff' stroke='#2b2d42' stroke-width='5'/>`,
  fan: `
    <circle cx='200' cy='150' r='100' fill='#f1f8ff' stroke='#2b2d42' stroke-width='6'/>
    <circle cx='200' cy='150' r='64' fill='none' stroke='#8d99ae' stroke-width='3'/>
    <ellipse cx='200' cy='98' rx='24' ry='46' fill='#4a9fd9' stroke='#2b2d42' stroke-width='4'/>
    <ellipse cx='200' cy='98' rx='24' ry='46' fill='#4a9fd9' stroke='#2b2d42' stroke-width='4' transform='rotate(120 200 150)'/>
    <ellipse cx='200' cy='98' rx='24' ry='46' fill='#4a9fd9' stroke='#2b2d42' stroke-width='4' transform='rotate(240 200 150)'/>
    <circle cx='200' cy='150' r='15' fill='#2b2d42'/>
    <rect x='190' y='250' width='20' height='64' fill='#555'/>
    <ellipse cx='200' cy='326' rx='85' ry='18' fill='#2b2d42'/>`,
  iron: `
    <ellipse cx='200' cy='338' rx='150' ry='12' fill='#00000022'/>
    <path d='M60 280 L60 240 C60 180 130 150 215 150 L325 225 C345 242 338 280 312 280 Z' fill='#4a90d9' stroke='#2b2d42' stroke-width='6'/>
    <path d='M52 280 L338 280 L350 312 L52 312 Z' fill='#d0d6de' stroke='#2b2d42' stroke-width='6'/>
    <path d='M122 168 C132 92 258 92 280 185' fill='none' stroke='#2b2d42' stroke-width='20' stroke-linecap='round'/>
    <circle cx='150' cy='218' r='14' fill='#fff' stroke='#2b2d42' stroke-width='4'/>`
};
ART.grinder = ART.mixer;
ART.jug = ART.kettle;

function imgFor(p) {
  const name = (p.title || "").toLowerCase();
  let inner = null;
  for (const k in ART) { if (name.includes(k)) { inner = ART[k]; break; } }
  if (!inner) {
    let e = null;
    for (const [k, icon] of KEYWORDS) { if (name.includes(k)) { e = icon; break; } }
    if (!e) e = CAT_ICONS[p.cat_id] || "🛍️";
    inner = `<text x='50%' y='52%' font-size='170' text-anchor='middle' dominant-baseline='central'>${e}</text>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
    <stop offset='0' stop-color='#fff1e8'/><stop offset='1' stop-color='#ffd9c2'/></linearGradient></defs>
    <rect width='400' height='400' fill='url(#g)'/>${inner}</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// ================= SHOP LOGIC =================
let products = [], cart = [], cat = "All", page = 1;
const PER_PAGE = 8;
const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const cartTotal = () => cart.reduce((s, c) => s + c.price * c.qty, 0);

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

async function init() {
  const [prods, cats] = await Promise.all([DB.list("products"), DB.list("categories")]);
  const nameOf = {};
  cats.forEach(c => { nameOf[c.id] = c.name || c.title || ""; });
  products = prods.filter(p => p.active !== false).map(p => {
    if (/^CAT\d+/i.test(p.cat_id)) p.cat_id = nameOf[p.cat_id] || "Other";
    return p;
  });
  const names = [...new Set(products.map(p => p.cat_id))].filter(n => n && n !== "Other");
  $("cats").innerHTML = ["All", ...names].map(c =>
    `<button data-c="${c}" class="${c === cat ? 'on' : ''}">${c}</button>`).join("");
  render();
}

function render() {
  const q = $("search").value.toLowerCase();
  const list = products.filter(p =>
    (cat === "All" || p.cat_id === cat) && (p.title || "").toLowerCase().includes(q));
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  page = Math.min(page, pages);
  const slice = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  $("grid").innerHTML = slice.map(p => `
    <div class="card">
      <img src="${imgFor(p)}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="des">${p.des || ''}</p>
      <p class="price">${money(p.price)}</p>
      <p class="stock ${p.qty < 15 ? 'low' : ''}">${p.qty > 0 ? p.qty + ' in stock' : 'Out of stock'}</p>
      <div class="row">
        <input type="number" min="1" max="${p.qty}" value="1" id="q_${p.id}">
        <button class="btn" ${p.qty < 1 ? 'disabled' : ''} onclick="addCart('${p.id}')">Add</button>
      </div>
    </div>`).join("") || "<p style='padding:20px'>No products found.</p>";

  $("pager").innerHTML = Array.from({ length: pages }, (_, i) =>
    `<button class="${i + 1 === page ? 'on' : ''}" onclick="page=${i + 1};render()">${i + 1}</button>`).join("");
}

// ---------- CART ----------
function addCart(id) {
  const p = products.find(x => String(x.id) === String(id));
  if (!p) return;
  const input = document.getElementById("q_" + id);
  const qty = input ? (Number(input.value) || 1) : 1;
  const item = cart.find(c => String(c.id) === String(id));
  const have = item ? item.qty : 0;
  if (have + qty > p.qty) return toast("Only " + p.qty + " in stock");
  if (item) item.qty += qty; else cart.push({ id: p.id, title: p.title, price: p.price, qty });
  drawCart();
  toast("Added to cart ✔");
}
function chg(id, d) {
  const item = cart.find(c => String(c.id) === String(id));
  const p = products.find(x => String(x.id) === String(id));
  if (!item) return;
  if (d > 0 && item.qty >= p.qty) return toast("No more stock");
  item.qty += d;
  if (item.qty < 1) cart = cart.filter(c => c !== item);
  drawCart();
}
function rm(id) { cart = cart.filter(c => String(c.id) !== String(id)); drawCart(); }

function drawCart() {
  $("cartCount").textContent = cart.reduce((s, c) => s + c.qty, 0);
  $("cartItems").innerHTML = cart.length ? cart.map(c => `
    <div class="ci">
      <div><b>${c.title}</b><br><small>${money(c.price)} each</small></div>
      <div class="qty"><button onclick="chg('${c.id}',-1)">−</button><span>${c.qty}</span><button onclick="chg('${c.id}',1)">+</button></div>
      <b>${money(c.price * c.qty)}</b>
      <button class="rm" onclick="rm('${c.id}')">🗑</button>
    </div>`).join("") : "<p class='empty'>Your cart is empty</p>";
  $("total").textContent = money(cartTotal());
}

// ---------- CHECKOUT ----------
const METHODS = [
  ["card", "💳 Credit / Debit Card"], ["gpay", "🟦 Google Pay"], ["upi", "📲 UPI"],
  ["paytm", "🔷 Paytm"], ["cod", "💵 Cash on Delivery"], ["credit", "🏦 Store Credit"]
];
const closeModal = () => $("modal").classList.remove("show");

function openCheckout() {
  if (!cart.length) return toast("Your cart is empty");
  const total = cartTotal();
  $("modalBox").innerHTML = `
    <h2>Checkout <button class="x" onclick="closeModal()">✕</button></h2>
    <div class="sum">
      ${cart.map(c => `<div><span>${c.title} × ${c.qty}</span><b>${money(c.price * c.qty)}</b></div>`).join("")}
      <div class="tot"><span>Total Amount</span><b>${money(total)}</b></div>
    </div>
    <h3>Delivery details</h3>
    <input id="c_name" placeholder="Full name">
    <input id="c_addr" placeholder="Delivery address">
    <h3>Choose payment method</h3>
    <div class="methods">
      ${METHODS.map(([v, l], i) => `<label><input type="radio" name="pm" value="${v}" ${i === 0 ? "checked" : ""}> ${l}</label>`).join("")}
    </div>
    <div id="pmFields"></div>
    <button class="btn full" id="payBtn" onclick="placeOrder()">Pay ${money(total)}</button>`;
  $("c_name").value = SESSION.name || "";
  $("modal").classList.add("show");
  document.querySelectorAll("input[name=pm]").forEach(r => r.onchange = showFields);
  showFields();
}

function showFields() {
  const m = document.querySelector("input[name=pm]:checked").value;
  let h = "";
  if (m === "card") h = `<input id="f_card" placeholder="Card number (16 digits)" maxlength="16">
    <input id="f_exp" placeholder="Expiry (MM/YY)" maxlength="5"><input id="f_cvv" placeholder="CVV" maxlength="3" type="password">`;
  else if (["gpay", "upi", "paytm"].includes(m)) h = `<input id="f_upi" placeholder="UPI ID (e.g. name@upi)">`;
  else if (m === "cod") h = `<p style="font-size:13px;color:#666">Pay in cash when your order is delivered.</p>`;
  else h = `<p style="font-size:13px;color:#666">The amount will be deducted from your store credit limit.</p>`;
  $("pmFields").innerHTML = h;
}

async function placeOrder() {
  const name = $("c_name").value.trim(), addr = $("c_addr").value.trim();
  const m = document.querySelector("input[name=pm]:checked").value;
  if (!name || !addr) return toast("Enter name and address");
  if (m === "card") {
    if (!/^\d{16}$/.test($("f_card").value)) return toast("Card number must be 16 digits");
    if (!/^\d{2}\/\d{2}$/.test($("f_exp").value)) return toast("Expiry must be MM/YY");
    if (!/^\d{3}$/.test($("f_cvv").value)) return toast("CVV must be 3 digits");
  }
  if (["gpay", "upi", "paytm"].includes(m) && !/^[\w.\-]+@[\w]+$/.test($("f_upi").value))
    return toast("Enter a valid UPI ID");

  const btn = $("payBtn"); btn.disabled = true; btn.textContent = "Processing...";
  const total = cartTotal();

  if (m === "credit") {
    const cust = await DB.get("Customers", SESSION.uid);
    if (total > cust.credit_limit) {
      btn.disabled = false; btn.textContent = "Pay " + money(total);
      return toast("Credit limit exceeded (limit " + money(cust.credit_limit) + ")");
    }
    await DB.update("Customers", SESSION.uid, { credit_limit: cust.credit_limit - total });
  }

  const orderId = "ORD" + Date.now();
  const label = METHODS.find(x => x[0] === m)[1];
  await DB.create("orders", orderId, {
    customer_id: SESSION.uid, customer_name: name, address: addr,
    items: JSON.stringify(cart), total, payment: label,
    payment_type: m === "credit" ? "credit" : "cash",
    status: "Placed", date: new Date().toISOString()
  });
  for (const c of cart) {
    const p = products.find(x => String(x.id) === String(c.id));
    await DB.update("products", c.id, { qty: p.qty - c.qty });
  }

  // send the order email (does not block the order if it fails)
  if (typeof Mailer !== "undefined") {
    Mailer.sendOrder({ orderId: orderId, total: total, payment: label, items: cart });
  }

  $("modalBox").innerHTML = `<div class="ok">
    <div class="tick">✅</div><h2 style="justify-content:center">Order Placed!</h2>
    <p>Order ID: <b>${orderId}</b></p>
    <div class="sum" style="text-align:left;margin:14px 0">
      ${cart.map(c => `<div><span>${c.title} × ${c.qty}</span><b>${money(c.price * c.qty)}</b></div>`).join("")}
      <div class="tot"><span>Total Paid</span><b>${money(total)}</b></div>
    </div>
    <p>Payment: ${label}</p><p>Delivering to: ${addr}</p><br>
    <button class="btn full" onclick="closeModal()">Continue Shopping</button></div>`;
  cart = []; drawCart(); $("drawer").classList.remove("open"); init();
}

$("cats").onclick = e => { if (e.target.dataset.c) { cat = e.target.dataset.c; page = 1; init(); } };
$("search").oninput = () => { page = 1; render(); };
$("cartBtn").onclick = () => $("drawer").classList.add("open");
$("closeCart").onclick = () => $("drawer").classList.remove("open");
$("buy").onclick = openCheckout;
init();