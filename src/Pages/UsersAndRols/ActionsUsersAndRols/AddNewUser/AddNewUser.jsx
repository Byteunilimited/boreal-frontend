import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../Assets";
import { useAxios } from "../../../../Contexts";
import { Eye, EyeOff } from "react-feather";
export const AddNewUserModal = ({ show, onClose, onSave }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        address: "",
        cityId: "",
        roleId: "",
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(() => {
        if (show) {
            fetchCities();
            fetchRoles();
        }
    }, [show]);

    const fetchCities = async () => {
        try {
            const response = await privateFetch.get("/location/city/all");
            if (response.status === 200) {
                setCities(response.data.result.city);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener las ciudades.");
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await privateFetch.get("/role/all");
            if (response.status === 200) {
                setRoles(response.data.result.role);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const response = await privateFetch.post("/user/create", formData);
            if (response.status === 200) {
                const data = response.data;
                setIsSuccessful(true);
                setConfirmationMessage("El usuario fue añadido exitosamente.");
                setShowConfirmationModal(true);
                onSave(data);
            } else {
                throw new Error("Error en la creación del usuario.");
            }
        } catch (error) {
            console.error("Error creando el usuario:", error);
            setError("Ocurrió un error en el servidor, por favor, intenta de nuevo.");
            setShowConfirmationModal(true);
        }
    };

    const closeModal = () => {
        setShowConfirmationModal(false);
        setError(null);
        onClose();
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Añadir Nuevo Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Cédula:</label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="Documento del usuario"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre del usuario"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Apellido del usuario"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Teléfono del usuario"
                            required
                            onKeyPress={(e) => {
                                const regex = /^[0-9]*$/;
                                if (!regex.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            maxLength="10"
                        />
                    </div>
                    <div className="formGroup">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email del usuario"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Contraseña:</label>
                        <div className="passwordContainer">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                required
                                className="passwordInput"
                            />
                            <span
                                className="passwordToggleUser"
                                onClick={toggleShowConfirmPassword}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} className="icon" />
                                ) : (
                                    <Eye size={20} className="icon" />
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="formGroup">
                        <label>Dirección:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Dirección del usuario"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Ciudad:</label>
                        <select
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            required
                            className="selects"
                        >
                            <option value="">Seleccionar ciudad</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                {`${city.description} (${city.department.description})`}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="formGroup">
                        <label>Rol:</label>
                        <select
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                            required
                            className="selects"
                        >
                            <option value="">Seleccionar rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.description}
                                </option>
                            ))}
                        </select>
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
