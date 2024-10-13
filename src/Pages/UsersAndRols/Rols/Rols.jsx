import React, { useEffect, useState } from 'react';
import { DynamicTable } from '../../../Components';
import { RiFileExcel2Line } from "react-icons/ri";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useAxios } from '../../../Contexts';

export const Rols = () => {
    const [rols, setRols] = useState([]); // Lista completa de roles
    const [filteredRols, setFilteredRols] = useState([]); // Lista filtrada
    const { privateFetch } = useAxios();
    const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

    useEffect(() => {
        fetchRols();
    }, []);

    // Obtener los roles desde la API
    const fetchRols = async () => {
        try {
            const response = await privateFetch.get("/role/all");
            if (response.status === 200) {
                const rolesData = response.data.result.role;
                setRols(rolesData);
                setFilteredRols(rolesData); // Inicialmente no filtrado
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Filtrar roles por término de búsqueda
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = rols.filter((role) =>
            role.id.toString().includes(lowercasedSearchTerm) ||
            role.description.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredRols(filtered);
    }, [searchTerm, rols]);

    // Definición de columnas de la tabla
    const rolsColumns = ["Código", "Nombre"];

    // Formatear datos para la tabla
    const formattedRols = filteredRols.map((role) => ({
        Código: role.id,
        Nombre: role.description,
    }));

    // Manejadores de eventos de la tabla
    const handleEdit = (row) => {
        console.log("Edit:", row);
    };

    const handleDelete = (row) => {
        console.log("Delete:", row);
    };

    const handleToggle = (row) => {
        console.log("Toggle status:", row);
    };

    // Exportar a Excel
    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRols); // Usar roles filtrados
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "Roles.xlsx");
    };

    return (
        <>
            <label>Buscar:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Código o Nombre"
              className="filterSearchCities"
            />
            <button onClick={handleExport} className="exportButton">
                <RiFileExcel2Line className="ExportIcon" />
                Exportar
            </button>
            <DynamicTable
                columns={rolsColumns}
                data={formattedRols}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                showToggle={false}
            />
        </>
    );
};
