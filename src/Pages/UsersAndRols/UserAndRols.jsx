import { useEffect, useState } from "react";
import "./UserAndRols.css";
import { Tab, Tabs } from "react-bootstrap";
import { Usuarios } from "../../Components";

export const UserAndRols = () => {
  useEffect(() => {
    document.title = "Usuarios y roles";
  }, []);
  const [key, setKey] = useState('users');
  return (
    <>

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 mt-4"
      >
        <Tab eventKey="users" title="Usuarios">
          <Usuarios />
        </Tab>
        <Tab eventKey="roles" title="Roles">
          Roles
        </Tab>
      </Tabs>

    </>
  );
}