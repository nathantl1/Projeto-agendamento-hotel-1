import api from './api';

export async function getReservas() {
  const response = await api.get('/reservas');
  return response.data;
}

export async function criarReserva(dados) {
  const response = await api.post('/reservas', dados);
  return response.data;
}


export async function updateReserva(id, dados) {
  const response = await api.put(`/reservas/${id}`, dados);
  return response.data;
}


export async function deleteReserva(id) {
  const response = await api.delete(`/reservas/${id}`);
  return response.data;
}
