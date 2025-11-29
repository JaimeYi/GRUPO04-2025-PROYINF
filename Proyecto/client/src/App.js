// src/App.js
import { Routes, Route } from "react-router-dom"; //Importar
import Home from "./pages/home"; // Suponiendo que tienes componentes para cada página
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Simulator from "./pages/simulator";
import CreditApplication from "./pages/creditApplication"
import PaymentButton from "./pages/pay";
import CommitPayment from "./pages/commitPayment";
import Docs from "./pages/docs";
import DataBank from "./pages/dataBank";
import Final from "./pages/final";

// import ProfilePage from './pages/ProfilePage';
// import NotFoundPage from './pages/NotFoundPage';
import "./css/index.css";
import BottomBar from "./components/BottomBar";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
    return (
        <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
            {/* Animated background — fixed layer behind everything */}
            <div
                style={{
                position: "fixed",
                inset: 0,
                zIndex: -1,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                }}
            >
                <AnimatedBackground />
            </div>
        <div>
            {/* Aquí se define qué componente renderizar para cada ruta */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/creditApplication" element={<CreditApplication />}/>
                <Route path="/pay" element={<PaymentButton />}/>
                <Route path="/commit-payment" element={<CommitPayment />}/>
                <Route path="/docSign" element={<Docs />}/>
                <Route path="/bankData" element={<DataBank />}/>
                <Route path="/final" element={<Final />}/>
        {/* <Route path="*" element={<NotFoundPage />} /> Ruta para 404 */}
            </Routes>
            {/* Barra fija inferior visible en todas las páginas */}
            <BottomBar />
        </div>
        </div>
    );
}

export default App;
