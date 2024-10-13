import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../Assets";
import { useAxios } from "../../../../Contexts";
import { Eye, EyeOff } from "react-feather";

export const UpdateUserModal = ({ show, onClose, user, onSave }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: user?.Cédula || "",
        name: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        address: "",
        cityId: "",
        roleId: "",
    });

    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Invoca fetchUserData al mostrar el modal
    useEffect(() => {
        if (show && user?.Cédula) {
            fetchUserData();
            fetchCities(); // Cargar las ciudades al abrir el modal
            fetchRoles(); // Cargar los roles al abrir el modal
        }
    }, [show, user]);

    const fetchUserData = async () => {
        try {
            const response = await privateFetch.get(`/user/id?id=${user.Cédula}`);
            if (response.status === 200) {
                const userData = response.data.result.user[0];
                setFormData({
                    id: userData.id,
                    name: userData.name,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    email: userData.email,
                    password: userData.password,
                    address: userData.address,
                    cityId: userData.city.id,
                    roleId: userData.role.id,
                });
            } else {
                setError("Ocurrió un error al obtener los datos del usuario.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Ocurrió un error al obtener los datos del usuario.");
        }
    };

    const fetchCities = async () => {
        try {
            const response = await privateFetch.get('/location/city/all');
            if (response.status === 200) {
                setCities(response.data.result.city);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setError("Ocurrió un error al obtener las ciudades.");
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await privateFetch.get('/role/all'); // Cambia la URL según tu API
            if (response.status === 200) {
                setRoles(response.data.result.role); // Asumiendo que los roles vienen en el campo result
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setError("Ocurrió un error al obtener los roles.");
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
            const response = await privateFetch.put(`/user/update`, formData);
            if (response.status === 200) {
                const data = response.data;
                setIsSuccessful(true);
                setConfirmationMessage("El usuario fue actualizado exitosamente.");
                setShowConfirmationModal(true);
                onSave(data);
            } else {
                throw new Error("Error en la actualización del usuario.");
            }
        } catch (error) {
            setIsSuccessful(false);
            setError("Ocurrió un error en el servidor, por favor, intenta de nuevo.");
            setShowConfirmationModal(true);
        }
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const closeModal = () => {
        setShowConfirmationModal(false);
        setError(null);
        onClose();
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Actualizar Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Cédula:</label>
                        <input type="text" name="id" value={formData.id} disabled required />
                    </div>
                    <div className="formGroup">
                        <label>Nombre:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Apellido:</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Teléfono:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Dirección:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="formGroup">
                        <label>Ciudad:</label>
                        <select name="cityId" value={formData.cityId} onChange={handleChange} required className="selects">
                            <option value="">Selecciona una ciudad</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                {`${city.description} (${city.department.description})`}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="formGroup">
                        <label>Rol:</label>
                        <select name="roleId" value={formData.roleId} onChange={handleChange} required className="selects">
                            <option value="">Selecciona un rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="formGroup">
                        <label>Contraseña:</label>
                        <div className="passwordContainer">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
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


                    <div className="formActions">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
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
