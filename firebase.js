
// ============================================================
// FIREBASE IMPORTS
// ============================================================

import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

getAuth,

createUserWithEmailAndPassword,

signInWithEmailAndPassword,

signOut,

onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

getFirestore,

collection,

addDoc,

getDocs,

query,

where

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {

apiKey: "AIzaSyDa9H7M95lKCOPskLyDEomvw9Hwug5TBlE",

authDomain: "online-store-dda50.firebaseapp.com",

projectId: "online-store-dda50",

storageBucket: "online-store-dda50.firebasestorage.app",

messagingSenderId: "910541041603",

appId: "1:910541041603:web:c4ce3c92dce0254e351776",

measurementId: "G-0VJSHS97DJ"

};


// ============================================================
// INIT
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================================
// GLOBAL
// ============================================================

window.currentUser = null;


// ============================================================
// REGISTER
// ============================================================

window.doRegister = async function(){

const email =
document.getElementById("regEmail").value;

const password =
document.getElementById("regPassword").value;

const confirm =
document.getElementById("regPasswordConfirm").value;

const msg =
document.getElementById("registerMsg");

if(password !== confirm){

msg.textContent = "Passwords do not match";

return;

}

try{

await createUserWithEmailAndPassword(

auth,
email,
password

);

msg.textContent = "Register successful!";

}catch(error){

msg.textContent = error.message;

}

};


// ============================================================
// LOGIN
// ============================================================

window.doLogin = async function(){

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

const msg =
document.getElementById("loginMsg");

try{

await signInWithEmailAndPassword(

auth,
email,
password

);

msg.textContent = "Login successful!";

}catch(error){

msg.textContent = error.message;

}

};


// ============================================================
// LOGOUT
// ============================================================

window.logout = async function(){

await signOut(auth);

};


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(auth,(user)=>{

if(user){

window.currentUser = user;

updateAccountUI(user.email);

closeAuth();

}else{

window.currentUser = null;

updateAccountUI(null);

}

});


// ============================================================
// SAVE ORDER
// ============================================================

window.saveOrderToFirebase = async function(orderData){

if(!window.currentUser){

alert("Please login first");

return;

}

try{

await addDoc(

collection(db,"orders"),

{

userEmail: window.currentUser.email,

items: orderData.items,

total: orderData.total,

date: new Date().toLocaleString()

}

);

}catch(error){

console.error(error);

}

};


// ============================================================
// SHOW ORDERS
// ============================================================

window.showOrders = async function(){

if(!window.currentUser){

alert("Please login first!");

return;

}

const q = query(

collection(db,"orders"),

where(
"userEmail",
"==",
window.currentUser.email
)

);

const querySnapshot =
await getDocs(q);

if(querySnapshot.empty){

alert("No orders yet!");

return;

}

let text = "🧾 ORDER HISTORY\n\n";

let index = 1;

querySnapshot.forEach((doc)=>{

const order = doc.data();

text +=
"Order #" + index + "\n";

text +=
order.date + "\n\n";

order.items.forEach((item)=>{

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

index++;

});

alert(text);

};
