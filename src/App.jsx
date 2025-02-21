// src/App.jsx
import React, { useState } from "react";
import MovieSearch from "./components/MovieSearch";
import BookmarkedMovies from "./components/BookmarkedMovies";
import "./App.css"; // Global/app-wide CSS

function App() {
  const [view, setView] = useState("search");

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <button
          className={view === "search" ? "nav-btn active" : "nav-btn"}
          onClick={() => setView("search")}
        >
          Search
        </button>
        <button
          className={view === "bookmarks" ? "nav-btn active" : "nav-btn"}
          onClick={() => setView("bookmarks")}
        >
          Bookmarks
        </button>
      </nav>

      <main>
        {view === "search" ? <MovieSearch /> : <BookmarkedMovies />}
      </main>
    </div>
  );
}

export default App;
