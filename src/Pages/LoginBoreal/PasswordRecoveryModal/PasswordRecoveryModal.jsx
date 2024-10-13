import React, { useState } from "react";
import { Modal } from "../../../Layouts";
import { ModalIconQuestion } from "../../../Assets";
import "./PasswordRecoveryModal.css";
import { Button } from "../../../Components";

export const PasswordRecoveryModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud de recuperación de contraseña");
      }

      setSuccess(true);
      setEmail("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      modalIcon={ModalIconQuestion}
      title="Restablecer contraseña"
      text={
        success
          ? "Solicitud de recuperación de contraseña enviada con éxito"
          : "Para restablecer su contraseña, por favor ingrese su correo electrónico"
      }
      onClose={onClose}
    >
      {!success ? (
        <form className="formContainer" onSubmit={handleSubmit}>
          <div className="Columns">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Ingrese su email"
              disabled={loading}
            />
            <div className="ButtonsPassword">
              <button className="ModalPasswordButtonSend" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
              </button>
              <button onClick={onClose} className="ModalPasswordButtonClose" disabled={loading}>
                Cancelar
              </button>
            </div>
          </div>
          {error && <p className="errorMessage">{error}</p>}
        </form>
      ) : (
        <Button onClick={onClose}>Cerrar</Button>
      )}
    </Modal>
  );
};
