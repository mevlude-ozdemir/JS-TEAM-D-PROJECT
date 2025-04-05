// API Yapılandırması
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwY2JkYTQ2NzJkMGZkMWRhYjU3NzJjYjJkNzhhYjMyNCIsIm5iZiI6MTc0MzcxNjUyNC44MjksInN1YiI6IjY3ZWYwMGFjYjNlMDM1Mjg2Y2Q5MWZkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j0Mea4sdRcdv4xLRcxt8bZgkEFSrxjdNrJf6CHcoW7k';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// DOM Elementleri
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const moviesGrid = document.getElementById('movies-grid');
const noResults = document.getElementById('no-results');
const pagination = document.getElementById('pagination');
const featuredMovie = document.getElementById('featured-movie');
const yearDropdownBtn = document.getElementById('year-dropdown-btn');
const yearDropdownContent = document.getElementById('year-dropdown-content');
const yearOptions = document.querySelectorAll('.year-option');

// Durum Değişkenleri
let currentPage = 1;
let totalPages = 0;
let lastSearchQuery = '';
let selectedYear = '';

// API Seçenekleri
const options = {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
};

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingMovies();
    loadMovieOfTheDay();
});

// Günün Filmini Yükle
async function loadMovieOfTheDay() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/day`, options);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const movie = data.results[0];
            updateHeroSection(movie);
        }
    } catch (error) {
        console.error('Günün filmi yüklenirken hata oluştu:', error);
    }
}

// Hero Bölümünü Güncelle
function updateHeroSection(movie) {
    const backdropPath = movie.backdrop_path;
    const heroSection = document.querySelector('.hero-section');
    heroSection.style.backgroundImage = `url(${IMAGE_BASE_URL}original${backdropPath})`;
    
    featuredMovie.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <div class="movie-rating">Puan: ${movie.vote_average.toFixed(1)}/10</div>
    `;
}

// Trend Filmleri Yükle
async function loadTrendingMovies(page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?page=${page}`, options);
        const data = await response.json();
        displayMovies(data.results);
        updatePagination(data.page, data.total_pages);
    } catch (error) {
        console.error('Trend filmler yüklenirken hata oluştu:', error);
        showNoResults();
    }
}

// Film Arama - Global kapsamda erişilebilir yapalım
window.searchMovies = async function(query, page = 1, year = '') {
    try {
        let url;
        
        // Eğer isim arıyorsak search API'sini kullan
        if (query) {
            url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
            
            if (year) {
                url += `&primary_release_year=${year}`;
            }
        } 
        // Sadece yıl filtresi varsa discover API'sini kullan
        else if (year) {
            url = `${BASE_URL}/discover/movie?page=${page}&include_adult=false&sort_by=popularity.desc&primary_release_year=${year}`;
        } 
        // Her ikisi de yoksa trend filmleri göster
        else {
            return loadTrendingMovies(page);
        }
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (data.results.length === 0) {
            showNoResults();
        } else {
            displayMovies(data.results);
            updatePagination(data.page, data.total_pages);
        }
        
        // Son arama sorgusunu güncelle
        lastSearchQuery = query;
        selectedYear = year;
        
    } catch (error) {
        console.error('Film arama sırasında hata oluştu:', error);
        showNoResults();
    }
}

// Filmleri Görüntüle
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    noResults.classList.add('hidden');
    
    movies.forEach(movie => {
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}original${movie.poster_path}`
            : 'placeholder-image.jpg';
            
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        // Film türlerini al
        const genres = movie.genre_ids ? getGenreNames(movie.genre_ids) : [];
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
        
        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    ${genres.length ? `<span>${genres.join(', ')}</span>` : ''}
                    ${year ? `<span>${year}</span>` : ''}
                </div>
                <div class="movie-rating">
                    <div class="stars">★★★★★</div>
                    <span>${movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
        `;
        moviesGrid.appendChild(movieCard);
    });
}

// Film türlerini isimlere çevir
const genreMap = {
    28: 'Aksiyon',
    12: 'Macera',
    16: 'Animasyon',
    35: 'Komedi',
    80: 'Suç',
    99: 'Belgesel',
    18: 'Drama',
    10751: 'Aile',
    14: 'Fantastik',
    36: 'Tarih',
    27: 'Korku',
    10402: 'Müzik',
    9648: 'Gizem',
    10749: 'Romantik',
    878: 'Bilim Kurgu',
    10770: 'TV Film',
    53: 'Gerilim',
    10752: 'Savaş',
    37: 'Vahşi Batı'
};

function getGenreNames(genreIds) {
    return genreIds
        .map(id => genreMap[id])
        .filter(name => name)
        .slice(0, 2); // En fazla 2 tür göster
}

// Sonuç Bulunamadı
function showNoResults() {
    moviesGrid.innerHTML = '';
    noResults.classList.remove('hidden');
    pagination.innerHTML = '';
}

// Sayfalamayı Güncelle
function updatePagination(currentPage, totalPages) {
    pagination.innerHTML = '';
    
    // Önceki sayfa butonu
    if (currentPage > 1) {
        addPaginationButton('Önceki', currentPage - 1);
    }
    
    // İlk sayfa
    addPaginationButton(1, 1, currentPage === 1);
    
    // Üç nokta ve orta sayfalar
    if (currentPage > 3) {
        pagination.appendChild(document.createTextNode('...'));
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        addPaginationButton(i, i, currentPage === i);
    }
    
    if (currentPage < totalPages - 2) {
        pagination.appendChild(document.createTextNode('...'));
    }
    
    // Son sayfa
    if (totalPages > 1) {
        addPaginationButton(totalPages, totalPages, currentPage === totalPages);
    }
    
    // Sonraki sayfa butonu
    if (currentPage < totalPages) {
        addPaginationButton('Sonraki', currentPage + 1);
    }
}

// Sayfalama Butonu Ekle
function addPaginationButton(text, page, isActive = false) {
    const button = document.createElement('button');
    button.textContent = text;
    if (isActive) button.classList.add('active');
    
    button.addEventListener('click', () => {
        if (lastSearchQuery) {
            searchMovies(lastSearchQuery, page, selectedYear);
        } else {
            loadTrendingMovies(page);
        }
    });
    
    pagination.appendChild(button);
}

// Olay Dinleyicileri
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    // Hem isim hem de yıl varsa veya sadece biri varsa arama yap
    if (query || selectedYear) {
        lastSearchQuery = query;
        searchMovies(query, 1, selectedYear);
    }
});

searchInput.addEventListener('input', () => {
    if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', !searchInput.value);
    }
});

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        lastSearchQuery = '';
        selectedYear = '';
        yearDropdownBtn.innerHTML = 'Year <span class="dropdown-arrow">▼</span>';
        loadTrendingMovies();
    });
}

// NOT: Aşağıdaki yıl dropdown fonksiyonlarını search-ui.js'e taşıdık, burada gerekli değil
// Yıl dropdown fonksiyonları ve yıl seçimi event listener'ları artık search-ui.js dosyasında 