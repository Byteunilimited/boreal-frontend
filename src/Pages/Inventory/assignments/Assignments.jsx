import React, { useEffect, useState } from 'react'
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button, DynamicTable } from '../../../Components';
import { useAxios } from "../../../Contexts";
import { AsignedItemModal } from '../ActionsInventory/AsignedItemModal/AsignedItemModal';

export const Assignments = () => {
  const [dataAsigned, setDataAsigned] = useState([]);
  const [showModalAsigned, setShowModalAsigned] = useState(false);
  const [data, setData] = useState([]);
  const [itemType, setItemType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { privateFetch } = useAxios();
  const [itemState, setItemState] = useState("Habilitado");
  const translateFields = (items, types) => {
    return items.map((item) => {

      return {
        Código: item.id,
        Elemento: item.inventory.description,
        Bodega: `${item.store.warehouse.description} (${item.store.warehouse.storeType.description})`,
        Propietario: item.owner.name,
        Condición: item.condition.description,
        Estado: item.state.description,
        Calidad: item.health.description,
        Existencias: item.quantity
      };
    });
  };


  const getDataAsigned = async () => {
    try {
      const [itemsResponse, types] = await Promise.all([
        privateFetch.get("/inventory/stock/all?page=0&size=2000", {
          headers: {
            "x-custom-header": "Boreal Api",
          },
        }),
      ]);

      if (itemsResponse.status === 200) {
        const data = itemsResponse.data;

        if (data && data.result && Array.isArray(data.result.items)) {
          // Si no hay tipos, pasamos un array vacío
          const translatedDataAsigned = translateFields(data.result.items || []);
          setDataAsigned(translatedDataAsigned);
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

  const handleRefresh = () => {
    setSearchTerm("");
    setItemType("");
    setItemState("");
    getDataAsigned();
  };
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asignaciones");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Asignaciones.xlsx");
  };
  const handleEdit = (item) => {
    setItemToEdit(item);
    setShowEditElementInventory(true);
  };

  const filteredData = dataAsigned.filter((item) => {
    const codigo = item.Código ? item.Código.toString() : "";
    const nombre = item.Elemento ? item.Elemento.toLowerCase() : "";

    const matchesType = itemType === "" || item.Tipo === itemType;
    const matchesState = itemState === "" || item.Estado === itemState;
    const matchesSearchTerm =
      codigo.includes(searchTerm) || nombre.includes(searchTerm.toLowerCase());

    return matchesType && matchesState && matchesSearchTerm;
  });


  const handleFilter = (value, column) => {
    setSearchTerm((prev) => ({ ...prev, [column]: value }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  const handleSave = (newItem) => {
    setData([...data, newItem]);
  };
  useEffect(() => {
    getDataAsigned();
  }, [handleSave]);

  return (
    <>
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

          <label>Estado:</label>
          <select
            value={itemState}
            onChange={(e) => setItemState(e.target.value)}
            className="filter"
          >
            <option value="">Todos</option>
            {[...new Set(dataAsigned.map((item) => item.Estado))]
              .filter(Boolean)
              .map((Estado, index) => (
                <option key={index} value={Estado}>
                  {Estado}
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
          <Button onClick={() => setShowModalAsigned(true)} text="Nueva asignación" />
          <button onClick={handleExport} className="exportButton">
            <RiFileExcel2Line className="ExportIcon" />
            Exportar
          </button>

        </div>
      </div>

      <DynamicTable
        columns={[
          "Código",
          "Elemento",
          "Bodega",
          "Propietario",
          "Condición",
          "Estado",
          "Calidad",
          "Existencias",
        ]}
        data={filteredData}
        onEdit={handleEdit}
        onFilter={handleFilter}
        hideDeleteIcon={true}
      />

      {showModalAsigned && (
        <AsignedItemModal
          show={showModalAsigned}
          onClose={() => setShowModalAsigned(false)}
          onSave={handleSave}
        />
      )}
    </>
  )
}
