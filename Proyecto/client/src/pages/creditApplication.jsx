import Navbar from "../components/Navbar";
import { useAuth } from "../components/auth";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as MiIcono } from "../media/svg/alert-circle-svgrepo-com.svg";
import GlassPanel from "../components/GlassPanel";
import "../css/creditApplication.css";

function CreditApplication() {
  // Estado de autenticación y datos del usuario
  const { user, isLoading } = useAuth();

  // Acceso al estado enviado por <Link state={{ cuotaEstimada }} />
  const location = useLocation();

  // Última simulación disponible (cuota estimada)
  const [lastSim, setLastSim] = useState(null);

  // Resultado del scoring { score, breakdown, usedConfig? }
  const [scoreResult, setScoreResult] = useState(null);

  // Mensaje de error visible en la UI
  const [err, setErr] = useState("");

  // Carga inicial de la cuota estimada: primero desde el state del Link;
  // si no existe (por recarga de página, por ejemplo), intenta desde localStorage.
  useEffect(() => {
    const fromState = location.state?.cuotaEstimada;
    if (fromState) {
      setLastSim({ cuotaEstimada: fromState });
      return;
    }
    try {
      const raw = localStorage.getItem("lastSimulation");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.cuotaEstimada) {
          setLastSim({ cuotaEstimada: parsed.cuotaEstimada });
        }
      }
    } catch (e) {
      console.warn("No se pudo leer lastSimulation:", e);
    }
  }, [location.state]);

  // Handler que intenta calcular el scoring usando:
  // - cuotaEstimada desde la simulación,
  // - datos del perfil del usuario (ingreso, antigüedad, deudas, edad, morosidad, protestos).
  const handleCalcularScoring = useCallback(async () => {
    setErr("");
    setScoreResult(null);

    // Requiere la cuota de la simulación
    if (!lastSim?.cuotaEstimada) {
      setErr("Primero realiza una simulación para obtener la cuota estimada.");
      return;
    }

    // Obtiene campos del perfil del usuario (se asume que están cargados ahí)
    // const perfil = user?.profile || {};
    // const {
    //   ingresoMensual,
    //   mesesAntiguedadLaboral,
    //   deudasVigentes,
    //   morosidad = false,
    //   protestos = false,
    //   edad,
    // } = perfil;

    const ingresoMensual = 707021;
    const mesesAntiguedadLaboral = 48;
    const deudasVigentes = 0;
    const morosidad = false;
    const protestos=  false;
    const edad = 50;

    // Validación mínima para evitar llamadas incompletas
    const faltantes = [
      ingresoMensual,
      mesesAntiguedadLaboral,
      deudasVigentes,
      edad,
    ].some((v) => v === undefined || v === null);

    if (faltantes) {
      setErr(
        "Faltan datos del perfil para calcular el scoring (ingreso, antigüedad, deudas, edad). Completa tu perfil y vuelve a intentarlo."
      );
      return;
    }

    // Payload plano esperado por el endpoint /api/score/compute
    const body = {
      ingresoMensual,
      cuotaEstimada: lastSim.cuotaEstimada,
      mesesAntiguedadLaboral,
      deudasVigentes,
      morosidad,
      protestos,
      edad,
    };

    try {
      const resp = await fetch("http://localhost:5000/api/score/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || "Error al calcular scoring");
      setScoreResult(json);
    } catch (e) {
      setErr(e.message);
    }
  }, [lastSim]);

  // Mientras se carga el estado de autenticación no se renderiza nada
  useEffect(() => {
    if (lastSim?.cuotaEstimada) {
        handleCalcularScoring();
    }
  }, [lastSim, handleCalcularScoring]);
  
  if (isLoading) return null;

  return (
    <div>
      {/* Bloque para usuarios autenticados (no "noCliente") */}
      {!(user === null || user.userType === "noCliente") ? (
        <>
          {/* Barra de navegación superior */}
          <Navbar />

          <div style={{ textAlign: "center", height: "48.3rem", paddingTop: "15rem"}}>
            <GlassPanel>
              {err && (
                <p style={{ color: "salmon", marginTop: 8 }}>
                  {String(err)}
                </p>
              )}
              {scoreResult ? (
                scoreResult.score > 70 ? (
                    <>
                      <h3>Felicidades, tu simulación ha sido aprobada</h3>
                      <p>El siguiente paso será firmar los documentos del crédito.</p>
                      <a className="navbar-btn" href="/docSign">Firmar documentos</a>
                    </>
                ) : (
                    <>
                      <h3>Lo lamentamos, no cumples con los requisitos para solicitar este préstamo</h3>
                      <a className="navbar-btn" href="/simulator">Volver al simulador</a>
                      <a className="navbar-btn" href="/">Volver al inicio</a>
                    </>
                )
              ) : (
                /* Estado de carga mientras scoreResult es null */
                !err && (
                  <div style={{ textAlign: "center", color: "white" }}>
                    <h3>Analizando viabilidad...</h3>
                    <p>Estamos procesando tu solicitud, por favor espera un momento.</p>
                  </div>
                )
              )}
            </GlassPanel>
          </div>
        </>
      ) : (
        <>
          <GlassPanel>
            <div className="alertAndRedirect">
              <MiIcono className="alert-signal" />
              <p className="alertText">
                Para continuar con la solicitud debes iniciar sesión o registrarte
              </p>
              <a href="/login">Iniciar Sesión</a>
              <a href="/register">Registrarse</a>
            </div>
          </GlassPanel>
        </>
      )}
    </div>
  );
}

export default CreditApplication;
