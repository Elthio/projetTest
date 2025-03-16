import React, { useState } from 'react';
import '../../styles/List.css';

/**
 * Generic list component that can be used for any entity
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data items to display
 * @param {Array} props.columns - Array of column definitions
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onAdd - Function to call when add button is clicked
 * @param {String} props.title - Title of the list
 */
const ListComponent = ({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onAdd, 
  title = 'Liste' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting when a column header is clicked
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return columns.some((column) => {
      const value = item[column.key];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data based on sort configuration
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>{title}</h2>
        <div className="list-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          {onAdd && (
            <button className="btn btn-primary" onClick={onAdd}>
              <i className="fas fa-plus"></i> Ajouter
            </button>
          )}
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  onClick={() => requestSort(column.key)}
                  className={sortConfig.key === column.key ? sortConfig.direction : ''}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="actions-column">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="actions-cell">
                      {onEdit && (
                        <button 
                          className="btn-action btn-edit" 
                          onClick={() => onEdit(item)}
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => onDelete(item)}
                          title="Supprimer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="no-data">
                  Aucune donnée trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListComponent;
