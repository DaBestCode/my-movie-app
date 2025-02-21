import React, { useState, useEffect } from "react";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [nextCursorMark, setNextCursorMark] = useState(null);
  const [numFound, setNumFound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // RapidAPI credentials & endpoint
  const BASE_URL = "https://imdb236.p.rapidapi.com/imdb/search";
  const RAPIDAPI_HOST = "imdb236.p.rapidapi.com";
  const RAPIDAPI_KEY = "a8c0812768msh042a0a325b6cfe4p1fd984jsn729e3996f445"; // <-- replace with your key

  const fetchMovies = async (reset = false) => {
    try {
      setIsLoading(true);

      const url = new URL(BASE_URL);
      url.searchParams.append("type", "movie");
      url.searchParams.append("rows", "25");
      url.searchParams.append("sortOrder", "ASC");
      url.searchParams.append("sortField", "id");

      // Use partial title search
      if (query.trim()) {
        url.searchParams.append("primaryTitleAutocomplete", query);
      }

      // If we have a cursorMark and we're not resetting, append it
      if (!reset && nextCursorMark) {
        url.searchParams.append("cursorMark", nextCursorMark);
      }

      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (reset) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }

      setNumFound(data.numFound || 0);
      setNextCursorMark(data.nextCursorMark || null);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // reset pagination
    setMovies([]);
    setNextCursorMark(null);
    fetchMovies(true);
  };

  // Load more results if nextCursorMark is present
  const handleLoadMore = () => {
    fetchMovies(false);
  };

  /**
   * Bookmark the given movie object to local storage.
   */
  const handleBookmark = (movie) => {
    // 1. Read existing bookmarks
    const existing = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];

    // 2. Check if the movie is already bookmarked
    if (!existing.some((m) => m.id === movie.id)) {
      // 3. Add new movie to the array
      existing.push(movie);
      // 4. Store back in local storage
      localStorage.setItem("bookmarkedMovies", JSON.stringify(existing));
      alert("Movie bookmarked!");
    } else {
      alert("This movie is already bookmarked.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h2>Movie Search</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search partial title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Search
        </button>
      </form>

      {isLoading && <p>Loading...</p>}

      {!isLoading && movies.length === 0 && (
        <p>No results found. Try another search!</p>
      )}

      {numFound > 0 && <p>Total results: {numFound}</p>}

      <div style={{ display: "grid", gap: "1rem" }}>
        {movies.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "0.5rem",
              display: "flex",
              gap: "1rem",
            }}
          >
            <img
              src={
                m.primaryImage
                  ? m.primaryImage
                  : "https://via.placeholder.com/100x150"
              }
              alt={m.primaryTitle}
              style={{ width: "100px", height: "150px", objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0.2rem 0" }}>{m.primaryTitle}</h3>
              {m.releaseDate && <p>Release Date: {m.releaseDate}</p>}
              {m.averageRating && <p>Rating: {m.averageRating}</p>}
              {m.description && (
                <p style={{ fontSize: "0.9rem" }}>{m.description}</p>
              )}

              {/* Bookmark button */}
              <button
                onClick={() => handleBookmark(m)}
                style={{
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                  background: "dodgerblue",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                }}
              >
                Bookmark
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && nextCursorMark && movies.length > 0 && (
        <button
          onClick={handleLoadMore}
          style={{
            padding: "0.5rem 1rem",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default MovieSearch;
