import React from 'react'
import './BaseSideBar.css'
import {Sidebar} from '../../Layouts';

export const BaseSideBar = (props) => {
    const { children } = props;
    return (
        <>
            <Sidebar />
            <div className="content">
                {children}
            </div>
        </>
    )
}
