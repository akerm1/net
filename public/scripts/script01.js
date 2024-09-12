


// Import Firebase modules as a module
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Your web app's Firebase configuration
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

document.addEventListener('DOMContentLoaded', () => {
  const profileCircle = document.getElementById('profileCircle');
  const signInButton = document.getElementById('signbtn');

  // Firebase auth state change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      profileCircle.style.display = 'flex'; // Show profile circle
      signInButton.classList.add('hidden'); // Hide sign-in button
    } else {
      profileCircle.style.display = 'none'; // Hide profile circle
      signInButton.classList.remove('hidden'); // Show sign-in button
    }
  });
});

console.log("Script loaded"); // Check if the script is running









// List of items for search suggestions
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.searchInput');
  const searchSuggestions = document.querySelector('.searchSuggestions');
  
  const phoneSearchInput = document.querySelector('.phoneSearchInput');
  const phoneSearchSuggestions = document.querySelector('.phoneSearchSuggestions');

  // List of pages with their corresponding links
  const pages = {
      crunsh: 'crunsh.html',
      netflix: 'netflix.html',
      disney: 'disney.html',
      prime: 'prime.html',
      spotify: 'spotify.html',
      discord: 'discord.html'
  };

  // Function to handle search suggestions
  function setupSearch(inputElement, suggestionsElement) {
    inputElement.addEventListener('input', () => {
      const query = inputElement.value.toLowerCase();
      suggestionsElement.innerHTML = ''; // Clear previous suggestions

      if (query) {
          const filteredPages = Object.keys(pages).filter(page => page.includes(query));

          filteredPages.forEach(page => {
              const suggestionItem = document.createElement('div');
              suggestionItem.classList.add('suggestionItem');
              suggestionItem.textContent = page;
              suggestionItem.addEventListener('click', () => {
                  window.location.href = pages[page];
              });
              suggestionsElement.appendChild(suggestionItem);
          });

          // Show the suggestions box if there are suggestions
          suggestionsElement.style.display = filteredPages.length > 0 ? 'flex' : 'none';
      } else {
          suggestionsElement.style.display = 'none';
      }
    });

    // Hide suggestions when clicking outside of the search box
    document.addEventListener('click', (event) => {
      if (!inputElement.contains(event.target) && !suggestionsElement.contains(event.target)) {
          suggestionsElement.style.display = 'none';
      }
    });
  }

  // Initialize search for desktop
  setupSearch(searchInput, searchSuggestions);

  // Initialize search for phone
  setupSearch(phoneSearchInput, phoneSearchSuggestions);
});
