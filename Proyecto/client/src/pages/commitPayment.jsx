import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import GlassPanel from "../components/GlassPanel";

const CommitPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get("token_ws");      // Flujo normal (Aprobado o Rechazado por banco)
    const tbkToken = searchParams.get("TBK_TOKEN");  // Flujo abortado (Usuario hizo click en "Anular")

    const [status, setStatus] = useState("Verificando transacción...");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // CASO A: El usuario anuló la compra voluntariamente
        if (tbkToken && !token) {
            setStatus("Has anulado el pago.");
            setIsError(true);
            return;
        }

        // CASO B: Flujo normal (El banco respondió, falta ver si aprobó o rechazó)
        if (token) {
            confirmarPago(token);
        } else if (!token && !tbkToken) {
            // CASO C: Alguien entró directo a la URL sin parámetros
            setStatus("No hay transacción activa.");
            navigate('/'); 
        }
    }, [token, tbkToken, navigate]);

    const confirmarPago = async (tokenWs) => {
        try {
            const response = await fetch("http://localhost:5000/api/webpay/commit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token_ws: tokenWs })
            });
            const result = await response.json();
            
            if (result.details?.status === 'AUTHORIZED') {
                setStatus("¡Pago Exitoso! Gracias por tu compra.");
                setIsError(false);
            } else {
                setStatus("El pago fue rechazado por el banco.");
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
            setStatus("Error de comunicación confirmando el pago.");
            setIsError(true);
        }
    };

    return (
        <>
        <Navbar />            
        <div style={{ textAlign: "center", height: "48.3rem", paddingTop: "15rem"}}>
            <GlassPanel>
                <h2 style={{ color: isError ? 'red' : 'green' }}>
                {status}
            </h2>
            
            {isError && (
                <button 
                    className="hero-btn" 
                    onClick={() => navigate('/pay')}
                    style={{ marginTop: '20px' }}
                >
                    Volver
                </button>
            )}
            </GlassPanel>
        </div>
        </>
    );
};

export default CommitPayment;