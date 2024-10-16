import React from "react";
import "./BaseSideBar.css";
import { NavBar, Sidebar } from "..";

export const BaseSideBar = (props) => {
  const { children } = props;
  return (
    <>

      <Sidebar />
      <main className="content">
                <NavBar />
                {children}
      </main>
    </>
  );
};
