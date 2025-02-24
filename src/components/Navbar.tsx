import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold text-purple-400">
                    <Link to={user ? "/tasks" : "/"}>TaskMaster</Link>
                </div>

                {/* Navigation Links */}
                <ul className={`sm:flex sm:items-center space-x-6 ${isMenuOpen ? "block" : "hidden"}`}>
                    {user ? (
                        <>
                            <li>
                                <Link
                                    to="/tasks"
                                    className="block py-2 px-4 hover:bg-purple-500 hover:text-white rounded transition duration-300"
                                >
                                    Tasks
                                </Link>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaUserCircle size={24} className="text-white" />
                                <button
                                    onClick={logout}
                                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link
                                to="/login"
                                className="block py-2 px-4 hover:bg-purple-500 hover:text-white rounded transition duration-300"
                            >
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
