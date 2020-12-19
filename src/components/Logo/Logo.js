import React from 'react';
import Tilty from 'react-tilty';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilty className="Tilty br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3">
                    <img style={{paddingTop: '5px'}} src={brain} alt='logo'/></div>
            </Tilty>
        </div>
    );
}

export default Logo;