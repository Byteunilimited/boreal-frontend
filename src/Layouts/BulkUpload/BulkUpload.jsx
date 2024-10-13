import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import "./BulkUpload.css";
import { Button } from "../../Components";
import { Table } from "react-bootstrap";
import { RiUploadCloudLine } from "react-icons/ri";
import { API_ENDPOINT } from "../../Util";
import { useAxios } from "../../Contexts";

export const BulkUpload = ({ show, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const { privateFetch } = useAxios();
  const fileInputRef = useRef(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const validFileType = uploadedFile.type === 'text/csv' || uploadedFile.name.endsWith('.csv');
      if (!validFileType) {
        alert('Por favor, selecciona un archivo CSV válido.');
        return;
      }
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



  const handleDownloadTemplate = () => {
    // Crear los datos para la plantilla con solo id y description
    const templateData = [
      ["id", "description"], // Solo las columnas necesarias
    ];

    // Convertir los datos a CSV
    const csvContent = templateData.map(e => e.join(",")).join("\n");

    // Crear un blob con el contenido CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Crear un enlace para descargar el archivo CSV
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Cargue_masivo.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Actualización de la validación para comprobar solo los campos 'id' y 'description'
  const handleUpload = () => {
    if (!fileInputRef.current.files[0]) { // Usar la referencia aquí
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0], "lista_requestos.csv");
    formData.append("inventoryType", JSON.stringify({ id: 1 }));
    formData.append("options", JSON.stringify({
      itemConditionId: 1,
      stateId: 1,
      statusId: 1,
      storeId: 1,
      ownerId: 1,
    }));

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };
  
    fetch(`${API_ENDPOINT}/inventory/item/upload/csv`, requestOptions)
    .then(response => {
      if (response.status === 415) {
        throw new Error('Tipo de contenido no soportado. Verifica el formato del archivo.');
      } else if (!response.ok) {
        throw new Error('La respuesta de la red no fue correcta: ' + response.statusText);
      }
      return response.text(); // Cambia a response.text() si esperas texto
    })
    .then(result => {
      console.log(result);
      // Manejar el resultado exitoso aquí
    })
    .catch(error => {
      console.error('Hubo un problema con la operación de fetch:', error);
      alert(`Ocurrió un error: ${error.message}`);
    });
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
              onChange={handleFileChange}
              type="file"
              accept=".csv"
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
        {showResultModal && (
          <Modal
            icon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
            title={isSuccessful ? "¡Éxito!" : "Error"}
            message={isSuccessful ? "Los datos fueron cargados exitosamente." : "Hubo un error al cargar los datos."}
            onClose={() => setShowResultModal(false)}
          />
        )}

      </div>
    </div>
  );
};
