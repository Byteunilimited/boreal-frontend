import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import "./BulkUpload.css";
import { Button } from "../../Components";
import { Table } from "react-bootstrap";
import { RiUploadCloudLine } from "react-icons/ri";

export const BulkUpload = ({ show, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      readFiles(uploadedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      readFiles(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const readFiles = (file) => {
    const p = new Promise((resolve, reject) => {
      const filereader = new FileReader();
      filereader.readAsArrayBuffer(file);

      filereader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      filereader.onerror = (error) => {
        reject(error);
      };
    });

    p.then((d) => {
      console.log("Datos leídos del archivo:", d);
      setJsonData(d);
    }).catch((error) => {
      console.error("Error al leer el archivo:", error);
    });
  };

  const handleUpload = () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    // Validar jsonData antes de enviar
    const isValid = jsonData.every((item) => {
      console.log("Validando item:", item);
      return item.id && item.description && item.inventoryTypeId;
    });

    if (!isValid) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Convertir jsonData a CSV
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const csvData = XLSX.utils.sheet_to_csv(ws);

    // Crear FormData y enviar archivo CSV
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([csvData], { type: "text/csv" }),
      "bulk_upload.csv"
    );

    // Realizar la solicitud utilizando fetch
    fetch("https://boreal-api-xzsy.onrender.com/boreal/inventory/item/upload/csv", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => { 
            throw new Error(`Error en la solicitud: ${response.status} - ${text}`); 
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Datos enviados exitosamente.");
        onUploadSuccess(data);
        onClose();
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
        alert(`Ocurrió un error al enviar los datos: ${error.message}`);
      });
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["id", "description", "inventoryTypeId"],
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
