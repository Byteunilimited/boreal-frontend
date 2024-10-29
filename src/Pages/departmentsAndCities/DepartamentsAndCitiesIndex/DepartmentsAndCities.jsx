import "./DepartmentsAndCities.css";
import { useState, useEffect } from 'react';
import { Tab, Tabs } from "react-bootstrap";
import { Department } from "@/Pages/Location/Department/Department";
import { City } from "@/Pages/Location/City/City";


export const DepartmentsAndCities = () => {
    const [key, setKey] = useState("department");
  
    useEffect(() => {
        document.title = "Departamentos y Ciudades";
    }, []);
    
  
    return (
        <>
            <div className="departmentAndCityContainer">
                <h1>Departamentos y Ciudades</h1>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 mt-4"
                >
                    <Tab eventKey="department" title="Departamentos">
                        <Department/>
                    </Tab>
                    <Tab eventKey="city" title="Ciudades">
                        <City/>
                    </Tab>
               </Tabs>
            </div>
        </>
    );
};
