import React, { useState, useEffect } from 'react';
import { DynamicTable } from '../../Components';
import { useAxios } from '../../Contexts';

export default function () {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { privateFetch } = useAxios();
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditElementInventory, setShowEditElementInventory] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const translateFields = (items) => {
    return items.map((item) => ({
      Código: item.id,
      NIT: item.nit,
      Nombre: item.businessName,
      Teléfono: item.phone,
      Dirección: item.address,
      Email: item.email,
      Ciudad: item.city ? `${item.city.description}, ${item.city.department.description}` : "Desconocido"
    }));
  };

  // Fetch data from the API
  const getData = async () => {
    try {
      const response = await privateFetch.get("/location/owner/all"); 
      if (response && response.data) {
        const translatedData = translateFields(response.data.result.zone);
        setData(translatedData);
      } else {
        console.error("Response does not contain data:", response);
      }
    } catch (error) {
      console.error("Error fetching zone data:", error);
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

  // Handle save of new data
  const handleSave = (newItem) => {
    setData((prevData) => [...prevData, newItem]);
  };

  // Set the document title on component mount
  useEffect(() => {
    document.title = "Zonas";
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    getData();
  }, []);

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return (
      item.Código.toString().includes(searchTerm) ||
      item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.NIT.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div>
        <h2>Propietarios</h2>
        <label>Buscar:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Código, NIT o Nombre"
          className="filterSearch"
        />
        <DynamicTable
          columns={["Código", "NIT", "Nombre", "Teléfono", "Dirección", "Email", "Ciudad"]}
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hideDeleteIcon={true}
        />
      </div>
    </>
  );
}
