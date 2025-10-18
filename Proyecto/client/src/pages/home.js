import Navbar from "../components/Navbar";

function Home(){
    return (
        <div>
            <Navbar />
            <h1>Home</h1>
            <a href="/simulator">Realizar simulación</a>
        </div>
    );
}

export default Home;