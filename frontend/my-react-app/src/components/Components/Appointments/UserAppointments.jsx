import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAppointments } from '../../redux/slices/appointmentsSlice';
import CreateAppointmentForm from './CreateAppointmentForm';

const UserAppointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.list);
  const loading = useSelector((state) => state.appointments.loading);
  const error = useSelector((state) => state.appointments.error);

  useEffect(() => {
    dispatch(fetchUserAppointments());
  }, [dispatch]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="user-appointments">
      <h2>Mes Rendez-vous</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            <p>Date : {new Date(appointment.date).toLocaleString()}</p>
            <p>Description : {appointment.description}</p>
            <p> doctor : {appointment.doctorName}</p>
            <p> reason: {appointment.reason}</p>
            <p> {appointment.date} - {appointment.time}</p>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default UserAppointments;