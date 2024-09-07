import './App.css';
import Event from './Pages/event';
import Admin from './Pages/admin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route index  path="/" element={<Event/>} />
    <Route path="/admin" element={<Admin/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;