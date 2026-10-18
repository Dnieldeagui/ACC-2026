import sqlite3

# Código executado no início do main.py
# Indica o nome do arquivo.db
DB_PATH = "dataBase.db"
# Função para verificar se a tabela existe. Se ela não existir, cria uma nova de alunos e professores
def verify_tables():
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.executescript("""

CREATE TABLE IF NOT EXISTS alunos_turmas (
    aluno_id INTEGER NOT NULL,
    turma_id INTEGER NOT NULL,
    PRIMARY KEY (aluno_id, turma_id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


CREATE TABLE IF NOT EXISTS turmas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ano TEXT NOT NULL,
    disciplina TEXT NOT NULL,
    codigo TEXT NOT NULL,
    professor_id TEXT NOT NULL,

    FOREIGN KEY (professor_id) REFERENCES professores(id)
);


CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_session TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    senha TEXT NOT NULL,
    turma_id INTEGER,

    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


CREATE TABLE IF NOT EXISTS professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_session TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    senha TEXT NOT NULL,
    disciplina TEXT,
    turma_id INTEGER,

    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    link TEXT NOT NULL,
    professor_id INTEGER NOT NULL,
    turma_id INTEGER,

    FOREIGN KEY (professor_id) REFERENCES professores(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


CREATE TABLE IF NOT EXISTS mensagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    mensagem TEXT NOT NULL
);

""")


# Função para procurar os dados dos alunos, com a senha em rash
def searcher_aluno(x,y):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT * FROM alunos WHERE email = ? AND senha = ?
""",(x,y))
        aluno = sqlrunner.fetchone()
        return aluno is not None


# Função para procurar os dados dos professores, com a senha em rash
def searcher_professor(x,y):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT * FROM professores WHERE email = ? AND senha = ?
""",(x,y))
        professor = sqlrunner.fetchone()
        return professor is not None


# Função para buscar o id_session do aluno
def searcher_aluno_id_session(x,y):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT id_session FROM alunos WHERE email = ? AND senha = ?
""",(x,y))
        id_session = sqlrunner.fetchone()
        return id_session[0] if id_session else None


# Função para buscar o id_session do professor
def searcher_professor_id_session(x,y):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT id_session FROM professores WHERE email = ? AND senha = ?
""",(x,y))
        id_session = sqlrunner.fetchone()
        return id_session[0] if id_session else None

# Função para buscar o id do aluno através do session_id
def searcher_aluno_id(id_session):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute(
            "SELECT id FROM alunos WHERE id_session = ?",
            (id_session,)
        )
        resultado = sqlrunner.fetchone()
        return resultado[0] if resultado else None


# Função para buscar o id do professor através do session_id
def searcher_professor_id(id_session):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute(
            "SELECT id FROM professores WHERE id_session = ?",
            (id_session,)
        )
        resultado = sqlrunner.fetchone()
        return resultado[0] if resultado else None

def searcher_professor_nome(id):
    with sqlite3.connect(DB_PATH) as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute(
            "SELECT nome FROM professores WHERE id = ?",
            (id,)
        )
        resultado = sqlrunner.fetchone()
        return resultado[0] if resultado else None

