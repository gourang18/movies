import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<div style = {{display: 'flex', padding: '0.5', margin: '0.5rem'}}>
			<Link to = "/" style={{textDecoration: 'none'}}> 
              	<h2> Movies App </h2>
            </Link>
            <Link to = "/favourites" style={{textDecoration: 'none'}}>
              	<h2 style={{marginLeft: "1rem"}}> Favourites </h2>
            </Link>
		</div>
	)
}

export default Navbar;
