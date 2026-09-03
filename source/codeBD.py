import sqlite3


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
    SELECT * FROM alunos WHERE email = ? AND senha = ?
""",(x,y))
        professor = sqlrunner.fetchone()
        return professor is not None

