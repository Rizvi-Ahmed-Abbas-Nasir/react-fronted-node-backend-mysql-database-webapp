import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function History() {
  const [events, setEvents] = useState([]);
  const [progresses, setProgresses] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [currentPhotosPath, setCurrentPhotosPath] = useState(null); // Fixed state variable name
  const [error, setError] = useState('');

  const getProgressValue = (value) => {
    switch (value) {
      case 1:
        return 20;
      case 2:
        return 40;
      case 3:
        return 70;
      case 4:
        return 100;
      default:
        return 0;
    }
  };

  const updateProgress = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/eventStatus/${id}`);
      const progressStatus = response.data.status;
      const mappedValue = getProgressValue(progressStatus);
      setProgresses((prevProgresses) => ({
        ...prevProgresses,
        [id]: mappedValue,
      }));
    } catch (error) {
      setError('Failed to update progress.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, );

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/event`);
      setEvents(response.data);
      response.data.forEach((event) => updateProgress(event.eventId));
    } catch (error) {
      setError('Failed to fetch events.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const data = await axios.delete(`${process.env.REACT_APP_URL}/event/${id}`);
        fetchEvents();
        alert(data.data.message);
      } catch (error) {
        setError('Failed to delete the event.');
      }
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      try {
        const data = await axios.delete(`${process.env.REACT_APP_URL}/removeEvent/${id}`);
        fetchEvents();
        alert(data.data.message);
      } catch (error) {
        setError('Failed to remove the event.');
      }
    }
  };

  const handleUndo = async (id) => {
    try {
      const data = await axios.post(`${process.env.REACT_APP_URL}/undoEvent/${id}`);
      fetchEvents();
      alert(data.data.message);
    } catch (error) {
      setError('Failed to undo the event deletion.');
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [currentEventId]: file,
    }));
  };

  // Handle file upload
  const handleFileUpload = async () => {
    const file = selectedFiles[currentEventId];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('photos', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/uploadPhotos/${currentEventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      setOpenDialog(false); // Close dialog after upload
      window.location.reload();
    } catch (error) {
      setError('Failed to upload the file.');
    }
  };

  // Open dialog for file actions (upload and download)
  const handleOpenDialog = (eventId, photoPath) => {
    setCurrentEventId(eventId);
    setCurrentPhotosPath(photoPath); // Fixed state variable name
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="md:ml-72 md:mt-32 md:w-[80%] w-full mt-9 flex justify-center p-8 flex-col bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">Event History</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {events.length > 0 ? (
        <div className="overflow-x-auto rounded-xl">
          <table className="table-auto w-full min-w-[700px]  text-left bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr className=" bg-blue-600 text-white border-b border-gray-200">
                <th className="p-4 font-semibold">Event Name</th>
                <th className="p-4 font-semibold">Speaker</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Paid</th>
                <th className="p-4 font-semibold">Cost</th>
                <th className="p-4 font-semibold">Progress</th>
                <th className="p-4 font-semibold">Actions</th>
                <th className="p-4 font-semibold">File Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.eventId} className="border-b border-gray-300">
                  <td className="p-4 text-gray-800">{event.eventName}</td>
                  <td className="p-4 text-gray-800">{event.nameOfSpeaker}</td>
                  <td className="p-4 text-gray-800">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-800">{event.isPaid ? 'Paid' : 'Not Paid'}</td>
                  <td className="p-4 text-gray-800">{event.cost ? event.cost : 'Free'}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress
                          variant="determinate"
                          value={progresses[event.eventId] || 0}
                          size={60}
                          thickness={6}
                          style={{
                            color: (progresses[event.eventId] || 0) === 100 ? 'green' : 'blue',
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div" color="textSecondary" fontSize={16} fontWeight="bold">
                            {`${Math.round(progresses[event.eventId] || 0)}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </div>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                    {event.isDeleted === 0 ? (
                      <button
                        onClick={() => handleRemove(event.eventId)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUndo(event.eventId)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        Undo
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleOpenDialog(event.eventId, event.eventPhotos)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      File Actions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No events available.</p>
      )}

      {/* File Actions Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>File Actions</DialogTitle>
        <DialogContent>
          <input
            type="file"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            accept=".zip"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileUpload} color="primary" variant="contained">
            Upload File
          </Button>
          <Button
            onClick={() => window.open(`${process.env.REACT_APP_URL}/${currentPhotosPath}`)}
            color="primary"
            variant="contained"
          >
            Download ZIP
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default History;
