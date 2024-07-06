import React from 'react'
import { useEffect } from 'react';

export const Procedures=()=> {
  useEffect(() => {
    document.title = "Procedimientos";
}, []);
  return (
    <div>Procedimientos</div>
  )
}
