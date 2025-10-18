import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        rut: "",
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        contrasena: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const verifyRut = (rut) => {
        const dv = rut.slice(-1);
        const body = rut.slice(0, -2);

        try {
            let aux = 2;
            let sum = 0;
            for (let i = body.length - 1; i >= 0; i--) {
                sum += parseInt(body[i]) * aux;

                if (aux === 7) {
                    aux = 2;
                } else {
                    aux++;
                }
            }

            aux = sum % 11;

            switch (aux) {
                case 10:
                    aux = "K";
                    break;
                case 11:
                    aux = "0";
                    break;
                default:
                    aux.toString();
            }

            if (aux !== dv) {
                throw Error("dv no coincide");
            }

            return false
        } catch (err) {
            setError("RUT invalido, ingrese un RUT válido");
            return true
        }
    };

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
        if (await verifyRut(formData.rut)){
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
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <h2>Formulario de Registro</h2>
                <div>
                    <label htmlFor="rut">Rut:</label>
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
                </div>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="apellido">Apellido:</label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="correo">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="telefono">Número de teléfono:</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
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
                <div>
                    <label htmlFor="contrasena">Repetir contraseña:</label>
                    <input
                        type="password"
                        id="confirmarContrasena"
                        name="confirmarContrasena"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}

export default Register;
