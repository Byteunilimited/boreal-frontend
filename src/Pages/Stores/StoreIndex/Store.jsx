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
import { UpdateStore } from '../ActionsStore/UpdateStore/UpdateStore';


export const Store = () => {
  const [key, setKey] = useState("store");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { privateFetch } = useAxios();
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditStore, setShowEditStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const translateFields = async (items) => {
    const dataToReturn = [];
    for (const item of items) {
      dataToReturn?.push({
        Código: item.id,
        Nombre: item.description,
        Teléfono: item.phone,
        Dirección: item.address,
        Email: item.email,
        Tipo: await getType(item?.storeTypeId),
        Ciudad: await getCity(item?.cityId),
        //Propietario: await getOWNER(item?.),
        Oficina:await getOFFICE(item?.officeId),
      })
    }
    return dataToReturn;
  };

  const getData = async () => {
    try {
      const
        { data: stores } = await privateFetch.get("/location/store/item/all");
      if (stores) {
        console.log(stores)
        const translatedData = await translateFields(stores.result.items)
        setData(translatedData);
      } else {
        console.error("Response does not contain data:", response);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const getCity = async (id) => {
    const [
      { data: city }
    ] = await Promise.all([
      privateFetch.get(`/location/city/id?id=${id}`)
    ]);
    return city?.result?.items?.[0]?.description ?? ""
  }

  const getType = async (id) => {
    try {
      const [
        { data: type }
      ] = await Promise.all([
        privateFetch.get(`/location/store/type/id?id=${id}`)
      ]);
      return type?.result?.items?.[0]?.description ?? ""
    } catch (error) {
      return ""
    }
  }
const getOWNER = async (id) => {
  try {
    const [
      { data: owner }
    ] = await Promise.all([
      privateFetch.get(`/location/owner/id?id=${id}`)
    ]);
    return owner?.result?.items?.[0]?.description ?? ""
  } catch (error) {
    return ""
  }
}
const getOFFICE = async (id) =>{
  try {
    const [
      { data: office }
    ] = await Promise.all([
      privateFetch.get(`/location/office/id?id=${id}`)
    ]);
    return office?.result?.items?.[0]?.description ?? ""
  } catch (error) {
    return ""
  }
}
  // Handle edit action
  const handleEdit = (store) => {
    const storeToEdit = data.find((item) => item.Código === store.Código);
    if (storeToEdit) {
      setSelectedStore(storeToEdit);
      setShowEditStore(true);
    }
  };


  const handleUpdate = (updatedItem) => {
    const updatedData = data.map((item) =>
      item.Código === updatedItem.id ? translateFields([updatedItem])[0] : item
    );
    setData(updatedData);
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
    getData();
  }, []);



  // Filter data based on search term
  const filteredData = data?.filter((item) => {
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

      {showEditStore && (
        <UpdateStore
          show={showEditStore}
          onClose={() => setShowEditStore(false)}
          storeData={selectedStore} // Pass the selectedStore object
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};
