import sqlite3

con = sqlite3.connect("data.db")
cursor = con.cursor()

cursor.execute("SELECT * FROM alunos")

for aluno in cursor.fetchall():
    print(aluno)

con.close()