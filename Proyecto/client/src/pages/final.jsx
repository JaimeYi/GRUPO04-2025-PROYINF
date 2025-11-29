import Navbar from "../components/Navbar";
import GlassPanel from "../components/GlassPanel";
import { useNavigate } from "react-router-dom";

function Final(){
    const navigate = useNavigate();

    const redir = () => {
        navigate("/");
    }
    return (
        <>
            <Navbar />
            <div style={{ textAlign: "center", height: "48.3rem", paddingTop: "15rem"}}>
                <GlassPanel>
                    <h1>Deposito realizado</h1>
                    <p>El deposito solicitado ya se ha realizado a su cuenta.</p>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <button className="navbar-btn" style={{ margin: "10px", width: "45%"}} onClick={redir}>Volver al inicio</button>
                    </div>
                </GlassPanel>
            </div>
        </>
    )
}

export default Final