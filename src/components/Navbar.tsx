import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold text-purple-400">
                    <Link to="/">TaskMaster</Link>
                </div>
                <div className="sm:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                    >
                        <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <ul
                    className={`sm:flex sm:items-center space-x-6 ${
                        isMenuOpen ? 'block' : 'hidden'
                    }`}
                >
                    <li>
                        <Link
                            to="/"
                            className="block py-2 px-4 hover:bg-purple-500 hover:text-white rounded transition duration-300"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/tasks"
                            className="block py-2 px-4 hover:bg-purple-500 hover:text-white rounded transition duration-300"
                        >
                            Tasks
                        </Link>
                    </li>
                    <li className="relative group">
            <span className="block py-2 px-4 cursor-pointer hover:bg-purple-500 hover:text-white rounded transition duration-300">
              More
            </span>
                        {/* Dropdown Menu */}
                        <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded shadow-lg hidden group-hover:block">
                            <li>
                                <Link
                                    to="/about"
                                    className="block px-4 py-2 hover:bg-purple-500 hover:text-white rounded transition duration-300"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="block px-4 py-2 hover:bg-purple-500 hover:text-white rounded transition duration-300"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
