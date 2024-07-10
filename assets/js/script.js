const global = {
    currentPage: window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1),
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
        document.querySelector('#popular-movies').appendChild(createCard(movie));
    });
  }

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
      document.querySelector('#search-results').appendChild(createCard(movie));
    });
  
    document.querySelector('#search-results-heading').innerHTML = `
            <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
        `;
  }
  
  async function displayMovieDetails() {
    const movieID = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieID}`);
    console.log(movie);

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
        const companiesList = movie.production_companies.map((company) => `<span>${company.name}<span>`).append('companieList');
        movieProductionCompanies.innerHTML = companiesList;
    }
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
      case 'index.html':
      case '/':
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
  
  document.addEventListener('DOMContentLoaded', init);