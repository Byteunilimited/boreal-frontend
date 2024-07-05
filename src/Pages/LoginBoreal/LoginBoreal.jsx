import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "react-feather";
import "./LoginBoreal.css";
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
import { useAuth, useAxios } from "../../Contexts";
import { Navigate } from 'react-router-dom';

export const LoginBoreal = () => {
  const { serialize } = useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {privateFetch} = useAxios();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [showItemsErrorModal, setShowItemsErrorModal] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showErrorModalEmail, setShowErrorModalEmail] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { Login } = useAuth();
  const { isAutenticated } = useAuth();

  useEffect(() => {
      document.title = "Login";
  }, []);

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

  const [showPassword, setShowPassword] = useState(false);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith(".com");
  };

  const handleSubmit = async (ev) => {
    setIsLoading(true);
    ev.preventDefault();
    const formData = serialize(ev.target);
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
      const { data } = await privateFetch.post("user/login", formData);
      if (data.status === 200) {
        Login(data);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/boreal/panel");
        }, 3000);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setShowErrorModal(true);
    }
  };

  return !isAutenticated() ? (
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
                name="email"
                type="email"
                className="mainInput"
                id="email"
                placeholder="Ingrese su usuario*"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="inputLoginContainer">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password"
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
            <Button  loading={isLoading} text="Ingresar" type="submit" className="buttonMain"/>
          </form>
        </div>
      </section>
    </div>
    ) : (
      <Navigate to='/boreal/panel' />
  )
};
