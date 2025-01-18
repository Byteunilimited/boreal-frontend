import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import "./BulkUpload.css";
import { Button } from "../../Components";
import { Table } from "react-bootstrap";
import { RiUploadCloudLine } from "react-icons/ri";
import { API_ENDPOINT } from "../../util";
import { useAxios } from "../../Contexts";
import Select from "react-select";



export const BulkUpload = ({ show, onClose, onUploadSuccess }) => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { axiosInstance } = useAxios();
  const [error, setError] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [states, setStates] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [healthStatuses, setHealthStatuses] = useState([]);
  const [formData, setFormData] = useState({});
  const { privateFetch } = useAxios();

  useEffect(() => {
    if (show) {
      fetchFilters();
    }
  }, [show]);

  const fetchFilters = async () => {
    try {
      const [conditionRes, stateRes, storeRes, ownerRes, healthRes] = await Promise.all([
        privateFetch.get("/lifecycle/condition/all?page=0&size=2000"),
        privateFetch.get("/lifecycle/state/all?page=0&size=2000"),
        privateFetch.get("/location/store/item/all?page=0&size=2000"),
        privateFetch.get("/location/owner/all?page=0&size=2000"),
        privateFetch.get("/lifecycle/health/all?page=0&size=2000"),

      ]);

      const conditions = conditionRes.data.result.items || [];
      const optionsConditions = conditions.map((condition) => ({
        value: condition.id,
        label: condition.description,
      }));
      setConditions(optionsConditions);


      const states = stateRes.data.result.items || [];
      const optionsStates = states.map((state) => ({
        value: state.id,
        label: state.description,
      }));
      setStates(optionsStates);


      const stores = storeRes.data.result.items || [];
      const optionsStores = stores.map((store) => ({
        value: store.id,
        label: `${store.description} - ${store.storeType.description}`,
      }));
      setStores(optionsStores);


      const owners = ownerRes.data.result.items || [];
      const optionsOwners = owners.map((owner) => ({
        value: owner.id,
        label: owner.name,
      }));
      setOwners(optionsOwners);

      const healthStatuses = healthRes.data.result.items || [];
      const optionsHealthStatuses = healthStatuses.map((healthStatus) => ({
        value: healthStatus.id,
        label: healthStatus.description,
      }));
      setHealthStatuses(optionsHealthStatuses);

    } catch (error) {
      console.error("Error fetching filters:", error);
      setError("Ocurrió un error al obtener los filtros.");
    }
  };

  const validateCSVHeaders = async (file) => {
    const text = await file.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",");
    const expectedHeaders = ["id", "description", "quantity"];
    return expectedHeaders.every((header) => headers.includes(header));
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        alert("Por favor selecciona un archivo.");
        return;
      }
  
      // Asegúrate de que es un archivo CSV
      if (!file.name.match(/\.csv$/)) {
        alert("Por favor selecciona un archivo válido (.csv).");
        return;
      }
  
      // Leer contenido del archivo
      const text = await file.text();
  
      // Validar cabeceras
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      if (lines.length === 0) {
        alert("El archivo está vacío.");
        return;
      }
  
      const headers = lines[0].split(",").map((header) => header.trim());
      const requiredHeaders = ["id", "description", "quantity"];
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  
      if (missingHeaders.length > 0) {
        alert(`El archivo no contiene las cabeceras requeridas: ${missingHeaders.join(", ")}`);
        return;
      }
  
      // Procesar el archivo si las cabeceras son válidas
      const data = lines.slice(1).map((line) => {
        const values = line.split(",");
        return headers.reduce((acc, header, index) => {
          acc[header] = values[index]?.trim() || "";
          return acc;
        }, {});
      });
  
      setJsonData(data);
      alert("Archivo cargado exitosamente.");
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
      alert("Ocurrió un error al procesar el archivo.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption
        ?
        ["conditionId", "healthId", "storeId", "ownerId", "stateId"].includes(field)
          ? Number(selectedOption.value)
          : selectedOption.value
        : null
    }));
  };

  const handleDownloadTemplate = () => {
    // Define la estructura de la plantilla
    const templateData = [
      { id: "", description: "", quantity: "" },
    ];
  
    // Convierte los datos a formato CSV
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(templateData));
  
    // Crea un Blob para generar el archivo CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    
    // Crea un enlace para descargar el archivo
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PlantillaInventario.csv"; // Nombre del archivo CSV
  
    // Simula un clic para descargar el archivo
    link.click();
  };
  

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Required to allow drop
  };

  const handleUploadItems = async () => {
    if (!fileInputRef.current?.files[0]) {
      alert("Por favor selecciona un archivo antes de continuar.");
      return;
    }

    const file = fileInputRef.current.files[0];
    const options = {
      itemConditionId: formData.conditionId || null,
      stateId: formData.stateId || null,
      statusId: formData.healthId || null,
      storeId: formData.storeId || null,
      ownerId: formData.ownerId || null
    };

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("options", new Blob([JSON.stringify(options)], { type: "application/json" }));

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/inventory/item/upload/csv`, {
        
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.text();
        alert("Carga completada: " + result);
        onUploadSuccess();
        onClose();
      } else {
        console.error("Error en la respuesta:", response);
        alert("Error al cargar el archivo: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al cargar los ítems:", error);
      alert("Error al cargar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlayBulk">
      <div className="modalContentBulk">
        <h2 className="modalTitleBulk">Cargue masivo</h2>
        <div className="modalBodyBulk">
          <Button
            onClick={handleDownloadTemplate}
            className="ButtonTemplateBulk"
            text="Descargar plantilla"
          />
          <div
            className="dropzoneBulk"
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <RiUploadCloudLine className="dropzoneIconBulk" />
            <p className="dropzoneTextBulk">
              Haz clic o arrastra el archivo a esta área para cargarlo
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hiddenInputBulk"
              ref={fileInputRef}
            />

          </div>
          {jsonData.length > 0 && (
            <div className="tableContainerBulk">
              <Table striped bordered hover className="dynamicTableBulk">
                <thead>
                  <tr>
                    {Object.keys(jsonData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jsonData.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        <div className="formGroup">
          <label>Bodega:</label>
          <Select
            options={stores}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "storeId")}
            placeholder="Seleccionar elemento"
            value={stores.find(option => option.value === formData.storeId)}
            isClearable
            className="selects"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "1em",
                textAlign: "start",
              }),
            }}
          />
        </div>

        <div className="formGroup">
          <label>Propietario:</label>
          <Select
            options={owners}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "ownerId")}
            placeholder="Seleccionar elemento"
            value={owners.find(option => option.value === formData.ownerId)}
            isClearable
            className="selects"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "1em",
                textAlign: "start",
              }),
            }}
          />
        </div>

        <div className="formGroup">
          <label>Calidad:</label>
          <Select
            options={healthStatuses}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "healthId")}
            placeholder="Seleccionar calidad"
            value={healthStatuses.find(option => option.value === formData.healthId)}
            isClearable
            className="selects"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "1em",
                textAlign: "start",
              }),
            }}
          />
        </div>

        <div className="buttonsBulk">
          <button
            onClick={handleUploadItems}
            disabled={jsonData.length === 0 || loading}
            className="ModalButtonSendBulk"
          >
            {loading ? "Cargando..." : "Guardar"}
          </button>
          <button onClick={onClose} className="ModalButtonCloseBulk">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
