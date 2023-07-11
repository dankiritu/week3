document.addEventListener('DOMContentLoaded', function() {
  const movieDetailsContainer = document.querySelector('.movie-details');
  const moviePoster = movieDetailsContainer.querySelector('.poster');
  const movieTitle = movieDetailsContainer.querySelector('.title');
  const movieRuntime = movieDetailsContainer.querySelector('.runtime');
  const movieShowtime = movieDetailsContainer.querySelector('.showtime');
  const movieAvailableTickets = movieDetailsContainer.querySelector('.available-tickets');
  const movieDescription = movieDetailsContainer.querySelector('.description');
  const buyTicketButton = movieDetailsContainer.querySelector('.buy-ticket');
  const movieMenu = document.getElementById('films');

  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      populateMovieMenu(data.films);
      const initialMovie = data.films[0];
      populateMovieDetails(initialMovie);
    })
    .catch(error => {
      console.log('Error loading JSON file:', error);
    });

  buyTicketButton.addEventListener('click', function() {
    const movieId = movieDetailsContainer.dataset.movieId;
    const availableTickets = parseInt(movieAvailableTickets.textContent);

    if (availableTickets > 0) {
      const updatedTickets = availableTickets - 1;
      movieAvailableTickets.textContent = updatedTickets;

      updateTicketsSold(movieId, updatedTickets)
        .then(() => {
          console.log('Tickets sold updated on the server');
        })
        .catch(error => {
          console.error('Error updating tickets sold:', error);
        });
    }
  });

  movieMenu.addEventListener('click', function(event) {
    const selectedMovieId = event.target.dataset.movieId;

    if (selectedMovieId) {
      fetchMovieDetails(selectedMovieId)
        .then(movie => {
          populateMovieDetails(movie);
        })
        .catch(error => {
          console.error('Error fetching movie details:', error);
        });
    }
  });

  function fetchMovieDetails(movieId) {
    return new Promise((resolve, reject) => {
      const movie = getMovieById(movieId);
      if (movie) {
        resolve(movie);
      } else {
        reject(new Error('Movie not found'));
      }
    });
  }

  function fetchAllMovies() {
    return new Promise((resolve, reject) => {
      const movies = getAllMovies();
      if (movies) {
        resolve(movies);
      } else {
        reject(new Error('Error fetching movies'));
      }
    });
  }

  function updateTicketsSold(movieId, ticketsSold) {
    return new Promise((resolve, reject) => {
      const movie = getMovieById(movieId);
      if (movie) {
        movie.tickets_sold = ticketsSold;
        resolve();
      } else {
        reject(new Error('Movie not found'));
      }
    });
  }

  function populateMovieDetails(movie) {
    moviePoster.style.backgroundImage = `url(${movie.poster})`;
    movieTitle.textContent = movie.title;
    movieRuntime.textContent = `Runtime: ${movie.runtime} minutes`;
    movieShowtime.textContent = `Showtime: ${movie.showtime}`;
    movieAvailableTickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
    movieDescription.textContent = movie.description;
    movieDetailsContainer.dataset.movieId = movie.id;

    if (movie.capacity - movie.tickets_sold === 0) {
      buyTicketButton.textContent = 'Sold Out';
      buyTicketButton.disabled = true;
    } else {
      buyTicketButton.textContent = 'Buy Ticket';
      buyTicketButton.disabled = false;
    }
  }

  function populateMovieMenu(movies) {
    movies.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.classList.add('film', 'item');
      movieItem.textContent = movie.title;
      movieItem.dataset.movieId = movie.id;

      if (movie.capacity - movie.tickets_sold === 0) {
        movieItem.classList.add('sold-out');
      }

      movieMenu.appendChild(movieItem);
    });
  }

  // Helper functions to get movie data
  function getMovieById(movieId) {
    const movies = getAllMovies();
    return movies.find(movie => movie.id === movieId);
  }

  function getAllMovies() {
    return [
      // Replace this array with your movie data from the JSON file
      // Use the same structure as the example JSON
    ];
  }
});
