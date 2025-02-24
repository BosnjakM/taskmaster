import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Register from "./pages/Register"; // NEU
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing"; // NEU

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} /> {/* Landing als Startseite */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* NEU */}

                {/* Geschützte Routen */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/tasks" element={<Tasks />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
