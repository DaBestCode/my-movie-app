// src/components/MovieCard.jsx
import React from "react";
import "../styles/MovieCard.css";

function MovieCard({ movie }) {
  const { Title, Year, Poster, imdbID } = movie;

  const handleBookmark = () => {
    // Retrieve existing bookmarks
    const existing = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
    const alreadySaved = existing.some((m) => m.imdbID === imdbID);

    if (!alreadySaved) {
      const newBookmark = {
        imdbID,
        Title,
        Year,
        Poster,
        watched: false,
        review: "",
      };
      existing.push(newBookmark);
      localStorage.setItem("bookmarkedMovies", JSON.stringify(existing));
      alert("Movie bookmarked!");
    } else {
      alert("Movie already bookmarked.");
    }
  };

  return (
    <div className="movie-card">
      <img
        src={Poster !== "N/A" ? Poster : "https://via.placeholder.com/160x240"}
        alt={Title}
      />
      <h3>{Title}</h3>
      <p>{Year}</p>
      <button onClick={handleBookmark}>Bookmark</button>
    </div>
  );
}

export default MovieCard;
