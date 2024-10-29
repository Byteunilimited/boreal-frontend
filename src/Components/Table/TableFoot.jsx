import { useState } from "react";
import { optionSelect, paginationTags } from "./PaginationOptions";


export const TableFoot = ({ data }) => {
    const pagination = typeof paginationTags !== 'undefined' ? paginationTags : {};
    const lastPage = data.pages;
    const action = data.action;
    const [currentPage, setCurrentPage] = useState(0);

    const handleSelectChange = e => action(0, e.target.value);

    const handleActionButton = e => {
        let page = e.target.value;
        if(page == null || page == '') return;

        setCurrentPage(page);
        action(page, '');
    };

    return (
        <tr>
            {
                data &&
                    <td colSpan={ Object.keys(data.tags).length } >
                        <div id={'paging'}>
                            <div className="viewPerPage">
                                <label> {pagination.itemsPerPageTag || `Items per page:`} </label>
                                <span className="dropDown">
                                    <select onChange={handleSelectChange} defaultValue={'DEFAULT'} >
                                        {
                                            (() => {
                                                let options = [];
                                                Object.keys(optionSelect).map(function(key, index) {
                                                    options.push(
                                                        <option 
                                                            key={key}
                                                            value={optionSelect[key]}
                                                        >
                                                            { optionSelect[key] }
                                                        </option>
                                                    )
                                                })
                                                return options;
                                            }
                                            )()
                                        }
                                    </select>
                                </span>
                            </div>
                            <div className={'paginationContainer'}>
                                <button
                                    className={`btnPagination`}
                                    value={0}
                                    onClick={handleActionButton}
                                >
                                    {pagination.firstPageTag || `First`}
                                </button>
                                <button
                                    className={`btnPagination`}
                                    value={data.prev}
                                    onClick={handleActionButton}
                                >
                                    {pagination.previousPageTag || `Previous`}
                                </button>
                                {
                                    (() => {
                                        let pages = [];
                                        const maxVisiblePages = 5;
                                        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                        const endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

                                        if (startPage > 1) {
                                            pages.push(
                                                <button
                                                    className={`btnPagination ${currentPage === 0 ? 'isActive' : ''}`}
                                                    key={1}
                                                    value={0}
                                                    onClick={handleActionButton}
                                                >
                                                    1
                                                </button>
                                            );
                                            if (startPage > 2) {
                                                pages.push(<span key="ellipsis-start" className="ellipsis">...</span>);
                                            }
                                        } 

                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <button
                                                    className={`btnPagination ${i - 1 == currentPage ? 'isActive' : ''}`}
                                                    key={i}
                                                    value={i - 1}
                                                    onClick={handleActionButton}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }

                                        if (endPage < data.pages) {
                                            if (endPage < data.pages - 1) {
                                                pages.push(<span key="ellipsis-end" className="ellipsis">...</span>);
                                            }
                                            pages.push(
                                                <button
                                                    className={`btnPagination ${data.pages - 1 == currentPage ? 'isActive' : ''}`}
                                                    key={data.pages}
                                                    value={data.pages - 1}
                                                    onClick={handleActionButton}
                                                >
                                                    {data.pages}
                                                </button>
                                            );
                                        }

                                        return pages;
                                    })()
                                }
                                <button
                                    className={`btnPagination`}
                                    value={data.next}
                                    onClick={handleActionButton}
                                >
                                    {pagination.nextPageTag || `Next`}
                                </button>
                                <button
                                    className={`btnPagination`}
                                    value={lastPage - 1}
                                    onClick={handleActionButton}
                                >
                                    {pagination.endPageTag || `End`}
                                </button>
                            </div>
                        </div>
                    </td>
            } 
        </tr>
    );
}
