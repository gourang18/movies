import React, { useEffect, useState } from 'react';

const Favourite = () => {
    
    const [state , setState] = useState({
        genres: [],
        currGenre: 'All Genres',
        currText: '',
        currPage: 0, 
        limit: 5,
        movies: []
    })
    
    let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',
                    18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',
                    9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',
                    37:'Western'};

    useEffect(() => {

        let data = JSON.parse(localStorage.getItem('movies-app') || '[]');
        let temp = [];
        data.forEach((movieObj) => {
            if(!temp.includes(genreids[movieObj.genre_ids[0]])) {
                temp.push(genreids[movieObj.genre_ids[0]]);
            }         
        })
        temp.unshift('All Genres');
        setState({
            ...state, 
            genres: [...temp],
            movies: [...data]
        });
        
    } , []);

    const handleGenreChange = (genre) => {
        setState({
            ...state,
            currGenre: genre,
            currPage: 0
        })
    }

    const searchTextChange = (e) => {
        let text = e.target.value; 
        setState({
            ...state, 
            currText: text
        })
    }

    const DescendingOrder = (property) => {
        let temp = state.movies; 
        temp.sort((objA , objB) => {
            return objB[property] - objA[property];
        });
        setState({...state , movies: [...temp]})
    }

    const AscendingOrder = (property) => {
        let temp = state.movies; 
        temp.sort((objA , objB) => {
            return objA[property] - objB[property];
        });
        setState({...state , movies: [...temp]})
    }

    const handleDelete = id => {
        let newMoviesArr = [];
        let deletedGenre;
        newMoviesArr = state.movies.filter(movieObj => {
            if(movieObj.id === id) {
                deletedGenre = genreids[movieObj.genre_ids[0]];
                return false;
            } else {
                return true;
            }
        });

        let newGenreArr = [];
        let flag = false;
        for(let i = 0 ; i < newMoviesArr.length ; i++) {
            let movieObj = newMoviesArr[i]; 
            if(genreids[movieObj.genre_ids[0]] === deletedGenre) {
                flag = true;
                break;
            }
        }

        if(flag === false)
            newGenreArr = state.genres.filter(genre => genre !== deletedGenre);
        else 
            newGenreArr = state.genres;
        
        let newCurrGenre = state.currGenre;

        if(!newGenreArr.includes(deletedGenre))
            newCurrGenre = 'All Genres';
        
        let newCurrPage = state.currPage;

        if(Math.ceil(newMoviesArr.length / state.limit) !== state.currPage + 1) {
            newCurrPage = (state.currPage !== 0 ? state.currPage - 1 : 0);
        }

        setState({...state, movies: [...newMoviesArr], 
                    genres: [...newGenreArr], 
                    currGenre: newCurrGenre,
                    currPage: newCurrPage
        });

        localStorage.setItem('movies-app' , JSON.stringify(newMoviesArr));
    }

    const changePage = page => {
        setState({...state, currPage: page});
    }

    // filter
    let filterArr = []; 
    if(state.currGenre === 'All Genres') {
        filterArr = state.movies;
    } else {
        filterArr = state.movies.filter((movieObj) => genreids[movieObj.genre_ids[0]] === state.currGenre);
    }

    let pages = Math.ceil(filterArr.length / state.limit);
    let pagesArr = [];
    for(let i = 0 ; i < pages ; i++) {
        pagesArr.push(i);
    }

    let si = (state.currPage) * state.limit;

    let ei = si + state.limit;
    
    filterArr = filterArr.slice(si , ei);

    let textFilterArr = [];

    if(state.currText !== '') {
        textFilterArr = filterArr.filter((movieObj) => {
            let title = movieObj.original_title.toLowerCase(); 
            return title.includes(state.currText);
        });
    } else {
        textFilterArr = [];
    }
    
    let finalArr = []; 
    if(textFilterArr.length !== 0) finalArr = textFilterArr;
    else finalArr = filterArr;

    return (
        <div className='container' style={{margin: 'auto'}}>
            <div className='row'>
                <div className='col-lg-3 col-sm-12'> 
                    <ul className="list-group favourites-genres">
                        {
                            state.genres.map((genre , index) => {
                                return (
                                    state.currGenre === genre ?
                                    <li className='list-group-item' 
                                        key = {index}
                                        style = {{backgroundColor: '#3f51b5' , 
                                        color: 'white' , textAlign: 'center',
                                        fontWeight: 'bold', cursor: 'pointer'}}
                                    > {genre} </li> :
                                    <li className='list-group-item' 
                                        key = {index}
                                        onClick ={() => {handleGenreChange(genre)}}
                                        style = {{backgroundColor: 'white' , 
                                                  color: '#3f51b5' , textAlign: 'center',
                                                  fontWeight: 'bold', cursor: 'pointer'}}
                                    
                                    > {genre} </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className='col-lg-9 favourites-table col-sm-12'> 
                    <div className='row'>
                        <input type="text" className = 'input-group-text col' placeholder='Search' 
                                value = {state.text} onChange={searchTextChange} />

                        <input type="number" className = 'input-group-text col' placeholder='Rows Count'
                            value = {state.limit} min = "1"
                            onChange = {(e) => setState({...state, limit: parseInt(e.target.value) , currPage: 0})}/>
                    </div>
                    
                    {
                        textFilterArr.length === 0 && state.currText !== '' ? <h2> No results found </h2>: 
                        <> 
                            <div className='row'> 
                                <table className="table">
                                    <thead>
                                        <tr style={{textAlign: 'center'}}>
                                            <th scope="col"> Title </th>
                                            <th scope="col"> Genre </th>
                                            <th scope="col"> 
                                                <i className = "fas fa-sort-up" 
                                                    onClick={() => DescendingOrder('popularity')}> </i> 
                                                        Popularity 
                                                <i className = "fas fa-sort-down" 
                                                    onClick={() => AscendingOrder('popularity')}> </i> 
                                            </th>
                                            <th scope="col"> 
                                                <i className = "fas fa-sort-up" 
                                                    onClick={() => DescendingOrder('vote_average')}> </i> 
                                                        Rating 
                                                <i className = "fas fa-sort-down" 
                                                    onClick={() => AscendingOrder('vote_average')}> </i> 
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            finalArr.map((movieObj , index) => {
                                                return (
                                                    <tr key = {index}>
                                                        <th scope="row" className = 'movie-img-table'> 
                                                            <img src = {`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} 
                                                                alt = {movieObj.title} className = 'movie-img-table'/>
                                                                <br/>
                                                                {movieObj.title} 
                                                        </th>
                                                        <td className='table-data'> {genreids[movieObj.genre_ids[0]]} </td>
                                                        <td className='table-data'> {movieObj.popularity} </td>
                                                        <td className='table-data'> {movieObj.vote_average} </td>
                                                        <td className='table-data'> 
                                                            <button type="button" className="btn btn-sm btn-danger" 
                                                                    onClick={() => handleDelete(movieObj.id)}> 
                                                                Delete
                                                            </button> 
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    {
                                        pagesArr.map( page => {
                                            return state.currPage === page ? 
                                                <li className="page-item" 
                                                    style = {{cursor: 'pointer'}} key = {page}>
                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                    <a className="page-link" onClick={() => changePage(page)} 
                                                        style = {{backgroundColor: '#3f51b5', color: 'white'}} 
                                                        key = {page}> {page + 1} </a> </li> 
                                                    :
                                                <li className="page-item" style = {{cursor: 'pointer'}} key = {page}>
                                                    <a className="page-link" onClick={() => changePage(page)}> 
                                                        {page + 1} 
                                                    </a> 
                                                </li>
                                            }
                                        )
                                    }                            
                                </ul>
                            </nav>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Favourite;