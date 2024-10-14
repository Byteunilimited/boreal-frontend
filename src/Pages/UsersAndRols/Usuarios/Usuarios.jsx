import { useEffect, useState } from "react"
import { FaSyncAlt } from "react-icons/fa";
import { Button, DynamicTable } from "../../../Components";
import { API_ENDPOINT, MOCK_DATA } from "../../../util";
import { Form, FormControl, InputGroup, Modal, Row, Col, FormSelect } from "react-bootstrap";
import { usersMock } from "../../../FalseData";
import axios from "axios";
import { useForm } from "../../../hooks";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AddNewUserModal } from "../ActionsUsersAndRols/AddNewUser/AddNewUser";
import { UpdateUserModal } from "../ActionsUsersAndRols/UpdateUser/UpdateUser";

export const Usuarios = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Estado para los datos filtrados
    const [searchTerm, setSearchTerm] = useState("");
    const [itemToEdit, setItemToEdit] = useState(null);
    const [loading, setLoading] = useState(false);
    const { serialize } = useForm();

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
            Rol: item.role?.description,
            Dirección: item.address,
            Ciudad: item.city ? `${item.city.description}, ${item.city.department.description}` : "Desconocido",
        }));
    };
    const handleSave = (newItem) => {
        setData((prevData) => [...prevData, newItem]);
    };



    const getData = async () => {
        setLoading(true);
        if (MOCK_DATA === "true") {
            setData(usersMock)
        } else {
            const [
                { data: users }
            ] = await Promise.all([
                axios.get(`${API_ENDPOINT}/user/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),

            ])
            const translatedData = translateFields(users?.result?.user ?? []);
            setData(translatedData);
            setFilteredData(translatedData);
        }
        setLoading(false);
    }


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
    }, [handleSave]);



    return (
        <>
            <div className="filtersContainer">
                <div className="filters">
                    <label>Buscar:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Actualizamos el valor de búsqueda
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
                columns={["Cédula", "Nombre", "Apellido", "Correo", "Télefono", "Rol", "Dirección", "Ciudad"]}
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
    )
}
