const apiKey = "4c7a7320dd8bce2e63040a05d265fa24"; // <--Your TMDb API key
const imgBaseURL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies-container");

// Load popular movies on page start
document.addEventListener("DOMContentLoaded", getPopularMovies);

// Search movies
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

// Fetch popular movies
async function getPopularMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
  const data = await res.json();
  displayMovies(data.results);
}

// Fetch searched movies
async function searchMovies(query) {
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
  const data = await res.json();
  displayMovies(data.results);
}

// Display movies in grid
function displayMovies(movies) {
  moviesContainer.innerHTML = "";
  movies.forEach(movie => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${imgBaseURL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <button onclick="getTrailers(${movie.id}, this)">Show Trailers</button>
      <div class="trailers"></div>
    `;
    moviesContainer.appendChild(movieEl);
  });
}

// Fetch and show ALL trailers under the movie
async function getTrailers(movieId, btn) {
  const trailersContainer = btn.nextElementSibling; // the <div class="trailers">
  
  // Toggle trailers if already visible
  if (trailersContainer.innerHTML !== "") {
    trailersContainer.innerHTML = "";
    btn.textContent = "Show Trailers";
    return;
  }

  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
  const data = await res.json();

  const trailers = data.results.filter(video => video.type === "Trailer" && video.site === "YouTube");

  if (trailers.length > 0) {
    trailersContainer.innerHTML = trailers.map(trailer => `
      <iframe width="100%" height="200" 
        src="https://www.youtube.com/embed/${trailer.key}" 
        frameborder="0" allowfullscreen>
      </iframe>
    `).join("");
    btn.textContent = "Hide Trailers";
  } else {
    trailersContainer.innerHTML = "<p>No trailers available for this movie.</p>";
  }
}

// Handle Enter key for search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      searchMovies(query);
    }
  }
});

// Add CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  #searchInput {
    width: 300px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  #searchBtn {
    padding: 10px 15px;
    margin-left: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  #searchBtn:hover {
    background-color: #218838;
  }
  #movies-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  .movie {
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    text-align: center;
  }
  .movie img {
    width: 100%;
    height: auto;
  }
`;
document.head.appendChild(style);
// Add basic styles for trailers
const trailersStyle = document.createElement("style");
trailersStyle.textContent = `
    .trailers {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .trailers iframe {
        border-radius: 5px;
    }
    `;  
document.head.appendChild(trailersStyle);
// Add basic styles for movie titles
const titlesStyle = document.createElement("style");
titlesStyle.textContent = `
    .movie h3 {
        padding: 10px;
        font-size: 1.2em;
        color: #333;
    }
    `;
document.head.appendChild(titlesStyle); 
// Add basic styles for movie buttons
const buttonsStyle = document.createElement("style");
buttonsStyle.textContent = `
    .movie button {
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 10px;
    }
    .movie button:hover {
        background-color: #0056b3;
    }
`;

document.head.appendChild(buttonsStyle);
// Add basic styles for movie container 
const containerStyle = document.createElement("style");
containerStyle.textContent = `
    #movies-container {
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    `;

document.head.appendChild(containerStyle);
// Add basic styles for search input and button
const searchStyle = document.createElement("style");
searchStyle.textContent = ` 
    #searchInput, #searchBtn {
        margin-bottom: 20px;
    }
    `;

    // Modal HTML structure
const modal = document.createElement("div");
modal.id = "trailerModal";
modal.style.display = "none";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <div class="trailer-carousel"></div>
    <div class="carousel-controls"></div>
  </div>
`;
document.body.appendChild(modal);

// Modal styles
const modalStyle = document.createElement("style");
modalStyle.textContent = `
  #trailerModal {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  #trailerModal .modal-content {
    background: #fff;
    border-radius: 10px;
    padding: 30px 20px 20px 20px;
    position: relative;
    min-width: 350px;
    max-width: 500px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.2);
    text-align: center;
  }
  #trailerModal .close-btn {
    position: absolute;
    top: 10px; right: 15px;
    font-size: 2em;
    cursor: pointer;
    color: #333;
  }
  #trailerModal .trailer-carousel iframe {
    width: 100%;
    height: 280px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  #trailerModal .carousel-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  #trailerModal .carousel-controls button {
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 32px; height: 32px;
    font-size: 1em;
    cursor: pointer;
    transition: background 0.2s;
  }
  #trailerModal .carousel-controls button.active {
    background: #0056b3;
    font-weight: bold;
  }
`;
document.head.appendChild(modalStyle);

// Blur background when modal is open
function setBlur(active) {
  document.body.style.filter = active ? "blur(4px)" : "";
}

// Show trailers in modal with carousel
async function getTrailers(movieId, btn) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
  const data = await res.json();
  const trailers = data.results.filter(video => video.type === "Trailer" && video.site === "YouTube");

  if (trailers.length === 0) {
    showModalContent("<p>No trailers available for this movie.</p>", []);
    return;
  }

  let current = 0;
  function renderCarousel(idx) {
    const trailer = trailers[idx];
    modal.querySelector(".trailer-carousel").innerHTML = `
      <div>
        <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
        <div style="margin-top:8px;font-weight:bold;">Trailer ${idx + 1} of ${trailers.length}</div>
      </div>
    `;
    // Numbered buttons
    const controls = trailers.map((_, i) =>
      `<button class="${i === idx ? "active" : ""}" data-idx="${i}">${i + 1}</button>`
    ).join("");
    modal.querySelector(".carousel-controls").innerHTML = controls;
    // Add click listeners
    modal.querySelectorAll(".carousel-controls button").forEach(btn =>
      btn.onclick = () => renderCarousel(Number(btn.dataset.idx))
    );
  }

  showModalContent("", trailers);
  renderCarousel(current);
}

// Show modal and blur background
function showModalContent(html, trailers) {
  modal.style.display = "flex";
  setBlur(true);
  if (html) {
    modal.querySelector(".trailer-carousel").innerHTML = html;
    modal.querySelector(".carousel-controls").innerHTML = "";
  }
}

// Close modal
modal.querySelector(".close-btn").onclick = () => {
  modal.style.display = "none";
  setBlur(false);
};

// Prevent blur on modal itself
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    setBlur(false);
  }
};

// Remove old trailers from movie cards (optional, not needed anymore)
document.querySelectorAll(".trailers").forEach(el => el.innerHTML = "");

function setBlur(active) {
    // Blur everything except the modal
    document.body.style.filter = "";
    Array.from(document.body.children).forEach(child => {
        if (child !== modal) {
            child.style.filter = active ? "blur(4px)" : "";
        }
    });
}
