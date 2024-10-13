import React, { useState, useEffect } from "react";
import { DynamicTable, Button } from "../../Components";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";

export const ActiveItemsTab = ({ data, handleRefresh, handleExport, handleEdit, handleDeactivate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemType, setItemType] = useState("Repuesto");

  const filteredData = data.filter(item => item.Estado === "Activo");

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      <div className="filtersContainer">
        <div className="filters">
          <label>Tipo:</label>
          <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="filter">
            {[...new Set(data.map(item => item.Tipo))].map((Tipo, index) => (
              <option key={index} value={Tipo}>{Tipo}</option>
            ))}
          </select>
          <label>Buscar:</label>
          <input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} placeholder="Código o Nombre" className="filterSearch" />
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
        data={filteredData}
        onEdit={handleEdit}
        onToggle={handleDeactivate}
        hideDeleteIcon={true}
      />
    </>
  );
};
