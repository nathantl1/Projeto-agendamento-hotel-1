import api from "../../services/api";
import React from "react";
import "./login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import inst1Logo from "../../assets/inst.svg";

export function Login() {
  return (
    <div className="container-lg borderxx">
        <div className="login">
          <img src={inst1Logo} alt="logo" />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                style={{ backgroundColor: "#e5e6e8" }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Senha"
                style={{ backgroundColor: "#e5e6e8" }}
              />
            </Form.Group>
            <Form.Group
              id="esqsenha"
              className="mb-3"
              controlId="formBasicCheckbox"
            >
              <span id="esqsenha" className="negrito clicavel">Esqueci minha senha</span>
            </Form.Group>
            <Button id="bt1" variant="primary" type="submit">
              Entrar
            </Button>
          </Form>
          <div id="final"><span>Não tem conta?</span><span id='cadastro' className="negrito clicavel" > Cadastre-se</span></div>
        </div>
    </div>
  );
}
export default Login;

function handleLogin() {
  api
    .post("/login", {
      email: email, // Make sure 'email' and 'senha' are defined in your component's state or scope
      senha: senha,
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));
}
