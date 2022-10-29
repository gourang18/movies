import axios from 'axios';
import React, { useState , useEffect} from 'react';
import Spinner from './Spinner';

const Movies = () => {

    const [state, setState] = useState({
        hover: '',
        parr: [1],
        currPage: 1,
        movies: [],
        favourites: []
    });
    
    useEffect(() => {
        fetchData();
        //eslint-disable-next-line
    } , [state.currPage]);


    const fetchData = async () => {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=5540e483a20e0b20354dabc2d66a31c9&language=en-US&page=${state.currPage}`);
        let dataArr = response.data.results; 
        let favouritesArr = JSON.parse(localStorage.getItem('movies-app') || '[]');
        let favouritesIDs = favouritesArr.map((movieObj) => movieObj.id);
        setState({...state, movies: [...dataArr] , favourites: [...favouritesIDs]});
    }

    const handlePageClick = (event) => {
        let page = parseInt(event.target.getAttribute("value"));
        if(state.currPage !== page) {
            setState({...state, currPage: page});
        }
    }


    const handleNext = () => {
        let tempArr = [];
        for(let i = 1 ; i <= state.parr.length + 1 ; i++) {
            tempArr.push(i);
        }
        setState({...state, parr: [...tempArr] , currPage: state.currPage + 1});
    }

    const handlePrevious = () => {
        if(state.currPage !== 1) {
            setState({...state, currPage: state.currPage - 1});
        }
    }

    const handleFavourites = (movie) => {
        let oldData = JSON.parse(localStorage.getItem('movies-app') || '[]');
        if(state.favourites.includes(movie.id)) {
            oldData = oldData.filter((m) => m.id !== movie.id);
        } else {
            oldData.push(movie);
        }
        localStorage.setItem('movies-app', JSON.stringify(oldData));
        handleFavouritesState();
    }

    const handleFavouritesState = () => {
        let oldData = JSON.parse(localStorage.getItem('movies-app') || '[]');
        let temp = oldData.map((movie) => movie.id);
        setState({...state, 
            favourites: [...temp]
        });
    }

    let movies = state.movies;

    return (
        <>
            {
            movies.length === 0 ? 
                <Spinner/> : 
                <div>
                    <h3 className='text-center'> <strong> Trending </strong> </h3> 
                    <div className='movies-list'>
                        {
                            movies.map((movieObj , index) => {
                                return (
                                    <div className = "movies-card" key = {index} 
                                        onMouseEnter = {() => {setState({...state, hover: movieObj.id})}} 
                                        onMouseLeave = {() => {setState({...state, hover: ''})}} >
                                        <img src = {`https://image.tmdb.org/t/p/original/${movieObj.backdrop_path}`} 
                                                className = "movies-img" alt = {movieObj.title} />
                                            <h5 className = "movies-title"> {movieObj.original_title} </h5>
                                            <div id = "button-wrapper">
                                                {
                                                    state.hover === movieObj.id &&
                                                    /* eslint-disable jsx-a11y/anchor-is-valid */
                                                    <a className = "btn btn-primary movies-button" 
                                                        onClick={() => {handleFavourites(movieObj)}}> 
                                                        {state.favourites.includes(movieObj.id) ? 'Remove from favourites' : 'Add to favourites'} 
                                                    </a>
                                                } 
                                            </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{display: 'flex' , justifyContent: 'center'}}>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination" style={{cursor: 'pointer'}}>
                                <li className="page-item">
                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                    <a className="page-link" onClick={handlePrevious}>
                                        Previous
                                    </a>
                                </li>
                                {
                                    state.parr.map((value , index) => {
                                        return (
                                            <li className="page-item" key={index}>
                                            {
                                                state.currPage === value ? 
                                                    <a className="page-link" value = {value} onClick={handlePageClick} 
                                                        style = {{backgroundColor: '#3f51b5', color: 'white'}}> 
                                                            {value}
                                                    </a> : 
                                                    
                                                    <a className="page-link" value = {value} onClick={handlePageClick}>
                                                            {value}
                                                    </a>

                                            }
                                            </li>
                                        )
                                    })
                                }
                                <li className="page-item">
                                    <a className="page-link" onClick={handleNext}>
                                        Next
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            }
        </>
    )
}

export default Movies;

