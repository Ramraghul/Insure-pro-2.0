import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/table">
                <button className='submit-button'>Table</button>
            </Link>
            <Link to="/">
                <button className='clear-button'>Report</button>
            </Link>
        </div>
    );
}

export default NavBar;
