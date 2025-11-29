import Navbar from "../components/Navbar";
import GlassPanel from "../components/GlassPanel";
import { useNavigate } from "react-router-dom";

function DataBank(){
    const navigate = useNavigate();
    const redir = () => {
        alert(`Datos de transferencias recibidos, deposito realizado.`);
        navigate("/final");
    }
    return (
        <>
            <Navbar/>
                <div style={{ textAlign: "center", paddingTop: "2.5rem"}}>
                    <GlassPanel>
                        <h2>Datos bancarios</h2>
                            <div className="card-form">

                                <label htmlFor="banco">Banco</label>
                                <select
                                    id="banco"
                                    name="banco"
                                    required
                                >
                                    <option>Banco 1</option>
                                    <option>Banco 2</option>
                                    <option>Banco 3</option>
                                </select>

                                <label htmlFor="typeAccount">Tipo de cuenta</label>
                                <select
                                    id="tipoDeCuenta"
                                    name="tipoDeCuenta"
                                    required
                                >
                                    <option>Cuenta Corriente</option>
                                    <option>Cuenta Vista</option>
                                    <option>Cuenta de Ahorro</option>
                                </select>

                                <label htmlFor="correo">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    required
                                />

                                <label htmlFor="accountNumber">Número de cuenta</label>
                                <input
                                    type="number"
                                    id="numeroCuenta"
                                    name="numeroCuenta"
                                    min={1}
                                    required
                                />

                                <button onClick={redir} className="hero-btn">Enviar datos</button>
                            </div>
                    </GlassPanel>
                </div>
        </>
    )
}

export default DataBank;