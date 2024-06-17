import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "react-feather";
import "./LoginBoreal.css";
import { postLogin } from "../../Services/login";
import {
  ModalIconMistake,
  ModalIconCorrect,
  ModalIconWarning,
  BorealLogo,
} from "../../assets";
import { PasswordRecoveryModal, Modal } from "../../Layouts";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components";
import { useForm } from "../../hooks";
import { useAuth } from "../../Contexts";
//import FormText from 'react-bootstrap/FormText'

export const LoginBoreal = () => {
  const { serialize } = useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [showItemsErrorModal, setShowItemsErrorModal] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showErrorModalEmail, setShowErrorModalEmail] = useState(false);
  const navigate = useNavigate();
  const { Login } = useAuth();

  const handlePasswordRecovery = () => {
    setShowRecoveryModal(true);
  };

  const handleCloseModal = () => {
    setShowRecoveryModal(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const testLoginData = {
    username: "usuarioprueba@gmail.com",
    password: "87654321",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzdWFyaW9wcnVlYmFAZ21haWwuY29tIiwiaWF0IjoxNjI0MzM3MTI0LCJleHAiOjE2MjQzMzcyMjR9.YTqDQ4WbB3WXyoXdC2PvQJcUNa9cpd-w8CcnMk6TD1Y",
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith(".com");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setShowItemsErrorModal(true);
      return;
    }

    if (!validateEmail(username)) {
      setShowErrorModalEmail(true);
      return;
    }

    try {
      if (
        username === testLoginData.username &&
        password === testLoginData.password
      ) {
        const userData = {
          username: testLoginData.username,
          token: testLoginData.token,
          expiresAt: Date.now() + 3600 * 1000,
        };
        Login(userData);
        localStorage.setItem("token", testLoginData.token);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/boreal/panel");
        }, 3000);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setError(error.message);
      setShowErrorModal(true);
    }
  };

  /*    

    try {
      const response = await axios.post(postLogin, { username, password });

      if (response.status === 201) {
        const { token, expiresAt } = response.data;
        Login({ token, expiresAt }); 
        localStorage.setItem("token", Login.token);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/boreal/inventario");
        }, 3000); 
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setError(error.message);
      setShowErrorModal(true);
    }
  };
*/

  return (
    <div className="mainBackground">
      <section className="mainSection">
        <figure className="mainFigure">
          <img src={BorealLogo} className="mainImg" alt="Logo boreal" />
        </figure>
        <div className="mainContainer">
          <h2 className="mainTitle">Inicio de sesión</h2>
          <form className="mainForm" onSubmit={handleSubmit}>
            <div className="inputLoginContainer">
              <input
                name="username"
                type="email"
                className="mainInput"
                id="username"
                placeholder="Ingrese su usuario*"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="inputLoginContainer">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="contrasenia"
                className="mainInput"
                id="password"
                placeholder="Ingrese su contraseña*"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="passwordToggle"
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} className="icon" />
                ) : (
                  <Eye size={20} className="icon" />
                )}
              </span>
            </div>
            {showSuccessModal && (
              <Modal
                modalIcon={ModalIconCorrect}
                title="Autenticación Exitosa"
                onClose={() => setShowSuccessModal(false)}
              />
            )}
            {showItemsErrorModal && (
              <Modal
                modalIcon={ModalIconWarning}
                title="Advertencia"
                text="Debes completar todos los campos."
                onClose={() => setShowItemsErrorModal(false)}
                showCloseButton={true}
              />
            )}
            {showErrorModal && (
              <Modal
                modalIcon={ModalIconMistake}
                title="Error de Autenticación"
                text="Usuario y/o contraseña incorrecta."
                onClose={() => setShowErrorModal(false)}
                showCloseButton={true}
              />
            )}
            {showErrorModalEmail && (
              <Modal
                modalIcon={ModalIconWarning}
                title="Advertencia"
                text="Por favor, introduce una dirección de correo electrónico válida."
                onClose={() => setShowErrorModalEmail(false)}
                showCloseButton={true}
              />
            )}
            <p className="pass" onClick={handlePasswordRecovery}>
              ¿Olvidó su contraseña?
            </p>

            {showRecoveryModal && (
              <PasswordRecoveryModal onClose={handleCloseModal} />
            )}
            <Button
              text="Ingresar"
              type="submit"
              className="buttonMain"
              onClick={handleSubmit}
            />
          </form>
        </div>
      </section>
    </div>
  );
};
