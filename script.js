// ============================================================
// PRODUCT DATA
// ============================================================

var products = [

{
id:1,
name:"Twix Minis",
description:"Delicious chocolate caramel biscuit",
price:10,
img:"https://gcs.rimg.com.tw/g1/6/bc/37/22228757099575_395.jpg",
category:"snacks"
},

{
id:2,
name:"Want Want Senbei",
description:"Classic rice crackers",
price:10,
img:"https://www.91zjdl.com/file/upload/202503/18/110711811.jpg.middle.jpg",
category:"snacks"
},

{
id:3,
name:"North Sea Codfish Snack",
description:"Shredded codfish snack",
price:60,
img:"https://img.pchome.com.tw/cs/items/DBACHS1900GP05V/000001_1742180781.jpg",
category:"snacks"
},

{
id:4,
name:"Garlic Green Peas",
description:"Crunchy garlic flavoured peas",
price:15,
img:"https://www.costco.com.tw/medias/sys_master/images/ha0/h0c/65765251907614.jpg",
category:"snacks"
},

{
id:5,
name:"Wet Wipes",
description:"Pure water baby wipes",
price:35,
img:"https://i1.momoshop.com.tw/1692891638/goodsimg/0008/084/433/8084433_OR_m.webp",
category:"daily"
},

{
id:6,
name:"Alcohol Wipes",
description:"Disinfecting alcohol wipes",
price:60,
img:"https://www.wellcare.com.tw/upload/2023_07_1714/20230717170747cuwc96Pw71.jpg",
category:"daily"
},

{
id:7,
name:"Band-Aid (Waterproof)",
description:"Skin color waterproof band-aid",
price:15,
img:"https://cosmebear.tw/cdn/shop/products/band-aid-ok-386265.jpg?v=1687585186&width=360",
category:"daily"
},

{
id:8,
name:"Pocket Tissues",
description:"Minions pattern tissues",
price:10,
img:"https://mall.iopenmall.tw/website/uploads_product/website_43989/P4398906638788_4_77141426.jpg?hash=96815",
category:"daily"
}

];

// ============================================================
// CATEGORIES
// ============================================================

var categories = {

snacks:"🍿 Snacks",

daily:"🏠 Daily Essentials"

};

// ============================================================
// VARIABLES
// ============================================================

var cart = [];

var currentCategory = "snacks";

// ============================================================
// ACCOUNT
// ============================================================

function handleAccountClick(event){

event.stopPropagation();

if(window.currentUser){

document
.getElementById("accountDropdown")
.classList.toggle("open");

}else{

openAuth();

}

}

function closeDropdown(){

document
.getElementById("accountDropdown")
.classList.remove("open");

}

document.addEventListener("click",function(e){

var wrapper =
document.getElementById("accountWrapper");

if(wrapper && !wrapper.contains(e.target)){

closeDropdown();

}

});

// ============================================================
// AUTH MODAL
// ============================================================

function openAuth(){

document
.getElementById("authOverlay")
.classList.add("active");

}

window.closeAuth = function(){

document
.getElementById("authOverlay")
.classList.remove("active");

}

function closeAuthOnOverlay(e){

if(
e.target ===
document.getElementById("authOverlay")
){

closeAuth();

}

}

function switchAuthTab(tab){

document
.getElementById("tabLogin")
.classList.toggle("active",tab==="login");

document
.getElementById("tabRegister")
.classList.toggle("active",tab==="register");

document
.getElementById("formLogin")
.classList.toggle("active",tab==="login");

document
.getElementById("formRegister")
.classList.toggle("active",tab==="register");

}

// ============================================================
// UPDATE ACCOUNT UI
// ============================================================

window.updateAccountUI = function(email){

var inner =
document.getElementById("accountBtnInner");

if(email){

var initial =
email[0].toUpperCase();

inner.innerHTML =

'<span class="avatar-letter">' +
initial +
'</span>';

document
.getElementById("dropdownName")
.textContent = "Hello!";

document
.getElementById("dropdownEmail")
.textContent = email;

}else{

inner.innerHTML =

'<svg class="icon-person" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';

document
.getElementById("dropdownEmail")
.textContent = "";

}

}

// ============================================================
// STORE
// ============================================================

function init(){

renderCategoryTabs();

renderProducts(currentCategory);

updateCart();

}

function renderCategoryTabs(){

var html = "";

for(var cat in categories){

var activeClass =
(cat===currentCategory)
? "active"
: "";

html +=

"<div class='category-tab " +
activeClass +
"' onclick='switchCategory(\"" +
cat +
"\")'>" +
categories[cat] +
"</div>";

}

document
.getElementById("categoryTabs")
.innerHTML = html;

}

function switchCategory(cat){

currentCategory = cat;

renderCategoryTabs();

renderProducts(cat);

}

function renderProducts(cat){

var html =

"<div class='category-section'>" +

"<h2 class='category-title'>" +
categories[cat] +
"</h2>" +

"<div class='category-products'>";

for(var i=0;i<products.length;i++){

var p = products[i];

if(p.category===cat){

html +=

"<div class='product-card'>" +

"<img class='product-img' src='" +
p.img +
"'>" +

"<h3 class='product-title'>" +
p.name +
"</h3>" +

"<p class='product-description'>" +
p.description +
"</p>" +

"<div class='product-price'>NT$ " +
p.price +
"</div>" +

"<button class='add-to-cart-btn' onclick='addToCart(" +
p.id +
")'>Add to Cart</button>" +

"</div>";

}

}

html += "</div></div>";

document
.getElementById("products")
.innerHTML = html;

}

// ============================================================
// CART
// ============================================================

function addToCart(id){

var product =
products.find(function(p){

return p.id===id;

});

var item =
cart.find(function(c){

return c.id===id;

});

if(item){

item.quantity++;

}else{

cart.push({

id:product.id,

name:product.name,

price:product.price,

img:product.img,

quantity:1

});

}

updateCart();

}

function removeFromCart(id){

cart = cart.filter(function(item){

return item.id !== id;

});

updateCart();

}

function updateCart(){

var total = 0;

var count = 0;

var html = "";

if(cart.length===0){

html =
"<div class='empty-cart'>Your cart is empty</div>";

}else{

for(var i=0;i<cart.length;i++){

var item = cart[i];

total += item.price * item.quantity;

count += item.quantity;

html +=

"<div class='cart-item'>" +

"<img src='" + item.img + "'>" +

"<div style='flex:1'>" +

"<strong>" +
item.name +
"</strong>" +

"<div>NT$ " +
item.price +
"</div>" +

"<div>Qty: " +
item.quantity +
"</div>" +

"</div>" +

"<button onclick='removeFromCart(" +
item.id +
")' style='height:35px'>✕</button>" +

"</div>";

}

}

document
.getElementById("cartItems")
.innerHTML = html;

document
.getElementById("cartTotal")
.textContent =
"Total: NT$ " + total;

document
.getElementById("cartCount")
.textContent = count;

}

// ============================================================
// CART SIDEBAR
// ============================================================

function toggleCart(){

document
.getElementById("cartSidebar")
.classList.toggle("active");

}

// ============================================================
// CHECKOUT
// ============================================================

function submitOrderNow(){

if(!window.currentUser){

alert("Please login first!");

openAuth();

return;

}

if(cart.length===0){

alert("Your cart is empty!");

return;

}

var total = 0;

var orderText = "";

for(var i=0;i<cart.length;i++){

var item = cart[i];

total += item.price * item.quantity;

orderText +=
item.name +
" x " +
item.quantity +
"\n";

}

// FIREBASE

saveOrderToFirebase({

items:JSON.parse(JSON.stringify(cart)),

total:total

});

// FORMSUBMIT

var form =
document.createElement("form");

form.method = "POST";

form.action =
"https://formsubmit.co/samanthachu1223@gmail.com";

form.style.display = "none";

var fields = {

"_subject":"New Order",

"Customer":
window.currentUser.email,

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

alert("Order submitted!");

cart = [];

updateCart();

toggleCart();

}

// ============================================================
// START
// ============================================================

init();
