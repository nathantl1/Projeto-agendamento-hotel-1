import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Tabs, Tab } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale/pt-BR';

import { getLaboratorios, createLaboratorio } from '../../services/labs';
import { criarReserva } from '../../services/reservas';

import "react-datepicker/dist/react-datepicker.css";
import './SchedulerModal.css';

registerLocale('pt-BR', ptBR);

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="date-time-field" onClick={onClick} ref={ref}>{value || 'Selecione a data'}</div>
));

export default function SchedulerModal({ show, onClose, onReservationSuccess }) {
  const [activeTab, setActiveTab] = useState('agendar');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupedLabs, setGroupedLabs] = useState({});
  const [selectedLabId, setSelectedLabId] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [anotacoes, setAnotacoes] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [newLabIdentifier, setNewLabIdentifier] = useState('');
  const [newLabType, setNewLabType] = useState('');
  const tiposDeLab = ['Sala', 'IF Maker', 'Hotel Tecnológico'];

  const fetchAndProcessLabs = () => {
    getLaboratorios()
      .then(response => {
        const groups = response.data.reduce((acc, lab) => {
          const tipo = lab.tipo || 'Outros';
          if (!acc[tipo]) acc[tipo] = [];
          acc[tipo].push(lab);
          return acc;
        }, {});
        setGroupedLabs(groups);
      })
      .catch(err => {
        console.error("Falha ao carregar laboratórios:", err);
        setError("Não foi possível carregar os laboratórios.");
      });
  };

  useEffect(() => {
    if (show) {
      setError('');
      setActiveTab('agendar');
      setSelectedLabId('');
      setNewLabIdentifier('');
      setNewLabType('');
      setResponsavel(localStorage.getItem('nome') || 'Não identificado');
      fetchAndProcessLabs();
    }
  }, [show]);

  const handleCreateLab = async (e) => {
    e.preventDefault();
    if (!newLabIdentifier || !newLabType) {
      setError("Por favor, preencha o tipo e o identificador.");
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await createLaboratorio({ identificador: newLabIdentifier, tipo: newLabType });
      alert(`'${newLabType}: ${newLabIdentifier}' criado com sucesso!`);
      setNewLabIdentifier('');
      fetchAndProcessLabs();
      setActiveTab('agendar');
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao criar o laboratório.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgendar = async (e) => {
    e.preventDefault();
    if (!selectedLabId || !dataInicio || !dataFim) {
      setError("Preencha o Laboratório, a Data de Início e Fim.");
      return;
    }
    setIsSubmitting(true);
    setError('');
    const dadosReserva = {
      laboratorio_id: parseInt(selectedLabId),
      data_inicio: dataInicio.toISOString().slice(0, 16),
      data_fim: dataFim.toISOString().slice(0, 16),
      anotacoes,
      professor_responsavel: responsavel,
    };
    try {
      await criarReserva(dadosReserva);
      onReservationSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao criar a reserva.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="custom-modal">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger text-center mb-3">{error}</p>}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="modal-tabs" className="custom-tabs mb-3" fill>
          <Tab eventKey="agendar" title="Agendar">
            <Form onSubmit={handleAgendar} className="p-2">
              <Row className="align-items-center mb-3">
                <Col className="d-flex align-items-center"><span className='datain'>Início:</span><DatePicker selected={dataInicio} onChange={(date) => setDataInicio(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="Hora" dateFormat="dd/MM/yyyy p" locale="pt-BR" customInput={<CustomDateInput />} required /></Col>
                <Col className="d-flex align-items-center"><span className='datain'>Fim:</span><DatePicker selected={dataFim} onChange={(date) => setDataFim(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="Hora" dateFormat="dd/MM/yyyy p" locale="pt-BR" customInput={<CustomDateInput />} minDate={dataInicio} required /></Col>
              </Row>
              <InputGroup className="input-group-custom mb-3">
                <i className="bi bi-building"></i>
                <Form.Select value={selectedLabId} onChange={(e) => setSelectedLabId(e.target.value)} required>
                  <option value="">Laboratório</option>
                  {Object.keys(groupedLabs).map(tipo => (
                    <optgroup key={tipo} label={tipo}>
                      {groupedLabs[tipo].map(lab => <option key={lab.id} value={lab.id}>{lab.identificador}</option>)}
                    </optgroup>
                  ))}
                </Form.Select>
              </InputGroup>
              <InputGroup className="input-group-custom mb-3"><i className="bi bi-person"></i><Form.Control placeholder="Responsável" value={responsavel} disabled /></InputGroup>
              <InputGroup className="input-group-custom mb-3"><i className="bi bi-card-text"></i><Form.Control as="textarea" rows={1} placeholder="Anotações" value={anotacoes} onChange={(e) => setAnotacoes(e.target.value)} style={{ resize: 'none' }} /></InputGroup>
              <Button className="btn-agendar mt-3" type="submit" disabled={isSubmitting || !selectedLabId}>{isSubmitting ? 'Agendando...' : 'Agendar'}</Button>
            </Form>
          </Tab>
          <Tab eventKey="criar" title="Criar Laboratório">
            <Form onSubmit={handleCreateLab} className="p-2">
              <InputGroup className="input-group-custom mb-3">
                <i className="bi bi-tag"></i>
                <Form.Select value={newLabType} onChange={(e) => setNewLabType(e.target.value)} required>
                  <option value="">Selecione um Tipo</option>
                  {tiposDeLab.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </Form.Select>
              </InputGroup>
              <InputGroup className="input-group-custom mb-3">
                <i className="bi bi-fonts"></i>
                <Form.Control placeholder="Identificador (Nome ou Número)" value={newLabIdentifier} onChange={(e) => setNewLabIdentifier(e.target.value)} required />
              </InputGroup>
              <Button className="btn-agendar mt-3" type="submit" disabled={isSubmitting || !newLabType}>{isSubmitting ? 'Criando...' : 'Criar Laboratório'}</Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
