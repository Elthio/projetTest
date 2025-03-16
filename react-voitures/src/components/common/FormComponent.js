import React, { useState } from 'react';
import '../../styles/Form.css';

/**
 * Generic form component that can be used for any entity
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Array} props.fields - Array of field definitions
 * @param {Function} props.onSubmit - Function to call on form submit
 * @param {String} props.submitLabel - Label for submit button
 * @param {Function} props.onCancel - Function to call on cancel
 */
const FormComponent = ({ 
  initialData = {}, 
  fields = [], 
  onSubmit, 
  submitLabel = 'Enregistrer', 
  onCancel 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} est requis`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">Sélectionner...</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                rows={field.rows || 3}
              />
            ) : field.type === 'date' ? (
              <input
                type="date"
                id={field.name}
                name={field.name}
                className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              />
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
              />
            )}
            
            {errors[field.name] && (
              <div className="invalid-feedback">{errors[field.name]}</div>
            )}
          </div>
        ))}
        
        <div className="form-buttons">
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              Annuler
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;
