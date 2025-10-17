import { useState } from "react";
import {useNavigate} from "react-router-dom" 
import Navbar from "../components/Navbar";

// TODO: implementar Cookie que almacene la informacion del usuario y mantenga la sesion iniciada

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        rut: "",
        contrasena: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/userManagement/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Ocurrió un error desconocido.');
            }

            console.log('Respuesta del servidor:', result);
            alert(`Inicio de sesión exitoso! Serás redirigido.`);
            navigate('/')

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <h2>Formulario de Inicio de Sesión</h2>
                <div>
                    <label htmlFor="rut">Rut:</label>
                    <input
                        type="text"
                        id="rut"
                        name="rut"
                        value={formData.rut}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contrasena">Contraseña:</label>
                    <input
                        type="password"
                        id="contrasena"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login;
