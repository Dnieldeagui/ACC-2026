import flask_login
import flask
import sqlite3
import hashlib
import secrets
import codeBD
with sqlite3.connect("dataBase.db") as connectbd:
        sqlrunner = connectbd.cursor()
        sqlrunner.executescript("""
    DROP TABLE alunos;
    DROP TABLE professores;
    DROP TABLE mensagens
""")