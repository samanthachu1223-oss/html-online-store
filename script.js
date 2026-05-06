/* =========================
   PRODUCTS
========================= */

var products = [

{
id:1,
name:"Twix Minis",
description:"Chocolate caramel biscuit",
price:10,
img:"https://gcs.rimg.com.tw/g1/6/bc/37/22228757099575_395.jpg",
category:"snacks"
},

{
id:2,
name:"Want Want Senbei",
description:"Rice crackers",
price:10,
img:"https://www.91zjdl.com/file/upload/202503/18/110711811.jpg.middle.jpg",
category:"snacks"
},

{
id:3,
name:"Wet Wipes",
description:"Pure water wipes",
price:35,
img:"https://i1.momoshop.com.tw/1692891638/goodsimg/0008/084/433/8084433_OR_m.webp",
category:"daily"
}

];

/* =========================
   CATEGORIES
========================= */

var categories = {

snacks:"🍿 Snacks",

daily:"🏠 Daily Essentials"

};

/* =========================
   VARIABLES
========================= */

var cart = [];

var orders = [];

var currentCategory = "snacks";

var isLogin = true;

var currentUser = null;

/* =========================
   INIT
========================= */

init();

function init(){

renderTabs();

renderProducts(currentCategory);

updateCart();

/* 自動登入 */

var savedUser =
localStorage.getItem("currentUser");

if(savedUser){

currentUser =
JSON.parse(savedUser);

updateAccountUI();

loadOrders();

}

}

/* =========================
   CATEGORY TABS
========================= */

function renderTabs(){

var html = "";

for(var key in categories){

html += `

<div class="category-tab ${key===currentCategory ? 'active':''}"

onclick="switchCategory('${key}')">

${categories[key]}

</div>

`;

}

document.getElementById("categoryTabs")
.innerHTML = html;

}

function switchCategory(cat){

currentCategory = cat;

renderTabs();

renderProducts(cat);

}

/* =========================
   PRODUCTS
========================= */

function renderProducts(cat){

var html = `

<div class="category-section">

<h2 class="category-title">

${categories[cat]}

</h2>

<div class="category-products">

`;

products.forEach(function(p){

if(p.category === cat){

html += `

<div class="product-card">

<img class="product-img"
src="${p.img}">

<h3 class="product-title">

${p.name}

</h3>

<p class="product-description">

${p.description}

</p>

<div class="product-price">

NT$ ${p.price}

</div>

<button class="add-btn"

onclick="addToCart(${p.id})">

Add to Cart

</button>

</div>

`;

}

});

html += `

</div>

</div>

`;

document.getElementById("products")
.innerHTML = html;

}

/* =========================
   CART
========================= */

function addToCart(id){

var product =
products.find(function(p){

return p.id === id;

});

var item =
cart.find(function(c){

return c.id === id;

});

if(item){

item.quantity++;

}else{

/* 不用 ...product */

cart.push({

id: product.id,

name: product.name,

description: product.description,

price: product.price,

img: product.img,

category: product.category,

quantity: 1

});

}

updateCart();

}

function updateCart(){

var html = "";

var total = 0;

var count = 0;

if(cart.length === 0){

html = `

<div class="empty-cart">

Your cart is empty

</div>

`;

}else{

cart.forEach(function(item){

total += item.price * item.quantity;

count += item.quantity;

html += `

<div class="cart-item">

<img src="${item.img}">

<div>

<h4>${item.name}</h4>

<p>NT$ ${item.price}</p>

<p>Qty: ${item.quantity}</p>

</div>

</div>

`;

});

html += `

<button class="checkout-btn"

onclick="submitOrderNow()">

Checkout

</button>

`;

}

document.getElementById("cartItems")
.innerHTML = html;

document.getElementById("cartTotal")
.innerHTML = `Total: NT$ ${total}`;

document.getElementById("cartCount")
.innerHTML = count;

}

function toggleCart(){

document.getElementById("cartSidebar")
.classList.toggle("active");

}

/* =========================
   AUTH
========================= */

function openAuth(){

if(currentUser){

return;

}

document.getElementById("authOverlay")
.classList.add("active");

}

function closeAuth(){

document.getElementById("authOverlay")
.classList.remove("active");

}

function switchMode(){

isLogin = !isLogin;

if(isLogin){

document.getElementById("authTitle")
.innerHTML = "Login";

document.getElementById("switchText")
.innerHTML = "Don't have an account?";

document.getElementById("switchBtn")
.innerHTML = "Register";

}else{

document.getElementById("authTitle")
.innerHTML = "Register";

document.getElementById("switchText")
.innerHTML = "Already have an account?";

document.getElementById("switchBtn")
.innerHTML = "Login";

}

}

function submitAuth(){

var email =
document.getElementById("authEmail").value;

var password =
document.getElementById("authPassword").value;

if(!email || !password){

alert("Please fill all fields");

return;

}

if(isLogin){

var user =
JSON.parse(localStorage.getItem(email));

if(!user){

alert("Account not found");

return;

}

if(user.password !== password){

alert("Wrong password");

return;

}

currentUser = user;

localStorage.setItem(
"currentUser",
JSON.stringify(user)
);

loadOrders();

alert("Login successful!");

}else{

var user = {

email: email,

password: password

};

localStorage.setItem(
email,
JSON.stringify(user)
);

currentUser = user;

localStorage.setItem(
"currentUser",
JSON.stringify(user)
);

orders = [];

saveOrders();

alert("Register successful!");

}

updateAccountUI();

closeAuth();

}

function updateAccountUI(){

var first =
currentUser.email[0]
.toUpperCase();

document.getElementById("accountBtnInner")
.innerHTML = `

<div class="avatar-letter">

${first}

</div>

`;

document.getElementById("dropdownName")
.innerHTML = "Hello!";

document.getElementById("dropdownEmail")
.innerHTML = currentUser.email;

}

function logout(){

currentUser = null;

localStorage.removeItem("currentUser");

document.getElementById("accountBtnInner")
.innerHTML = `

<svg class="icon-person"
viewBox="0 0 24 24"
xmlns="http://www.w3.org/2000/svg">

<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>

</svg>

`;

document.getElementById("dropdownEmail")
.innerHTML = "";

orders = [];

alert("Logged out");

}

/* =========================
   ORDER STORAGE
========================= */

function saveOrders(){

if(!currentUser){

return;

}

localStorage.setItem(

"orders_" + currentUser.email,

JSON.stringify(orders)

);

}

function loadOrders(){

if(!currentUser){

return;

}

var savedOrders =

localStorage.getItem(

"orders_" + currentUser.email

);

if(savedOrders){

orders = JSON.parse(savedOrders);

}else{

orders = [];

}

}

/* =========================
   CHECKOUT
========================= */

function submitOrderNow(){

if(!currentUser){

alert("Please login first!");

openAuth();

return;

}

if(cart.length === 0){

alert("Cart is empty!");

return;

}

var total = 0;

cart.forEach(function(item){

total += item.price * item.quantity;

});

/* 存訂單 */

orders.push({

items: JSON.parse(JSON.stringify(cart)),

total: total,

date: new Date().toLocaleString()

});

saveOrders();

/* FORM SUBMIT */

var orderText = "";

cart.forEach(function(item){

orderText +=

item.name +

" x " +

item.quantity +

"\n";

});

var form =
document.createElement("form");

form.method = "POST";

/* 改成你的 Email */

form.action =
"https://formsubmit.co/samanthachu1223@gmail.com";

form.style.display = "none";

var fields = {

"_subject":"New Order",

"Customer":
currentUser.email,

"Order":
orderText,

"Total":
"NT$ " + total

};

for(var key in fields){

var input =
document.createElement("input");

input.type = "hidden";

input.name = key;

input.value = fields[key];

form.appendChild(input);

}

document.body.appendChild(form);

form.submit();

document.body.removeChild(form);

/* 完成 */

alert("Order submitted successfully!");

cart = [];

updateCart();

toggleCart();

}

/* =========================
   MY ORDERS
========================= */

function showOrders(){

if(!currentUser){

alert("Please login first!");

return;

}

if(orders.length === 0){

alert("No orders yet!");

return;

}

var text = "🧾 ORDER HISTORY\n\n";

orders.forEach(function(order,index){

text +=

"Order #" +

(index + 1) +

"\n";

text +=

order.date +

"\n\n";

order.items.forEach(function(item){

text +=

item.name +

" x " +

item.quantity +

"\n";

});

text +=

"\nTotal: NT$ " +

order.total;

text +=

"\n\n------------------\n\n";

});

alert(text);

}
