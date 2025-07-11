from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
CORS(app) 

app.config['JWT_SECRET_KEY'] = 'sua-chave-super-secreta-e-longa' 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///reservas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)

#Banco
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(20), default='professor', nullable=False)

class Laboratorio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    identificador = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    reservas = db.relationship('Reserva', backref='laboratorio', lazy=True, cascade="all, delete-orphan")
    __table_args__ = (db.UniqueConstraint('tipo', 'identificador', name='_tipo_identificador_uc'),)

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_inicio = db.Column(db.String(50), nullable=False)
    data_fim = db.Column(db.String(50), nullable=False)
    professor_responsavel = db.Column(db.String(100), nullable=False)
    anotacoes = db.Column(db.Text, nullable=True)
    laboratorio_id = db.Column(db.Integer, db.ForeignKey('laboratorio.id'), nullable=False)

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return Usuario.query.filter_by(id=identity).one_or_none()

# --- ROTAS DE AUTENTICAÇÃO E USUÁRIOS ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    usuario = Usuario.query.filter_by(email=email).first()
    if not usuario or not check_password_hash(usuario.senha, senha):
        return jsonify({'error': 'Credenciais inválidas'}), 401
    access_token = create_access_token(identity=str(usuario.id))
    return jsonify({'token': access_token, 'nome': usuario.nome, 'tipo': usuario.tipo, 'email': usuario.email})

@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('senha') or not data.get('nome'):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Este e-mail já está em uso'}), 409
    senha_hash = generate_password_hash(data['senha'])
    novo_usuario = Usuario(nome=data['nome'], email=data['email'], senha=senha_hash, tipo=data.get('tipo', 'professor'))
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

# Routes
@app.route('/api/laboratorios', methods=['POST'])
@jwt_required()
def criar_laboratorio():
    data = request.get_json()

    tipo = data.get('tipo')
    identificador = data.get('identificador')

    try:
        identificador_int = int(identificador)
    except (ValueError, TypeError):
        return jsonify({'error': 'O identificador deve ser um número inteiro.'}), 400

    if not tipo:
        return jsonify({'error': 'O tipo do laboratório é obrigatório.'}), 400

    if Laboratorio.query.filter_by(identificador=identificador_int, tipo=tipo).first():
        return jsonify({'error': 'Um laboratório com esse identificador e tipo já existe.'}), 409

    novo_lab = Laboratorio(identificador=identificador_int, tipo=tipo)
    db.session.add(novo_lab)
    db.session.commit()

    return jsonify({'id': novo_lab.id, 'identificador': novo_lab.identificador, 'tipo': novo_lab.tipo}), 201

@app.route('/api/laboratorios', methods=['GET'])
@jwt_required()
def listar_laboratorios():
    laboratorios = Laboratorio.query.order_by(Laboratorio.tipo, Laboratorio.identificador).all()
    resultado = [
        {
            'id': lab.id,
            'identificador': lab.identificador,
            'tipo': lab.tipo
        } for lab in laboratorios
    ]
    return jsonify(resultado)

# Routes reserva
@app.route('/api/reservas', methods=['GET'])
@jwt_required()
def listar_reservas():
    reservas = Reserva.query.order_by(Reserva.data_inicio.desc()).all()
    resultado = [{'id': r.id, 'data_inicio': r.data_inicio, 'data_fim': r.data_fim, 'professor_responsavel': r.professor_responsavel, 'anotacoes': r.anotacoes, 'laboratorio': {'id': r.laboratorio.id, 'identificador': r.laboratorio.identificador, 'tipo': r.laboratorio.tipo}} for r in reservas]
    return jsonify(resultado)

@app.route('/api/reservas', methods=['POST'])
@jwt_required()
def criar_reserva():
    data = request.get_json()
    required_fields = ['laboratorio_id', 'data_inicio', 'data_fim']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400
    try:
        inicio = datetime.fromisoformat(data['data_inicio'])
        fim = datetime.fromisoformat(data['data_fim'])
    except ValueError:
        return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DDTHH:MM'}), 400
    if fim <= inicio:
        return jsonify({'error': 'A data final deve ser posterior à data inicial'}), 400
    reservas_existentes = Reserva.query.filter_by(laboratorio_id=data['laboratorio_id']).all()
    for r in reservas_existentes:
        r_inicio = datetime.fromisoformat(r.data_inicio)
        r_fim = datetime.fromisoformat(r.data_fim)
        if max(inicio, r_inicio) < min(fim, r_fim):
            return jsonify({'error': f'Este horário já está ocupado'}), 409
    nova_reserva = Reserva(laboratorio_id=data['laboratorio_id'], data_inicio=data['data_inicio'], data_fim=data['data_fim'], professor_responsavel=data.get('professor_responsavel', 'N/A'), anotacoes=data.get('anotacoes', ''))
    db.session.add(nova_reserva)
    db.session.commit()
    return jsonify({'message': 'Reserva criada com sucesso!'}), 201

@app.route('/api/reservas/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_reserva(id):
    reserva = Reserva.query.get(id)
    if not reserva:
        return jsonify({'error': 'Reserva não encontrada'}), 404
    db.session.delete(reserva)
    db.session.commit()
    return jsonify({'message': 'Reserva deletada com sucesso'}), 200

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    print(f"[DEBUG] Procurando usuário com ID: {identity}")
    usuario = Usuario.query.filter_by(id=identity).one_or_none()
    if not usuario:
        print(f"[DEBUG] Usuário não encontrado no banco!")
    return usuario

@app.route('/api/reservas/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_reserva(id):
    data = request.get_json()
    reserva = Reserva.query.get(id)
    if not reserva:
        return jsonify({'error': 'Reserva não encontrada'}), 404

    try:
        inicio = datetime.fromisoformat(data['data_inicio'])
        fim = datetime.fromisoformat(data['data_fim'])
    except ValueError:
        return jsonify({'error': 'Formato de data inválido'}), 400

    if fim <= inicio:
        return jsonify({'error': 'A data final deve ser posterior à inicial'}), 400

    reserva.data_inicio = data['data_inicio']
    reserva.data_fim = data['data_fim']
    reserva.anotacoes = data.get('anotacoes', '')

    db.session.commit()
    return jsonify({'message': 'Reserva atualizada com sucesso!'}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)


