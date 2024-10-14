import React, { useState } from 'react';
import { DynamicTable, Button } from '../../../Components';
import { useAxios } from '../../../Contexts';
import './InventoryDepends.css';
export const InventoryDepends = () => {
  const { privateFetch } = useAxios();
  const [itemType, setItemType] = useState('');
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ id: '', description: '' });
  const [showModal, setShowModal] = useState(false);

  const fetchConditions = async () => {
    try {
      const response = await privateFetch.get('/lifecycle/condition/all');
      handleResponse(response, 'entity');
    } catch (error) {
      console.error('Error fetching Condiciones:', error);
      setData([]);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await privateFetch.get('/lifecycle/state/all');
      handleResponse(response, 'entity');
    } catch (error) {
      console.error('Error fetching Estados:', error);
      setData([]);
    }
  };

  const fetchCircumstances = async () => {
    try {
      const response = await privateFetch.get('/lifecycle/status/all');
      handleResponse(response, 'entity');
    } catch (error) {
      console.error('Error fetching Circunstancia:', error);
      setData([]);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await privateFetch.get('/inventory/type/all');
      handleResponse(response, 'item');
    } catch (error) {
      console.error('Error fetching Tipo de elemento:', error);
      setData([]);
    }
  };

  const handleResponse = (response, key) => {
    if (response && response.data && response.data.result) {
      const resultData = Array.isArray(response.data.result[key]) ? response.data.result[key] : [];
      setData(resultData);
    } else {
      console.error('Error fetching data: unexpected response format');
      setData([]);
    }
  };

  const handleSelectChange = (value) => {
    setItemType(value);
    setNewItem({ id: '', description: '' }); 
    switch (value) {
      case 'Condiciones':
        fetchConditions();
        break;
      case 'Estados':
        fetchStates();
        break;
      case 'Circunstancia':
        fetchCircumstances();
        break;
      case 'Tipo':
        fetchTypes();
        break;
      default:
        setData([]);
    }
  };

  const handleAddItem = async () => {
    let endpoint = '';
    switch (itemType) {
      case 'Condiciones':
        endpoint = '/lifecycle/condition/create';
        break;
      case 'Estados':
        endpoint = '/lifecycle/state/create';
        break;
      case 'Circunstancia':
        endpoint = '/lifecycle/status/create';
        break;
      case 'Tipo':
        endpoint = '/inventory/type/create';
        break;
      default:
        console.error('No valid endpoint for the selected item type.');
        return;
    }

    try {
      await privateFetch.post(endpoint, newItem); 
      handleSelectChange(itemType);
      setNewItem({ id: '', description: '' }); 
      setShowModal(false); 
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleEdit = (row) => {
    console.log("Edit:", row);
};
  return (
    <>
        <div className='ContainerDepends'>
            <div className="filtersContainer">
                <div className="filters">
                    <label>Crear dependencia:</label>
                    <select
                        value={itemType}
                        onChange={(e) => handleSelectChange(e.target.value)}
                        className="filter"
                    >
                        <option value="">Selecciona</option>
                        <option value="Condiciones">Condiciones</option>
                        <option value="Estados">Estados</option>
                        <option value="Circunstancia">Circunstancia</option>
                        <option value="Tipo">Tipo de elemento</option>
                    </select>
                </div>

                {itemType && (
                    <div className="actions">
                        <Button onClick={() => setShowModal(true)} text="Añadir Dependencia" />
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modalDepends">
                    <div className="modalContentDepends">
                        <span className="closeModalDepends" onClick={() => setShowModal(false)}>&times;</span>
                        <h3>Añadir {itemType}</h3>
                        <div className="formGroupDepends">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="description"
                                value={newItem.description}
                                onChange={handleInputChange}
                                placeholder='Nombre'
                                required
                            />
                        </div>
                        <Button onClick={handleAddItem} text={`Añadir ${itemType}`} className='buttonModalDepends'/>
                    </div>
                </div>
            )}

            {itemType && data.length > 0 && (
                <div>
                    <DynamicTable
                        columns={["Código", "Nombre"]}
                        data={data.map((item) => ({
                            Código: item.id,
                            Nombre: item.description || item.name || 'Desconocido',
                        }))}
                        hideDeleteIcon={true}
                        hideEditIcon={true} 
                    />
                </div>
            )}
        </div>
    </>
  );
};  

