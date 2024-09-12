// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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

// DOM Elements
const container = document.getElementById('container');
const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const signInSpinner = document.getElementById('signInSpinner');
const signUpSpinner = document.getElementById('signUpSpinner');
const signInStatus = document.getElementById('signInStatus');
const signUpStatus = document.getElementById('signUpStatus');
const forgotPasswordLink = document.getElementById('forgotPassword');

// Toggle forms
signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

// Sign up form submission
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    signUpSpinner.style.display = 'block'; // Show spinner

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Signed up as:', user.email);
            signUpStatus.textContent = 'Sign up successful';
            signUpStatus.style.color = 'green';
            setTimeout(() => {
                container.classList.remove("right-panel-active");
                signUpSpinner.style.display = 'none'; // Hide spinner
            }, 1000); // Delay to ensure spinner is visible
        })
        .catch((error) => {
            console.error(error.message);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    signUpStatus.textContent = 'Email is already in use';
                    break;
                case 'auth/invalid-email':
                    signUpStatus.textContent = 'Invalid email address';
                    break;
                case 'auth/weak-password':
                    signUpStatus.textContent = 'Password is too weak';
                    break;
                default:
                    signUpStatus.textContent = 'Error: ' + error.message;
            }
            signUpStatus.style.color = 'red';
            signUpSpinner.style.display = 'none'; // Hide spinner on error
        });
});

// Sign in form submission
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    signInSpinner.style.display = 'block'; // Show spinner

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Signed in as:', user.email);
            signInStatus.textContent = 'Sign in successful';
            signInStatus.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'https://akerm1.github.io/test4/'; // Redirect after successful sign-in
            }, 1000); // Delay to ensure spinner is visible
        })
        .catch((error) => {
            console.error(error.message);
            signInStatus.textContent = 'Sign in failed: ' + error.message;
            signInStatus.style.color = 'red';
            signInSpinner.style.display = 'none'; // Hide spinner on error
        });
});

// Forgot Password Link
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;

    if (!email) {
        signInStatus.textContent = 'Please enter your email address';
        signInStatus.style.color = 'red';
        return;
    }

    signInSpinner.style.display = 'block'; // Show spinner

    sendPasswordResetEmail(auth, email)
        .then(() => {
            signInStatus.textContent = 'Password reset email sent. Check your inbox.';
            signInStatus.style.color = 'green';
            signInSpinner.style.display = 'none'; // Hide spinner
        })
        .catch((error) => {
            console.error(error.message);
            signInStatus.textContent = 'Error: ' + error.message;
            signInStatus.style.color = 'red';
            signInSpinner.style.display = 'none'; // Hide spinner on error
        });
});



