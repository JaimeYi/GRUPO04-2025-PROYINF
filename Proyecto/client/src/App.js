// src/App.js
import { Routes, Route } from "react-router-dom"; // 👈 Importar
import Home from "./pages/home"; // Suponiendo que tienes componentes para cada página
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
// import ProfilePage from './pages/ProfilePage';
// import NotFoundPage from './pages/NotFoundPage';
import "./css/index.css";

function App() {
    return (
        <div>
            {/* Aquí se define qué componente renderizar para cada ruta */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
        {/* <Route path="*" element={<NotFoundPage />} /> Ruta para 404 */} */}
            </Routes>
        </div>
    );
}

export default App;
