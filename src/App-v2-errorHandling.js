import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "4d3e237d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  // fetch(`https://www.omdbapi.com/?s=Interstellar&apikey=${KEY}`).then(response=>response.json()).then(data=>console.log(data))

  // Render logic is NOT allowed to produce any side effects(API calls,timers,state updates..)
  // ❌fetch(`https://www.omdbapi.com/?s=Interstellar&apikey=${KEY}`).then(response=>response.json()).then(data=>setMovies(data.Search))
  // ❌setWatched()

  //in small react application, this is a great way to fetch data on mount
  // useEffect(function(){
  //   fetch(`https://www.omdbapi.com/?s=Interstellar&apikey=${KEY}`).then(response=>response.json()).then(data=>setMovies(data.Search))
  // },[])

  //Effect callbacks are synchronous to prevent race conditions. Put the async function inside a function
  const query = "hero";
  const [isLoading, setIsLoading] = useState(false);
  //1.set error state, initial state set to empty string
  const [error, setError] = useState("");
  useEffect(function () {
    async function fetchMovies() {
      //2.wrap the fetching data logic into try catch block
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`
        );
        //3.check fetching state by checking res.ok
        console.log("res", res);
        //4.if res.ok is false, manually throw an error(instead of showing the automatic error).
        //  this error can then be catched in the catch block.

        //❕Please note: Why the default error message appears instead of our customized error message when the network breaks during the data fetching phase:
        // If the internet connection breaks during the fetching phase (when the await function is waiting for any response, whether success or failure), the if(!res.ok) condition will never be executed. This is because, when there is a network error during the awaiting phase, the code immediately exits the await function and goes to the catch block, triggering the default error message. To display the customized error message, you should wrap the await fetching call with a new try-catch block.
        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies.");
        }
        //5.situation-2 when the data is fetched successfully but the result return according to the the 'query' is empty, some errors may happen. eg. undefined.length will result in error/ data.Search will become undefine.Search
        const data = await res.json();
        console.log("data", data);
        // warning - 'Response' has to be capitalized!
        if (data.Response === "False") throw new Error("Movie not been found!");

        setMovies(data.Search);
        setIsLoading(false);
      } catch (err) {
        // console.log('err',err)
        console.error("err", err.message);
        setError(err.message);
        // below is how to show automatic error
        // console.log(err)
        // setError(`💥💥💥${err}`)
      } finally {
        setIsLoading(false);
      }
      // setState is ASYNCHRONOUS, the state value would not be immediately accessible
      // The reason why the console.log prints two same results is because the 'strict' mode
      // console.log('stale state:',movies)
      // console.log(data.Search)
    }
    fetchMovies();
  }, []);

  return (
    <>
      <NavBar>
        <Search />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        {/* component composition with children */}
        <Box>
          {error ? (
            <ErrorMessage message={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MovieList movies={movies} />
          )}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
        {/* Passing elements as props(Alternartive to children) */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      {/* Found <strong>{movies.length}</strong> results */}
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function Box({ element }) {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
//         {isOpen ? "–" : "+"}
//       </button>
//       {isOpen && element}
//     </div>
//   );
// }

function MovieList({ movies }) {
  // const [movies, setMovies] = useState(tempMovieData);
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>;
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMoivie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMoivie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
