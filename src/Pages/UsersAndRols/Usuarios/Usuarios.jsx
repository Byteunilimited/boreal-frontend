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
    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [offices, setOffices] = useState([]);

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "Usuarios.xlsx");
    };

    const translateFields = (items) => {
        return items.map((item) => ({
            Cédula: item.id,
            Nombre: item.name,
            Apellido: item.lastName,
            Correo: item.email,
            Télefono: item.phone,
            Rol: roles.find((role) => role.id === item.roleId)?.description || "Desconocido", 
            Dirección: item.address,
            Ciudad: cities.find((city) => city.id === item.cityId)?.description || "Desconocido",
            Oficina: offices.find((office) => office.id === item.officeId)?.description || "Desconocida",
        }));
    };
    console.log(translateFields(data));
    

    const getData = async () => {
        setLoading(true);
        try {
            if (MOCK_DATA === "true") {
                setData(usersMock);
            } else {
                const [usersRes, departmentsRes, citiesRes, rolesRes, officesRes] = await Promise.all([
                    axios.get(`${API_ENDPOINT}/user/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    axios.get(`${API_ENDPOINT}/location/department/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    axios.get(`${API_ENDPOINT}/location/city/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    axios.get(`${API_ENDPOINT}/role/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                    axios.get(`${API_ENDPOINT}/location/office/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                ]);

                const users = usersRes.data?.result?.items ?? [];
                setDepartments(departmentsRes.data?.result?.items ?? []);
                setCities(citiesRes.data?.result?.items ?? []);
                setRoles(rolesRes.data?.result?.items ?? []);
                setOffices(officesRes.data?.result?.items ?? []);

                const translatedData = translateFields(users);
                setData(translatedData);
                setFilteredData(translatedData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = data.filter((user) =>
                user.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Cédula.toString().includes(searchTerm)
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [searchTerm, data]);

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
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="filtersContainer">
                <div className="filters">
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
                    onSave={(newItem) => setData((prevData) => [...prevData, newItem])}
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
