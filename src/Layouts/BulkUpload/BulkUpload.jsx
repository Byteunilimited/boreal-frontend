import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { RiUploadCloudLine } from "react-icons/ri";
import "./BulkUpload.css";
import { Button } from "../../Components";

export const BulkUpload = ({ show, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

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

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["id", "description",  "isEnable", "stock","inventoryTypeId",],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Cargue masivo.xlsx");
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2 className="modalTitle">Cargue masivo</h2>
        <div className="modalBody">
          <Button
            onClick={handleDownloadTemplate}
            className="ButtonTemplate"
            text="Descargar plantilla"
          />
          <div
            className="dropzone"
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <RiUploadCloudLine className="dropzoneIcon" />
            <p className="dropzoneText">
              Haz clic o arrastra el archivo a esta área para cargarlo
            </p>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hiddenInput"
              ref={fileInputRef}
            />
          </div>
        </div>
        <div className="modalFooter">
          <button
            onClick={handleUpload}
            disabled={!file}
            className="ModalButtonSend"
          >
            Cargar
          </button>
          <button onClick={onClose} className="ModalButtonClose">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
