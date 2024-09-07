import './App.css';
import Header from "./components/header"
import Event from './Pages/event';
import Admin from './Pages/admin';
import Createevent from './Pages/createevent';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route index  path="/" element={<Event/>} />
    <Route path="/admin" element={<Admin/>} />
    <Route path="/createEvent" element={<Createevent/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;