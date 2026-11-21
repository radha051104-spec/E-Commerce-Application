const g = id => document.getElementById(id);
let editing = null;

async function load() {
  const list = await DB.list("products");
  g("rows").innerHTML = list.map(p => `<tr>
    <td>${p.id}</td><td>${p.cat_id}</td><td>${p.title}</td><td>₹${p.price}</td><td>${p.qty}</td>
    <td>${p.active === false ? "Inactive" : "Active"}</td>
    <td><button onclick="edit('${p.id}')">Edit</button>
        <button onclick="toggle('${p.id}',${p.active !== false})">${p.active === false ? "Activate" : "Deactivate"}</button>
        <button onclick="del('${p.id}')">Delete</button></td></tr>`).join("");
}
async function edit(id) {
  const p = await DB.get("products", id); editing = id;
  g("f_id").value = id; g("f_id").disabled = true;   // id cannot be updated
  g("f_cat").value = p.cat_id; g("f_title").value = p.title; g("f_des").value = p.des;
  g("f_price").value = p.price; g("f_qty").value = p.qty; g("f_img").value = p.img;
}
async function toggle(id, isActive) { await DB.update("products", id, { active: !isActive }); load(); }
async function del(id) { if (confirm("Delete this product? Yes/No")) { await DB.remove("products", id); load(); } }

g("form").onsubmit = async e => {
  e.preventDefault();
  const data = { cat_id: g("f_cat").value, title: g("f_title").value, des: g("f_des").value,
    price: Number(g("f_price").value), qty: Number(g("f_qty").value), img: g("f_img").value, active: true };
  if (editing) await DB.update("products", editing, data);
  else await DB.create("products", g("f_id").value, data);
  editing = null; g("form").reset(); g("f_id").disabled = false; load();
};
load();