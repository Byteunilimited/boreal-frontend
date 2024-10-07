import React, { useState, useEffect } from "react";
import { DynamicTable, Button } from "../../Components";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { ConfirmationModal } from "../../Layouts";
import { useAxios } from "../../Contexts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AddOfficeModal, UpdateOfficeModal } from "../../Components/addModals";
import './Oficces.css'

export const Offices = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { privateFetch } = useAxios();
  const [showAddOfficeModal, setShowAddOfficeModal] = useState(false);
  const [showUpdateOfficeModal, setShowUpdateOfficeModal] = useState(false); 
  const [selectedOffice, setSelectedOffice] = useState(null); 

  useEffect(() => {
    document.title = "Sucursales";
  }, []);

  const handleCloseModal = () => {
    setShowAddOfficeModal(false);
  };

  useEffect(() => {
    filterData(data, searchTerm);
  }, [data, searchTerm]);

  const getData = async () => {
    try {
      const response = await privateFetch.get("/location/office/all");
      if (response && response.data) {
        const translatedData = translateFields(response.data.result.entity);
        setData(translatedData);
        setFilteredData(translatedData);
      } else {
        console.error("Response does not contain data:", response);
      }
    } catch (error) {
      console.error("Error fetching offices data:", error);
    }
  };

  const handleSave = (newItem) => {
    setData([...data, newItem]);
    setFilteredData([...data, newItem]);
  };
  const handleUpdate = (updatedItem) => {
    const updatedData = data.map((item) =>
      item.Código === updatedItem.id ? translateFields([updatedItem])[0] : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
  };


  
  const translateFields = (items) => {
    return items.map((item) => ({
      Código: item.id,
      Nombre: item.description,
      Dirección: item.address,
      Teléfono: item.phone,
      Correo: item.email,
      Ciudad: item.city ? `${item.city.description}, ${item.city.department.description}` : "Desconocido",
      Propietario: item.owner ? item.owner.businessName : "Desconocido",
    }));
  };

  const filterData = (data, searchTerm) => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.Código.toString().includes(searchTerm) ||
          item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Propietario.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredData(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    getData();
    setSearchTerm("");
  };

  const handleEdit = (office) => {
    const officeToEdit = data.find((item) => item.Código === office.Código);
    if (officeToEdit) {
      setSelectedOffice({
        id: officeToEdit.Código,
        description: officeToEdit.Nombre,
        phone: officeToEdit.Teléfono,
        email: officeToEdit.Correo,
        address: officeToEdit.Dirección,
        ownerId: officeToEdit.Propietario, 
        cityId: officeToEdit.Ciudad, 
      });
      setShowUpdateOfficeModal(true);
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sucursales");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Sucursales.xlsx");
  };

  useEffect(() => {
      getData();
  }, [handleSave]);

  return (
    <div className="contentMainGeneral">
      <div className="inventory">
        <h1>Sucursales</h1>
        <div className="filtersContainer">
          <div className="filters">
            <label>Buscar:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar..."
              className="filterSearch"
            />
          </div>
          <div className="actions">
            <button onClick={handleRefresh} className="iconRefresh">
              <FaSyncAlt />
            </button>
            <Button onClick={() => setShowAddOfficeModal(true)} text="Añadir" />

            <button onClick={handleExport} className="exportButton">
              <RiFileExcel2Line className="ExportIcon" />
              Exportar
            </button>
          </div>
        </div>
        <DynamicTable
          columns={["Código", "Nombre", "Dirección", "Teléfono", "Correo", "Ciudad", "Propietario"]}
          data={filteredData}
          onEdit={handleEdit} 
          hideDeleteIcon={true}
        />
      </div>

      {showAddOfficeModal && (
        <AddOfficeModal
          show={showAddOfficeModal}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      {showUpdateOfficeModal && selectedOffice && (
        <UpdateOfficeModal
          show={showUpdateOfficeModal}
          onClose={() => setShowUpdateOfficeModal(false)}
          onUpdate={handleUpdate}
          officeData={selectedOffice} 
        />
      )}
    </div>
  );
};
