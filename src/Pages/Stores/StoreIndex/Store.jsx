import React, { useState, useEffect } from 'react';
import { Button, DynamicTable } from '../../../Components';
import { useAxios } from '../../../Contexts';
import { AddNewStoreModal } from '../ActionsStore/AddNewStore/AddNewStore';
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Tab, Tabs } from "react-bootstrap";
import './Store.css';
import { StoreType } from '../StoreType/StoreTypeIndex/StoreType';

export const Store = () => {
  const [key, setKey] = useState("store");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { privateFetch } = useAxios();
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const translateFields = (items) => {
    return items.map((item) => ({
      Código: item.id,
      Nombre: item.description,
      Teléfono: item.phone,
      Dirección: item.address,
      Email: item.email,
      Tipo: item.storeType ? item.storeType.description : "Desconocido",
      Ciudad: item.city ? `${item.city.description}, ${item.city.department.description}` : "Desconocido",
      Propietario: item.owner ? item.owner.businessName : "Desconocido",
      Oficina: item.office ? item.office.description : "Sin oficina",
    }));
  };

  const getData = async () => {
    try {
      const response = await privateFetch.get("/location/store/item/all");
      if (response && response.data) {
        const translatedData = translateFields(response.data.result.store);
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
    setItemToEdit(item);
    setShowEditElementInventory(true);
  };


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

  // Set the document title on component mount
  useEffect(() => {
    document.title = "Bodegas";
  }, []);

  // Fetch data on component mount
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

const handleCloseModal = () => {
  setShowModal(false);
};

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bodegas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Bodegas.xlsx");
  };

  return (
    <>
      <div className='storeMain'>
        <h2 className='storeTitle'>Bodegas</h2>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 mt-4">
          <Tab eventKey="store" title="Bodegas">
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
              columns={["Código", "Nombre", "Teléfono", "Dirección", "Email", "Tipo", "Ciudad", "Propietario", "Oficina"]}
              data={filteredData}
              onEdit={handleEdit}
              showToggle={true}
              onToggle={() => { }}
              hideDeleteIcon={true}
            />
          </Tab>
          <Tab eventKey="storeType" title="Tipos de Bodega">
            <StoreType />
          </Tab>
        </Tabs>
      </div>
      {showModal && (
        <AddNewStoreModal
          show={showModal}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

    </>
  );
};
