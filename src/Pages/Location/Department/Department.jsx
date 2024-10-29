import { useState, useEffect } from 'react';
import { API_ENDPOINT } from "@/util";
import { Search } from '@/Components/Search/Search';
import { Table } from "@/Components/Table/Table";


export const Department = () => {
    const [search, setSearch] = useState('');
    const [pages, setPages] = useState(0);
    const [prev, setPrev] = useState(0);
    const [next, setNext] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [data, setData] = useState([]);

    
    const action = (currentPage, size) => {
        setPageNumber(currentPage);
        if(size != null && size != '') setPageSize(size);
    }


    let head = ["Código", "Descripción"];
    
    const props = {
        head,
        data,
        foot: {
            pages,
            next,
            prev,
            tags: head,
            action
        }
    }


    const getData = (url, pageNumber, pageSize) => {
        const method = {method: 'GET'};
        
        fetch(API_ENDPOINT + url + `?search=${search}&page=${pageNumber}&size=${pageSize}`, method)
            .then(response => response.json())
            .then(response => {
                setData(response.result.items);
                setPages(response.info.pages);
                setPrev(response.info.prev);
                setNext(response.info.next);
                setPageSize(pageSize);
            })
            .catch(err => console.error(err)); 
    };

   
    useEffect(() => {
        getData('/location/department/find', pageNumber, pageSize);
    }, [search, pageNumber, pageSize]); 
  

    const searchAction = s => setSearch(s);
  
    return (
        <>
            <Search action={searchAction}/>
            <Table style='department' props={props}/>
        </>
    );
}
