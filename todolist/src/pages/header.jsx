import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">To-Do List</a>
                <div >
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/list">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/account">Account</a>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
