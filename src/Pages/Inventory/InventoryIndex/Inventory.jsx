import React, { useState, useEffect } from "react";
import { DynamicTable, Button } from "../../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./Inventory.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal } from "../ActionsInventory";
import { BulkUpload } from "../../../Layouts/BulkUpload/BulkUpload";
import { useAxios } from "../../../Contexts";
import { createSearchParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import { ModalIconCorrect, ModalIconMistake } from "../../../assets";
import { API_ENDPOINT } from "../../../util";
import { ConfirmationModal, Modal } from "../../../Layouts";
import { EditElementInventory } from "../ActionsInventory/EditElementInventory/EditElementInventory";
import { InventoryDepends } from "../InventoryDepends/InventoryDepends";
import { Assignments } from "../Assignments/Assignments";

export const Inventory = () => {
  const [key, setKey] = useState("items");
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

  const translateFields = (items) => {
    return items.map((item) => ({
      Código: item.inventory.id,
      Nombre: item.inventory.description,
      Tipo: item.inventory.inventoryType.description,
      Propietario: item.owner.businessName,
      Bodega: item.store.description,
      Estado: item.state.description,
      Condición: item.itemCondition.description,
      Cantidad: item.quantity,
      Circunstancia: item.status.description,
    }));
  };

  const getData = async () => {
    try {
      const response = await privateFetch.get("/inventory/item/all", {
        headers: {
          "x-custom-header": "Boreal Api",
        },
      });

      if (response.status === 200) {
        const data = response.data;

        if (data && data.result && Array.isArray(data.result.inventory)) {
          const translatedData = translateFields(data.result.inventory);
          setData(translatedData);
        } else {
          console.error("No se encontraron datos de inventario.");
        }
      } else {
        console.error("Error en la solicitud de inventario:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
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
    console.log(item);
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
              className="mb-3 mt-4">
              <Tab eventKey="items" title="Inventario">
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
                    {/*<button
                      onClick={() => setShowBulkUploadModal(true)}
                      className="exportButton">
                      Cargue masivo
                    </button>*/}
                  </div>
                </div>
                <DynamicTable
                  columns={[
                    "Código",
                    "Nombre",
                    "Tipo",
                    "Propietario",
                    "Bodega",
                    "Estado",
                    "Condición",
                    "Cantidad",
                    "Circunstancia",
                  ]}
                  data={filteredData}
                  onEdit={handleEdit}
                  onFilter={handleFilter}
                  hideDeleteIcon={true}
                />

              </Tab>
              {/*               <Tab eventKey="asignaciones" title="Asignaciones">
                <Assignments />
              </Tab> */}
              <Tab eventKey="dependencias" title="Dependencias">
                <InventoryDepends />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modals */}
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
