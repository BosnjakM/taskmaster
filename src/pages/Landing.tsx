import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-purple-600 mb-4">Willkommen bei TaskMaster</h1>
            <p className="text-lg text-gray-700 mb-6">
                Organisiere deine Aufgaben einfach und effizient!
            </p>

            <div className="flex space-x-4">
                <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                    Login
                </Link>
                <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">
                    Registrieren
                </Link>
            </div>
        </div>
    );
};

export default Landing;
