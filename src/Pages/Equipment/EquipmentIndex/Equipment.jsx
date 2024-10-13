import React from 'react'
import { useEffect } from 'react';

export const Equipment=()=> {
  useEffect(() => {
    document.title = "Equipos";
}, []);
  return (
    <div>Equipos</div>
  )
}
