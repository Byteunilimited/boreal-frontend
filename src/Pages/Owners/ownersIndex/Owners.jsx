import React, { useState, useEffect } from 'react';
import { Button, DynamicTable } from '../../../Components';
import { useAxios } from '../../../Contexts';
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AddNewOwner } from '../ActionsOwners/AddNewOwner/AddNewOwner';
import { UpdateOwner } from '../ActionsOwners/UpdateOwner/UpdateOwner';

export const Owners =  () =>{
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { privateFetch } = useAxios();
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [showEditOwner, setShowEditOwner] = useState(false);
  const [showUpdateOwner, setShowUpdateOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const translateFields = (items) => {
    return items.map((item) => ({
      Código: item.id,
      NIT: item.nit,
      Nombre: item.name,
      Teléfono: item.phone,
      Dirección: item.address,
      Email: item.email,
      Estado: item.stateId,
      Ciudad: item.cityId 

    }));
  };

  const getData = async () => {
    try {
      const response = await privateFetch.get("/location/owner/all");
      if (response && response.data) {
        const translatedData = translateFields(response.data.result.items);
        setData(translatedData);
      } else {
        console.error("Response does not contain data:", response);
      }
    } catch (error) {
      console.error("Error fetching zone data:", error);
    }
  };

  // Handle edit action
  const handleEdit = (owner) => {
    const ownerToEdit = data.find((item) => item.Código === owner.Código);
    if (ownerToEdit) {
      setSelectedOwner({
        id: ownerToEdit.Código,
        businessName: ownerToEdit.Nombre,
        phone: ownerToEdit.Teléfono,
        email: ownerToEdit.Correo,
        address: ownerToEdit.Dirección,
        cityId: ownerToEdit.Ciudad,
      });
      setShowUpdateOwner(true);
    }
  };

  const handleUpdate = (updatedItem) => {
    const updatedData = data.map((item) =>
      item.Código === updatedItem.id ? translateFields([updatedItem])[0] : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
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
  // Handle save of new data
  const handleSave = (newItem) => {
    setData((prevData) => [...prevData, newItem]);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Propietarios");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Propietarios.xlsx");
  };

  // Set the document title on component mount
  useEffect(() => {
    document.title = "Propietarios";
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    getData();
  }, [handleSave]);

  const filterData = data.filter((item) => {
    const codigo = item.Código ? item.Código.toString() : "";
    const nombre = item.Nombre ? item.Nombre.toLowerCase() : "";
    const nit = item.NIT ? item.NIT.toLowerCase() : "";
    return (
      codigo.includes(searchTerm) ||
      nombre.includes(searchTerm.toLowerCase())
      || nit.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div className='storeMain'>
        <h2 className='storeTitle'>Propietarios</h2>
        <div className="filtersContainer">
          <div className="filters">
            <label>Buscar:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar..."
              className="filterSearch"
            />
          </div>
          <div className="actions">
            <button onClick={handleRefresh} className="iconRefresh">
              <FaSyncAlt />
            </button>
            <Button onClick={() => setShowAddOwner(true)} text="Añadir" />

            <button onClick={handleExport} className="exportButton">
              <RiFileExcel2Line className="ExportIcon" />
              Exportar
            </button>
          </div>
        </div>
        <DynamicTable
          columns={["Código", "NIT", "Nombre", "Teléfono", "Dirección", "Email", "Estado", "Ciudad"]}
          data={filterData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hideDeleteIcon={true}
        />
      </div >
      {showAddOwner && (
        <AddNewOwner
          show={showAddOwner}
          onClose={() => setShowAddOwner(false)}
          onSave={handleSave}
        />
      )}
      {showEditOwner && itemToEdit && (
        <UpdateNewOwner
          show={showEditOwner}
          onClose={() => setShowEditOwner(false)}
          user={itemToEdit}
          onSave={handleUpdate}
        />
      )}
      {showUpdateOwner && selectedOwner && (
        <UpdateOwner
          show={showUpdateOwner}
          onClose={() => setShowUpdateOwner(false)}
          onUpdate={handleUpdate}
          ownerData={selectedOwner}
        />
      )}
    </>
  );
}
