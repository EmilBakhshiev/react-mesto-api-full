import React from 'react';
import '../index.css';

function Footer() {
    return ( 
        <footer className = "footer content" >
        <p className = "footer__copyright" > {`©${new Date().getFullYear()} Mesto Russia`} </p> 
        </footer>
    )
}
export default Footer;