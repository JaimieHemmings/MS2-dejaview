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

    results.forEach((movie) => {
        console.log(movie.title);
    })
}