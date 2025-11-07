import Navbar from "../components/Navbar";
import "../css/home.css";
import { Link } from "react-router-dom";

function Home(){
    return (
        <div>
            <Navbar />

            <main className="home-page">
                <div className="hero-card">
                    <h2>Bienvenido a la simulación de crédito</h2>
                    <p>Calcula en segundos tu crédito de consumo, revisa tu historial y obtén una respuesta inmediata.</p>
                    <Link to="/simulator" className="hero-btn">Realizar simulación</Link>
                </div>
            </main>
        </div>
    );
}

export default Home;