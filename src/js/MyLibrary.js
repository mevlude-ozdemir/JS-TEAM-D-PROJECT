import Hero from './js/hero.js';
document.addEventListener('DOMContentLoaded', () => {
  Hero();
});

const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=3c5d79694d82b9e1fe6883553a34fc2d`;
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const genres = data.genres;
    const genreSelect = document.getElementById('genre-filter');

    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.name;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching genres:', error);
  });

let currentMovies = []; // tüm filmler
let displayedMovies = 0; // şu ana kadar görüntülenen filmler
const moviesPerPage = 9;

export function renderMovies(movies, loadMore = false) {
  const movieContainer = document.getElementById('movie-list');
  const startIndex = loadMore ? displayedMovies : 0;
  const endIndex = Math.min(startIndex + moviesPerPage, movies.length);
  const moviesToShow = movies.slice(startIndex, endIndex);

  const moviesHTML = moviesToShow
    .map(
      movie => `
    <div class="movie-card" data-genre="${movie.genre || 'unknown'}">
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
      <p class="movie-genre">${movie.genre || 'Kategori belirtilmemiş'}</p>
      <button class="remove-btn" data-id="${movie.id}">Kaldır</button>
    </div>
  `
    )
    .join('');

  if (loadMore) {
    movieContainer.innerHTML += moviesHTML;
  } else {
    movieContainer.innerHTML = moviesHTML;
  }

  displayedMovies += moviesPerPage;

  // Kaldırma butonları
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const movieId = button.getAttribute('data-id');
      removeMovie(movieId);
    });
  });

  // Load more butonu görünürlük
  document.getElementById('load-more').style.display =
    endIndex < movies.length ? 'block' : 'none';
}

function filterMoviesByGenre(genreName) {
  const filtered = currentMovies.filter(movie => movie.genre === genreName);
  renderMovies(filtered);
}

function saveMovieToLibrary(movie) {
  let library = JSON.parse(localStorage.getItem('library')) || [];
  library.push(movie);
  localStorage.setItem('library', JSON.stringify(library));
}

document.getElementById('genre-filter').addEventListener('change', e => {
  const selectedGenre = e.target.value;
  filterMoviesByGenre(selectedGenre); // Seçilen türe göre filtrele
});

function loadMoviesFromLibrary() {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  renderMovies(library);
}
