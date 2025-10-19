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
            console.log(err);
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
        console.log(formData.rut);

        // --- Verificar Rut ---
        if (await verifyRut(formData.rut)) {
            return;
        }

        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/userManagement/guest-session",
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
            onClose();
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
    const [error, setError] = useState("");
    const [historySimulation, setHistorySimulation] = useState([]);
    const [creditData, setCreditData] = useState({
        cuotaMensual: "",
        ctc: "",
        tasaInteres: "",
        cae: "",
        costoSeguros: "",
    });

    const [requestSimulation, setRequestSimulation] = useState({
        userType: '',
        userID: ''
    })

    const [formData, setFormData] = useState({
        montoSimulacion: 100000,
        plazoCredito: 0,
        seguroDeDegravamen: true,
        seguroDeCesantia: true,
        userType: "",
        userID: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue;
        if (type === "checkbox") {
            finalValue = checked;
        } else if (type === "number" || type === "range") {
            finalValue = value === "" ? "" : parseInt(value, 10);
        } else {
            finalValue = value;
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: finalValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.plazoCredito < 1) {
            setError("Seleccione cantidad de cuotas");
            return;
        }

        formData.userType = user.userType;
        if (formData.userType === "noCliente") {
            formData.userID = user.sessionId;
        } else {
            formData.userID = user.rut;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/simulator/calculateCredit",
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

            setCreditData({
                cuotaMensual: result.cuotaMensual,
                ctc: result.ctc,
                tasaInteres: result.tasaInteres,
                cae: result.cae,
                costoSeguros: result.costoSeguros,
            });
        } catch (error) {
            setError("Datos invalidos.");
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    if (isLoading) {
        return null;
    }

    const getSimulationHistory = async () => {
        requestSimulation.userType = user.userType;
        if (requestSimulation.userType === "noCliente") {
            requestSimulation.userID = user.sessionId;
        } else {
            requestSimulation.userID = user.rut;
        }

        const response = await fetch(
            "http://localhost:5000/api/simulator/getSimulationHistory",
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
        console.log(result)

        if (!response.ok) {
            throw new Error(result.error || "Ocurrió un error desconocido.");
        }

        setHistorySimulation(result)
    };

    

    return (
        <div>
            <Navbar />
            {!(user === null) ? (
                <>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="montoSimulacion">
                                Monto a simular:
                            </label>
                            <input
                                type="number"
                                id="montoSimulacion"
                                name="montoSimulacion"
                                value={formData.montoSimulacion}
                                onChange={handleChange}
                                min={100000}
                                max={99999999}
                                maxLength={8}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="plazoCredito">
                                Cantidad de cuotas:
                                <strong> {formData.plazoCredito}</strong>
                            </label>
                            <div>
                                <input
                                    type="range"
                                    id="plazoCredito"
                                    name="plazoCredito"
                                    value={formData.plazoCredito}
                                    onChange={handleChange}
                                    min="1"
                                    max="64"
                                    step="1"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="seguros">
                                Seleccionar seguros que desee agregar:
                            </label>
                            <div>
                                <label>
                                    Seguro de Degravamen
                                    <input
                                        type="checkbox"
                                        name="seguroDeDegravamen"
                                        checked={formData.seguroDeDegravamen}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Seguro de Cesantia
                                    <input
                                        type="checkbox"
                                        name="seguroDeCesantia"
                                        checked={formData.seguroDeCesantia}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <input
                                type="text"
                                name="userID"
                                value={
                                    user.userType === "noCliente"
                                        ? user.sessionId
                                        : user.rut
                                }
                                hidden
                            />
                        </div>
                        <button type="submit">Simular</button>
                    </form>
                    {error && !(creditData.cuotaMensual >= 1) && (
                        <p style={{ color: "red" }}>{error}</p>
                    )}
                    <hr />
                    {creditData.cuotaMensual >= 1 && (
                        <p style={{ color: "green" }}>
                            Cuota mensual: ${creditData.cuotaMensual}
                        </p>
                    )}
                    {creditData.cuotaMensual >= 1 && (
                        <p style={{ color: "green" }}>
                            Costo Total del Crédito (CTC): ${creditData.ctc}
                        </p>
                    )}
                    {creditData.cuotaMensual >= 1 && (
                        <p style={{ color: "green" }}>
                            Tasa de interés: {creditData.tasaInteres}%
                        </p>
                    )}
                    {creditData.cuotaMensual >= 1 && (
                        <p style={{ color: "green" }}>
                            Carga Anual Equivalente (CAE): {creditData.cae}%
                        </p>
                    )}
                    {creditData.costoSeguros > 0 && (
                        <p style={{ color: "green" }}>
                            Total seguros: {creditData.costoSeguros}
                        </p>
                    )}
                    <hr />
                    <button onClick={getSimulationHistory}>
                        Ver historial de simulaciones
                    </button>
                    {(historySimulation.length !== 0) ? 
                    <>
                        <h3>Mis ultimas 10 simulaciones</h3>
                        <ul>
                            {historySimulation.map(item => (
                                <li key={item.idsimulacion}>
                                    monto requerido: {item.montosimulado}, monto final: {item.ctc}, valor cuota: {item.cuotamensual}, cantidad de cuotas: {item.plazocredito}
                                </li>
                            ))}
                        </ul>
                    </> : <></>}
                    <hr />
                    <a href="/requestCredit">Solicitar crédito simulado</a>
                </>
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
