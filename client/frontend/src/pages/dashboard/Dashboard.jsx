import api from '../../services/api';
import React from 'react';
import './dashboard.css';

export function Dashboard() {
  return (
    <div className="container vh-100">
      <div className='cards'>
        <div class="custom-card">
        <div class="card-content">
          <h5 class="card-title">Nome do Lab</h5>
          <p class="card-subtitle">Hotel Tecnológico</p>
        </div>
        <div class="card-icon">
          <i class="bi bi-calendar"></i>{" "}
        </div>
        </div>
         <div class="custom-card">
        <div class="card-content">
          <h5 class="card-title">Nome do Lab</h5>
          <p class="card-subtitle">Hotel Tecnológico</p>
        </div>
        <div class="card-icon">
          <i class="bi bi-calendar"></i>{" "}
        </div>
        </div>
         <div class="custom-card">
        <div class="card-content">
          <h5 class="card-title">Nome do Lab</h5>
          <p class="card-subtitle">Hotel Tecnológico</p>
        </div>
        <div class="card-icon">
          <i class="bi bi-calendar"></i>{" "}
        </div>
        </div>
         <div class="custom-card">
        <div class="card-content">
          <h5 class="card-title">Nome do Lab</h5>
          <p class="card-subtitle">Hotel Tecnológico</p>
        </div>
        <div class="card-icon">
          <i class="bi bi-calendar"></i>{" "}
        </div>
        </div>
         <div class="custom-card">
        <div class="card-content">
          <h5 class="card-title">Nome do Lab</h5>
          <p class="card-subtitle">Hotel Tecnológico</p>
        </div>
        <div class="card-icon">
          <i class="bi bi-calendar"></i>{" "}
        </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
