import React from "react";
import "./Modal.css";
import { Button } from "../../../Components";


export const Modal = ({ title, text, children, onClose, modalIcon, showCloseButton }) => {
  return (
    <div className="modalOverlay1" onClick={onClose}>
      <div className="modalContent1" onClick={(e) => e.stopPropagation()}>
        <img src={modalIcon} alt="modalImg" className="modalIcon1" />
        <h2 className="modalTitle1">{title}</h2>
        <p className="modalText1">{text}</p>
        <div className="modalBody1">{children}</div>
        {showCloseButton && <button onClick={onClose} className="modalCloseBtn1"> Cerrar </button>}
      </div>
    </div>
  );
};


