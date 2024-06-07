import React from "react";
import "./Modal.css";
import { Button } from "../../../Components";


export const Modal = ({ title, text, children, onClose, modalIcon, showCloseButton }) => {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <img src={modalIcon} alt="modalImg" className="modalIcon" />
        <h2 className="modalTitle">{title}</h2>
        <p className="modalText">{text}</p>
        <div className="modalBody">{children}</div>
        {showCloseButton && <button onClick={onClose} className="modalCloseBtn"> Cerrar </button>}
      </div>
    </div>
  );
};


