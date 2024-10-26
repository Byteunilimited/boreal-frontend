import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import "./BulkUpload.css";
import { Button } from "../../Components";
import { Table } from "react-bootstrap";
import { RiUploadCloudLine } from "react-icons/ri";
import { API_ENDPOINT } from "../../util";
import { useAxios } from "../../Contexts";

export const BulkUpload = ({ show, onClose, onUploadSuccess }) => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { axiosInstance } = useAxios();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Transform jsonData into the required structure
      const transformedData = jsonData.map((item) => ({
        id: item.Código,
        description: item.Nombre,
        inventoryTypeId: item.Tipo,
      }));

      setJsonData(transformedData); // Save transformed data
      onUploadSuccess(transformedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { Código: "", Nombre: "", Tipo: "" }, // Example structure
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "PlantillaInventario.xlsx");
  };

  const handleDrop = (event) => {
    event.preventDefault(); // Prevent default behavior
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({ target: { files } }); // Use the same file upload logic
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Required to allow drop
  };

  const handleUploadItems = async () => {
    setLoading(true);
    try {
      // Loop through the jsonData and send each item to the endpoint
      const promises = jsonData.map((item) =>
        axiosInstance.post(`${API_ENDPOINT}/inventory/item/create`, item)
      );
      await Promise.all(promises); // Wait for all requests to complete
      setLoading(false);
      alert("Carga completada exitosamente");
      onClose(); // Close modal after upload success
    } catch (error) {
      setLoading(false);
      console.error("Error uploading items:", error);
      alert("Error al cargar los ítems");
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
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hiddenInputBulk"
              ref={fileInputRef} // Add ref to input
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
        <div className="buttonsBulk">
          <button
            onClick={handleUploadItems}
            disabled={jsonData.length === 0 || loading}
            className="ModalButtonSendBulk"
          >
            {loading ? "Cargando..." : "Cargar"}
          </button>
          <button onClick={onClose} className="ModalButtonCloseBulk">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
