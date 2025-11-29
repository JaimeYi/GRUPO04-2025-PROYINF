import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/home.css";
import { isInvalidRUT } from "../utils/rutVerifier";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        rut: "",
        nombre: "",
        correo: "",
        telefono: "",
        contrasena: "",
        ingresoLiquido: "",
        direccion: ""
    });

    const [liquidacion, setLiquidacion] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

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
        
        if (await isInvalidRUT(formData.rut)){
            setError("El rut ingresado es inválido");
            return;
        }
        
        let salary = 0
        setLoading("True");

        try {
            const dataToSend = new FormData();
            dataToSend.append('rut', formData.rut);
            dataToSend.append('fullName', formData.nombre);
            dataToSend.append('pdfFile', liquidacion);
            const response = await fetch(
                "http://localhost:5000/api/pdfParser", {
                    method: "POST",
                    body: dataToSend
                }
            );

            const result = await response.json();

            if (!response.ok){
                throw new Error(
                    result.error || "Ocurrió un error desconocido."
                )
            }

            console.log("Respuesta del servidor:", result)

            if (result.answer === "-1"){
                alert("Error en validación de datos, asegurese de que los datos ingresados en el formulario coincidan con los datos de la liquidación de sueldo");
                setLoading("False");
                setError("Error en validación de datos ingresados");
                return;
            }

            salary = parseInt(result.answer, 10);

            setFormData((prevState) => ({
                ...prevState,
                ingresoLiquido: parseInt(result.answer)
            }));

        } catch (error) {
            setLoading("False");
            setError(error.message);
            return;
        }

        try {
            const registerData = {
                ...formData,
                ingresoLiquido: salary
            };

            const response = await fetch(
                "http://localhost:5000/api/userManagement/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registerData),
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
            setLoading("False");
        } catch (error) {
            setLoading("False");
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <main className="home-page">
                <div className="hero-card">
                    {(loading === "True") ? (
                        <>
                            <h1>Validando datos...</h1>
                        </>
                    ) : (
                        <>
                            <h2>Registrarse</h2>
                            <p>Crea tu cuenta para acceder a las simulaciones y obtener recomendaciones personalizadas.</p>
                            <p>El nombre completo y el rut deben coincidir con los indicados en la liquidación de sueldo que se adjunte.</p>
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
                                    placeholder="Juan Ignacio Pérez Rodriguez"
                                    required
                                />

                                <label htmlFor="correo">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="someone@example.com"
                                    required
                                />

                                <label htmlFor="telefono">Teléfono</label>
                                <input
                                    type="text"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="+56912345678"
                                    required
                                />

                                <label htmlFor="contrasena">Contraseña</label>
                                <input
                                    type="password"
                                    id="contrasena"
                                    name="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                />

                                <label htmlFor="confirmarContrasena">Repetir contraseña</label>
                                <input
                                    type="password"
                                    id="confirmarContrasena"
                                    name="confirmarContrasena"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                />

                                <label htmlFor="direccion">Dirección</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Av. Vicuña Mackenna 3939"
                                    required
                                />

                                <label htmlFor="liquidacion">Sube tu liquidación de sueldo</label>
                                <input
                                    type="file"
                                    id="pdfFile"
                                    name="liquidacionDeSueldo"
                                    accept="application/pdf"
                                    onChange={(e) => setLiquidacion(e.target.files[0])}
                                    required
                                />

                                {error && <p style={{ color: "red" }}>{error}</p>}

                                <button type="submit" className="hero-btn">Registrarse</button>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Register;
