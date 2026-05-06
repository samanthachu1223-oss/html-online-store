// ============================================================
//  PRODUCT DATA
// ============================================================
var products = [
  { id: 1,  name: "Twix Minis",                description: "Delicious chocolate caramel biscuit",             price: 10,  img: "https://gcs.rimg.com.tw/g1/6/bc/37/22228757099575_395.jpg",                                                                     category: "snacks" },
  { id: 2,  name: "Want Want Senbei",           description: "Classic rice crackers",                           price: 10,  img: "https://www.91zjdl.com/file/upload/202503/18/110711811.jpg.middle.jpg",                                                           category: "snacks" },
  { id: 3,  name: "North Sea Codfish Snack",    description: "Shredded codfish snack (Thin/Medium size available)", price: 60, img: "https://img.pchome.com.tw/cs/items/DBACHS1900GP05V/000001_1742180781.jpg",                                                    category: "snacks" },
  { id: 4,  name: "Garlic Green Peas",          description: "Crunchy garlic flavoured peas",                   price: 15,  img: "https://www.costco.com.tw/medias/sys_master/images/ha0/h0c/65765251907614.jpg",                                                  category: "snacks" },
  { id: 5,  name: "Wet Wipes",                  description: "Pure water baby wipes (20 sheets)",               price: 35,  img: "https://i1.momoshop.com.tw/1692891638/goodsimg/0008/084/433/8084433_OR_m.webp",          imgClass: "large",                      category: "daily"  },
  { id: 6,  name: "Alcohol Wipes",              description: "Disinfecting alcohol wipes (20 sheets)",          price: 60,  img: "https://www.wellcare.com.tw/upload/2023_07_1714/20230717170747cuwc96Pw71.jpg",                                                   category: "daily"  },
  { id: 7,  name: "Band-Aid (Waterproof)",      description: "Skin color (76 mm × 19 mm)",                      price: 15,  img: "https://cosmebear.tw/cdn/shop/products/band-aid-ok-386265.jpg?v=1687585186&width=360",                                            category: "daily"  },
  { id: 8,  name: "Small Band-Aid (Waterproof)",      description: "For wounds under 1cm - Waterproof",         price: 5,   img: "https://shop.r10s.com/384/dc0/4880/4fb0/7066/20f4/03fc/11e9efa7640242ac110002.jpg",                                               category: "daily"  },
  { id: 9,  name: "Small Band-Aid (Hypoallergenic)",  description: "For wounds under 1cm - Skin-tone, low sensitivity", price: 5, img: "https://shop.r10s.com/384/dc0/4880/4fb0/7066/20f4/03fc/11e9efa7640242ac110002.jpg",                                        category: "daily"  },
  { id: 10, name: "Pocket Tissues",             description: "Minions pattern (10 sheets)",                     price: 10,  img: "https://mall.iopenmall.tw/website/uploads_product/website_43989/P4398906638788_4_77141426.jpg?hash=96815",                        category: "daily"  }
];

var categories = { snacks: "🍿 Snacks", daily: "🏠 Daily Essentials" };
var cart = [];
var currentCategory = "snacks";


// ============================================================
//  AUTH — localStorage helpers
// ============================================================
var currentUser = null;

function getUsers() {
  try { return JSON.parse(localStorage.getItem("store_users") || "{}"); } catch (e) { return {}; }
}
function saveUsers(users) {
  localStorage.setItem("store_users", JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem("store_session") || "null"); } catch (e) { return null; }
}
function saveSession(user) {
  localStorage.setItem("store_session", JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem("store_session");
}

// ---- Account button / dropdown ----
function handleAccountClick(e) {
  e.stopPropagation(); // prevent the document listener from closing it immediately
  if (currentUser) {
    document.getElementById("accountDropdown").classList.toggle("open");
  } else {
    openAuth();
  }
}

function closeDropdown() {
  document.getElementById("accountDropdown").classList.remove("open");
}

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  var wrapper = document.getElementById("accountWrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    closeDropdown();
  }
});

// ---- Auth modal ----
function openAuth() {
  document.getElementById("authOverlay").classList.add("active");
  document.getElementById("loginMsg").textContent = "";
  document.getElementById("registerMsg").textContent = "";
}
function closeAuth() {
  document.getElementById("authOverlay").classList.remove("active");
}
function closeAuthOnOverlay(e) {
  if (e.target === document.getElementById("authOverlay")) closeAuth();
}
function switchAuthTab(tab) {
  document.getElementById("tabLogin").classList.toggle("active", tab === "login");
  document.getElementById("tabRegister").classList.toggle("active", tab === "register");
  document.getElementById("formLogin").classList.toggle("active", tab === "login");
  document.getElementById("formRegister").classList.toggle("active", tab === "register");
}

// ---- Login ----
function doLogin() {
  var email    = document.getElementById("loginEmail").value.trim().toLowerCase();
  var password = document.getElementById("loginPassword").value;
  var msg      = document.getElementById("loginMsg");

  if (!email || !password) {
    msg.className = "auth-msg error";
    msg.textContent = "Please fill in all fields.";
    return;
  }
  var users = getUsers();
  if (!users[email]) {
    msg.className = "auth-msg error";
    msg.textContent = "Account not found. Please register first.";
    return;
  }
  if (users[email].password !== password) {
    msg.className = "auth-msg error";
    msg.textContent = "Incorrect password.";
    return;
  }
  currentUser = { email: email, name: users[email].name || "" };
  saveSession(currentUser);
  msg.className = "auth-msg success";
  msg.textContent = "Login successful!";
  setTimeout(function () { closeAuth(); updateAccountUI(); }, 700);
}

// ---- Register ----
function doRegister() {
  var name    = document.getElementById("regName").value.trim();
  var email   = document.getElementById("regEmail").value.trim().toLowerCase();
  var pass    = document.getElementById("regPassword").value;
  var pass2   = document.getElementById("regPasswordConfirm").value;
  var msg     = document.getElementById("registerMsg");

  if (!email || !pass || !pass2) {
    msg.className = "auth-msg error";
    msg.textContent = "Please fill in email and password.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.className = "auth-msg error";
    msg.textContent = "Please enter a valid email.";
    return;
  }
  if (pass.length < 6) {
    msg.className = "auth-msg error";
    msg.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (pass !== pass2) {
    msg.className = "auth-msg error";
    msg.textContent = "Passwords do not match.";
    return;
  }
  var users = getUsers();
  if (users[email]) {
    msg.className = "auth-msg error";
    msg.textContent = "This email is already registered.";
    return;
  }
  users[email] = { name: name, password: pass };
  saveUsers(users);
  currentUser = { email: email, name: name };
  saveSession(currentUser);
  msg.className = "auth-msg success";
  msg.textContent = "Account created! Welcome 🎉";
  setTimeout(function () { closeAuth(); updateAccountUI(); }, 800);
}

// ---- Logout ----
function logout() {
  currentUser = null;
  clearSession();
  closeDropdown();
  updateAccountUI();
}

// ---- Update UI after auth state change ----
function updateAccountUI() {
  var inner = document.getElementById("accountBtnInner");

  if (currentUser) {
    var initial = (currentUser.name ? currentUser.name[0] : currentUser.email[0]).toUpperCase();
    inner.innerHTML = '<span class="avatar-letter">' + initial + '</span>';
    document.getElementById("dropdownName").textContent  = "Hello, " + (currentUser.name || "there") + "!";
    document.getElementById("dropdownEmail").textContent = currentUser.email;
    // Pre-fill checkout form
    if (currentUser.name) document.getElementById("customerName").value = currentUser.name;
    document.getElementById("customerEmail").value = currentUser.email;
  } else {
    inner.innerHTML = '<svg class="icon-person" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
  }
}


// ============================================================
//  STORE
// ============================================================
function init() {
  var session = getSession();
  if (session) { currentUser = session; }
  updateAccountUI();
  renderCategoryTabs();
  renderProducts(currentCategory);
}

function renderCategoryTabs() {
  var html = "";
  for (var cat in categories) {
    var activeClass = (cat === currentCategory) ? "active" : "";
    html += "<div class='category-tab " + activeClass + "' onclick='switchCategory(\"" + cat + "\")'>" + categories[cat] + "</div>";
  }
  document.getElementById("categoryTabs").innerHTML = html;
}

function switchCategory(cat) {
  currentCategory = cat;
  renderCategoryTabs();
  renderProducts(cat);
}

function renderProducts(cat) {
  var html = "<div class='category-section'><h2 class='category-title'>" + categories[cat] + "</h2><div class='category-products'>";
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (p.category === cat) {
      html += "<div class='product-card'>";
      if (p.img)   html += "<img class='product-img " + (p.imgClass || "") + "' src='" + p.img + "' alt='" + p.name + "'>";
      else         html += "<div class='product-emoji'>" + p.emoji + "</div>";
      html += "<h3 class='product-title'>" + p.name + "</h3>";
      html += "<p class='product-description'>" + p.description + "</p>";
      html += "<div class='product-price'>NT$ " + p.price + "</div>";
      html += "<button class='add-to-cart-btn' onclick='addToCart(" + p.id + ")'>Add to Cart</button>";
      html += "</div>";
    }
  }
  html += "</div></div>";
  document.getElementById("products").innerHTML = html;
}

function addToCart(id) {
  var product = products.find(function (p) { return p.id === id; });
  var item    = cart.find(function (c) { return c.id === id; });
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, emoji: product.emoji, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (c) { return c.id !== id; });
  updateCart();
}

function increaseQuantity(id) {
  var item = cart.find(function (c) { return c.id === id; });
  if (item) item.quantity++;
  updateCart();
}

function decreaseQuantity(id) {
  var item = cart.find(function (c) { return c.id === id; });
  if (item) {
    if (item.quantity > 1) item.quantity--;
    else removeFromCart(id);
  }
  updateCart();
}

function updateCart() {
  var total = 0, count = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
    count += cart[i].quantity;
  }
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = "Total: NT$ " + total;

  var html = "";
  if (cart.length === 0) {
    html = "<div class='empty-cart'>Your cart is empty</div>";
  } else {
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      html += "<div class='cart-item'><div class='cart-item-info'>";
      if (item.img) html += "<img src='" + item.img + "' alt='" + item.name + "'>";
      else          html += "<span class='product-emoji'>" + item.emoji + "</span>";
      html += "<div><strong>" + item.name + "</strong>";
      html += "<div>NT$ " + item.price + " each</div>";
      html += "<div class='quantity-controls'>";
      html += "<button class='quantity-btn' onclick='decreaseQuantity(" + item.id + ")'>-</button>";
      html += "<span class='quantity-display'>" + item.quantity + "</span>";
      html += "<button class='quantity-btn' onclick='increaseQuantity(" + item.id + ")'>+</button>";
      html += "</div></div></div>";
      html += "<button class='remove-item' onclick='removeFromCart(" + item.id + ")'>Remove All</button></div>";
    }
  }
  document.getElementById("cartItems").innerHTML = html;
}

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("active");
  hideCheckout();
}

function showCheckout() {
  if (cart.length === 0) { alert("Your cart is empty!"); return; }
  document.getElementById("checkoutBtn").style.display  = "none";
  document.getElementById("cartItems").style.display    = "none";
  document.getElementById("cartTotal").style.display    = "none";
  document.getElementById("checkoutForm").classList.add("active");
}

function hideCheckout() {
  document.getElementById("checkoutBtn").style.display = "block";
  document.getElementById("cartItems").style.display   = "block";
  document.getElementById("cartTotal").style.display   = "block";
  document.getElementById("checkoutForm").classList.remove("active");
}

function submitOrderNow() {
  var name  = document.getElementById("customerName").value.trim();
  var email = document.getElementById("customerEmail").value.trim();
  if (!name || !email) { alert("Please fill in all fields!"); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email address!"); return; }

  var total = 0, orderText = "", orderHTML = "";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total      += item.price * item.quantity;
    orderText  += item.name + " - NT$ " + item.price + " x " + item.quantity + " = NT$ " + (item.price * item.quantity) + "\n";
    orderHTML  += "<div class='order-item'>" + item.name + " - NT$ " + item.price + " × " + item.quantity + " = NT$ " + (item.price * item.quantity) + "</div>";
  }
  orderHTML += "<div class='order-item'>Total: NT$ " + total + "</div>";

  document.getElementById("orderSummary").innerHTML =
    "<h3>📋 Order Details</h3>" +
    "<p style='text-align:center; margin-bottom:15px;'><strong>" + name + "</strong><br>" + email + "</p>" +
    orderHTML;

  // Submit via hidden form
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "https://formsubmit.co/samanthachu1223@gmail.com";
  form.target = "hiddenFrame";
  var fields = {
    "_subject":       "New Order from " + name,
    "_captcha":       "false",
    "_template":      "table",
    "Customer Name":  name,
    "Customer Email": email,
    "Order Details":  orderText,
    "Total":          "NT$ " + total
  };
  for (var key in fields) {
    var input = document.createElement("input");
    input.type  = "hidden";
    input.name  = key;
    input.value = fields[key];
    form.appendChild(input);
  }
  var iframe = document.createElement("iframe");
  iframe.name = "hiddenFrame";
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  document.body.appendChild(form);
  form.submit();
  setTimeout(function () {
    document.body.removeChild(form);
    document.body.removeChild(iframe);
  }, 2000);

  document.getElementById("thankYouOverlay").classList.add("active");
  document.getElementById("thankYouMessage").classList.add("active");
  hideCheckout();
  cart = [];
  updateCart();
  document.getElementById("customerName").value  = "";
  document.getElementById("customerEmail").value = "";
}

function closeThankYou() {
  document.getElementById("thankYouOverlay").classList.remove("active");
  document.getElementById("thankYouMessage").classList.remove("active");
  toggleCart();
}

// ---- Start ----
init();
