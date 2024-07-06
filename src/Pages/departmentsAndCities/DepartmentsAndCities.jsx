import React from 'react'
import { useEffect } from 'react';

export const DepartmentsAndCities=() => {
  useEffect(() => {
    document.title = "Departamentos y ciudades";
}, []);
  return (
    <div>departamentos y ciudades</div>
  )
}
