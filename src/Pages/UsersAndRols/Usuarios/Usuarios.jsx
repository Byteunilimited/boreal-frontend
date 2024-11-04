import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { Button, DynamicTable } from "../../../Components";
import { API_ENDPOINT, MOCK_DATA } from "../../../util";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { AddNewUserModal } from "../ActionsUsersAndRols/AddNewUser/AddNewUser";
import { UpdateUserModal } from "../ActionsUsersAndRols/UpdateUser/UpdateUser";

export const Usuarios = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemToEdit, setItemToEdit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [states, setStates] = useState([]); 


    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "Usuarios.xlsx");
    };

    const translateFields = (items) => {
        return items.map((item) => {
            // Convertimos stateId a string para comparación
            const stateIdAsString = item.stateId.toString();
            const state = states.find(state => state.id === stateIdAsString);
            return {
                Cédula: item.id,
                Nombre: item.name,
                Apellido: item.lastName,
                Correo: item.email,
                Télefono: item.phone,
                Rol: item.role?.description || "Desconocido",
                Dirección: item.address,
                Ciudad: `${item.city.description}, (${item.city.department.description})` || "Desconocido",
                Oficina: item.office?.description || "Desconocida",
                //Estado: state ? state.description : "Desconocido",
            };
        });
    };
    
    
        

    const getData = async () => {
        setLoading(true);
        try {
            if (MOCK_DATA === "true") {
                setData(usersMock);
            } else {
                const [usersRes, rolesRes,statesRes] = await Promise.all([
                    axios.get(`${API_ENDPOINT}/user/all?page=0&size=2000`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    axios.get(`${API_ENDPOINT}/role/all?page=0&size=2000`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    axios.get(`${API_ENDPOINT}/lifecycle/state/all?page=0&size=2000`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    
                ]);

                const users = usersRes.data?.result?.items ?? [];
                const translatedData = translateFields(users);
                setData(translatedData);
                setFilteredData(translatedData);

                const rolesData = rolesRes.data?.result?.items ?? [];
                setRoles(rolesData);

                const statesData = statesRes.data?.result?.items ?? [];
                setStates(statesData); 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter((user) =>
                user.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Cédula.toString().includes(searchTerm)
            );
        }

        if (selectedRole) {
            filtered = filtered.filter((user) => user.Rol === selectedRole);
        }

        setFilteredData(filtered);
    }, [searchTerm, selectedRole, data]);

    const handleEdit = (item) => {
        setItemToEdit(item);
        setShowEditUser(true);
    };

    const handleUpdate = (updatedItem) => {
        const updatedData = data.map((item) =>
            item.Cédula === updatedItem.id ? { ...item, ...updatedItem } : item
        );
        setData(updatedData);
        setShowEditUser(false);
        getData();
    };

    const handleSave = (newItem) => {
        setData((prevData) => [...prevData, newItem]);
        getData();
    };

    useEffect(() => {
        getData();
    }, []);

    console.log(data);
    return (
        <>
            <div className="filtersContainer">
                <div className="filters">

                    <label>Rol:</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        placeholder="Filtrar por rol"
                        className="filter"
                    >
                        <option value="">Todos</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.description}>
                                {role.description}
                            </option>
                        ))}
                    </select>
                    <label>Buscar:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..."
                        className="filterSearch"
                    />
                </div>
                <div className="actions">
                    <button onClick={getData} className="iconRefresh">
                        <FaSyncAlt />
                    </button>
                    <Button onClick={() => setShowAddUser(true)} text="Añadir" />
                    <button onClick={handleExport} className="exportButton">
                        <RiFileExcel2Line className="ExportIcon" />
                        Exportar
                    </button>
                </div>
            </div>

            <DynamicTable
                columns={["Cédula", "Nombre", "Apellido", "Correo", "Télefono", "Rol", "Dirección", "Ciudad", "Oficina"]}
                data={filteredData}
                onEdit={handleEdit}
                showToggle={true}
                onToggle={() => { }}
                hideDeleteIcon={true}
            />

            {showAddUser && (
                <AddNewUserModal
                    show={showAddUser}
                    onClose={() => setShowAddUser(false)}
                    onSave={handleSave}
                />
            )}
            {showEditUser && itemToEdit && (
                <UpdateUserModal
                    show={showEditUser}
                    onClose={() => setShowEditUser(false)}
                    user={itemToEdit}
                    onSave={handleUpdate}
                />
            )}
        </>
    );
};
