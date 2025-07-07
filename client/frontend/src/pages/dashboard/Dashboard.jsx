import api from '../../services/api';
import React from 'react';
import './dashboard.css';

export function Dashboard() {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {/* Logo IFMS (simulação) */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '48px', color: 'green' }}>
            <b>■</b><br />
            <b>■ ■</b><br />
            <b>■ ■</b><br />
            <b style={{ color: 'red' }}>■</b> <b>■</b><br />
          </div>
        </div>

        <form>
          <div className="form-group mb-3">
            <input type="email" className="form-control" placeholder="Email" />
          </div>

          <div className="form-group mb-2">
            <input type="password" className="form-control" placeholder="Senha" />
          </div>

          <div className="d-flex justify-content-end mb-3">
            <a href="#" className="text-decoration-none">Esqueci minha senha</a>
          </div>

          <button type="submit" className="btn btn-success w-100">Entrar</button>

          <div className="text-center mt-3">
            <span>Não tem uma conta? <a href="#" className="text-success">Cadastre-se</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
