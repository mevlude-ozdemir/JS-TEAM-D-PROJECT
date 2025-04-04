 // Sample API key - replace with your actual API key
 const API_KEY = 'YOUR_API_KEY';
 const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original/';

 // Default movie data (from your example)
 const defaultMovie = {
     id: 493529,
     title: "Dungeons & Dragons: Honor Among Thieves",
     backdrop_path: "/A7JQ7MIV5fkIxceI5hizRIe6DRJ.jpg",
     vote_average: 7.6,
     overview: "A charming thief and a band of unlikely adventurers undertake an epic heist to retrieve a lost relic, but things go dangerously awry when they run afoul of...",
 };

 // Function to fetch trending movies
 async function fetchTrendingMovies() {
     try {
         const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
         const data = await response.json();

         if (data.results && data.results.length > 0) {
             // Select a random movie from trending
             const randomIndex = Math.floor(Math.random() * data.results.length);
             return data.results[randomIndex];
         } else {
             return defaultMovie;
         }
     } catch (error) {
         console.error('Error fetching trending movies:', error);
         return defaultMovie;
     }
 }

 // Function to generate rating stars
 function generateStars(rating) {
     const fullStars = Math.floor(rating / 2);
     const halfStar = rating % 2 >= 1 ? 1 : 0;
     const emptyStars = 5 - fullStars - halfStar;

     let starsHTML = '';

     for (let i = 0; i < fullStars; i++) {
         starsHTML += '<span class="star">★</span>';
     }

     if (halfStar) {
         starsHTML += '<span class="star">★</span>';
     }

     for (let i = 0; i < emptyStars; i++) {
         starsHTML += '<span class="star" style="opacity: 0.5;">★</span>';
     }

     return starsHTML;
 }

 // Function to load hero content
 async function loadHeroContent() {
     const heroElement = document.getElementById('hero');
     const movie = await fetchTrendingMovies();

     const heroHTML = `
         <img src="${BASE_IMAGE_URL + movie.backdrop_path}" alt="${movie.title}" class="hero-bg">
         <div class="hero-content">
             <h1 class="hero-title">${movie.title}</h1>
             <div class="rating">
                 ${generateStars(movie.vote_average)}
             </div>
             <p class="hero-description">${movie.overview}</p>
             <div class="hero-buttons">
                 <a href="#" class="btn btn-primary" onclick="openTrailerModal(${movie.id})">Watch trailer</a>
                 <a href="#" class="btn btn-secondary" onclick="openDetailsModal(${movie.id})">More details</a>
             </div>
         </div>
     `;

     heroElement.innerHTML = heroHTML;
 }

 // Function to fetch movie trailer
 async function fetchMovieTrailer(movieId) {
     try {
         const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
         const data = await response.json();

         // Find trailer or teaser
         const trailer = data.results.find(video => video.type === 'Trailer' || video.type === 'Teaser');

         return trailer ? trailer.key : null;
     } catch (error) {
         console.error('Error fetching movie trailer:', error);
         return null;
     }
 }

 // Function to fetch movie details
 async function fetchMovieDetails(movieId) {
     try {
         const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
         return await response.json();
     } catch (error) {
         console.error('Error fetching movie details:', error);
         return null;
     }
 }

 // Function to open trailer modal
 async function openTrailerModal(movieId) {
     const trailerKey = await fetchMovieTrailer(movieId);
     const trailerContainer = document.getElementById('trailerVideoContainer');

     if (trailerKey) {
         trailerContainer.innerHTML = `
             <iframe src="https://www.youtube.com/embed/${trailerKey}" 
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowfullscreen></iframe>
         `;
     } else {
         trailerContainer.innerHTML = `
             <div style="text-align: center; padding: 50px;">
                 <h3>We're sorry!</h3>
                 <p>No trailer is available for this movie.</p>
             </div>
         `;
     }

     document.getElementById('trailerModal').style.display = 'flex';
 }

 // Function to close trailer modal
 function closeTrailerModal() {
     document.getElementById('trailerModal').style.display = 'none';
     document.getElementById('trailerVideoContainer').innerHTML = '';
 }

 // Function to open details modal
 async function openDetailsModal(movieId) {
     const movieDetails = await fetchMovieDetails(movieId);
     const detailsContainer = document.getElementById('movieDetailsContainer');

     if (movieDetails) {
         const genres = movieDetails.genres.map(genre => genre.name).join(', ');
         const releaseDate = new Date(movieDetails.release_date).toLocaleDateString();

         detailsContainer.innerHTML = `
             <h2>${movieDetails.title}</h2>
             <p><strong>Rating:</strong> ${movieDetails.vote_average}/10</p>
             <p><strong>Release Date:</strong> ${releaseDate}</p>
             <p><strong>Runtime:</strong> ${movieDetails.runtime} minutes</p>
             <p><strong>Genres:</strong> ${genres}</p>
             <p><strong>Overview:</strong> ${movieDetails.overview}</p>
         `;
     } else {
         detailsContainer.innerHTML = `
             <div style="text-align: center; padding: 50px;">
                 <h3>We're sorry!</h3>
                 <p>Could not load details for this movie.</p>
             </div>
         `;
     }

     document.getElementById('detailsModal').style.display = 'flex';
 }

 // Function to close details modal
 function closeDetailsModal() {
     document.getElementById('detailsModal').style.display = 'none';
 }

 // Close modals when clicking outside content
 window.onclick = function (event) {
     const trailerModal = document.getElementById('trailerModal');
     const detailsModal = document.getElementById('detailsModal');

     if (event.target === trailerModal) {
         closeTrailerModal();
     }

     if (event.target === detailsModal) {
         closeDetailsModal();
     }
 };

 // Load hero content when page loads
 document.addEventListener('DOMContentLoaded', loadHeroContent);