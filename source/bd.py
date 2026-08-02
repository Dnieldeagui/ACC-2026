import sqlite3

connectbd = sqlite3.connect("dataBase.db")
sqlrunner = connectbd.cursor()

sqlrunner.executescript("""
CREATE TABLE alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL 
);
""")
connectbd.commit()
connectbd.close()
