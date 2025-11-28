import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CommitPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // 1. Capturamos los dos posibles tokens
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
            
            // Validamos lo que responde el backend (SDK)
            if (result.details?.status === 'AUTHORIZED') {
                setStatus("¡Pago Exitoso! Gracias por tu compra.");
                setIsError(false);
                // Aquí podrías vaciar el carrito, guardar orden en DB, etc.
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
        <div className="hero-card">
            <h2 style={{ color: isError ? 'red' : 'green' }}>
                {status}
            </h2>
            
            {/* Botón para volver a intentar o ir al inicio */}
            {isError && (
                <button 
                    className="hero-btn" 
                    onClick={() => navigate('/pay')} // O donde tengas el pago
                    style={{ marginTop: '20px' }}
                >
                    Volver
                </button>
            )}
        </div>
    );
};

export default CommitPayment;