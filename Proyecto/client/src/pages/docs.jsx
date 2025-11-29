import Navbar from "../components/Navbar";
import GlassPanel from "../components/GlassPanel";
import { useNavigate } from "react-router-dom";

function Docs(){
    const navigate = useNavigate();

    const redir = () => {
        alert(`Contrato firmado con exito`);
        navigate("/bankData");
    }
    return (
        <>
            <Navbar/>
                <div style={{ textAlign: "center", height: "48.3rem", paddingTop: "15rem"}}>
                    <GlassPanel>
                        <h1>Contrato</h1>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <a href="/archivoDePrueba.pdf" download="contrato.pdf" className="navbar-btn" style={{ margin: "10px", width: "45%"}}>Leer contrato</a>
                            <button className="navbar-btn" style={{ margin: "10px", width: "45%"}} onClick={redir}>Firmar Contrato</button>
                        </div>
                    </GlassPanel>
                </div>
        </>
    )
}

export default Docs;