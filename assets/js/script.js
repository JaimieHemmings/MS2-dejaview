const global = {
    api: {
      apiKey: 'a635907d86ee5951aace63e75f36b55a',
      apiUrl: 'https://api.themoviedb.org/3/',
    },
  };

    // Fetch Data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&languages=en-us`
    );
    const data = await response.json();
    return data;
}

// Display 20 most Popular Movies
displayPopularMovies();

async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    results.slice(0,12).forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        ${
            movie.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
            />`
            : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
            />`
            }
            </a>
            <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
            </div>
            `;
            document.querySelector('#popular-movies').appendChild(div);
    });
}