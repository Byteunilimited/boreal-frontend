import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { useAxios } from "../../../../Contexts";
import { Eye, EyeOff } from "react-feather";
import Select from "react-select";

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
        officeId: "",
        roleId: "",
    });

    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [offices, setOffices] = useState([]);

    useEffect(() => {
        if (show && user?.Cédula) {
            fetchUserData();
            fetchCities();
            fetchRoles();
            fetchOffices();
        }
    }, [show, user]);


    const handleSelectChange = (selectedOption, field) => {
        setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : null }));
    };

    const fetchUserData = async () => {
        try {
            const response = await privateFetch.get(`/user/id?id=${user.Cédula}`);
            if (response.status === 200) {
                const userData = response.data.result.items[0];
                setFormData({
                    id: userData.id,
                    name: userData.name,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    email: userData.email,
                    password: userData.password,
                    address: userData.address,
                    cityId: userData.city.id,
                    officeId: userData.office.id,
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
            const response = await privateFetch.get('/location/city/all?page=0&size=2000');
            if (response.status === 200) {
                const cities = response.data.result.items || [];
                const options = cities.map((city) => ({
                    value: city.id,
                    label: `${city.description}, - ${city.department.description}`,
                }));
                setCities(options);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setError("Ocurrió un error al obtener las ciudades.");
        }
    };

    const fetchOffices = async () => {
        try {
            const response = await privateFetch.get("/location/office/all?page=0&size=2000");
            if (response.status === 200) {
                const offices = response.data.result.items || [];
                const options = offices.map((office) => ({
                    value: office.id,
                    label: office.description
                }));
                setOffices(options);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener las oficinas.");
        }
    };
    const fetchRoles = async () => {
        try {
            const response = await privateFetch.get('/role/all?page=0&size=2000');
            if (response.status === 200) {
                const roles = response.data.result.items || [];
                const options = roles.map((role) => ({
                    value: role.id,
                    label: role.description
                }));
                setRoles(options);
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
                setIsSuccessful(true);
                setShowConfirmationModal(true);
                setConfirmationMessage("El usuario fue actualizado exitosamente.");
                const data = response.data;
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
                        <Select
                            options={cities}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "cityId")}
                            placeholder="Seleccionar ciudad"
                            value={cities.find(option => option.value === formData.cityId)}
                            required
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
                        <label>Sucursal:</label>
                        <Select
                            options={offices}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "officeId")}
                            placeholder="Seleccionar sucursal"
                            value={offices.find(option => option.value === formData.officeId)}
                            isClearable
                            required
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
                        <label>Rol:</label>
                        <Select
                            options={roles}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "roleId")}
                            placeholder="Seleccionar rol"
                            value={roles.find(option => option.value.toString() === formData.roleId.toString())}
                            isClearable
                            required
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
                        <label>Contraseña:</label>
                        <div className="passwordContainer">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="passwordInput"
                                required
                            />
                            <span
                                className="passwordToggleUser"
                                onClick={toggleShowConfirmPassword}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} className="iconPassword" />
                                ) : (
                                    <Eye size={20} className="iconPassword" />
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
