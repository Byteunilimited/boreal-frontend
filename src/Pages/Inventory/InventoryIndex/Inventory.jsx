import React, { useState, useEffect } from "react";
import { DynamicTable, Button } from "../../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./Inventory.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal } from "../ActionsInventory/AddItemModal/AddItemModal";
import { BulkUpload } from "../../../Layouts/BulkUpload/BulkUpload";
import { useAxios } from "../../../Contexts";
import { createSearchParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import { ModalIconCorrect, ModalIconMistake } from "../../../assets";
import { API_ENDPOINT } from "../../../util";
import { ConfirmationModal, Modal } from "../../../Layouts";
import { EditElementInventory } from "../ActionsInventory/EditElementInventory/EditElementInventory";
import { InventoryDepends } from "../InventoryDepends/InventoryDepends";

export const Inventory = () => {
  const [key, setKey] = useState("activos");
  const [error, setError] = useState(null);
  const { privateFetch } = useAxios();
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemType, setItemType] = useState("Repuesto");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [sucursal, setSucursal] = useState("");
  const [itemToActivate, setItemToActivate] = useState(null);
  const [itemToDeactivate, setItemToDeactivate] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Nueva función para obtener el tipo de inventario
const getInventoryTypes = async () => {
  try {
    const response = await privateFetch.get("/inventory/type/all", {
      headers: {
        "x-custom-header": "Boreal Api",
      },
    });

    if (response.status === 200) {
      const inventoryTypes = response.data.result.items;
      return inventoryTypes;
    } else {
      console.error("Error en la solicitud de tipos de inventario:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching inventory types:", error);
    return [];
  }
};

// Modificación en la función `getData`
const getData = async () => {
  try {
    const [itemsResponse, types] = await Promise.all([
      privateFetch.get("/inventory/item/all", {
        headers: {
          "x-custom-header": "Boreal Api",
        },
      }),
      getInventoryTypes(),
    ]);

    if (itemsResponse.status === 200) {
      const data = itemsResponse.data;

      if (data && data.result && Array.isArray(data.result.items)) {
        const translatedData = translateFields(data.result.items, types);
        setData(translatedData);
      } else {
        console.error("No se encontraron datos de inventario.");
      }
    } else {
      console.error("Error en la solicitud de inventario:", itemsResponse.statusText);
    }
  } catch (error) {
    console.error("Error fetching inventory data:", error);
  }
};

// Modificación en `translateFields` para incluir los tipos de inventario
const translateFields = (items, types) => {
  return items.map((item) => {
    const inventoryType = types.find((type) => type.id === item.inventoryTypeId);
    return {
      Código: item.id,
      Nombre: item.description,
      Tipo: inventoryType ? inventoryType.description : "Desconocido",
    };
  });
};

  const handleRefresh = () => {
    getData();
    setSearchTerm("");
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Inventario.xlsx");
  };


  const handleEdit = (item) => {
    setItemToEdit(item);
    setShowEditElementInventory(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationModal(true);
  };


  const filteredData = data.filter((item) => {
    const codigo = item.Código ? item.Código.toString() : "";
    const nombre = item.Nombre ? item.Nombre.toLowerCase() : "";
  
    // Filtra por tipo y luego por el término de búsqueda
    const matchesType = itemType === "" || item.Tipo === itemType;
    const matchesSearchTerm =
      codigo.includes(searchTerm) || nombre.includes(searchTerm.toLowerCase());
  
    return matchesType && matchesSearchTerm;
  });
  

  const handleFilter = (value, column) => {
    setSearchTerm((prev) => ({ ...prev, [column]: value }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSave = (newItem) => {
    setData([...data, newItem]);
    setFilteredData([...data, newItem]);
  };

  const handleBulkUploadSuccess = (newData) => {
    setData([...data, ...newData]);
    setFilteredData([...data, ...newData]);
  };


  useEffect(() => {
    document.title = "Inventario";
  }, []);

  useEffect(() => {
    getData();
  }, [handleSave]);


  return (
    <>
      <div>
        <div>
          <div className="inventory">
            <h1>Inventario</h1>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3 mt-4"
            >
              <Tab eventKey="inventario" title="Inventario">
                <div className="filtersContainer">
                  <div className="filters">
                    <label>Tipo:</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="filter"
                    >
                      <option value="">Todos</option>
                      {[...new Set(data.map((item) => item.Tipo))]
                        .filter(Boolean)
                        .map((Tipo, index) => (
                          <option key={index} value={Tipo}>
                            {Tipo}
                          </option>
                        ))}
                    </select>

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
                </div>
                <DynamicTable
                  columns={[
                    "Código",
                    "Nombre",
                    "Tipo"
                  ]}
                  data={filteredData}
                  onEdit={handleEdit}
                  onFilter={handleFilter}
                  hideDeleteIcon={true}
                />
              </Tab>
              <Tab eventKey="activos" title="Activos">
              <div className="filtersContainer">
                  <div className="filters">
                    <label>Tipo:</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="filter"
                    >
                      <option value="">Todos</option>
                      {[...new Set(data.map((item) => item.Tipo))]
                        .filter(Boolean)
                        .map((Tipo, index) => (
                          <option key={index} value={Tipo}>
                            {Tipo}
                          </option>
                        ))}
                    </select>

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
                </div>
                <DynamicTable
                  columns={[
                    "Código",
                    "Nombre",
                    "Tipo"
                  ]}
                  data={filteredData.filter(item => item.Estado === 'Activo')}
                  onEdit={handleEdit}
                  onFilter={handleFilter}
                  hideDeleteIcon={true}
                />

              </Tab>
              {/* Pestaña de Inactivos */}
              <Tab eventKey="inactivos" title="Inactivos">
                <div className="filtersContainer">
                  <div className="filters">
                    <label>Tipo:</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="filter"
                    >
                      <option value="">Todos</option>
                      {[...new Set(data.map((item) => item.Tipo))]
                        .filter(Boolean)
                        .map((Tipo, index) => (
                          <option key={index} value={Tipo}>
                            {Tipo}
                          </option>
                        ))}
                    </select>

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
                </div>

                <DynamicTable
                  columns={[
                    "Código",
                    "Nombre",
                    "Tipo"
                  ]}
                  data={filteredData.filter(item => item.Estado === 'Inactivo')}
                  onEdit={handleEdit}
                  onFilter={handleFilter}
                  hideDeleteIcon={true}
                />
              </Tab>

              <Tab eventKey="asiganciones" title="Existencias">
                Asignaciones
              </Tab>

              <Tab eventKey="vinculaciones" title="Vinculaciones">
                <InventoryDepends />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>


      {showModal && (
        <AddItemModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
      {showBulkUploadModal && (
        <BulkUpload
          show={showBulkUploadModal}
          onClose={() => setShowBulkUploadModal(false)}
          onSuccess={handleBulkUploadSuccess}
        />
      )}
      {showEditElementInventory && (
        <EditElementInventory
          show={showEditElementInventory}
          onClose={() => setShowEditElementInventory(false)}
          item={itemToEdit}
          onSave={handleSave}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          show={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={confirmationAction}
          message={confirmationMessage}
        />
      )}
      {showResultModal && (
        <Modal
          show={showResultModal}
          onClose={() => setShowResultModal(false)}
          icon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
          message={confirmationMessage}
        />
      )}
    </>
  );
};
