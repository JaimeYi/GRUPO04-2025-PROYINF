import React from "react";
import "../css/bottombar.css";
import { Link } from "react-router-dom";

function BottomBar() {
    return (
        <footer className="bottombar" role="contentinfo">
            <div className="bottombar-inner">
                <Link to="/about" className="bottombar-btn">Sobre nosotros</Link>
                <Link to="/terms" className="bottombar-btn">Términos y condiciones</Link>
            </div>
        </footer>
    );
}

export default BottomBar;
