import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { RiDeleteBin6Line, RiEditBoxLine } from "react-icons/ri";
import "./DynamicTables.css";

export const DynamicTable  = ({ columns, data, onEdit, onDelete}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState({ Código: "", Nombre: "" });
  const [showSearch, setShowSearch] = useState({ Código: false, Nombre: false });

  const pagesVisited = pageNumber * recordsPerPage;
  const pageCount = Math.ceil(data.length / recordsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setPageNumber(0);
  };

  const handleSearchIconClick = (column) => {
    setShowSearch((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleFilter = (value, column) => {
    setSearchTerm((prev) => ({ ...prev, [column]: value }));
    setPageNumber(0);
  };

  const filteredData = data.filter((item) => {
    return (
      item.Código.includes(searchTerm.Código) &&
      item.Nombre.toLowerCase().includes(searchTerm.Nombre.toLowerCase())
    );
  });

  return (
    <div className="tableContainer">
      <table className="dynamicTable">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {column}
                {["Código", "Nombre"].includes(column) && (
                  <>
                    <FaSearch onClick={() => handleSearchIconClick(column)} className="searchIcon" />
                    {showSearch[column] && (
                      <input
                        type="text"
                        placeholder={`Buscar ${column}`}
                        onChange={(e) => handleFilter(e.target.value, column)}
                        className="searchInput"
                      />
                    )}
                  </>
                )}
              </th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .slice(pagesVisited, pagesVisited + recordsPerPage)
            .map((row, rowIndex) => (
              <tr key={rowIndex} className="tableRow">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
                <td>
                  <RiEditBoxLine
                    className="actionIcon editIcon"
                    onClick={() => onEdit(row)}
                  />
                  <RiDeleteBin6Line
                    className="actionIcon deleteIcon"
                    onClick={() => onDelete(row)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="paginationContainer">
        <ReactPaginate
          previousLabel={<FaAngleLeft />}
          nextLabel={<FaAngleRight />}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination"}
          previousLinkClassName={"paginationLink"}
          nextLinkClassName={"paginationLink"}
          disabledClassName={"paginationLinkDisabled"}
          activeClassName={"paginationLinkActive"}
        />
        <div className="recordsPerPage">
          <select
            id="recordsPerPage"
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
          >
            <option value={10}>10/Page</option>
            <option value={20}>20/Page</option>
            <option value={30}>30/Page</option>
            <option value={40}>40/Page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

DynamicTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
