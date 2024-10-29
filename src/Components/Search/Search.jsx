import { useState, useEffect } from 'react';


export const Search = ({ action }) => {
    const searchAction = typeof action !== 'undefined' ? action : ()=>{};
    const [ search, setSearch ] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
    };

    useEffect(() => {
        searchAction(search);
    }, [search]); 
 
    return (
        <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Código o Nombre"
            className="search"
        />
    );
}
