import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth";
import Navbar from "../components/Navbar";
import "../css/profile.css"

function Profile(){
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    }

    return (
        <div>
            <Navbar />
            <h1>Profile</h1>
            <div className="backgroundGlass">
                <div className="glassCard">

                </div>
            </div>
        </div>
    )
}

export default Profile;