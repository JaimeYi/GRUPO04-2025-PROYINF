import "../css/navbar.css"
import Logo from "../media/svg/banking-online-web-bank-svgrepo-com.svg?react"

// TODO: Una vez implementada la cookie para mantener la sesion iniciada, incluir condicionales para cambiar las opciones disponibles dependiendo si el usuario esta logeado o no

function Navbar() {
    return (
        <div className="navbar">
            <img src={Logo} alt="logo" href="/">
            </img>
            <ul className="listButtons">
                <li>
                    <a href="/login">
                        Iniciar sesión
                    </a>
                </li>
                <li>
                    <a href="/register">
                        Registrarse
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;