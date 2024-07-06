import React from 'react'
import { useEffect } from 'react';

export const Wineries=()=> {
  useEffect(() => {
    document.title = "Bodegas";
}, []);
  return (
    <div>Bodegas</div>
  )
}
