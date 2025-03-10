import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../../redux/slices/appointmentsSlice';

const CreateAppointmentForm = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const loading = useSelector((state) => state.appointments.loading);
  const error = useSelector((state) => state.appointments.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAppointment({ date, description }));
  };

  return (
    <div className="create-appointment-form">
      <h2>Créer un nouveau rendez-vous</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date :</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Créer'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateAppointmentForm;