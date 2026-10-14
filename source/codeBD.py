import sqlite3

# Código executado no início do main.py

# Função para verificar se a tabela existe. Se ela não existir, cria uma nova de alunos e professores
def verify_tables():
    with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.executescript("""
CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_session TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    senha TEXT NOR NULL
);

CREATE TABLE IF NOT EXISTS professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_session TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    senha TEXT NOT NULL,
    disciplina TEXT
);

""")

# Função para procurar os dados dos alunos, com a senha em rash
def searcher_aluno(x,y):
    with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT * FROM alunos WHERE email = ? AND senha = ?
""",(x,y))
        aluno = sqlrunner.fetchone()
        return aluno is not None

# Função para procurar os dados dos professores, com a senha em rash
def searcher_professor(x,y):
    with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT * FROM professores WHERE email = ? AND senha = ?
""",(x,y))
        professor = sqlrunner.fetchone()
        return professor is not None
