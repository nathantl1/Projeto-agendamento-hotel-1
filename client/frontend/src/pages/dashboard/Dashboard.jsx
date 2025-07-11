import React, { useState, useEffect } from 'react';
import { getReservas, deleteReserva, updateReserva } from '../../services/reservas';
import EditReservaModal from '../../components/EditModal/EditReservaModal';
import './dashboard.css';
import editIcon from '../../assets/icons8-crie-um-novo-30.png';
import deleteIcon from '../../assets/icons8-lixo-128.png';

const ReservaCard = ({ reserva, onDeletar, onEditar }) => {
  const formatarData = (dataString) => {
    if (!dataString) return 'Data inválida';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="reserva-card">
      <div className="reserva-card-header">
        <h5>{reserva.laboratorio.tipo}: {reserva.laboratorio.identificador}</h5>
      </div>
      <div className="reserva-card-body">
        <div className="info-wrapper">
            <div className="info-item"><span><strong>Responsável:</strong> {reserva.professor_responsavel}</span></div>
            <div className="info-item"><span><strong>Início:</strong> {formatarData(reserva.data_inicio)}</span></div>
            <div className="info-item"><span><strong>Término:</strong> {formatarData(reserva.data_fim)}</span></div>
            {reserva.anotacoes && (<div className="info-item"><span><strong>Anotações:</strong> {reserva.anotacoes}</span></div>)}
        </div>
        <div className="card-actions">

            <button onClick={() => onEditar(reserva)} className="action-btn" title="Editar Reserva">
                <img src={editIcon} alt="Editar" className="action-icon" />
            </button>

            <button onClick={() => onDeletar(reserva.id)} className="action-btn delete" title="Deletar Reserva">
                <img src={deleteIcon} alt="Deletar" className="action-icon" />
            </button>
        </div>
      </div>
    </div>
  );
};

export function Dashboard({ filtroAtivo, refreshDashboard }) { 
  const [todasReservas, setTodasReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [reservaParaEditar, setReservaParaEditar] = useState(null);
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const data = await getReservas(); 
      setTodasReservas(data);
    } catch (err) {
      setError("Falha ao carregar os agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [refreshDashboard]);

  useEffect(() => {
    if (filtroAtivo === 'Tudo') {
      setReservasFiltradas(todasReservas);
    } else {
      const filtradas = todasReservas.filter(reserva => reserva.laboratorio.tipo === filtroAtivo);
      setReservasFiltradas(filtradas);
    }
  }, [filtroAtivo, todasReservas]);

  const handleDeletarReserva = async (id) => {
    try {
      await deleteReserva(id);
      fetchReservas();
    } catch (err) {
      alert("Erro ao deletar a reserva.");
    }
  };

  const handleEditarClick = (reserva) => {
    setReservaParaEditar(reserva);
    setMostrarModalEdicao(true);
  };

  const handleSalvarEdicao = async (reservaAtualizada) => {
    try {
      await updateReserva(reservaAtualizada.id, reservaAtualizada);
      fetchReservas();
      setMostrarModalEdicao(false);
    } catch (err) {
      alert("Erro ao salvar as alterações.");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-5"><h4>A carregar agendamentos...</h4></div>;
  if (error) return <div className="text-center mt-5"><h4 className="text-danger">{error}</h4></div>;

  return (
    <div className="dashboard-container">
      <div className='cards-grid mt-4'>
        {reservasFiltradas.length > 0 ? (
          reservasFiltradas.map(reserva => (
            <ReservaCard 
              key={reserva.id} 
              reserva={reserva} 
              onDeletar={handleDeletarReserva}
              onEditar={handleEditarClick}
            />
          ))
        ) : (
          <p className="text-center w-100">Nenhum agendamento encontrado para o filtro "{filtroAtivo}".</p>
        )}
      </div>

      {mostrarModalEdicao && (
        <EditReservaModal
          show={mostrarModalEdicao}
          onHide={() => setMostrarModalEdicao(false)}
          reserva={reservaParaEditar}
          onSalvar={handleSalvarEdicao}
        />
      )}
    </div>
  );
}

export default Dashboard;
