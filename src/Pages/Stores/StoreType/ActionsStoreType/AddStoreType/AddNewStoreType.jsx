
import { useEffect, useState } from "react";
import "../../../ActionsStore/AddNewStore/AddStoreModal.css";
import { ModalIconCorrect, ModalIconMistake } from "../../../../../assets";
import { useAxios } from "../../../../../Contexts";
import { Modal } from "../../../../../Layouts";


export const AddNewStoreType = ({ show, onClose, onSave }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        description: "",

    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleKeyPress = (e) => {
        const regex = /^[a-zA-Z0-9\s]*$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const response = await privateFetch.post("/location/store/type/create", formData);
            if (response.status === 200) {
                const data = response.data;
                setIsSuccessful(true);
                setConfirmationMessage("El elemento fue añadido exitosamente.");
                setShowConfirmationModal(true);
                onSave(data);
            } else {
                throw new Error("Error en la creación del tipo de bodega.");
            }
        } catch (error) {
            console.error("Error creando el tipo de bodega:", error);
            setError("Ocurrió un error en el servidor, por favor, intenta de nuevo.");
            setShowConfirmationModal(true);
        }
    };

    const closeModal = () => {
        setShowConfirmationModal(false);
        setError(null);
        onClose();
    };
    

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Añadir Nueva Bodega</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nombre de la bodega"
                            onKeyPress={handleKeyPress}
                            required
                            maxLength="40" 
                        />
                    </div>
                    

                    <div className="formActions">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>

            {showConfirmationModal && (
                <Modal
                    title={isSuccessful ? "Éxito" : "Error"}
                    text={isSuccessful ? confirmationMessage : error}
                    modalIcon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
                    onClose={closeModal}
                    showCloseButton
                />
            )}
        </div>
    );
};
