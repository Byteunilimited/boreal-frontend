import React from "react";

export const Button = ({ props }) => {
    let { style, action, text = 'Button', title, child, name } = props || {};
    child = child ? child : text;

    return (
        <button
            className={`${style || ''}Button`}
            onClick={action}
            data-title={title}
            name={name} >
            { React.isValidElement(child) ? child : text }
        </button>
    );
}
