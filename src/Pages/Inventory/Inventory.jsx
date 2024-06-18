import React, { useState, useEffect } from "react";
import { DynamicTable, Button } from "../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import axios from "axios";
import "../Inventory/Inventory.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal } from "../../Layouts";
import { BulkUpload } from "../../Layouts/BulkUpload/BulkUpload";
import { useAxios } from "../../Contexts";

export const Inventory = () => {
  const { privateFetch } = useAxios();
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ Código: "", Nombre: "" });
  const [itemType, setItemType] = useState("");
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const apiUrl = "http://192.168.101.15:8080/boreal/spare/all";

  useEffect(() => {
    getData();
  }, [apiUrl]);

  useEffect(() => {
    filterData();
  }, [searchTerm, itemType, dateFrom, dateTo]);

  const getData = async () => {
    const {data} = await privateFetch.get(apiUrl);
    console.log(data.result.Spare)
    setData(data.result.Spare)
  };
  const filterData = () => {
    let filtered = data;

    if (searchTerm.Código) {
      filtered = filtered.filter((item) =>
        item.Código?.includes(searchTerm.Código)
      );
    }

    if (searchTerm.Nombre) {
      filtered = filtered.filter((item) =>
        item.Nombre?.toLowerCase().includes(searchTerm.Nombre.toLowerCase())
      );
    }

    if (itemType) {
      filtered = filtered.filter((item) => item.Tipo === itemType);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.Fecha) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        (item) => new Date(item.Fecha) <= new Date(dateTo)
      );
    }

    setFilteredData(filtered);
  };

  const handleRefresh = () => {
    const today = new Date();
    setSearchTerm({ Código: "", Nombre: "" });
    setItemType("");
    setDateFrom(today.toISOString().split("T")[0]);
    setDateTo(today.toISOString().split("T")[0]);
    setFilteredData(data);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Inventario.xlsx");
  };

  const handleEdit = (item) => {
    alert(`Editar: ${item.Nombre}`);
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm(`Eliminar: ${item.Nombre}`);
    if (confirmDelete) {
      setData(data.filter((d) => d.Código !== item.Código));
      setFilteredData(filteredData.filter((d) => d.Código !== item.Código));
    }
  };

  const handleFilter = (value, column) => {
    setSearchTerm((prev) => ({ ...prev, [column]: value }));
  };

  const handleSave = (newItem) => {
    setData([...data, newItem]);
    setFilteredData([...data, newItem]);
  };

  const handleBulkUploadSuccess = (newData) => {
    setData([...data, ...newData]);
    setFilteredData([...data, ...newData]);
  };

  return (
    <>
      <div>
        <div>
          <div className="inventory">
            <h1>Inventario</h1>
            <div className="filtersContainer">
              <div className="filters">
                <label>Tipo:</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="filter"
                >
                  <option value="">Todos</option>
                  {[...new Set(data.map((item) => item.Tipo))].map(
                    (Tipo, index) => (
                      <option key={index} value={Tipo}>
                        {Tipo}
                      </option>
                    )
                  )}
                </select>
                
              </div>
              <div className="actions">
                <button onClick={handleRefresh} className="iconRefresh">
                  <FaSyncAlt />
                </button>
                <Button onClick={() => setShowModal(true)} text="Añadir" />
                <button onClick={handleExport} className="exportButton">
                  <RiFileExcel2Line className="ExportIcon" />
                  Exportar a excel
                </button>
                <button
                  onClick={() => setShowBulkUploadModal(true)}
                  className="exportButton"
                >
                  Cargue masivo
                </button>
              </div>
            </div>
            <DynamicTable
              columns={["id", "description", "stock"]}
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFilter={handleFilter}
            />
            <AddItemModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSave={handleSave}
            />
            <BulkUpload
              show={showBulkUploadModal}
              onClose={() => setShowBulkUploadModal(false)}
              onUploadSuccess={handleBulkUploadSuccess}
            />
          </div>
        </div>
      </div>
    </>
  );
};
