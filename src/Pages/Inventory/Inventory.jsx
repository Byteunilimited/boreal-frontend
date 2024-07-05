import React, { useState, useEffect } from "react";
import { DynamicTable, Button, EditElementInventory } from "../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "../Inventory/Inventory.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal, ConfirmationModal } from "../../Layouts";
import { BulkUpload } from "../../Layouts/BulkUpload/BulkUpload";
import { useAxios } from "../../Contexts";
import { createSearchParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
export const Inventory = () => {
  const [key, setKey] = useState("actives");
  const { privateFetch } = useAxios();
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemType, setItemType] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  useEffect(() => {
    document.title = "Inventario";
}, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, itemType, data]);

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
    }));
  };

  const getData = async () => {
    try {
      const response = await privateFetch.get("/inventory/all");
      if (response && response.data) {
        console.log("API response data:", response.data.result.Inventory);
        const translatedData = translateFields(response.data.result.Inventory);
        setData(translatedData);
        setFilteredData(translatedData);
        const uniqueItemTypes = [
          ...new Set(translatedData.map((item) => item.Tipo)),
        ].filter(Boolean);
        if (uniqueItemTypes.length > 0) {
          setItemType(uniqueItemTypes[0]);
        }
      } else {
        console.error("Response does not contain data:", response);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const filterData = () => {
    let filtered = data;


    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.Código.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (itemType) {
      filtered = filtered.filter((item) => item.Tipo === itemType);
    }

    setFilteredData(filtered);
  };

  const handleRefresh = () => {
    getData();
    setSearchTerm("");
    const uniqueItemTypes = [...new Set(data.map((item) => item.Tipo))].filter(
      Boolean
    );
    if (uniqueItemTypes.length > 0) {
      setItemType(uniqueItemTypes[0]);
    }
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
    console.log(item);
    setItemToEdit(item);
    setShowEditElementInventory(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    try {
      await privateFetch.delete(
        `https://boreal-api.onrender.com/boreal/inventory/delete?id=${itemToDelete.Código}`
      );
      const updatedData = data.filter((d) => d.Código !== itemToDelete.Código);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      alert("Hubo un error al eliminar el item.");
    } finally {
      setShowConfirmationModal(false);
      setItemToDelete(null);
    }
  };

  const handleToggle = async (item) => {
    const isEnabling = item.Estado === "Inactivo";
    const apiUrl = isEnabling
      ? `https://boreal-api.onrender.com/boreal/inventory/item/enable?id=${item.Código}`
      : `https://boreal-api.onrender.com/boreal/inventory/item/disable?id=${item.Código}`;
  
    try {
      const response = await privateFetch.put(apiUrl);
      console.log("API response:", response);
  
      if (response.status === 200) {
        console.log("Estado actualizado con éxito");
        const updatedData = data.map((d) =>
          d.Código === item.Código ? { ...d, Estado: isEnabling ? "Activo" : "Inactivo" } : d
        );
        setData(updatedData);
        setFilteredData(updatedData);
      } else {
        console.error("Ocurrió un error inesperado.");
      }
    } catch (error) {
      console.error("Error al actualizar el estado del ítem:", error);
      alert("Hubo un error al actualizar el estado del ítem.");
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
                  </div>
                  <div className="search">
                    <label>Buscar:</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Buscar por Código o Nombre"
                      className="filter"
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
                  columns={[
                    "Código",
                    "Nombre",
                    "Tipo",
                    "Existencias",
                    "Estado",
                  ]}
                  data={activeItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onFilter={handleFilter}
                  onToggle={handleToggle}
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
                  columns={[
                    "Código",
                    "Nombre",
                    "Tipo",
                    "Existencias",
                    "Estado",
                  ]}
                  data={inactiveItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onFilter={handleFilter}
                  onToggle={handleToggle}
                  hideDeleteIcon={true}
                />
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
            {showConfirmationModal && (
              <ConfirmationModal
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={confirmDelete}
                message={`¿Estás seguro de que deseas eliminar el item ${itemToDelete?.Nombre}?`}
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
          </div>
        </div>
      </div>
    </>
  );
};
