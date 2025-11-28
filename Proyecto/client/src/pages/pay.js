const PaymentButton = () => {

    const handlePayment = async () => {
        // 1. Pedimos a NUESTRO backend que inicie la transacción
        const orderData = {
            amount: 10000, // $10.000 CLP
            buyOrder: "orden_" + Math.floor(Math.random() * 10000),
            sessionId: "sesion_" + Date.now()
        };

        try {
            const response = await fetch("http://localhost:5000/api/webpay/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            // 2. Recibimos el token y la URL. Ahora debemos redirigir al usuario.
            // Transbank requiere un POST form submit con el token.
            return autoSubmitForm(data.url, data.token);

        } catch (error) {
            console.error("Error iniciando pago", error);
        }
    };

    // Función auxiliar para crear y enviar el formulario "al vuelo"
    const autoSubmitForm = (url, token) => {
        const form = document.createElement("form");
        form.action = url;
        form.method = "POST";
    
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = token;
    
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit(); // Esto redirige al usuario a Transbank
    };

    return (
        <button onClick={handlePayment} className="hero-btn">
            Pagar con Webpay
        </button>
    );
};

export default PaymentButton;