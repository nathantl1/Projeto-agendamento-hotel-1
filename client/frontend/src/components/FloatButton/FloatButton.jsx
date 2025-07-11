
import React from "react";
import "./floatbutton.css";

function FloatButton({ onClick }) {
  return (
    <button
      className="botao"
      onClick={onClick}
    >
      +
    </button>
  );
}

export default FloatButton;
