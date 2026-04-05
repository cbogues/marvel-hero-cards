// ================================
// CONFIGURATION
// ================================

// Your SuperHero API token
// In a real backend app this would be hidden server-side
// For now we're learning how API calls work in the browser
// NEW - calls our own server instead
const BASE_URL = "";
// ================================
// GET ELEMENTS FROM THE PAGE
// ================================

// These grab the HTML elements we built in index.html
// document.getElementById finds an element by its id attribute
const searchInput = document.getElementById("hero-search");
const searchBtn = document.getElementById("search-btn");
const heroCard = document.getElementById("hero-card");
const heroImage = document.getElementById("hero-image");
const heroName = document.getElementById("hero-name");
const heroFullname = document.getElementById("hero-fullname");
const heroPublisher = document.getElementById("hero-publisher");
const errorMessage = document.getElementById("error-message");
const loadingMessage = document.getElementById("loading");

// Power stat elements
const statIntelligence = document.getElementById("stat-intelligence");
const statStrength = document.getElementById("stat-strength");
const statSpeed = document.getElementById("stat-speed");
const statCombat = document.getElementById("stat-combat");

// ================================
// HELPER FUNCTIONS
// ================================

// Show an element by removing the hidden class
function show(element) {
  element.classList.remove("hidden");
}

// Hide an element by adding the hidden class
function hide(element) {
  element.classList.add("hidden");
}

// Reset the page back to its default state
function resetUI() {
  hide(heroCard);
  hide(errorMessage);
  hide(loadingMessage);
}

// ================================
// DISPLAY HERO DATA
// ================================

function displayHero(hero) {
  // Fill in the hero image
  heroImage.alt = hero.name;
  heroImage.src = hero.image.url;
  heroImage.onerror = function () {
    heroImage.src = `https://ui-avatars.com/api/?name=${hero.name}&size=200&background=e23636&color=fff&bold=true`;
  };
  // Fill in the hero text info
  heroName.textContent = hero.name;
  heroFullname.textContent = hero.biography["full-name"] || "Unknown";
  heroPublisher.textContent = hero.biography.publisher || "Unknown";

  // Fill in the power stat bars
  // The API returns stats as strings like "85" so we add % to make a width
  statIntelligence.style.width = hero.powerstats.intelligence + "%";
  statStrength.style.width = hero.powerstats.strength + "%";
  statSpeed.style.width = hero.powerstats.speed + "%";
  statCombat.style.width = hero.powerstats.combat + "%";

  // Show the card
  show(heroCard);
}

// ================================
// SEARCH FUNCTION
// ================================

async function searchHero() {
  // Get what the user typed and remove extra spaces
  const heroSearchTerm = searchInput.value.trim();

  // If the input is empty do nothing
  if (!heroSearchTerm) return;

  // Reset UI and show loading message
  resetUI();
  show(loadingMessage);

  try {
    // Make the API call
    // fetch() sends a request to the URL and waits for a response
    const response = await fetch(`/api/hero/${heroSearchTerm}`);

    // Convert the response to JSON so we can read it
    const data = await response.json();

    // Hide the loading message
    hide(loadingMessage);

    // Check if the API found any results
    if (data.response === "success") {
      // Take the first result from the results array
      const hero = data.results[0];
      displayHero(hero);
    } else {
      // Show error message if no hero found
      show(errorMessage);
    }
  } catch (error) {
    // This runs if the network request fails completely
    hide(loadingMessage);
    show(errorMessage);
    console.error("API call failed:", error);
  }
}

// ================================
// EVENT LISTENERS
// ================================

// Listen for a click on the Search button
searchBtn.addEventListener("click", searchHero);

// Listen for Enter key press in the search input
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchHero();
  }
});
