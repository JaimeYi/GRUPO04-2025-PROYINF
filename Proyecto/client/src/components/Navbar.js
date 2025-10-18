import "../css/navbar.css";
import Logo from "../media/svg/banking-online-web-bank-svgrepo-com.svg";
import { useAuth } from "./auth";
import {Link} from "react-router-dom"

function Navbar() {
    const { user, logout, isLoading } = useAuth(); // Usar esta linea en cada vista que se requiera verificar si el usuario esta logeado o no

    const logoLink = (
        <Link to="/" className="logo">
            <img src={Logo} alt="Logo" className="logo" />
        </Link>
    );

    if (isLoading) {
        return null;
    }

    return (
        <nav className="navbar">
            {logoLink}
            <ul className="listButtons">
                {user ? ( // De esta manera se utiliza el condicional para mostrar cierta opcion dependiendo si el usuario esta logeado o no
                    <>
                        <li>
                            <a href="/profile">Mi perfil</a>
                        </li>
                        <li>
                            <button onClick={logout}>Cerrar Sesión</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <a href="/login">Iniciar sesión</a>
                        </li>
                        <li>
                            <a href="/register">Registrarse</a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
