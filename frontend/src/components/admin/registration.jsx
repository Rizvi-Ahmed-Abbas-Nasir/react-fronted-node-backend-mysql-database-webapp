import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../header';
import AdminHeader from './AdminHeader';
import QRCode from "qrcode";

function RegistrationPage() {
  const { id } = useParams();
  const [registration, setRegistration] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [src,setSrc] = useState('');
  
  useEffect(() => {
    async function fetchRegistration() {
      try {
        const response = await axios.get(`http://localhost:8000/getAllRegistrations/${id}`);
        if (response.data && Array.isArray(response.data)) {
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




  const handleApprove = async (stdId,email_id) => {
    try {
     console.log(id, stdId);
     const srccode = await QRCode.toDataURL(JSON.stringify({event_id:id,student_id:stdId})) ;
     const res = await axios.put(`http://localhost:8000/approveStudent/${id}`, {"student_id":stdId });
     await axios.post(`http://localhost:8000/sendAttendanceQrcode`, {"email":email_id,"src":srccode});
     alert("Approve")
     console.log(res.data);
      setRegistration(registration.map(reg => reg.student_id === stdId ? { ...reg, isApproved: true } : reg));
    } catch (err) {
      setError("Failed to approve registration. Please try again.");
    }
  };

  const handleDecline = async (stdId) => {
    try {
      const res = await axios.delete(`http://localhost:8000/deleteRegistration/${id}`, {
        data: { student_id: stdId },
      });
      
      alert("Delete");
      console.log(res.data);
      
      setRegistration(registration.filter(reg => reg.student_id !== stdId));
    } catch (err) {
      setError("Failed to decline registration. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <AdminHeader />
      <div className="flex flex-col gap-4 justify-start items-start ml-72 mt-32 w-[80%]">
        <h1 className="text-2xl font-bold">Registration Details</h1>
        {registration.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registration.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.clg_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.student_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.transaction_id || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.isApproved ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!reg.isApproved && (
                      <>
                        <button
                          onClick={ () =>  handleApprove(reg.student_id,reg.email_id)}
                          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(reg.student_id)}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No registration details available.</p>
        )}
      </div>
    </>
  );
}

export default RegistrationPage;
