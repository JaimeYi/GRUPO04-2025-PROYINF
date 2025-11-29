import Navbar from "../components/Navbar";
import { useAuth } from "../components/auth";
import { useState, useEffect } from "react";
import { rutVerifier } from "../utils/rutVerifier";
import "../css/cardData.css";
import GlassPanel from "../components/GlassPanel";
import BottomBar from "../components/BottomBar";
import { Link } from "react-router-dom";
import HistoryModal from "../components/HistoryModal";
import { formatMoney } from "../utils/formatMoney";

function GuestPopup({ onClose }) {
    const [formData, setFormData] = useState({ rut: "", correo: "", telefono: "" });
    const { setUser } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({
            userType: "noCliente",
            sessionId: "guest_" + Date.now(),
            rut: formData.rut.replace(/[^0-9kK-]/g, "").toUpperCase()
        });
        onClose();
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div className="glass-panel max-w-md w-full p-10" style={{ color: "white" }}>
                <h3 className="text-3xl font-bold text-white text-center mb-10">
                    Ingresa tus datos personales
                </h3>

                <form onSubmit={handleSubmit} className="space-y-8" style={{ color: "white" }}s>
                    <input
                        type="text"
                        placeholder="12.345.678-K"
                        className="inputCard-guest w-full text-center text-xl"
                        maxLength="12"
                        required
                        value={formData.rut}
                        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    />

                    <input
                        type="email"
                        placeholder="tucorreo@ejemplo.cl"
                        className="inputCard-guest w-full text-center text-xl"
                        required
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    />

                    <input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        className="inputCard-guest w-full text-center text-xl"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />

                    <div className="flex gap-8 justify-center pt-10">
                        <button 
                            type="submit" 
                            className="navbar-btn navbar-btn-green text-3xl px-20 py-7 font-bold transform hover:scale-110 transition-all"
                        >
                            Continuar
                        </button>
                        <button type="button" onClick={onClose} className="navbar-btn text-3xl px-20 py-7 font-bold transform hover:scale-110 transition-all">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


function Simulator() {
    const { user, isLoading } = useAuth();
    const [showGuestPopup, setShowGuestPopup] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState("");
    const [historySimulation, setHistorySimulation] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [creditData, setCreditData] = useState({
        cuotaMensual: "",
        ctc: "",
        tasaInteres: "",
        cae: "",
        costoSeguros: "",
    });

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

    const getSimulationHistory = async () => {
        const response = await fetch(
            "http://localhost:5000/api/simulator/simulationHistory",
            {
                method: "GET",
                credentials: "include",
            }
        );

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            throw new Error(result.error || "Ocurrió un error desconocido.");
        }

        setHistorySimulation(result);
    };

    const calculateCredit = async (data) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/simulator/calculateCredit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
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

            localStorage.setItem(
                "lastSimulation",
                JSON.stringify({
                    cuotaEstimada: result.cuotaMensual,     // scoring
                    montoSimulacion: data.montoSimulacion,
                    plazoCredito: data.plazoCredito,
                    fecha: new Date().toISOString(),
                })
            );

            getSimulationHistory();
        } catch (error) {
            console.log(error);
            setError("Datos inválidos.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.plazoCredito < 1) {
            setError("Seleccione cantidad de cuotas");
            return;
        }

        const preparedData = {
            ...formData,
            userType: user.userType,
            userID: user.userType === "noCliente" ? user.sessionId : user.rut,
        };

        await calculateCredit(preparedData);
    };

    const handleRestore = async (item) => {
        const restoredData = {
            montoSimulacion: item.montosimulado,
            plazoCredito: item.plazocredito,
            seguroDeDegravamen: item.segurodedegravamen,
            seguroDeCesantia: item.segurodecesantia,
            userID: user.userType === "noCliente" ? user.sessionId : user.rut,
            userType: user.userType,
        };

        setFormData(restoredData);
        setShowHistory(false);

        await calculateCredit(restoredData);
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };


    useEffect(() => {
        getSimulationHistory();
    }, []);

    useEffect(() => {
        const openHandler = () => setShowHistory(true);
        window.addEventListener("openHistoryModal", openHandler);
        return () =>
            window.removeEventListener("openHistoryModal", openHandler);
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <Navbar />

            <div
                style={{
                    height: "100vh",              
                    overflow: "hidden",           
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <GlassPanel>
                    {user ? (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "0.5rem",
                                            fontWeight: 600,
                                            color: "white",
                                        }}
                                    >
                                        Monto a simular:
                                    </label>
                                    <input
                                        type="text"
                                        name="montoSimulacion"
                                        value={formatMoney(
                                            formData.montoSimulacion
                                        )}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(
                                                /\D/g,
                                                ""
                                            ); // Remove non-digits
                                            const num =
                                                raw === ""
                                                    ? 100000
                                                    : Math.min(
                                                          parseInt(raw, 10),
                                                          99999999
                                                      );
                                            handleChange({
                                                target: {
                                                    name: "montoSimulacion",
                                                    value: num,
                                                },
                                            });
                                        }}
                                        min={100000}
                                        max={99999999}
                                        className="monto-input"
                                        required
                                        placeholder="$100.000"
                                    />
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            textAlign: "center",
                                            marginBottom: "0.5rem",
                                            fontWeight: 600,
                                            color: "white",
                                        }}
                                    >
                                        Cantidad de cuotas:{" "}
                                        <strong className="cuotas-display">
                                            {formData.plazoCredito}
                                        </strong>
                                    </label>
                                    <input
                                        type="range"
                                        name="plazoCredito"
                                        value={formData.plazoCredito}
                                        onChange={handleChange}
                                        min={1}
                                        max={64}
                                        step={1}
                                        className="custom-range"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "0.75rem",
                                            fontWeight: 600,
                                            color: "white",
                                        }}
                                    >
                                        Seleccionar seguros que desee agregar:
                                    </label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                name="seguroDeDegravamen"
                                                checked={
                                                    formData.seguroDeDegravamen
                                                }
                                                onChange={handleChange}
                                            />
                                            Seguro de Degravamen
                                        </label>
                                        <label className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                name="seguroDeCesantia"
                                                checked={
                                                    formData.seguroDeCesantia
                                                }
                                                onChange={handleChange}
                                            />
                                            Seguro de Cesantía
                                        </label>
                                    </div>
                                </div>

                                <input
                                    type="hidden"
                                    name="userID"
                                    value={
                                        user.userType === "noCliente"
                                            ? user.sessionId
                                            : user.rut
                                    }
                                />

                                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center"  }}>
                                    <button
                                        type="submit"
                                        className="navbar-btn"
                                    >
                                        Simular
                                    </button>
                                </div>
                            </form>

                            {error && !creditData.cuotaMensual && (
                                <p style={{ color: "red" }}>{error}</p>
                            )}

                            <hr
                                style={{
                                    borderColor: "rgba(255,255,255,0.3)",
                                    margin: "2rem 0",
                                }}
                            />

                            {/* RESULTS */}
                            {creditData.cuotaMensual && (
                                <div className="simulation-results">
                                    <div className="result-item">
                                        <div className="result-icon">1</div>
                                        <span className="result-label">
                                            Cuota mensual:
                                        </span>
                                        <span className="result-value">
                                            {formatMoney(
                                                creditData.cuotaMensual
                                            )}
                                        </span>
                                    </div>

                                    <div className="result-item">
                                        <div className="result-icon">2</div>
                                        <span className="result-label">
                                            Costo Total (CTC):
                                        </span>
                                        <span className="result-value">
                                            {formatMoney(creditData.ctc)}
                                        </span>
                                    </div>

                                    <div className="result-item">
                                        <div className="result-icon">3</div>
                                        <span className="result-label">
                                            Tasa de interés:
                                        </span>
                                        <span className="result-value">
                                            {creditData.tasaInteres}%
                                        </span>
                                    </div>

                                    <div className="result-item">
                                        <div className="result-icon">4</div>
                                        <span className="result-label">
                                            CAE:
                                        </span>
                                        <span className="result-value">
                                            {parseFloat(creditData.cae).toFixed(
                                                2
                                            )}
                                            %
                                        </span>
                                    </div>

                                    {creditData.costoSeguros > 0 && (
                                        <div className="result-item">
                                            <div className="result-icon">5</div>
                                            <span className="result-label">
                                                Total seguros:
                                            </span>
                                            <span className="result-value">
                                                {formatMoney(
                                                    creditData.costoSeguros
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* BUTTONS – NOW VISIBLE & CENTERED */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "1.5rem",
                                    marginTop: "2rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    type="button"
                                    className="navbar-btn navbar-btn-green"
                                    onClick={() =>
                                        alert("Simulación enviada al correo!")
                                    }
                                >
                                    Enviar simulación a email
                                </button>

                                <Link
                                  to="/creditApplication"
                                  state={{ cuotaEstimada: creditData.cuotaMensual }}
                                  className="navbar-btn"
                                >
                                    Solicitar crédito simulado
                                </Link>
                            </div>
                        </>
                ) : (
                     <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            gap: "3rem",          
                            width: "100%",
                        }}
                    >
                        <h2 className="text-5xl font-extrabold text-white mb-20 drop-shadow-2xl">
                            Antes de comenzar
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-16 justify-center items-center mt-12 mb-10"
                            style={{
                                gap: "4rem",      // ← separa botones mucho más
                                paddingTop: "1rem"
                            }}>
                            <Link
                                to="/login"
                                className="navbar-btn navbar-btn-green text-4xl px-20 py-12 transform hover:scale-110 transition-all duration-300 shadow-2xl font-bold"
                                style={{ minWidth: "380px" }}
                            >
                                Soy cliente
                            </Link>

                            {/* NO SOY CLIENTE – AHORA SÍ SE VE COMO BOTÓN REAL */}
                            <button
                                onClick={() => setShowGuestPopup(true)}
                                className="navbar-btn text-4xl px-20 py-12 transform hover:scale-110 transition-all duration-300 shadow-2xl font-bold bg-white/20 backdrop-blur-md border-4 border-white/40 hover:bg-white/30"
                                style={{ minWidth: "380px" }}
                            >
                                No soy cliente
                            </button>
                        </div>
                    </div>
                    )}
                </GlassPanel>
            </div>

            {/* POPUP QUE APARECE ENCIMA DE TODO */}
            {showGuestPopup && <GuestPopup onClose={() => setShowGuestPopup(false)} />}

            <BottomBar />
        </>
    );
}
export default Simulator;
