import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DepartmentsAndCities.css";
import { Button, DynamicTable } from "../../../Components";
import { API_ENDPOINT } from "../../../util";
import { Tab, Tabs } from "react-bootstrap";
import { RiFileExcel2Line } from "react-icons/ri";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const DepartmentsAndCities = () => {
  const [key, setKey] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [departmentNames, setDepartmentNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    document.title = "Departamentos y Ciudades";
    fetchDepartments();
    fetchCities();
  }, []); 

  useEffect(() => {
    if (key === "departments") {
      filterDepartments(searchTerm);
    } else if (key === "cities") {
      filterCities(searchTerm);
    }
  }, [departments, cities, searchTerm, key]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/location/department/all?page=0&size=33`, {
        headers: {
          "x-custom-header": "Boreal Api",
        },
      });
      if (response.data && response.data.result) {
        const deptData = response.data.result.items;
        setDepartments(deptData);
        const deptNames = deptData.reduce((acc, dept) => {
          acc[dept.id] = dept.description;
          return acc;
        }, {});
        setDepartmentNames(deptNames);
      } else {
        console.error("Error fetching departments data:", response);
      }
    } catch (error) {
      console.error("Error fetching departments data:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/location/city/all?page=0&size=1119`, {
        headers: {
          "x-custom-header": "Boreal Api",
        },
      });
      if (response.data && response.data.result) {
        setCities(response.data.result.items);
      } else {
        console.error("Error fetching cities data:", response);
      }
    } catch (error) {
      console.error("Error fetching cities data:", error);
    }
  };

  const filterDepartments = (searchTerm) => {
    if (!searchTerm) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((department) =>
        department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.id.toString().includes(searchTerm)
      );
      setFilteredDepartments(filtered);
    }
  };

  const filterCities = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((city) => {
        const departmentName = departmentNames[city.departmentId] || "";
        return (
          city.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.id.toString().includes(searchTerm) ||
          departmentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredCities(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleExport = () => {
    const dataToExport = key === "departments" ? formattedDepartments : formattedCities;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, key === "departments" ? "Departamentos" : "Ciudades");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, key === "departments" ? "Departamentos.xlsx" : "Ciudades.xlsx");
  };

  const departmentColumns = ["Código", "Nombre"];
  const cityColumns = ["Código", "Nombre", "Departamento"];

  const formattedDepartments = filteredDepartments.map((dept) => ({
    Código: dept.id,
    Nombre: dept.description,
  }));

  const formattedCities = filteredCities.map((city) => ({
    Código: city.id,
    Nombre: city.description,
    Departamento: departmentNames[city.departmentId] || "Desconocido",
  }));

  const handleEdit = (row) => {
    console.log("Edit:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
  };

  const handleToggle = (row) => {
    console.log("Toggle status:", row);
  };

  return (
    <>
      <div className="departments-container">
        <h1>Departamentos y Ciudades</h1>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 mt-4"
        >
          <Tab eventKey="departments" title="Departamentos">
            <label>Buscar:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Código o Nombre"
              className="filterSearchCities"
            />

            <button onClick={handleExport} className="exportButton">
              <RiFileExcel2Line className="ExportIcon" />
              Exportar
            </button>
            <DynamicTable
              columns={departmentColumns}
              data={formattedDepartments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              showToggle={false}
            />
          </Tab>

          <Tab eventKey="cities" title="Ciudades">
            <label>Buscar:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Código, Nombre o Departamento"
              className="filterSearchCities"
            />
            <button onClick={handleExport} className="exportButton">
              <RiFileExcel2Line className="ExportIcon" />
              Exportar
            </button>

            <DynamicTable
              columns={cityColumns}
              data={formattedCities}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              showToggle={false}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
};
