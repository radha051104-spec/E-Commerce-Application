const SAMPLE = [
  ["P001","Fashion","Men's Running Shoes","Lightweight daily trainers",1999,50,"https://picsum.photos/seed/shoes/400/400"],
  ["P002","Fashion","Women's Denim Jacket","Classic blue denim",1499,30,"https://picsum.photos/seed/jacket/400/400"],
  ["P003","Beauty","Matte Lipstick","Long-lasting colour",399,120,"https://picsum.photos/seed/lipstick/400/400"],
  ["P004","Beauty","Vitamin C Face Serum","Brightening serum 30ml",649,80,"https://picsum.photos/seed/serum/400/400"],
  ["P005","Lifestyle","Insulated Water Bottle","1L, keeps cold 24h",799,10,"https://picsum.photos/seed/bottle/400/400"],
  ["P006","Lifestyle","Yoga Mat","6mm non-slip",899,60,"https://picsum.photos/seed/yoga/400/400"],
  ["P007","Fashion","Leather Wallet","Slim bifold",599,200,"https://picsum.photos/seed/wallet/400/400"],
  ["P008","Beauty","Hair Care Combo","Shampoo + conditioner",549,14,"https://picsum.photos/seed/hair/400/400"]
];
async function seedProducts() {
  for (const [id,cat,title,des,price,qty,img] of SAMPLE)
    await DB.create("products", id, { cat_id: cat, title, des, price, qty, img, active: true });
  alert("Sample products added!");
}