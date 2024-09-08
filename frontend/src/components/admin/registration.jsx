import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../header';
import AdminHeader from './AdminHeader';

function RegistrationPage() {
  const { id } = useParams();
  const [registration, setRegistration] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRegistration() {
      try {
        const response = await axios.get(`http://localhost:8000/getAllRegistrations/${id}`);
        if (response.data && Array.isArray(response.data)) {
          console.log(response.data);
          setRegistration(response.data);
        } else {
          setError("No registration found");
        }
      } catch (err) {
        setError("Failed to fetch registration details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRegistration();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <AdminHeader />
      <div className="flex flex-wrap gap-4 justify-start items-start ml-72 mt-32 w-[80%] ">
        <h1 className="text-2xl font-bold">Registration Details</h1>
        {registration.length > 0 ? (
          registration.map((reg, index) => (
            <div key={index} className="mt-4 p-4 border border-gray-300 rounded">
              <p><strong>College ID:</strong> {reg.clg_id}</p>
              <p><strong>Email ID:</strong> {reg.email_id}</p>
              <p><strong>First Name:</strong> {reg.first_name}</p>
              <p><strong>Middle Name:</strong> {reg.middle_name}</p>
              <p><strong>Last Name:</strong> {reg.last_name}</p>
              <p><strong>Registration ID:</strong> {reg.reg_id}</p>
              <p><strong>Approved:</strong> {reg.isApproved ? 'Yes' : 'No'}</p>
              <p><strong>Time of Attendance:</strong> {reg.timeOfAttendance || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No registration details available.</p>
        )}
      </div>
    </>
  );
}

export default RegistrationPage;
