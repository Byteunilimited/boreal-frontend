import React, { useState, useEffect } from "react";
import { DynamicTable, Button } from "../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./UserAndRols.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModalUser } from "../../Layouts";
import { BulkUpload } from "../../Layouts/BulkUpload/BulkUpload";
import { Form, FormControl, InputGroup, Modal, Tab, Tabs} from "react-bootstrap";
import { Row, Col, Container } from 'react-bootstrap';
import { MOCK_DATA } from "../../util";
import { usersMock } from "../../FalseData";
import { useAxios } from "../../Contexts";

export const UserAndRols = () => {
  const {privateFetch} = useAxios();
  const [showAddUser, setSHowAddUser] = useState(false)
  const [key, setKey] = useState('users');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ Código: "", Nombre: "" });
  const [itemType, setItemType] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(
  new Date().toISOString().split("T")[0]
  );

  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const apiUrl = 'https://boreal-api.onrender.com/boreal/user/all';

  useEffect(() => {
    getData();

  }, []);
  const translateFields = (items) => {
    return items.map(item => ({
      Código: item.id,
      Nombre: item.name,
      Apellido: item.lastName,
      Teléfono: item.phone,
      Dirección: item.address,
      Correo: item.email,
      Rol:"Admin",
      Estado:item.isEnable === true ? "Activo": item.isEnable === false ? "Inactivo" : "Desconocido"
    }));
  };
  const getData = async () => {
    const { data } = await privateFetch.get(apiUrl);
    const translatedData = translateFields(data.result.User);
    setData(translatedData);
    setFilteredData(translatedData);
  };

  useEffect(() => {
    //filterData();
  }, [searchTerm, itemType, dateFrom, dateTo]);
  const handleRefresh = () => {
    const today = new Date();
    setSearchTerm({ Código: "", Nombre: "" });
    setItemType("");
    setDateFrom(today.toISOString().split("T")[0]);
    setDateTo(today.toISOString().split("T")[0]);
    //setFilteredData(data);
  };
  const handleEdit = (item) => {
    alert(`Editar: ${item.Nombre}`);
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm(`Eliminar: ${item.Nombre}`);
    if (confirmDelete) {
      setData(data.filter((d) => d.Código !== item.Código));
      // setFilteredData(filteredData.filter((d) => d.Código !== item.Código));
    }
  };

  const handleFilter = (value, column) => {
    setSearchTerm((prev) => ({ ...prev, [column]: value }));
  };
  const handleSave = (newItem) => {
    setData([...data, newItem]);
    // setFilteredData([...data, newItem]);
  };

  const handleBulkUploadSuccess = (newData) => {
    setData([...data, ...newData]);
    //setFilteredData([...data, ...newData]);
  };

  return (
    <>

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 mt-4"
      >

        <Tab eventKey="users" title="Usuarios">
          <Row className="mb-2"> 
            <Col sm="auto">
              <button size="sm" variant="primary" onClick={getData} className="iconRefresh">
                <FaSyncAlt />
              </button>
            </Col>
            <Col sm="auto">
            <Button onClick={() => setShowModal(true)} text="Añadir" />
            </Col>
          </Row>
          <DynamicTable
            columns={["Código", "Nombre", "Apellido", "Teléfono", "Dirección", "Correo","Rol", "Estado"]}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Tab>
        <Tab eventKey="roles" title="Roles">

        </Tab>
        {showModal && (
              <AddItemModalUser
                show={showModal}
                onClose={() => {
                  setShowModal(false);
                }}
                onSave={handleSave}
              />
            )}
      </Tabs>

    </>
  );
}

