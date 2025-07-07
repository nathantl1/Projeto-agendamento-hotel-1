from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # libera acesso do React

@app.route('/')
def index():
    return {'mensagem': 'API funcionando'}

if __name__ == '__main__':
    app.run(debug=True)
