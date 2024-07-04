import React from 'react'

export const AddItemModalUser = () => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              placeholder="Nombre"
              type="text"
              name="id"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Apellido:</label>
            <input
              placeholder="Apellido"
              type="text"
              name="description"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Cédula:</label>
            <input
              placeholder="Cédula"
              type="text"
              name="Tipo"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Correo:</label>
            <input
              placeholder="Correo"
              type="number"
              name="stock"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Dirección:</label>
            <input
              placeholder="Dirección"
              type="text"
              name="Tipo"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Contraseña:</label>
            <input
              placeholder="Contraseña"
              type="text"
              name="Tipo"
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Rol:</label>
            <input
              placeholder="Rol"
              type="number"
              name="stock"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formActions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


AddItemModal.propTypes = {
  show: PropTypes.bool.isRequired,
  //onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
