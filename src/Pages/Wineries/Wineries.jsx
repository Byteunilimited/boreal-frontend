import React, { useState, useEffect } from 'react';
import { Button, DynamicTable } from '../../Components';
import { useAxios } from '../../Contexts';
import { AddNewStoreModal } from './AddNewStore';
export const Wineries = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { privateFetch } = useAxios();
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Translate inventory items into a readable format for the table
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

  // Fetch data from the API
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

  // Handle delete action
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationModal(true);
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
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
  }, []);

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return (
      item.Código.toString().includes(searchTerm) ||
      item.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div>
        <h2>Bodegas</h2>
        <label>Buscar:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Código o Nombre"
          className="filterSearch"
        />
        <Button onClick={() => setShowModal(true)} text="Añadir" />
        <DynamicTable
          columns={["Código", "Nombre", "Teléfono", "Dirección", "Email", "Tipo", "Ciudad", "Propietario", "Oficina"]}
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hideDeleteIcon={false}
        />
      </div>
      {showModal && (
              <AddNewStoreModal
                show={showModal}
                onClose={() => {
                  setShowModal(false);
                }}
                onSave={handleSave}
              />
            )}
    </>
  );
};
