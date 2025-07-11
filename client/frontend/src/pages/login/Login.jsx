import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import inst1Logo from "../../assets/inst.svg";
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  

  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState("");

  const handleRecuperarSenha = async () => {
    try {

      alert("Um e-mail de redefinição de senha foi enviado (fake).");
    } catch (err) {
      alert("Erro ao tentar redefinir a senha.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (!email || !senha) {
      alert("Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {

      const response = await api.post("/login", { email, senha });


      localStorage.setItem("token", response.data.token);
      localStorage.setItem("nome", response.data.nome);
      localStorage.setItem("tipo", response.data.tipo);
      localStorage.setItem("email", response.data.email);


      navigate("/dashboard");

    } catch (err) {

      alert("Credenciais inválidas. Tente novamente.");
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="container-lg" id="containerlogin">
      <div className="login">
        <img src={inst1Logo} alt="Logo do Instituto Federal" />
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              style={{ backgroundColor: "#e5e6e8" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Senha"
              style={{ backgroundColor: "#e5e6e8" }}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            id="esqsenha"
            className="mb-3 text-end"
            controlId="formBasicCheckbox"
          >
            <span
              className="negrito clicavel"
              onClick={() => setMostrarRecuperar(!mostrarRecuperar)}
            >
              Esqueci minha senha
            </span>
            {mostrarRecuperar && (
              <div className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail para recuperação"
                    value={emailRecuperar}
                    onChange={(e) => setEmailRecuperar(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={handleRecuperarSenha}>Redefinir Senha</Button>
              </div>
            )}
          </Form.Group>

          <Button id="bt1" variant="primary" type="submit">
            Entrar
          </Button>
        </Form>

        <div id="final">
          <span>Não tem uma conta?</span>
          <Link to="/cadastro" id="cadastro" className="negrito clicavel">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
