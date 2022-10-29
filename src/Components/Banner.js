import React from 'react';
import {movies} from "./getMovies";

const Banner = () => {
    let movie = movies.results[0]; 
    return (
        <>
            {
                movie === '' ?
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> :
                <div className = "banner-card">
                    <img src = {`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                        className = "banner-img" alt = {movie.title} />
                    <h1 className = "banner-title"> {movie.original_title} </h1>
                </div>
            }    
        </>
    )
}

export default Banner; 
