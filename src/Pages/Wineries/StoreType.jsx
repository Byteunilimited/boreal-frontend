import React, { useState, useEffect } from 'react';
import { Button, DynamicTable } from '../../Components';
import { useAxios } from '../../Contexts';
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import './Wineries.css';
import { AddNewStoreType } from './AddNewStoreType';
import { UpdateStoreType } from './UpdateStoreType';
export const StoreType = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { privateFetch } = useAxios();
    const [itemToEdit, setItemToEdit] = useState(null);
    const [showEditElementInventory, setShowEditElementInventory] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalStoreType, setShowModalStoreType] = useState(false);

    const translateFields = (items) => {
        return items.map((item) => ({
            Código: item.id,
            Nombre: item.description,

        }));
    };

    const getData = async () => {
        try {
            const response = await privateFetch.get("/location/store/type/all");
            if (response && response.data) {
                const translatedData = translateFields(response.data.result.item);
                setData(translatedData);
            } else {
                console.error("Response does not contain data:", response);
            }
        } catch (error) {
            console.error("Error fetching inventory data:", error);
        }
    };

    // Handle edit action
    const handleEdit = (item) => {
        setItemToEdit(item); // Establece el item a editar
        setShowModalStoreType(true); // Muestra el modal de actualización
    };

    // Handle delete action
    const handleDelete = (item) => {
        setItemToDelete(item);
        setShowConfirmationModal(true);
    };

    // Handle search input change
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleRefresh = () => {
        getData();
        setSearchTerm("");
    };

    const handleSave = (newItem) => {
        setData((prevData) => [...prevData, newItem]);
    };

    const handleUpdate = (updatedItem) => {
        setData((prevData) => prevData.map(item => item.Código === updatedItem.id ? {
            Código: updatedItem.id,
            Nombre: updatedItem.description
        } : item));
        set(false); 
    };


    useEffect(() => {
        getData();
    }, [handleSave]);

    // Filter data based on search term
    const filteredData = data.filter((item) => {
        const codigo = item.Código ? item.Código.toString() : "";
        const nombre = item.Nombre ? item.Nombre.toLowerCase() : "";
        return (
            codigo.includes(searchTerm) ||
            nombre.includes(searchTerm.toLowerCase())
        );
    });


    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tipos de Bodega");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "TposDeBodega.xlsx");
    };

    return (
        <>
            <div >

                <div className="filtersStore">
                    <label>Buscar:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Código o Nombre"
                        className="filterSearch"


                    />
                </div>
                <div className="actions">
                    <button onClick={handleRefresh} className="iconRefresh">
                        <FaSyncAlt />
                    </button>
                    <Button onClick={() => setShowModal(true)} text="Añadir" />

                    <button onClick={handleExport} className="exportButton">
                        <RiFileExcel2Line className="ExportIcon" />
                        Exportar
                    </button>

                </div>
                <DynamicTable
                    columns={["Código", "Nombre"]}
                    data={filteredData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showToggle={true}
                    onToggle={() => { }}
                    hideDeleteIcon={true}
                />
            </div>
            {showModal && (
                <AddNewStoreType
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    onSave={handleSave}
                />
            )}
           {showModalStoreType && itemToEdit && (
                <UpdateStoreType
                    show={showModalStoreType}
                    onClose={() => setShowModalStoreType(false)}
                    storeType={itemToEdit} 
                    onUpdate={handleUpdate} 
                />
            )}
        </>
    );
};
