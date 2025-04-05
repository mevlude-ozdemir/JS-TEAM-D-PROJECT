const modalContainer = document.getElementById("modalContainer");
const apiKey = "f020ded2029e9839f3faae2bf7d9a880";
const movieId = 550;
let inLibrary = false;

async function fetchModalHTML() {
  const response = await fetch("./partials/modal.html");
  const html = await response.text();
  modalContainer.innerHTML = html;
  setupModalLogic(); // HTML yüklendikten sonra olaylar bağlanmalı
}

async function fetchMovieDetails(id) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=tr-TR`);
  const data = await res.json();
  return data;
}

async function openModal(movieId) {
  const data = await fetchMovieDetails(movieId);

  document.getElementById("moviePoster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  document.getElementById("movieTitle").textContent = data.title;
  document.getElementById("movieRating").textContent = data.vote_average;
  document.getElementById("moviePopularity").textContent = data.popularity.toFixed(1);
  document.getElementById("movieOverview").textContent = data.overview;
  document.getElementById("toggleLibrary").textContent = inLibrary ? "− Remove from My Library" : "+ Add to My Library";

  document.getElementById("movieModal").style.display = "block";
}

function setupModalLogic() {
  const modal = document.getElementById("movieModal");
  const closeBtn = document.querySelector(".close");
  const toggleBtn = document.getElementById("toggleLibrary");

  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  toggleBtn.onclick = () => {
    inLibrary = !inLibrary;
    toggleBtn.textContent = inLibrary ? "− Remove from My Library" : "+ Add to My Library";
  };

  document.getElementById("openMovieBtn").onclick = () => openModal(movieId);
}

// Sayfa yüklenince modal component'ini yükle
fetchModalHTML();
