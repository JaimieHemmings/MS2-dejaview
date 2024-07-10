const global = {
    currentPage: window.location.pathname,
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

// Display 12 most Popular Movies
async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    results.slice(0,12).forEach((movie) => {

        const tempNode = document.querySelector("div[data-type='template']").cloneNode(true);
        tempNode.removeAttribute('data-type');
        tempNode.querySelector("a").setAttribute('href', `movie-details.html?id=${movie.id}`);
        tempNode.querySelector("img").setAttribute('src', movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../images/no-image.jpg');
        tempNode.querySelector(".card-title").textContent = movie.title;
        tempNode.querySelector(".card-text").textContent = `Release: ${movie.release_date}`;
        tempNode.style.display = "block";
        document.querySelector('#popular-movies').appendChild(tempNode);
    });
}

function init() {
    switch(global.currentPage) {
        case 'index.html':
        case '/':
            displayPopularMovies();
            break;
        case 'movie-details.html':
            break;
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);