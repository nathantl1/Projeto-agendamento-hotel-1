import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./cadastro.css"; // Certifique-se de que tem um CSS para esta página

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("professor");
  const [error, setError] = useState(""); // Estado para guardar a mensagem de erro
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    if (!nome || !email || !senha) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    try {
      await api.post("/usuarios", {
        nome,
        email,
        senha,
        tipo,
      });
      alert("Registo realizado com sucesso! Pode agora fazer login.");
      navigate("/"); // Redireciona para a página de login
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        // Se o backend enviar uma mensagem de erro específica, exibe-a
        setError(err.response.data.error);
      } else {
        // Mensagem genérica para outros tipos de erro (ex: falha de rede)
        setError("Ocorreu um erro ao registar. Tente novamente.");
      }
      console.error("Erro no registo:", err);
    }
  };

  return (
    <div className="container-lg mt-5">
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Registo de Utilizador</h2>
        <Form onSubmit={handleCadastro}>
          {error && <p className="text-danger text-center">{error}</p>}

          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Insira o seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Endereço de E-mail</Form.Label>
            <Form.Control
              type="email"
              placeholder="Insira o seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSenha">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTipo">
            <Form.Label>Tipo de Utilizador</Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="professor">Professor</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Registar
            </Button>
          </div>
        </Form>
        <div className="text-center mt-3">
          <p>
            Já tem uma conta? <Link to="/">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
