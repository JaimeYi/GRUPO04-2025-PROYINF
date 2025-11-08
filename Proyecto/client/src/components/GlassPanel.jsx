import React from "react";
import "../css/GlassPanel.css"; // we’ll create this next

function GlassPanel({ children, style }) {
  return (
    <div className="glass-panel" style={style}>
      {children}
    </div>
  );
}

export default GlassPanel;
