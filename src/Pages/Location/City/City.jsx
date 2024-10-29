import { useState, useEffect } from 'react';
import { API_ENDPOINT } from "@/util";
import { Search } from '@/Components/Search/Search';
import { Table } from "@/Components/Table/Table";


export const City = () => {
    const [search, setSearch] = useState('');
    const [pages, setPages] = useState(0);
    const [prev, setPrev] = useState(0);
    const [next, setNext] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [response, setData] = useState({});

    
    const action = (currentPage, size) => {
        setPageNumber(currentPage);
        if(size != null && size != '') setPageSize(size);
    }


    let head = ["Código", "Descripción", 'Departamento'];
    
    const dataProvider = response => {
        let dataFormated = [];
        let data = {};

        Object.keys(response).map(item => {
            data = {};
            Object.keys(response[item]).map(function(key, index) {
                if(key != 'department'){
                    data[key] = response[item][key];
                } else {
                    data[key] = response[item].department.description;
                }

            })

            dataFormated.push(data);
        })

        return dataFormated;
    }


    const getData = (url, pageNumber, pageSize) => {
        const method = {method: 'GET'};

        fetch(API_ENDPOINT + url + `?search=${search}&page=${pageNumber}&size=${pageSize}`, method)
            .then(response => response.json())
            .then(response => {
                let data = dataProvider(response.result.items);
                setData(data);
                setPages(response.info.pages);
                setPrev(response.info.prev);
                setNext(response.info.next);
                setPageSize(pageSize);
            })
            .catch(err => console.error(err)); 
    };


    const props = {
        head,
        data: response,
        foot: {
            pages,
            next,
            prev,
            tags: head,
            action
        }
    }


    useEffect(() => {
        getData('/location/city/find', pageNumber, pageSize);
    }, [search, pageNumber, pageSize]); 
  
  
    const searchAction = s => setSearch(s);
    
    return (
        <>
            <Search action={searchAction}/>
            <Table style='city' props={props}/>
        </>
    );
}
