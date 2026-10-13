import sqlite3

def verify_tables():
    with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.executescript("""
CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    disciplina TEXT
);

""")

def searcher_aluno(x,y):
    with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT * FROM alunos WHERE email = ? AND senha = ?
""",(x,y))
        aluno = sqlrunner.fetchone()
        return aluno is not None

def searcher_professor(x,y):
    with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("""
    SELECT * FROM professores WHERE email = ? AND senha = ?
""",(x,y))
        professor = sqlrunner.fetchone()
        return professor is not None
    

