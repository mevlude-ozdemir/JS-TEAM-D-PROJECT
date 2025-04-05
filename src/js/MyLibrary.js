

// Global değişkenler
let currentMovies = []; // tüm filmler
let displayedMovies = 0; // şu ana kadar görüntülenen filmler
const moviesPerPage = 9;
const genreMap = {}; // Genre ID-Name eşleşmelerini saklayacak bir obje

document.addEventListener('DOMContentLoaded', () => {
  loadMoviesFromLibrary();

  // Genre filtresi için event listener'ları ayarla
  const genreSelect = document.getElementById('genre-filter');
  if (genreSelect) {
    // İlk tıklamada API'den türleri çek
    let genresFetched = false;

    genreSelect.addEventListener('click', () => {
      // Eğer türler henüz çekilmediyse
      if (!genresFetched) {
        fetchGenres();
        genresFetched = true;
      }
    });

    // Change event listener'ı ekle
    genreSelect.addEventListener('change', e => {
      const selectedGenre = e.target.value;
      filterMoviesByGenre(selectedGenre);
    });
  }

  // Load more butonu için event listener
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      renderMovies(currentMovies, true);
    });
  }
});

// API'den türleri çek
function fetchGenres() {
  const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=3c5d79694d82b9e1fe6883553a34fc2d`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const genres = data.genres;
      const genreSelect = document.getElementById('genre-filter');

      // Tüm seçenekleri temizle
      genreSelect.innerHTML = '';

      // "Tüm Filmler" seçeneğini ekle
      const allOption = document.createElement('option');
      allOption.value = 'all';
      allOption.textContent = 'Genre';
      genreSelect.appendChild(allOption);

      // API'den gelen türleri ekle
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);

        // Genre ID-Name eşleşmesini sakla
        genreMap[genre.id] = genre.name;
      });

      // Genre map'i localStorage'a kaydet
      localStorage.setItem('genreMap', JSON.stringify(genreMap));

      // Kütüphanedeki filmlere genre isimlerini ekleyerek yeniden yükle
      updateMovieGenres();
    })
    .catch(error => {
      console.error('Error fetching genres:', error);
    });
}

// Kütüphanedeki filmlere genre isimlerini ekle
function updateMovieGenres() {
  let library = JSON.parse(localStorage.getItem('library')) || [];

  // Genre ID'leri isimlerle eşleştir
  library = library.map(movie => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      // TMDB API'dan gelen filmlerde genre_ids var
      const genreNames = movie.genre_ids
        .map(id => genreMap[id] || 'Bilinmeyen')
        .join(', ');
      return { ...movie, genre: genreNames };
    } else if (movie.genre && !isNaN(movie.genre)) {
      // Eğer genre bir ID ise, isimle değiştir
      return { ...movie, genre: genreMap[movie.genre] || 'Bilinmeyen' };
    }
    return movie;
  });

  // Güncellenmiş kütüphaneyi kaydet
  localStorage.setItem('library', JSON.stringify(library));

  // Güncel verileri göster
  currentMovies = library;
  displayedMovies = 0;
  renderMovies(library, false);
}

// Filmleri render et
export function renderMovies(movies, loadMore = false) {
  const movieContainer = document.getElementById('movie-list');

  // Eğer film yoksa mesaj göster
  if (movies.length === 0) {
    movieContainer.innerHTML = `
      <div class="no-movies-message">
      <p>OOPS... We are very sorry! You don’t have any movies at your library.</p>
      <button id="go-to-catalog" class="search-btn">Search movie</button>
    </div>
  `;
    // Butona tıklanınca catalog sayfasına yönlendir
    const searchBtn = document.getElementById('go-to-catalog');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        window.location.href = 'index.html'; // veya sayfanın tam yolu
      });
    }                       
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
    return;
  }

  const startIndex = loadMore ? displayedMovies : 0;
  const endIndex = Math.min(startIndex + moviesPerPage, movies.length);
  const moviesToShow = movies.slice(startIndex, endIndex);

  const moviesHTML = moviesToShow
    .map(
      movie => `
    <div class="movie-card" data-genre="${movie.genre || 'unknown'}">
      <img src="${
        movie.poster || `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }" alt="${movie.title}" class="movie-poster">
      class="movie-poster">
      onerrror="this.src='./img/herodesktop.svg';">
      <h3 class="movie-title">${movie.title}</h3>
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

  displayedMovies = endIndex;

  // Kaldırma butonları
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const movieId = button.getAttribute('data-id');
      removeMovie(movieId);
    });
  });

  // Load more butonu görünürlük
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = endIndex < movies.length ? 'block' : 'none';
 
  console.log('endIndex:', endIndex);
  console.log('movies.length:', movies.length);
 }
}

// Filmleri türe göre filtrele
function filterMoviesByGenre(genreId) {
  if (genreId === 'all') {
    displayedMovies = 0;
    renderMovies(currentMovies, false);
    return;
  }

  // ID veya isim ile filtreleme (esneklik için)
  const filtered = currentMovies.filter(movie => {
    // Genre bir dizi veya string olabilir
    if (typeof movie.genre === 'string') {
      // Filmde birden fazla tür olabileceğinden içerikte arama yap
      return movie.genre.includes(genreMap[genreId]) || movie.genre === genreId;
    } else if (Array.isArray(movie.genre_ids)) {
      return movie.genre_ids.includes(Number(genreId));
    }
    return false;
  });

  displayedMovies = 0;
  renderMovies(filtered, false);
}

// Filme kütüphaneye kaydet
function saveMovieToLibrary(movie) {
  let library = JSON.parse(localStorage.getItem('library')) || [];

  // Film zaten ekli mi kontrol et
  if (!library.some(m => m.id === movie.id)) {
    library.push(movie);
    localStorage.setItem('library', JSON.stringify(library));
  }
}

// Filmi kütüphaneden kaldır
function removeMovie(movieId) {
  let library = JSON.parse(localStorage.getItem('library')) || [];
  library = library.filter(movie => movie.id != movieId);
  localStorage.setItem('library', JSON.stringify(library));

  // Güncel listeyi göster
  currentMovies = library;
  displayedMovies = 0;
  renderMovies(library, false);
}

// Kütüphaneden filmleri yükle
function loadMoviesFromLibrary() {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  currentMovies = library;
  displayedMovies = 0;
  renderMovies(library, false);
}
document.addEventListener('DOMContentLoaded', () => {
  const moviePoster = document.getElementById('movie-poster');
  const screenWidth = window.innerWidth; // Ekran genişliği

  let posterUrl = '';

  // Ekran genişliğine göre resim seçimi
  if (screenWidth <= 768) {
    // Tablet veya mobil cihaz için küçük resim
    posterUrl = 'img/movie-poster-tablet.jpg';
  } else {
    // Masaüstü cihaz için büyük resim
    posterUrl = 'img/movie-poster-desktop.jpg';
  }

  moviePoster.src = posterUrl;

  // Eğer API ile veri alıyorsanız, buraya API istekleri ekleyebilirsiniz
  fetch('https://api.themoviedb.org/3/movie/550?api_key=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => {
      const posterApiUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
      moviePoster.src = posterApiUrl;
    })
    .catch(error => {
      console.error('Error fetching movie data:', error);
      moviePoster.src = './img/backup-image.jpg'; // Yedek resim
    });
});
