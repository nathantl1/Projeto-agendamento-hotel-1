import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Agendar from './pages/agendar/Agendar.jsx';
import Header from './components/Header/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<div className='container-lg'><Header /><Dashboard /></div>} />
        <Route path="/agendar" element={<Agendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
