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

var categories = {
snacks:"🍿 Snacks",
daily:"🏠 Daily Essentials"
};

var cart = [];

var currentCategory = "snacks";

var isLogin = true;

var currentUser = null;

/* INIT */

init();

function init(){

renderTabs();

renderProducts(currentCategory);

updateCart();

}

/* CATEGORY */

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

document.getElementById("categoryTabs").innerHTML = html;

}

function switchCategory(cat){

currentCategory = cat;

renderTabs();

renderProducts(cat);

}

/* PRODUCTS */

function renderProducts(cat){

var html = `
<div class="category-section">

<h2 class="category-title">
${categories[cat]}
</h2>

<div class="category-products">
`;

products.forEach(function(p){

if(p.category===cat){

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

html += "</div></div>";

document.getElementById("products").innerHTML = html;

}

/* CART */

function addToCart(id){

var product = products.find(p=>p.id===id);

var item = cart.find(c=>c.id===id);

if(item){

item.quantity++;

}else{

cart.push({
...product,
quantity:1
});

}

updateCart();

}

function updateCart(){

var html = "";

var total = 0;

var count = 0;

if(cart.length===0){

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

}

document.getElementById("cartItems").innerHTML = html;

document.getElementById("cartTotal").innerHTML =
`Total: NT$ ${total}`;

document.getElementById("cartCount").innerHTML =
count;

}

function toggleCart(){

document.getElementById("cartSidebar")
.classList.toggle("active");

}

/* AUTH */

function openAuth(){

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

alert("Login successful!");

}else{

var user = {
email:email,
password:password
};

localStorage.setItem(
email,
JSON.stringify(user)
);

currentUser = user;

alert("Register successful!");

}

updateAccountUI();

closeAuth();

}

function updateAccountUI(){

var first =
currentUser.email[0].toUpperCase();

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

alert("Logged out");

}

function showOrders(){

alert("Order history coming soon!");

}
