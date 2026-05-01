#banco de dados provisorio pra teste, depois que tivermos o banco de dados finalizado ou com quase tudo pronto é só substituir alguns detalhes
import bcrypt

usuarios =[
    {

        "id": 1,
        "nome": "João  Aluno",
        "email": "aluno@escola.com",
        "senha_hash": bcrypt.hashpw("123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "tipo":"aluno"
    },
    {
        "id": 2,
        "nome": "Ronado Professor",
        "email": "professor@escola.com",
        "senha_hash": bcrypt.hashpw("prof123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "tipo":"professor"
    }
]

def find_user_by_email(email):
    #Procura usuário pelo email
    for user in usuarios:
        if user["email"] == email:
            return user
    return None

def create_user(nome, email, senha, tipo="aluno"):
    #Cria um novo usuário
    novo_id = max([u["id"] for u in usuarios]) + 1 if usuarios else 1
    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    novo_usuario = {
        "id": novo_id,
        "nome": nome,
        "email": email,
        "senha_hash": senha_hash,
        "tipo": tipo
    }
    usuarios.append(novo_usuario)
    return novo_usuario

def get_all_users():
    """Retorna todos os usuários (sem senha)"""
    return [{"id": u["id"], "nome": u["nome"], "email": u["email"], "tipo": u["tipo"]} for u in usuarios]