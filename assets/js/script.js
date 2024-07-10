const global = {
    currentPage: window.location.pathname,
    search: {
      term: '',
      type: '',
      totalResults: 0,
    },
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
    const {
      results
    } = await fetchAPIData('movie/popular');
    results.slice(0, 12).forEach((movie) => {
      const tempNode = document.querySelector("div[data-type='template']").cloneNode(true);
      tempNode.removeAttribute('data-type');
      tempNode.querySelector("a").setAttribute('href', `movie-details.html?id=${movie.id}`);
      tempNode.querySelector("img").setAttribute('src', movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/img/no-image.jpg');
      tempNode.querySelector(".card-title").textContent = movie.title;
      tempNode.querySelector(".card-text").textContent = `Release: ${movie.release_date}`;
      tempNode.style.display = "block";
      document.querySelector('#popular-movies').appendChild(tempNode);
    });
  }
  
  // Make a request to search
  async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  
    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');
  
    if (global.search.term) {
      const results = await searchAPIData();
      console.log(results);
      displaySearchResults(results);
    }
  
    document.querySelector('#search-term').value = '';
  }
  
  function displaySearchResults(results) {
  
    results.forEach((movie) => {
      let tempNode = document.querySelector("div[data-type='template']").cloneNode(true);
      tempNode.removeAttribute('data-type');
      tempNode.querySelector("a").setAttribute('href', `movie-details.html?id=${movie.id}`);
      tempNode.querySelector("img").setAttribute('src', movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/img/no-image.jpg');
      tempNode.querySelector(".card-title").textContent = movie.title;
      tempNode.querySelector(".card-text").textContent = `Release: ${movie.release_date}`;
      tempNode.style.display = "block";
      document.querySelector('#search-results').appendChild(tempNode);
    });
  
    document.querySelector('#search-results-heading').innerHTML = `
          <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
      `;
  }
  
  // Make a request to search
  
  async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
  
    const response = await fetch(
      `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
    )
  
    const data = await response.json();
    return data.results;
  }
  
  function init() {
    switch (global.currentPage) {
      case '/index.html':
        displayPopularMovies();
        break;
      case 'movie-details.html':
        break;
      case 'search.html':
      case '/search.html':
        search();
      default:
        break;
    }
  }
  
  document.addEventListener('DOMContentLoaded', init);