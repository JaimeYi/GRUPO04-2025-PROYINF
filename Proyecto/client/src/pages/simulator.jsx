import Navbar from "../components/Navbar";
import { useAuth } from "../components/auth";
import { useState } from "react";
import "../css/cardData.css";

function CardData({ onClose }) {
    const [formData, setFormData] = useState({
        rut: "",
        correo: "",
        telefono: "",
    });

    const { setUser } = useAuth();

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
            aux = 11 - aux;

            switch (aux) {
                case 10:
                    aux = "K";
                    break;
                case 11:
                    aux = "0";
                    break;
                default:
                    aux = aux.toString();
            }

            if (aux !== dv) {
                throw Error("dv no coincide");
            }

            return false;
        } catch (err) {
            console.log(err)
            setError("RUT invalido, ingrese un RUT válido");
            return true;
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
        console.log(formData.rut)

        // --- Verificar Rut ---
        if (await verifyRut(formData.rut)) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/userManagement/registerNoClient",
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

            try {
                const response = await fetch(
                    "http://localhost:5000/api/userManagement/authenticationNoClient",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                        credentials: "include",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error || "Ocurrió un error desconocido."
                    );
                }

                setUser(result.user);
            } catch (error) {
                setError(error.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="background">
            <div className="card">
                <h3>Ingresa tus datos personales</h3>
                <form onSubmit={handleSubmit}>
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

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <button type="submit">Continuar</button>
                </form>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

function Simulator() {
    const { user, isLoading } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    if (isLoading) {
        return null;
    }

    return (
        <div>
            <Navbar />
            {user ? (
                <>Holaaaa, estas listo</>
            ) : (
                <>
                    <h3>Antes de comenzar</h3>
                    <a href="/login">Soy cliente</a>
                    <button onClick={toggleVisibility}>No soy cliente</button>
                    {isVisible && <CardData onClose={toggleVisibility} />}
                </>
            )}
        </div>
    );
}

export default Simulator;
