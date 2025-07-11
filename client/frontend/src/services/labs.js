import api from './api';

export const getLaboratorios = () => {
  return api.get('/laboratorios');
};

export const createLaboratorio = (labData) => {
  return api.post('/laboratorios', labData);
};
