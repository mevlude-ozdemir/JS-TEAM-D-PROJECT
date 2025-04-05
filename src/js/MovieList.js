export function getMoviesFromStorage() {
    const movies = localStorage.getItem('movies');
    return movies ? JSON.parse(movies) : [];
}
export function renderMovieList(container, movies, onRemove) {
  // Filmleri render etme mantığı...
}

function initialize() {
    const movieContainer = document.getElementById('movie-list');
    const movies = getMoviesFromStorage();

    if (movies.length === 0) {
        movieContainer.innerHTML = '<div class="no-movies-message">OOPS...We are very sorry!You don’t have any movies at your library. </div>';

        return;
    }

    renderMovieList(movieContainer, movies);
}

function removeMovie(movieid) {

}
document.addEventListener('DOMContentLoaded', initialize);