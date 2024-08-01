import React, { useState, useEffect } from "react";
import { DynamicTable, Button, EditElementInventory } from "../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "../Inventory/Inventory.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal, ConfirmationModal, Modal } from "../../Layouts";
import { BulkUpload } from "../../Layouts/BulkUpload/BulkUpload";
import { useAxios } from "../../Contexts";
import { createSearchParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";

export const Offices = () => {
  const [key, setKey] = useState("actives");
  const { privateFetch } = useAxios();
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemType, setItemType] = useState("Repuesto");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [sucursal, setSucursal] = useState("");
  const [itemToActivate, setItemToActivate] = useState(null);
  const [itemToDeactivate, setItemToDeactivate] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  useEffect(() => {
    document.title = "Inventario";
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterData(data, searchTerm, itemType);
  }, [data, searchTerm, itemType]);

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
        console.log("Translated data:", translatedData); // Añadir este log
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

    console.log("Filtered data:", filtered);

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
        `https://boreal-api-xzsy.onrender.com/boreal/inventory/item/enable?id=${item.Código}`
      );

      if (response.status === 200) {
        console.log("Ítem activado con éxito");
        const updatedData = data.map((d) =>
          d.Código === item.Código ? { ...d, Estado: "Activo" } : d
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setShowConfirmationModal(false);
      } else {
        console.error("Ocurrió un error al activar el ítem.");
      }
    } catch (error) {
      console.error("Error al activar el ítem:", error);
      alert("Hubo un error al activar el ítem.");
    }
  };

  const deactivateItem = async (item) => {
    try {
      const response = await privateFetch.delete(
        `https://boreal-api-xzsy.onrender.com/boreal/inventory/item/disable?id=${item.Código}`
      );

      if (response.status === 200) {
        console.log("Ítem desactivado con éxito");
        const updatedData = data.map((d) =>
          d.Código === item.Código ? { ...d, Estado: "Inactivo" } : d
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setShowConfirmationModal(false);
      } else {
        console.error("Ocurrió un error al desactivar el ítem.");
      }
    } catch (error) {
      console.error("Error al desactivar el ítem:", error);
      alert("Hubo un error al desactivar el ítem.");
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

console.log("Active items:", activeItems); 
console.log("Inactive items:", inactiveItems); 
  return (
    <>
      <div>
        <div>
          <div className="inventory">
            <h1>Sucursales</h1>
                <div className="filtersContainer">
                  <div className="filters">

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
          </div>
        </div>
      </div>
    </>
  );
};
