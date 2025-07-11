import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import '../SchedulerModal/SchedulerModal.css'; 

registerLocale('pt-BR', ptBR);


const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="date-time-field" onClick={onClick} ref={ref}>{value || 'Selecione a data'}</div>
));

export default function EditReservaModal({ show, onHide, reserva, onSalvar }) {

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [anotacoes, setAnotacoes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (reserva) {

      setDataInicio(new Date(reserva.data_inicio));
      setDataFim(new Date(reserva.data_fim));
      setAnotacoes(reserva.anotacoes || '');
    }
  }, [reserva]);

  const handleSalvarClick = async (e) => {
    e.preventDefault();
    if (!dataInicio || !dataFim) {
      setError("As datas de início e fim são obrigatórias.");
      return;
    }
    setIsSubmitting(true);
    setError('');


    const reservaAtualizada = {
      ...reserva,
  // Formata a data
      data_inicio: dataInicio.toISOString().slice(0, 16),
      data_fim: dataFim.toISOString().slice(0, 16),
      anotacoes,
    };


    await onSalvar(reservaAtualizada);
    
    setIsSubmitting(false);
  };


  if (!reserva) return null;

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Editar Reserva</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSalvarClick}>
        <Modal.Body>
          {error && <p className="text-danger text-center mb-3">{error}</p>}
          
          <div className="mb-3 p-2 rounded" style={{backgroundColor: '#e9ecef'}}>
            <strong>Laboratório:</strong> {reserva.laboratorio.tipo}: {reserva.laboratorio.identificador}
          </div>

          <Row className="align-items-center mb-3">
            <Col className="d-flex align-items-center">
              <span className='datain'>Início:</span>
              <DatePicker selected={dataInicio} onChange={(date) => setDataInicio(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="Hora" dateFormat="dd/MM/yyyy p" locale="pt-BR" customInput={<CustomDateInput />} required />
            </Col>
            <Col className="d-flex align-items-center">
              <span className='datain'>Fim:</span>
              <DatePicker selected={dataFim} onChange={(date) => setDataFim(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="Hora" dateFormat="dd/MM/yyyy p" locale="pt-BR" customInput={<CustomDateInput />} minDate={dataInicio} required />
            </Col>
          </Row>

          <InputGroup className="input-group-custom mb-3">
            <i className="bi bi-card-text"></i>
            <Form.Control as="textarea" rows={1} placeholder="Anotações" value={anotacoes} onChange={(e) => setAnotacoes(e.target.value)} style={{ resize: 'none' }} />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button className="btn-agendar" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'A salvar...' : 'Salvar Alterações'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
