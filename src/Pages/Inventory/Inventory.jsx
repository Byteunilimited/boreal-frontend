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

export const Inventory = () => {
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
  useEffect(() => {
    const dummyData = [
      {
        Código: "001",
        Nombre: "Repuesto 1",
        Tipo: "Repuesto",
        Fecha: "2023-05-01",
        Cantidad: 10,
      },
      {
        Código: "002",
        Nombre: "Producto 1",
        Tipo: "Producto",
        Fecha: "2024-05-05",
        Cantidad: 15,
      },
      {
        Código: "003",
        Nombre: "Repuesto 2",
        Tipo: "Repuesto",
        Fecha: "2022-05-10",
        Cantidad: 8,
      },
      {
        Código: "004",
        Nombre: "Repuesto 3",
        Tipo: "Repuesto",
        Fecha: "2024-05-12",
        Cantidad: 20,
      },
      {
        Código: "005",
        Nombre: "Producto 2",
        Tipo: "Producto",
        Fecha: "2021-05-20",
        Cantidad: 5,
      },
      {
        Código: "006",
        Nombre: "Repuesto 4",
        Tipo: "Repuesto",
        Fecha: "2020-05-25",
        Cantidad: 12,
      },
      {
        Código: "007",
        Nombre: "Repuesto 1",
        Tipo: "Repuesto",
        Fecha: "2023-05-01",
        Cantidad: 10,
      },
      {
        Código: "008",
        Nombre: "Producto 1",
        Tipo: "Producto",
        Fecha: "2024-05-05",
        Cantidad: 15,
      },
      {
        Código: "009",
        Nombre: "Repuesto 2",
        Tipo: "Repuesto",
        Fecha: "2022-05-10",
        Cantidad: 8,
      },
      {
        Código: "010",
        Nombre: "Repuesto 3",
        Tipo: "Repuesto",
        Fecha: "2024-05-12",
        Cantidad: 20,
      },
      {
        Código: "011",
        Nombre: "Producto 2",
        Tipo: "Producto",
        Fecha: "2021-05-20",
        Cantidad: 5,
      },
      {
        Código: "012",
        Nombre: "Repuesto 4",
        Tipo: "Repuesto",
        Fecha: "2020-05-25",
        Cantidad: 12,
      },
      {
        Código: "013",
        Nombre: "Repuesto 1",
        Tipo: "Repuesto",
        Fecha: "2023-05-01",
        Cantidad: 10,
      },
      {
        Código: "014",
        Nombre: "Producto 1",
        Tipo: "Producto",
        Fecha: "2024-05-05",
        Cantidad: 15,
      },
      {
        Código: "015",
        Nombre: "Repuesto 2",
        Tipo: "Repuesto",
        Fecha: "2022-05-10",
        Cantidad: 8,
      },
      {
        Código: "016",
        Nombre: "Repuesto 3",
        Tipo: "Repuesto",
        Fecha: "2024-05-12",
        Cantidad: 20,
      },
      {
        Código: "017",
        Nombre: "Producto 2",
        Tipo: "Producto",
        Fecha: "2021-05-20",
        Cantidad: 5,
      },
      {
        Código: "018",
        Nombre: "Repuesto 4",
        Tipo: "Repuesto",
        Fecha: "2020-05-25",
        Cantidad: 12,
      },
      {
        Código: "019",
        Nombre: "Repuesto 1",
        Tipo: "Repuesto",
        Fecha: "2023-05-01",
        Cantidad: 10,
      },
      {
        Código: "020",
        Nombre: "Producto 1",
        Tipo: "Producto",
        Fecha: "2024-05-05",
        Cantidad: 15,
      },
      {
        Código: "021",
        Nombre: "Repuesto 2",
        Tipo: "Repuesto",
        Fecha: "2022-05-10",
        Cantidad: 8,
      },
      {
        Código: "022",
        Nombre: "Repuesto 3",
        Tipo: "Repuesto",
        Fecha: "2024-05-12",
        Cantidad: 20,
      },
      {
        Código: "023",
        Nombre: "Producto 2",
        Tipo: "Producto",
        Fecha: "2021-05-20",
        Cantidad: 5,
      },
      {
        Código: "024",
        Nombre: "Repuesto 4",
        Tipo: "Repuesto",
        Fecha: "2020-05-25",
        Cantidad: 12,
      },
    ];
    setData(dummyData);
    setFilteredData(dummyData);
  }, []);
  /*
  useEffect(() => {
    axios.get('API_ENDPOINT', { headers: { 'x-custom-header': 'Boreal Api' } })
      .then(response => {
        const apiData = response.data.result.Spare;
        const transformedData = {
          Código: apiData.id,
          Nombre: apiData.description,
          Tipo: "Spare",
          Fecha: new Date().toISOString().split("T")[0],
          Existencias: apiData.stock,
        };
        setData([transformedData]);
        setFilteredData([transformedData]);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);
  */
  useEffect(() => {
    filterData();
  }, [searchTerm, itemType, dateFrom, dateTo]);

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
                <label htmlFor="dateFrom">Fecha inicial:</label>
                <input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="date"
                  max={new Date().toISOString().split("T")[0]}
                />
                <label htmlFor="dateTo">Fecha final:</label>
                <input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="date"
                  max={new Date().toISOString().split("T")[0]}
                />
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
              columns={Object.keys(data[0] || {})}
              data={filteredData}
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
