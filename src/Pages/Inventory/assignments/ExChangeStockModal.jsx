import React, { useState, useEffect } from "react";
import { ModalIconCorrect, ModalIconMistake } from "../../../assets";
import Select from "react-select";
import { useAxios } from "../../../Contexts";
import { Modal } from "../../../Layouts";

export const ExChangeStockModal = ({ show, onClose, itemToExchange }) => {
    const { privateFetch } = useAxios();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        remitterId: "",
        quantity: "",
        receiverStoreId: "",
    });
    const [warehouses, setWarehouses] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");

    // State for current quantity and remitter details
    const [currentQuantity, setCurrentQuantity] = useState("");

    useEffect(() => {
        if (show && itemToExchange?.Código) {
            fetchStores();
            fetchCurrentQuantity(itemToExchange.Código);
        }
    }, [show, itemToExchange]);

    const fetchStores = async () => {
        try {
            const response = await privateFetch.get("/location/store/item/all?page=0&size=2000");
            const storeOptions = response.data.result.items.map((stores) => ({
                value: stores.id,
                label: `${stores.description} - ${stores.storeType.description}` || stores.description,
            }));
            setWarehouses(storeOptions);
        } catch (error) {
            console.error("Error al obtener las bodegas:", error);
            setError("Ocurrió un error al obtener las bodegas.");
        }
    };

    const fetchCurrentQuantity = async (codigo) => {
        try {
            const response = await privateFetch.get(`/inventory/stock/find?search=${codigo}&page=0&size=1`);
            if (response.status === 200 && response.data.result.items.length > 0) {
                const item = response.data.result.items[0];
                setCurrentQuantity(item.quantity);
                setFormData((prev) => ({
                    ...prev,
                    remitterId: item.store.id,
                }));
            } else {
                console.error("No se encontraron datos para el código:", codigo);
            }
        } catch (error) {
            console.error("Error al obtener la cantidad actual:", error);
            setError("Ocurrió un error al obtener la cantidad actual.");
        }
    };

    const handleSelectChange = (selectedOption, action) => {
        if (action.name === "remitter") {
            setFormData((prev) => ({ ...prev, remitterId: selectedOption?.value || "" }));
        } else if (action.name === "receiver") {
            setFormData((prev) => ({ ...prev, receiverStoreId: selectedOption?.value || "" }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                remitter: { id: itemToExchange.Código, quantity: currentQuantity },
                receiver: { storeId: formData.receiverStoreId },
            };
            const response = await privateFetch.post("/inventory/stock/give", payload);

            if (response.status === 200) {
                setIsSuccessful(true);
                setConfirmationMessage("El inventario fue cedido exitosamente.");
                setShowConfirmationModal(true);
                setTimeout(() => {
                    setShowConfirmationModal(false);
                    onClose();
                }, 3000);
            }
        } catch (error) {
            console.error("Error inesperado:", error);
            setError("Ocurrió un error al ceder el inventario.");
            setShowConfirmationModal(true);
        }
    };

    const closeModal = () => {
        setError(null);
        onClose();
    };


    return (
        <div className={`modalOverlay ${show ? "visible" : ""}`}>
            <div className="modalContent">
                <h2>Ceder Inventario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Bodega Remitente:</label>
                        <Select
                            name="remitter"
                            options={warehouses}
                            onChange={handleSelectChange}
                            placeholder="Seleccionar bodega remitente"
                            value={warehouses.find((option) => option.value === formData.remitterId)}
                            isClearable
                            isDisabled 
                            className="selects"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: "1em",
                                    textAlign: "start",
                                }),
                            }}
                        />

                    </div>
                    <div className="formGroup">
                        <label>Bodega Receptora:</label>
                        <Select
                            name="receiver"
                            options={warehouses}
                            onChange={handleSelectChange}
                            placeholder="Seleccionar bodega receptora"
                            value={warehouses.find((option) => option.value === formData.receiverStoreId)}
                            isClearable
                            className="selects"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: "1em",
                                    textAlign: "start",
                                }),
                            }}
                        />
                    </div>
                    <div className="formGroup">
                        <label>Cantidad Actual Remitente:</label>
                        <input
                            type="text"
                            value={currentQuantity}
                            readOnly
                            className="readonlyInput"
                        />
                    </div>
                    <div className="formGroup">
                        <label>Cantidad a ceder:</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Cantidad a ceder"
                            onChange={handleChange}
                            required
                            value={formData.quantity}
                        />
                    </div>

                    <div className="formActions">
                        <button type="submit">Ceder</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>

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
        </div>
    );
};
