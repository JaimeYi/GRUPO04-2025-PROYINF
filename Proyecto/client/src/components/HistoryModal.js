// src/components/HistoryModal.js
import React from "react";
import "../css/GlassPanel.css"; // reuse the same glass style
// src/components/HistoryModal.jsx
import { formatMoney } from "../utils/formatMoney";

function HistoryModal({ history, onClose, onRestore }) {
  if (!history?.length) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h3>Historial de Simulaciones</h3>
          <p>No hay simulaciones guardadas.</p>
          <button onClick={onClose} className="navbar-btn">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Historial de Simulaciones</h3>

        <div className="history-list">
          {history.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-grid">
                <div><strong>Monto:</strong></div>
                <div>{formatMoney(item.montosimulado)}</div>

                <div><strong>Monto final (CTC):</strong></div>
                <div>{formatMoney(item.ctc || item.costoTotal || 0)}</div>

                <div><strong>Cuotas:</strong></div>
                <div>{item.plazocredito}</div>

                <div><strong>Valor por cuota:</strong></div>
                <div>{formatMoney(item.cuotamensual || item.cuotaMensual)}</div>

                {item.cae != null && (
                  <>
                    <div><strong>CAE:</strong></div>
                    <div>{(parseFloat(item.cae) * 100).toFixed(2)}%</div>
                  </>
                )}
              </div>

              <button
                onClick={() => onRestore(item)}
                className="history-restore-btn"
                style={{ marginTop: "1rem", width: "100%" }}
              >
                Restaurar
              </button>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="navbar-btn" style={{ marginTop: "1rem" }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default HistoryModal;