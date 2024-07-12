

/** Create global variables .....
* This is against best practices but for the purpose of this project it is acceptable and likely
* unavoidable without overly complicating the code and adding unnecessary complexity
**/
const globalVars = {
  currentPage: window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1),
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'a635907d86ee5951aace63e75f36b55a',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

/**
 * Get Popular Movies from API and slice 12 results to display on the index page
 **/
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  // API always returns 20 results, so we slice to 12
  results.slice(0, 12).forEach((movie) => {
    /**
     *  Populate the index page with popular movies
     * @param {Object} movie - The movie object to populate the index page with
     **/ 
    populateIndex(movie);
  });
}

/**
 * Populate the index page with popular movies
**/
function populateIndex(movie) {
  // Create a card for each movie and append to the index page
  document.querySelector('#popular-movies').appendChild(
    /**
     * Create a card for each movie and append to the index page
     * @param {Object} movie - The movie object to populate the index page with
     **/
    createCard(movie)
  );
}

/** 
 * Get Movie Details from API for Search Results
 **/
async function retrieveMovieDetails() {
  // retrieve movie ID from querystring in URL
  const movieID = window.location.search.split('=')[1];
  // fetch movie details from API
  const movie = await fetchAPIData(`movie/${movieID}`);
  displayMovieDetails(movie);
}

/**
 * Popluates the movie details page with movie data
 * @param {Object} movie - The movie object to populate the movie details page with
 **/ 
async function displayMovieDetails(movie) {
  const movieBackdrop = document.getElementById('movie-backdrop');
  movieBackdrop.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`;
  const moviePoster = document.getElementById('movie-poster');
  moviePoster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/img/no-image.jpg';
  moviePoster.alt = `Poster for ${movie.title} movie`;
  const movieTitle = document.getElementById('movie-title');
  movieTitle.textContent = movie.title;
  const movieRating = document.getElementById('movie-rating');
  movieRating.textContent = movie.vote_average.toFixed(1);
  const movieDate = document.getElementById('movie-release-date');
  movieDate.textContent = movie.release_date;
  const movieOverview = document.getElementById('movie-overview');
  movieOverview.textContent = movie.overview;
  const movieGenres = document.getElementById('genre-list');
  const movieGenresList = movie.genres.map((genre) => `<li>${genre.name}</li>`).join('');
  movieGenres.innerHTML = movieGenresList;

  // Some additional checks to validate and replace missing data before poipulating the page
  const movieLink = document.getElementById('movie-link');
  if(movie.homepage) {
      movieLink.setAttribute("href", movie.homepage);
  } else {
      movieLink.style.display = "none";
  }    
  
  if(movie.budget && movie.budget > 0) {
    const movieBudget = document.getElementById('movie-budget');
    movieBudget.textContent = `$${addCommasToNumber(movie.budget)}`;
  } else {
    const movieBudget = document.getElementById('movie-budget');
    movieBudget.textContent = "Unknown";
  }

  if(movie.revenue) {
    const movieRevenue = document.getElementById('movie-revenue');
    movieRevenue.textContent = `$${addCommasToNumber(movie.revenue)}`;
  }

  if (movie.runtime) {
    const movieRuntime = document.getElementById('movie-runtime');
    movieRuntime.textContent = movie.runtime;
  }

  if (movie.status) {
    const movieStatus = document.getElementById('movie-status');
    movieStatus.textContent = movie.status;
  }

  if (movie.production_companies) {
      const movieProductionCompanies = document.getElementById('movie-companies');
      const companiesList = movie.production_companies.map((company) => `<span>${company.name}</span>`).join('');
      movieProductionCompanies.innerHTML = companiesList;
  }
}

/**
 * Search for movies using the search API
 * @returns {Promise} - The search results
 **/
async function search() {
  // Get search term from query string
  const queryString = window.location.search;
  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Set the search term from the query string
  globalVars.search.term = urlParams.get('search-term');

  // If search term is not empty, call the search API
  if (globalVars.search.term !== '' && globalVars.search.term !== null) {
    // Call the search API
    const { results, total_pages, page, total_results } = await searchAPIData();

    globalVars.search.page = page;
    globalVars.search.totalPages = total_pages;
    globalVars.search.totalResults = total_results;

    /**
     * Display search results
     * @param {Array} results - The array of search results to display
     **/
    displaySearchResults(results);
  }
}

/**
 * Takes a movie object and creates a card element and appropriate content
 * @param {Object} movie - The movie object to create a card for
 * @returns {Node} - The card node
 **/
function createCard(movie) {
  const tempNode = document.querySelector("div[data-type='template']").cloneNode(true);
  tempNode.removeAttribute('data-type');
  tempNode.querySelector("a").setAttribute('href', `movie-details.html?id=${movie.id}`);
  tempNode.querySelector("img").setAttribute('src', movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/img/no-image.jpg');
  tempNode.querySelector("img").setAttribute('alt', `Poster for ${movie.title} movie`);
  tempNode.querySelector(".card-title").textContent = movie.title;
  tempNode.querySelector(".card-text").textContent = movie.release_date ? `Release: ${movie.release_date}` : "No release date found";

  // The template node is hidden by default, so we need to set it to display
  tempNode.style.display = "block";
  return tempNode;
}

// Display Search Results
function displaySearchResults(results) {

  showSpinner();

  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((movie) => {
    document.querySelector('#search-results').appendChild(createCard(movie));
  });

  // Display search results heading
  document.querySelector('#search-results-heading').innerHTML = `
    <h1 class="search-title pt-5">${results.length} of ${globalVars.search.totalResults} Results for ${globalVars.search.term}</h1>
  `;
  
  // Display pagination and hide the spinner
  displayPagination();
  hideSpinner();
}

/**
 * Display Pagination
 **/
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-custom" id="prev">Prev</button>
  <div class="page-counter">Page ${globalVars.search.page} of ${globalVars.search.totalPages}</div>
  <button class="btn btn-custom" id="next">Next</button>`;

  document.querySelector('#pagination').appendChild(div);

  // disable the previous button if on first page
  if (globalVars.search.page === globalVars.search.totalPages) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable the next button if on last page
  if(globalVars.search.page === globalVars.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    globalVars.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    globalVars.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Fetch Data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = globalVars.api.apiKey;
  const API_URL = globalVars.api.apiUrl;
  
  showSpinner();

  /**
   * Fetch data from the API
   * @param {String} endpoint - The API endpoint to fetch data from
   * @returns {Promise} - The data from the API
   */
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&languages=en-us`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

/**
 * Search API based on provided parameters
 * @returns {Promise} - The data from the API
 */
async function searchAPIData() {
  const API_KEY = globalVars.api.apiKey;
  const API_URL = globalVars.api.apiUrl;
  
  showSpinner();

  // Fetch data from the API
  const response = await fetch(
    `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${globalVars.search.term}&page=${globalVars.search.page}`
  );

  // Parse the response
  const data = await response.json();

  hideSpinner();

  return data;
}
/**
 * Initialise the appropriate code block based on the current page 
 **/
function init() {
  switch (globalVars.currentPage) {
    case '/index.html':
    case 'index.html':
    case '/':
    case 'MS2-dejaview/':
    case '/MS2-dejaview/':
    case '':
      displayPopularMovies();
      break;
    case '/movie-details.html':
    case 'movie-details.html':
      retrieveMovieDetails();
      break;
    case 'search.html':
    case '/search.html':
      search();
      break;
    default:
      break;
  }
}

/**
 * Add commas to a number
 * @param {Number} number - The number to add commas to
 * @returns {String} - The number with commas 
 **/
function addCommasToNumber(number) {
  if(!isNaN(number)) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return "NaN";
  }
}

/**
 * Show the spinner
 **/
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

/**
 * Hide the spinner
 **/
function hideSpinner() {
  window.onload = document.querySelector('.spinner').classList.remove('show');
}

// Initialise the code block once the DOM has loaded
document.addEventListener('DOMContentLoaded', init);

// Export the functions to be used in the tests
module.exports = { retrieveMovieDetails, displayMovieDetails, displayPopularMovies, addCommasToNumber, fetchAPIData, searchAPIData, createCard, showSpinner, hideSpinner };