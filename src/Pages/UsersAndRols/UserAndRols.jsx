import React, { useState, useEffect } from "react";
import { DynamicTable } from "../../Components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./UserAndRols.css";
import { FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AddItemModal } from "../../Layouts";
import { BulkUpload } from "../../Layouts/BulkUpload/BulkUpload";
import axios from "axios";
import {
  Form,
  FormControl,
  InputGroup,
  Modal,
  Tab,
  Tabs,
  Button,
} from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import { MOCK_DATA } from "../../util";
import { usersMock } from "../../FalseData";

export const UserAndRols = () => {
  const [showAddUser, setSHowAddUser] = useState(false);
  const [key, setKey] = useState("users");
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ Código: "", Nombre: "" });
  const [itemType, setItemType] = useState("");
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    document.title = "Usuarios y roles";
}, []);

  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (MOCK_DATA) {
      setData(usersMock);
    } else {
      const { data } = await axios.get("API_ENDPOINT", {
        headers: { "x-custom-header": "Boreal Api" },
      });
      console.log(data);
    }
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
              <Button size="sm" variant="primary" onClick={getData}>
                <FaSyncAlt />
              </Button>
            </Col>
            <Col sm="auto">
              <Button size="sm" variant="primary">
                +
              </Button>
            </Col>
          </Row>
          <DynamicTable
            columns={Object.keys(data[0] || {})}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Tab>
        <Tab eventKey="roles" title="Roles"></Tab>
      </Tabs>
      <Modal show={showAddUser}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Usuario</Modal.Title>
        </Modal.Header>
        !loading ? (
        <Form onSubmit={() => {}} autoComplete="off">
          <Modal.Body>
            <Row>
              <Col sm>
                <label>Nombre</label>
                <FormControl size="sm" type="text" name="nombre" required />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>Apellido</label>
                <FormControl size="sm" type="text" name="apellido" required />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>Cédula</label>
                <FormControl size="sm" type="text" name="cifnif" required />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>Correo</label>
                <FormControl size="sm" type="email" name="correo" required />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>Contraseña</label>
                <InputGroup size="sm">
                  <Form.Control type="text" name="password" required />
                  <Button>Ojo</Button>
                </InputGroup>
              </Col>
            </Row>

            <Row>
              <Col sm>
                <label>Vigencia</label>
                <FormControl size="sm" type="date" name="vigencia" required />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>Dirección</label>
                <FormControl
                  as="textarea"
                  size="sm"
                  type="text"
                  name="direccion"
                  required
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => {}}>
              Cerrar
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
