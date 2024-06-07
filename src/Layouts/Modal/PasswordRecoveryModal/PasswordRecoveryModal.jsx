import React, { useState } from "react";
import {Modal} from "../../../Layouts";
import {ModalIconQuestion} from "../../../assets";
import "../PasswordRecoveryModal/PasswordRecoveryModal.css";
import { Button } from "../../../Components";

export const PasswordRecoveryModal = ({ onClose }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Enviar solicitud de recuperación de contraseña para:", email);
    onClose();
  };

  return (
    <Modal
      modalIcon={ModalIconQuestion}
      title="Restablecer contraseña"
      text={
        "Para restablecer su contraseña, por favor ingrese su correo electrónico"
      }
      onClose={onClose}
    >
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="Columns">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Ingrese su email"
          />
          <div className="ButtonsPassword">
            
            <button className="ModalPasswordButtonSend" type="submit">
              Enviar
            </button>
            <button onClick={onClose} className="ModalPasswordButtonClose">
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

