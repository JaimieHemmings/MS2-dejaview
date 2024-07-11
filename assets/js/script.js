const global = {
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
  
  // Display 12 most Popular Movies
  async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    results.slice(0, 12).forEach((movie) => {
        document.querySelector('#popular-movies').appendChild(createCard(movie));
    });
  }
  
  async function displayMovieDetails() {
    const movieID = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieID}`);

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

    
    const movieLink = document.getElementById('movie-link');
    if(movie.homepage) {
        movieLink.setAttribute("href", movie.homepage);
    } else {
        movieLink.style.display = "none";
    }    
  
    if(movie.budget) {
        const movieBudget = document.getElementById('movie-budget');
        movieBudget.textContent = `$${addCommasToNumber(movie.budget)}`;
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
  
  // Make a request to search
  async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.term = urlParams.get('search-term');
  
    if (global.search.term !== '' && global.search.term !== null) {
      const { results, total_pages, page, total_results } = await searchAPIData();

      global.search.page = page;
      global.search.totalPages = total_pages;
      global.search.totalResults = total_results;

      displaySearchResults(results);
    }
  }

  // Create HTML data from object data based on template node clone
  function createCard(movie) {
    const tempNode = document.querySelector("div[data-type='template']").cloneNode(true);
    tempNode.removeAttribute('data-type');
    tempNode.querySelector("a").setAttribute('href', `movie-details.html?id=${movie.id}`);
    tempNode.querySelector("img").setAttribute('src', movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/img/no-image.jpg');
    tempNode.querySelector(".card-title").textContent = movie.title;
    tempNode.querySelector(".card-text").textContent = `Release: ${movie.release_date}`;
    tempNode.style.display = "block";
    return tempNode;
  }
  
  // Display Search Results
  function displaySearchResults(results) {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

    results.forEach((movie) => {
      document.querySelector('#search-results').appendChild(createCard(movie));
    });
  
    document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;
    
    displayPagination();
  }

  // Create & Display Pagination
  function displayPagination() {
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

    document.querySelector('#pagination').appendChild(div);

    // disable the previous button if on first page
    if (global.search.page === global.search.totalPages) {
      document.querySelector('#prev').disabled = true;
    }

    // Disable the next button if on last page
    if(global.search.page === global.search.totalPages) {
      document.querySelector('#next').disabled = true;
    }

    // Next page
    document.querySelector('#next').addEventListener('click', async () => {
      global.search.page++;
      const { results, total_pages } = await searchAPIData();
      displaySearchResults(results);
    });
  
    // Prev page
    document.querySelector('#prev').addEventListener('click', async () => {
      global.search.page--;
      const { results, total_pages } = await searchAPIData();
      displaySearchResults(results);
    });
  }

  // Fetch Data from TMDB API
  async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    
    showSpinner();
  
    const response = await fetch(
      `${API_URL}${endpoint}?api_key=${API_KEY}&languages=en-us`
    );

    const data = await response.json();

    hideSpinner();

    return data;
  }
  
  // Make a request to search
  async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    
    showSpinner();
  
    const response = await fetch(
      `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
    );
  
    const data = await response.json();

    hideSpinner();

    return data;
  }
  
  function init() {
    switch (global.currentPage) {
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
        displayMovieDetails();
        break;
      case 'search.html':
      case '/search.html':
        search();
      default:
        break;
    }
  }

  function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
  }
  
  function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
  }
  
  document.addEventListener('DOMContentLoaded', init);