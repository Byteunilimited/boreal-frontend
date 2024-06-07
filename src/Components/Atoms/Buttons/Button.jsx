import React from 'react';
import "../Buttons/Button.css"

export const Button = ( props) => {
  return (
<button {...props}  className="MainButton">
  {props?.text}
</button>
  )
}