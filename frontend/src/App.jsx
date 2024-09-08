import './App.css';
import Event from './Pages/event';
import Createevent from './Pages/createevent';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegistrationPage from './components/admin/registration';
import Approve from './Pages/approve';
function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route index  path="/" element={<Event/>} />
    <Route path="/admin" element={<Createevent/>} />
    <Route path="/admin/approve" element={<Approve/>} />
    <Route path="/admin/attendence" element={<Approve/>} />
    <Route path="/registrations/:id" element={<RegistrationPage/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;