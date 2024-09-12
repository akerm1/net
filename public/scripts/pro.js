// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, query, where, orderBy, getDocs, collection, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1KApdTOCrWAaQ1EDsh4CLfFslPzakSFk",
  authDomain: "voyllar-a872f.firebaseapp.com",
  projectId: "voyllar-a872f",
  storageBucket: "voyllar-a872f.appspot.com",
  messagingSenderId: "112983014466",
  appId: "1:112983014466:web:f724d2566b6a0f7f5a01db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const emailSpan = document.getElementById('email');
  const userNameSpan = document.getElementById('userName');
  const signOutBtn = document.getElementById('signOutBtn');
  const forgotPasswordLink = document.getElementById('forgotPassword');
  const ordersContainer = document.getElementById('orders');

  // Display user info
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      emailSpan.textContent = user.email || 'No email';
      userNameSpan.textContent = user.displayName || 'No username';
      await fetchOrders(user.uid);
    } else {
      emailSpan.textContent = 'Not logged in';
      userNameSpan.textContent = 'Not logged in';
      ordersContainer.innerHTML = '<h1>Please sign in to view your orders.</h1>';
    }
  });

  // Handle Sign Out
  signOutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert('Successfully signed out');
      window.location.href = 'sign.html'; // Redirect to sign-in page or home page
    }).catch((error) => {
      alert('Error signing out');
      console.error('Sign Out Error', error);
    });
  });

  // Handle Forgot Password
  forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    const userEmail = auth.currentUser?.email;
    
    if (userEmail) {
      sendPasswordResetEmail(auth, userEmail)
        .then(() => {
          alert(`Password reset email sent to ${userEmail}`);
        })
        .catch((error) => {
          console.error('Error sending password reset email', error);
          alert('Error sending password reset email');
        });
    } else {
      alert('No user is logged in');
    }
  });
});

// Fetch orders from Firestore
async function fetchOrders(userId) {
  try {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, where('userId', '==', userId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      document.getElementById('orders').innerHTML = '<p>No orders found.</p>';
      return;
    }

    const ordersContainer = document.getElementById('orders');
    ordersContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      const orderElement = document.createElement('div');
      orderElement.classList.add('order');

      const statusClass = orderData.status ? 'status-success' : 'status-verifying';
      const statusText = orderData.status ? 'Payment successful: Item will be delivered in a moment' : 'Verifying the payment';

      orderElement.innerHTML = `
        <div class="order-header">Order ID: ${orderData.orderId}</div>
        <div class="order-details">
          <p><strong>Product:</strong> ${orderData.product}</p>
          <p><strong>Price:</strong> ${orderData.price}</p>
          <p><strong>Status:</strong> <span class="order-status ${statusClass}">${statusText}</span></p>
          <p><strong>Date:</strong> ${orderData.date.toDate().toLocaleString()}</p>
          <p class="item1">${orderData.Your_Item || 'Your Item Will Be Delivered Here'}</p>
          <button class="delete-button" data-id="${doc.id}">Delete Order</button>
        </div>
      `;

      ordersContainer.appendChild(orderElement);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        const orderId = event.target.getAttribute('data-id');
        await deleteOrder(orderId);
      });
    });
  } catch (error) {
    document.getElementById('orders').innerHTML = '<p>Error fetching orders. Please try again later.</p>';
    console.error('Error fetching orders:', error);
  }
}

// Delete order from Firestore
async function deleteOrder(orderId) {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    alert('Order deleted successfully');
    // Refresh orders after deletion
    const user = auth.currentUser;
    if (user) {
      await fetchOrders(user.uid);
    }
  } catch (error) {
    alert('Failed to delete order');
    console.error('Error deleting order:', error);
  }
}
