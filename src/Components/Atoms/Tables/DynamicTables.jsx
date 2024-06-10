import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";
import { RiDeleteBin6Line, RiEditBoxLine } from "react-icons/ri";
import Pagination from "react-bootstrap/Pagination";
import "./DynamicTables.css";
import Table from "react-bootstrap/Table";

export const DynamicTable = ({ columns, data, onEdit, onDelete }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState({ Código: "", Nombre: "" });
  const [showSearch, setShowSearch] = useState({
    Código: false,
    Nombre: false,
  });

  const pagesVisited = pageNumber * recordsPerPage;
  const pageCount = Math.ceil(data.length / recordsPerPage);

  const changePage = (pageNumber) => {
    setPageNumber(pageNumber);
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

  const renderPaginationItems = () => {
    let items = [];

    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === pageNumber + 1}
            onClick={() => changePage(i - 1)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      if (pageNumber > 2) {
        items.push(
          <Pagination.Item key={1} onClick={() => changePage(0)}>
            1
          </Pagination.Item>,
          <Pagination.Ellipsis key="start-ellipsis" />
        );
      }

      const startPage = Math.max(pageNumber - 2, 1);
      const endPage = Math.min(pageNumber + 2, pageCount);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === pageNumber + 1}
            onClick={() => changePage(i - 1)}
          >
            {i}
          </Pagination.Item>
        );
      }

      if (pageNumber < pageCount - 3) {
        items.push(
          <Pagination.Ellipsis key="end-ellipsis" />,
          <Pagination.Item
            key={pageCount}
            onClick={() => changePage(pageCount - 1)}
          >
            {pageCount}
          </Pagination.Item>
        );
      }
    }

    return items;
  };

  return (
    <div className="tableContainer">
      <Table striped className="dynamicTable">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="bg-blue">
                {column}
                {["Código", "Nombre"].includes(column) && (
                  <>
                    <FaSearch
                      onClick={() => handleSearchIconClick(column)}
                      className="searchIcon"
                    />
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
      </Table>
      <div className="paginationContainer">
        <Pagination className="border-radius.sm">
          <Pagination.First onClick={() => changePage(0)} />
          <Pagination.Prev
            onClick={() => changePage(Math.max(pageNumber - 1, 0))}
          />
          {renderPaginationItems()}
          <Pagination.Next
            onClick={() => changePage(Math.min(pageNumber + 1, pageCount - 1))}
          />
          <Pagination.Last onClick={() => changePage(pageCount - 1)} />
        </Pagination>
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
