import sqlite3
DB_PATH = "dataBase.db"
with sqlite3.connect(DB_PATH) as connectbd:
    sqlrunner = connectbd.cursor()
    sqlrunner.executescript("""
    DROP TABLE alunos;
    DROP TABLE professores;
    DROP TABLE mensagens
""")