import React from 'react'
import { useEffect } from 'react';

export const Bills= () =>{
  useEffect(() => {
    document.title = "Facturas";
}, []);
  return (
    <div>Bills</div>
  )
}
