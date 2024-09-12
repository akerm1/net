// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

// Extract the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');

// Reset password form submission
const resetPasswordForm = document.getElementById('resetPasswordForm');
resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    const resetPasswordStatus = document.getElementById('resetPasswordStatus');

    if (newPassword !== confirmNewPassword) {
        resetPasswordStatus.textContent = 'Passwords do not match';
        resetPasswordStatus.style.color = 'red';
        return;
    }

    confirmPasswordReset(auth, oobCode, newPassword)
        .then(() => {
            resetPasswordStatus.textContent = 'Password has been reset successfully.';
            resetPasswordStatus.style.color = 'green';
        })
        .catch((error) => {
            console.error(error.message);
            resetPasswordStatus.textContent = 'Error: ' + error.message;
            resetPasswordStatus.style.color = 'red';
        });
});
