import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../header';
import AdminHeader from './AdminHeader';
import QRCode from 'qrcode';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI

function RegistrationPage() {
  const { id: eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({});
  const [bulkActionStatus, setBulkActionStatus] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getAllRegistrations/${eventId}`);
        setRegistrations(response.data || []);
      } catch (err) {
        setError("Error fetching registration data");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [eventId]);

  const approveStudent = async (studentId, emailId) => {
    setActionStatus({ ...actionStatus, [studentId]: 'approving' });
    try {
      const qrCodeData = JSON.stringify({ event_id: eventId, student_id: studentId });
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

      await axios.put(`http://localhost:8000/approveStudent/${eventId}`, { student_id: studentId });
      await axios.post(`http://localhost:8000/sendAttendanceQrcode`, { email: emailId, src: qrCodeUrl });

      setRegistrations(registrations.map(reg =>
        reg.student_id === studentId ? { ...reg, isApproved: true } : reg
      ));
      alert("Student approved successfully!");
    } catch (err) {
      setError("Error approving student");
    } finally {
      setActionStatus({ ...actionStatus, [studentId]: null });
    }
  };

  const declineStudent = async (studentId) => {
    setActionStatus({ ...actionStatus, [studentId]: 'declining' });
    try {
      await axios.delete(`http://localhost:8000/deleteRegistration/${eventId}`, { data: { student_id: studentId } });
      setRegistrations(registrations.filter(reg => reg.student_id !== studentId));
      alert("Student declined successfully!");
    } catch (err) {
      setError("Error declining student");
    } finally {
      setActionStatus({ ...actionStatus, [studentId]: null });
    }
  };

  const approveAll = async () => {
    setBulkActionStatus('approving');
    try {
      for (const reg of registrations.filter(r => !r.isApproved)) {
        const qrCodeData = JSON.stringify({ event_id: eventId, student_id: reg.student_id });
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

        await axios.put(`http://localhost:8000/approveStudent/${eventId}`, { student_id: reg.student_id });
        await axios.post(`http://localhost:8000/sendAttendanceQrcode`, { email: reg.email_id, src: qrCodeUrl });

        setRegistrations(prevRegs =>
          prevRegs.map(r =>
            r.student_id === reg.student_id ? { ...r, isApproved: true } : r
          )
        );
      }
      alert("All students approved successfully!");
    } catch (err) {
      setError("Error approving all students");
    } finally {
      setBulkActionStatus(null);
    }
  };

  const deleteAll = async () => {
    setBulkActionStatus('deleting');
    try {
      await Promise.all(
        registrations.map(reg =>
          axios.delete(`http://localhost:8000/deleteRegistration/${eventId}`, { data: { student_id: reg.student_id } })
        )
      );
      setRegistrations([]);
      alert("All registrations deleted successfully!");
    } catch (err) {
      setError("Error deleting all registrations");
    } finally {
      setBulkActionStatus(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <AdminHeader />
      <div className="flex flex-col gap-4 md:ml-72 md:mt-32 w-full px-4">
        <h1 className="text-2xl font-bold mb-4">Registration Details</h1>
        
        {/* Buttons for bulk actions */}
        {registrations.length ? (
          <div className="flex gap-4 mb-4">
            <button
              onClick={approveAll}
              disabled={bulkActionStatus === 'approving'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {bulkActionStatus === 'approving' ? <CircularProgress size={20} color="inherit" /> : 'Approve All'}
            </button>
            <button
              onClick={deleteAll}
              disabled={bulkActionStatus === 'deleting'}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              {bulkActionStatus === 'deleting' ? <CircularProgress size={20} color="inherit" /> : 'Delete All'}
            </button>
          </div>
        ) : null}

        {registrations.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">College ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Approved</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Transaction ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map(({ student_id, clg_id, email_id, first_name, last_name, transaction_id, isApproved }) => (
                  <tr key={student_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{clg_id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{email_id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{first_name} {last_name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{isApproved ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{transaction_id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {!isApproved && (
                        <>
                          <button
                            onClick={() => approveStudent(student_id, email_id)}
                            disabled={actionStatus[student_id] === 'approving'}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mr-2"
                          >
                            {actionStatus[student_id] === 'approving' ? <CircularProgress size={20} color="inherit" /> : 'Approve'}
                          </button>
                          <button
                            onClick={() => declineStudent(student_id)}
                            disabled={actionStatus[student_id] === 'declining'}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            {actionStatus[student_id] === 'declining' ? <CircularProgress size={20} color="inherit" /> : 'Decline'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No registration details available.</p>
        )}
      </div>
    </>
  );
}

export default RegistrationPage;
