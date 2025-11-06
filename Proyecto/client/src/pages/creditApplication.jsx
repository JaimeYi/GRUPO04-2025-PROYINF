import Navbar from "../components/Navbar";
import { useAuth } from "../components/auth";
import { useState, useEffect } from "react";
import {ReactComponent as MiIcono} from "../media/svg/alert-circle-svgrepo-com.svg";
import "../css/creditApplication.css";

function CreditApplication(){
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }
    return (
        <div>
            {!(user === null || user.userType === "noCliente") ? (
                <>
                    <Navbar />
                    
                </>
            ) : (
                <>
                    <div className="alertAndRedirect">
                        <MiIcono className="alert-signal"/>
                        <p className="alertText">Para continuar con la solicitud debes iniciar sesión o registrarte</p>
                        <a href="/login">Iniciar Sesión</a>
                        <a href="/register">Registrarse</a>
                    </div>
                </>
            )}
        </div>
    )
}

export default CreditApplication;