import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1KApdTOCrWAaQ1EDsh4CLfFslPzakSFk",
  authDomain: "voyllar-a872f.firebaseapp.com",
  projectId: "voyllar-a872f",
  storageBucket: "voyllar-a872f.appspot.com",
  messagingSenderId: "112983014466",
  appId: "1:112983014466:web:f724d2566b6a0f7f5a01db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.openPopup = function(event, payLink, baridiMobLink, usdtLink) {
  event.preventDefault();
  const product = event.target.closest('.card').dataset.product;
  const price = event.target.closest('.card').dataset.price;
  window.currentProduct = product;
  window.currentPrice = price;
  window.currentPayLink = payLink;
  window.currentBaridiMobLink = baridiMobLink;
  window.currentUsdtLink = usdtLink;

  const popup = document.getElementById('payment-popup');
  if (popup) {
    const priceDisplay = document.getElementById('price-display');
    if (priceDisplay) {
      priceDisplay.textContent = `Price: ${price}`;
    }
    popup.style.display = 'flex';
    console.log("Popup opened with details:", { product, price, payLink, baridiMobLink, usdtLink });

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please sign in to make a purchase.");
        console.log("User not signed in");
      } else {
        console.log("User is signed in:", user.uid);
      }
    });
  } else {
    console.error("Payment popup element not found.");
  }
}

window.closePopup = function() {
  const popup = document.getElementById('payment-popup');
  if (popup) {
    popup.style.display = 'none';
    console.log("Popup closed");
  } else {
    console.error("Payment popup element not found.");
  }
}

window.handlePayment = async function(method) {
  const product = window.currentProduct;
  const price = window.currentPrice;

  if (!product || !price) {
    alert("Product or price information is missing.");
    console.log("Product or price missing.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to make a purchase.");
      console.log("No user signed in");
      return;
    }

    const userId = user.uid;
    const ordersCollection = collection(db, 'orders');
    const orderRef = doc(ordersCollection); // Create a new document reference

    console.log("Creating order with details:", {
      product,
      price,
      userId,
      status: false, // Set status to false initially
      date: serverTimestamp(),
      orderId: orderRef.id,
      Your_Item: "Your Item Will Be Delivered Here"
    });

    // Save the order to Firestore
    await setDoc(orderRef, {
      product,
      price,
      userId,
      status: false, // Set status to false initially
      date: serverTimestamp(),
      orderId: orderRef.id,
      Your_Item: "Your Item Will Be Delivered Here"
    });

    console.log("Order saved to Firestore successfully");

    // Redirect based on payment method
    if (method === 'paypal') {
      window.open(window.currentPayLink, '_blank');
    } else if (method === 'baridimob') {
      window.open(window.currentBaridiMobLink, '_blank');
    } else if (method === 'usdt') {
      window.open(window.currentUsdtLink, '_blank');
    }

    // Close the popup after redirection
    closePopup();
  } catch (error) {
    console.error("Error handling payment or saving order:", error);
  }
}




