import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiEdit2Line, RiCloseFill } from "react-icons/ri";
import Pagination from "react-bootstrap/Pagination";
import Table from "react-bootstrap/Table";
import "./DynamicTables.css";

export const DynamicTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onToggle,
  showToggle,
  hideDeleteIcon,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const pagesVisited = pageNumber * recordsPerPage;
  const pageCount = Math.ceil(data.length / recordsPerPage);

  const changePage = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value, 10));
    setPageNumber(0);
  };

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
            {columns?.map((column, index) =>  (
              <th key={index} className="bg-blue">
                {column}
              </th>
            ))}
            {showToggle && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data
            .slice(pagesVisited, pagesVisited + recordsPerPage)
            .map((row, rowIndex) => (
              <tr key={rowIndex} className="tableRow">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column === "Estado" && showToggle ? (
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={row[column] === "Activo"}
                          onChange={() => onToggle(row)}
                        />
                        <span className="slider round"></span>
                      </label>
                    ) : (
                      row[column]
                    )}
                  </td>
                ))}
                {showToggle && (
                  <td>
                    <RiEdit2Line
                      className="actionIcon editIcon"
                      onClick={() => onEdit(row)}
                    />
                    {!hideDeleteIcon && (
                      <RiCloseFill
                        className="actionIcon deleteIcon"
                        onClick={() => onDelete(row)}
                      />
                    )}
                  </td>
                )}
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
            <option value={10}>10 por pagina</option>
            <option value={20}>20 por pagina</option>
            <option value={40}>30 por pagina</option>
            <option value={50}>40 por pagina</option>
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
  onToggle: PropTypes.func.isRequired,
  showToggle: PropTypes.bool,
  hideDeleteIcon: PropTypes.bool,
};

DynamicTable.defaultProps = {
  showToggle: true,
  hideDeleteIcon: false,
};
