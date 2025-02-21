// BookmarkedMovies.jsx
import React, { useState, useEffect } from "react";

function BookmarkedMovies() {
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
    setBookmarkedMovies(saved);
  }, []);

  const removeBookmark = (movieId) => {
    const filtered = bookmarkedMovies.filter((m) => m.id !== movieId);
    setBookmarkedMovies(filtered);
    localStorage.setItem("bookmarkedMovies", JSON.stringify(filtered));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Bookmarked Movies</h2>
      {bookmarkedMovies.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarkedMovies.map((movie) => (
          <div key={movie.id} style={{ marginBottom: "1rem" }}>
            <h4>{movie.primaryTitle}</h4>
            {movie.primaryImage && (
              <img
                src={movie.primaryImage}
                alt={movie.primaryTitle}
                style={{ width: "100px" }}
              />
            )}
            <p>Release Date: {movie.releaseDate}</p>
            {/* Remove from bookmarks */}
            <button onClick={() => removeBookmark(movie.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

export default BookmarkedMovies;
