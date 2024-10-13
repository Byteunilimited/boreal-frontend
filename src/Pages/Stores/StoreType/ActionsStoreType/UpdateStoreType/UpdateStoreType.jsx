import { useEffect, useState } from "react";
import { ModalIconCorrect, ModalIconMistake } from "../../../../../Assets";
import { useAxios } from "../../../../../Contexts";
import { Modal } from "../../../../../Layouts";

export const UpdateStoreType = ({ show, onClose, storeType, onUpdate }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: storeType.id,
        description: storeType.description,
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        if (storeType) {

            setFormData({
                id: storeType.Código || "",
                description: storeType.Nombre || "",
            });
        }

    }, [storeType]);


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
            const response = await privateFetch.put("/location/store/type/update", formData);
            if (response.status === 200) {     
                setIsSuccessful(true);
                setConfirmationMessage("El tipo de bodega fue actualizado exitosamente.");
                setShowConfirmationModal(true);
                onUpdate(formData);
                console.log(isSuccessful);
                
            } else {
                throw new Error("Error en la actualización del tipo de bodega.");
            }
        } catch (error) {
            console.error("Error actualizando el tipo de bodega:", error);
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
                <h2>Actualizar Tipo de Bodega</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Nombre:</label>

                        <input
                            type="text"
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            placeholder="Nombre del tipo de bodega"
                            onKeyPress={handleKeyPress}
                            required
                            maxLength="40"
                        />

                    </div>

                    <div className="formActions">
                        <button type="submit">Actualizar</button>
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
                    onClose={closeModal}
                    modalIcon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
                    showCloseButton
                />
            )}

        </div>
    );
};
