import Navbar from "../components/Navbar";
import { useAuth } from "../components/auth";
import { useState, useEffect } from "react";
import {ReactComponent as MiIcono} from "../media/svg/alert-circle-svgrepo-com.svg";
import "../css/creditApplication.css";

function CreditApplication(){
    const { user, isLoading } = useAuth();
<<<<<<< HEAD
    const [isMessageVisible, setIsMessageVisible] = useState(true);

    useEffect(() => {
        // 4. Configura el temporizador
        const timerId = setTimeout(() => {
            // 5. Después de 2 segundos, actualiza el estado para ocultar el mensaje
            setIsMessageVisible(false);
        }, 2000); // 2000ms = 2 segundos

        // 6. (Opcional pero recomendado) Limpia el temporizador 
        // si el componente se desmonta antes de tiempo.
        return () => {
            clearTimeout(timerId);
        };
        
    }, []);
=======
>>>>>>> 9007e269b6470398005351a20f303dadcdb48cdf

    if (isLoading) {
        return null;
    }
<<<<<<< HEAD

=======
>>>>>>> 9007e269b6470398005351a20f303dadcdb48cdf
    return (
        <div>
            {!(user === null || user.userType === "noCliente") ? (
                <>
                    <Navbar />
<<<<<<< HEAD
                    {isMessageVisible && (
                        <p id="verifyCreditText">
                            Verificando requisitos para el préstamo...
                        </p>
                    )}
=======
                    
>>>>>>> 9007e269b6470398005351a20f303dadcdb48cdf
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