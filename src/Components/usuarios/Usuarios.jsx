import { useEffect, useState } from "react"
import { FaSyncAlt } from "react-icons/fa";
import { DynamicTable } from "../Atoms";
import { API_ENDPOINT, MOCK_DATA } from "../../util";
import { Form, FormControl, InputGroup, Modal, Button, Row, Col, FormSelect } from "react-bootstrap";
import { usersMock } from "../../FalseData";
import axios from "axios";
import { useForm } from "../../hooks";

export const Usuarios = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState({ Código: "", Nombre: "" });
    const [itemType, setItemType] = useState("");
    const [dateFrom, setDateFrom] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editUser, setEditUser] = useState({});
    useEffect(() => {
        getData();
    }, []);
    const { serialize } = useForm();

    const translateFields = (items) => {
        return items.map((item) => ({
          Cédula: item.id,
          Nombre: item.name,
          Apellido: item.lastName,
          Correo:item.email,
          Télefono: item.phone,
          Rol:
            item.role.id === 1
              ? "Admin"
              : item.role.id === 2
              ? "Técnico"
              : item.role.id === 3
              ? "Cliente"
              : "Desconocido",
          Estado:
            item.isEnable === true
              ? "Activo"
              : item.isEnable === false
              ? "Inactivo"
              : "Desconocido",
        }));
      };

      
    const getData = async () => {
        setLoading(true);
        if (MOCK_DATA === "true") {
            setData(usersMock)
            setCities([]);
        } else {
            //TODO el backend tambien debe enviar los campos cityId y roleId
            const [
                { data: users },
                { data: cities },
                { data: roles}
            ] = await Promise.all([
                axios.get(`${API_ENDPOINT}/user/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                axios.get(`${API_ENDPOINT}/location/city/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
                axios.get(`${API_ENDPOINT}/role/all`, { headers: { 'x-custom-header': 'Boreal Api' } }),
            ])
            const translatedData = translateFields(users?.result?.user ?? []);
            setData(translatedData);
            setCities(cities?.result?.city ?? [])
            setRoles(roles?.result?.role ?? [])
        }
        setLoading(false);
    }
   

    useEffect(() => {
        //filterData();
    }, [searchTerm, itemType, dateFrom, dateTo]);

    const handleEdit = (item) => {
        console.log(item)
       setEditUser(item);
       setShowEditUser(true);
    };
    //! Pendiente a terminar
     const saveUser = async (ev) => {
        setLoading(true);
        ev.preventDefault();
        const formData = serialize(ev.target);
        const { data } = await axios.post(`${API_ENDPOINT}/user/create`, formData, { headers: { 'x-custom-header': 'Boreal Api' } });
        //TODO faltra como pedir el id de zona
        //TODO manejar la respuesta del backend para mostrar un mensaje de éxito o error
        console.log({ data })
        setShowAddUser(false);
        //Recargar data
        getData()
        setLoading(false);
    }
    //! Pendientea terminar
    const saveEditUser = async (ev) => {
        setLoading(true);
        ev.preventDefault();
        const formData = serialize(ev.target);
        const { data } = await axios.put(`${API_ENDPOINT}/user/update`, formData, { headers: { 'x-custom-header': 'Boreal Api' } });
        //TODO faltra como pedir el id de zona
        //TODO manejar la respuesta del backend para mostrar un mensaje de éxito o error
        console.log({ data })
        setEditUser({})
        setShowEditUser(false);
        //Recargar data
        getData()
        setLoading(false);
    }
    //! Pendiente a terminar
    const handleDelete = async (item) => {
        setLoading(true);
        const confirmDelete = window.confirm(`Eliminar: ${item.name}`);
        if (confirmDelete) {
            console.log(item)
            const { data } = await axios.delete(`${API_ENDPOINT}/user/delete`, { headers: { 'x-custom-header': 'Boreal Api' } });
            console.log({ data })
            //Recargar data
            getData()
        }
        setLoading(false);
    };

    return loading ? (
        <>
            Cargando ...
        </>
    ) : (
        <>
            <Row className="mb-2">
                <Col sm="auto">
                    <Button size="sm" variant="primary" onClick={getData}>
                        <FaSyncAlt />
                    </Button>
                </Col>
                <Col sm="auto">
                    <Button size="sm" variant="primary" onClick={() => setShowAddUser(true)}>
                        +
                    </Button>
                </Col>
            </Row>
            <DynamicTable
                columns={["Cédula", "Nombre", "Apellido", "Correo","Télefono", "Rol", "Estado"]}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Modal show={showAddUser} onHide={() => setShowAddUser(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Usuario</Modal.Title>
                </Modal.Header>
                {
                    !loading ? (
                        <Form onSubmit={saveUser} autoComplete="off">
                            <input hidden name="zoneId" defaultValue={1} />
                            <Modal.Body>
                                <Row>
                                    <Col sm>
                                        <label>Nombre</label>
                                        <FormControl size="sm" type="text" name="name" required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Apellido</label>
                                        <FormControl size="sm" type="text" name="lastName" required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Rol</label>
                                        <FormSelect size="sm" name="roleId" required>
                                            <option value="">Seleccione</option>
                                            {
                                                roles.map((rol) => (
                                                    <option key={rol.id} value={rol.id}>{rol.description}</option>
                                                ))
                                            }
                                        </FormSelect>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Teléfono</label>
                                        <FormControl size="sm" type="text" name="phone" required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Ciudad</label>
                                        <FormSelect size="sm" name="cityId" required>
                                            <option value="">Seleccione</option>
                                            {
                                                cities.map((city) => (
                                                    <option key={city.id} value={city.id}>{city.description} - {city?.department?.description}</option>
                                                ))
                                            }
                                        </FormSelect>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Cédula</label>
                                        <FormControl size="sm" type="text" name="id" required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Correo</label>
                                        <FormControl size="sm" type="email" name="email" required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Contraseña</label>
                                        <InputGroup size="sm">
                                            <Form.Control
                                                type="text"
                                                name="password"
                                                required
                                            />
                                            <Button>
                                                Ojo
                                            </Button>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Dirección</label>
                                        <FormControl
                                            as="textarea"
                                            size="sm"
                                            type="text"
                                            name="address"
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button size="sm" variant="secondary" onClick={() => setShowAddUser(false)}>
                                    Cerrar
                                </Button>
                                <Button type="submit" size="sm" variant="primary">
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    ) : (
                        <>
                            Cargando ...
                        </>
                    )
                }
            </Modal>
            <Modal show={showEditUser} onHide={() => setShowEditUser(false)} >                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                {
                    !loading ? (
                        <Form onSubmit={saveEditUser} autoComplete="off">
                            <input hidden name="zoneId" defaultValue={1} />
                            <Modal.Body>
                                <Row>
                                    <Col sm>
                                        <label>Nombre</label>
                                        <FormControl size="sm" type="text" name="name" required defaultValue={editUser?.name}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Apellido</label>
                                        <FormControl size="sm" type="text" name="lastName" required defaultValue={editUser?.lastName} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Teléfono</label>
                                        <FormControl size="sm" type="text" name="phone" required defaultValue={editUser?.phone}  />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Rol</label>
                                        <FormSelect size="sm" name="roleId" required>
                                            <option value="">Seleccione</option>
                                            {
                                                roles.map((rol) => (
                                                    <option key={rol.id} value={rol.id}>{rol.description}</option>
                                                ))
                                            }
                                        </FormSelect>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Ciudad</label>
                                        <FormSelect size="sm" name="cityId" required>
                                            <option value="">Seleccione</option>
                                            {
                                                cities.map((city) => (
                                                    <option key={city.id} value={city.id}>{city.description} - {city?.department?.description}</option>
                                                ))
                                            }
                                        </FormSelect>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Cédula</label>
                                        <FormControl size="sm" type="text" name="id" required defaultValue={editUser?.id} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Correo</label>
                                        <FormControl size="sm" type="email" name="email" required defaultValue={editUser?.email}  />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Contraseña</label>
                                        <InputGroup size="sm">
                                            <Form.Control
                                                type="text"
                                                name="password"
                                                required
                                                size="sm"
                                            />
                                            <Button>
                                                Ojo
                                            </Button>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <label>Dirección</label>
                                        <FormControl
                                            as="textarea"
                                            size="sm"
                                            type="text"
                                            name="address"
                                            required
                                            defaultValue={editUser?.address}
                                        />
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button size="sm" variant="secondary" onClick={() => setShowEditUser(false)}>
                                    Cerrar
                                </Button>
                                <Button type="submit" size="sm" variant="primary">
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    ) : (
                        <>
                            Cargando ...
                        </>
                    )
                }
            </Modal>
        </>
    )
}
