import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
             await registerUser(email, password);
            navigate("/login");
        } catch (error) {
            console.error("Registrierungsfehler:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold">Registrieren</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 mt-6">
                <label className="block mb-2">E-Mail:</label>
                <input
                    type="email"
                    className="border p-2 w-full mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className="block mb-2">Passwort:</label>
                <input
                    type="password"
                    className="border p-2 w-full mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
                    Registrieren
                </button>
            </form>
        </div>
    );
};

export default Register;
