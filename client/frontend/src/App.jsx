import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Header from "./components/Header/Header.jsx";
import FloatButton from "./components/FloatButton/FloatButton.jsx";
import SchedulerModal from "./components/SchedulerModal/SchedulerModal.Jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import Cadastro from "./pages/cadastro/Cadastro.jsx";

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filtroAtivo, setFiltroAtivo] = useState("Tudo");

  const handleReservationSuccess = () => {
    setModalVisible(false);

    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/dashboard"
          element={
            <div className="container-lg position-relative">
              <Header onFilterChange={setFiltroAtivo} />

              <Dashboard filtroAtivo={filtroAtivo} key={refreshKey} />

              <SchedulerModal
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                onReservationSuccess={handleReservationSuccess}
              />
              <FloatButton onClick={() => setModalVisible(true)} />
            </div>
          }
        />

        <Route path="/agendar" element={<div>Página de Agendamento</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
