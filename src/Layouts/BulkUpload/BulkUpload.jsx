import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { RiUploadCloudLine } from "react-icons/ri";
import "./BulkUpload.css";
import { Button } from "../../Components";
import { Table } from "react-bootstrap";

export const BulkUpload = ({ show, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    readFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    readFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      const formattedData = rows.map((row) => {
        let formattedRow = {};
        headers.forEach((header, index) => {
          let key = header;
          let value = row[index];
          switch (key) {
            case "estado":
              value = value === "active" ? true : value === "inactive" ? false : value;
              break;
            case "descripción":
              key = "description";
              break;
            case "tipo_de_inventario":
              key = "inventoryTypeId";
              break;
            default:
              break;
          }
          formattedRow[key] = value;
        });
        return formattedRow;
      });

      setJsonData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    axios
      .post("https://boreal-api.onrender.com/boreal/inventory/item/upload/csv", jsonData)
      .then((response) => {
        alert("Datos enviados exitosamente.");
        onUploadSuccess(response.data);
        onClose();
      })
      .catch((error) => {
        alert("Error al enviar los datos.");
      });
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["id", "descripción", "estado", "stock", "tipo_de_inventario"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Cargue masivo.xlsx");
  };

  if (!show) {
    return null;
  }

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
              onChange={handleFileChange}
              className="hiddenInputBulk"
              ref={fileInputRef}
            />
          </div>
          {jsonData.length > 0 && (
            <div className="tableContainer">
              <Table striped className="dynamicTable">
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
        <div className="buttons">
          <button
            onClick={handleUpload}
            disabled={!file}
            className="ModalButtonSendBulk"
          >
            Cargar
          </button>
          <button onClick={onClose} className="ModalButtonCloseBulk">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
