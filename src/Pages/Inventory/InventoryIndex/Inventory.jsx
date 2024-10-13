import React, { useState, useEffect } from "react";
import { DynamicTable, Button} from "../../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./Inventory.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal} from "../ActionsInventory";
import { BulkUpload } from "../../../Layouts/BulkUpload/BulkUpload";
import { useAxios } from "../../../Contexts";
import { createSearchParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import { ModalIconCorrect, ModalIconMistake } from "../../../Assets";
import { API_ENDPOINT } from "../../../Util";
import { ConfirmationModal, Modal } from "../../../Layouts";
import { EditElementInventory } from "../ActionsInventory/EditElementInventory/EditElementInventory";

export const Inventory = () => {
  const [key, setKey] = useState("actives");
  const [error, setError] = useState(null);
  const { privateFetch } = useAxios();
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
      Código: item.id,
      Nombre: item.description,
      Tipo:
        item.inventoryType.id === 1
          ? "Repuesto"
          : item.inventoryType.id === 2
            ? "Producto"
            : "Desconocido",
      Existencias: item.stock,
      Estado:
        item.isEnable === true
          ? "Activo"
          : item.isEnable === false
            ? "Inactivo"
            : "Desconocido",
      // Sucursal: item.office.description,
    }));
  };

  const getData = async () => {
    try {
      const response = await privateFetch.get("/inventory/item/all");
      if (response && response.data) {
        console.log("API response data:", response.data.result.Inventory);
        const translatedData = translateFields(response.data.result.Inventory);
        console.log("Translated data:", translatedData);
        setData(translatedData);
        filterData(translatedData, searchTerm, itemType, sucursal);
      } else {
        console.error("Response does not contain data:", response);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const filterData = (data, searchTerm, itemType, sucursal) => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.Código.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (itemType) {
      filtered = filtered.filter((item) => item.Tipo === itemType);
    }
    if (sucursal) {
      filtered = filtered.filter((item) => item.Sucursal === sucursal);
    }

    setFilteredData(filtered);
  };

  const handleSucursalChange = (e) => {
    setSucursal(e.target.value);
  };

  const handleRefresh = () => {
    getData();
    setSearchTerm("");
  };

  const handleExport = () => {
    const itemsToExport = key === "actives" ? activeItems : inactiveItems;
    const worksheet = XLSX.utils.json_to_sheet(itemsToExport);
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
    console.log(item);
    setItemToEdit(item);
    setShowEditElementInventory(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationModal(true);
  };

  const handleActivate = (item) => {
    setConfirmationMessage(
      `¿Estás seguro de que deseas activar ${item.Nombre}?`
    );
    setItemToActivate(item);
    setShowConfirmationModal(true);
    setConfirmationAction(() => () => activateItem(item));
  };

  const handleDeactivate = (item) => {
    setConfirmationMessage(
      `¿Estás seguro de que deseas desactivar ${item.Nombre}?`
    );
    setItemToDeactivate(item);
    setShowConfirmationModal(true);
    setConfirmationAction(() => () => deactivateItem(item));
  };

  const activateItem = async (item) => {
    try {
      const response = await privateFetch.put(
        `${API_ENDPOINT}/inventory/item/enable?id=${item.Código}`
      );

      if (response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue activado exitosamente.");
        setShowConfirmationModal(true);
        const updatedData = data.map((d) =>
          d.Código === item.Código ? { ...d, Estado: "Activo" } : d
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setShowConfirmationModal(false);
      } else {
        setIsSuccessful(false);
        setConfirmationMessage("Ocurrió un error al activar el ítem.");
        setShowConfirmationModal(true);
      }
    } catch (error) {
      setIsSuccessful(false);
      setConfirmationMessage("Hubo un error al activar el ítem.");
      setShowConfirmationModal(true);
    }
  };

  const deactivateItem = async (item) => {
    try {
      const response = await privateFetch.delete(
        `${API_ENDPOINT}/inventory/item/disable?id=${item.Código}`
      );

      if (response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue desactivado exitosamente.");
        setShowConfirmationModal(true);
        const updatedData = data.map((d) =>
          d.Código === item.Código ? { ...d, Estado: "Inactivo" } : d
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setShowConfirmationModal(false);
      } else {
        setIsSuccessful(false);
        error("Ocurrió un error al desactivar el ítem.");
        setShowConfirmationModal(true);
      }
    } catch (error) {
      setIsSuccessful(false);
      error("Hubo un error al desactivar el ítem.");
      setShowConfirmationModal(true);
    }
  };

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

  const activeItems = filteredData.filter((item) => item.Estado === "Activo");
  const inactiveItems = filteredData.filter(
    (item) => item.Estado === "Inactivo"
  );

  useEffect(() => {
    document.title = "Inventario";
  }, []);

  useEffect(() => {
      getData();
  }, [handleSave]);

  useEffect(() => {
    filterData(data, searchTerm, itemType);
  }, [data, searchTerm, itemType]);

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
              <Tab eventKey="actives" title="Activos">
                <div className="filtersContainer">
                  <div className="filters">
                    <label>Tipo:</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="filter"
                    >
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
                    <button
                      onClick={() => setShowBulkUploadModal(true)}
                      className="exportButton">
                      Cargue masivo
                    </button>
                  </div>
                </div>
                <DynamicTable
                  columns={["Código", "Nombre", "Tipo", "Existencias", "Estado"]}
                  data={activeItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onFilter={handleFilter}
                  onToggle={handleDeactivate}
                  hideDeleteIcon={true}
                />

              </Tab>
              <Tab eventKey="Inactives" title="Inactivos">
                <div className="filtersContainer">
                  <div className="filters">
                    <label>Tipo:</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="filter"
                    >
                      {[...new Set(data.map((item) => item.Tipo))].map(
                        (Tipo, index) => (
                          <option key={index} value={Tipo}>
                            {Tipo}
                          </option>
                        )
                      )}
                    </select>

                    {/* <label>Sucursal:</label>
                    <select
                      value={sucursal}
                      onChange={handleSucursalChange}
                      className="filterOffice"
                    >
                      {[...new Set(data.map((item) => item.Sucursal))]
                        .filter(Boolean)
                        .map((Sucursal, index) => (
                          <option key={index} value={Sucursal}>
                            {Sucursal}
                          </option>
                        ))}
                    </select> */}
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
                    <button
                      onClick={() => setShowBulkUploadModal(true)}
                      className="exportButton"
                    >
                      Cargue masivo
                    </button>
                  </div>
                </div>
                <DynamicTable
                  columns={["Código", "Nombre", "Tipo", "Existencias", "Estado"]}
                  data={inactiveItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onFilter={handleFilter}
                  onToggle={handleActivate}
                  hideDeleteIcon={true}
                />
              </Tab>
              <Tab eventKey="asignations" title="Asignaciones"></Tab>
              <Tab eventKey="depends" title="Dependencias">
                <div className="filtersContainer">
                <div className="filters">
                <label>Crear dependencia:</label>
                    <select
                      value="Selecciona una dependencia"
                      onChange={(e) => setItemType(e.target.value)}
                      className="filter"
                    >
                          <option >
                          Condiciones
                          </option>

                          <option >
                         Estados
                          </option>
                          <option >
                          Circunstancia
                          </option>
                    </select>
                </div>
                </div>
                
              </Tab>
            </Tabs>
            {showModal && (
              <AddItemModal
                show={showModal}
                onClose={() => {
                  setShowModal(false);
                }}
                onSave={handleSave}
              />
            )}
            {showBulkUploadModal && (
              <BulkUpload
                show={showBulkUploadModal}
                onClose={() => setShowBulkUploadModal(false)}
                onUploadSuccess={handleBulkUploadSuccess}
              />
            )}

            {showEditElementInventory && (
              <EditElementInventory
                show={showEditElementInventory}
                item={itemToEdit}
                onClose={() => {
                  setShowEditElementInventory(false);
                }}
                onSave={handleSave}
              />
            )}
            <ConfirmationModal
              show={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onConfirm={confirmationAction}
              message={confirmationMessage}
            />
            {showConfirmationModal && (
              <Modal
                title={isSuccessful ? "Éxito" : "Error"}
                text={isSuccessful ? confirmationMessage : error}
                onClose={() => setShowConfirmationModal(false)}
                modalIcon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
                showCloseButton
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
