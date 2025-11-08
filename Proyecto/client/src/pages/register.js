import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/home.css";
import { rutVerifier } from "../utils/rutVerifier";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        rut: "",
        nombre: "",
        correo: "",
        telefono: "",
        contrasena: "",
        ocupacion: "",
        ingresoLiquido: "",
        direccion: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (formData.contrasena !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // --- Verificar Rut ---
        if (await rutVerifier(formData.rut)){
            setError("El rut ingresado es inválido");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/userManagement/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Ocurrió un error desconocido."
                );
            }

            console.log("Respuesta del servidor:", result);
            alert(`¡Registro exitoso ${formData.nombre}! Serás redirigido.`);
            navigate("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />

            <main className="home-page">
                <div className="hero-card">
                    <h2>Registrarse</h2>
                    <p>Crea tu cuenta para acceder a las simulaciones y obtener recomendaciones personalizadas.</p>
                    <form onSubmit={handleSubmit} className="card-form">
                        <label htmlFor="rut">Rut</label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={formData.rut}
                            onChange={handleChange}
                            maxLength={10}
                            placeholder="12345678-K"
                            required
                        />

                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="correo">Correo electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="confirmarContrasena">Repetir contraseña</label>
                        <input
                            type="password"
                            id="confirmarContrasena"
                            name="confirmarContrasena"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <label htmlFor="ocupacion">Ocupación</label>
                        <input
                            type="text"
                            id="ocupacion"
                            name="ocupacion"
                            value={formData.ocupacion}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="ingresoLiquido">Ingreso líquido</label>
                        <input
                            type="number"
                            id="ingresoLiquido"
                            name="ingresoLiquido"
                            value={formData.ingresoLiquido}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                        />

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <button type="submit" className="hero-btn">Registrarse</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Register;
