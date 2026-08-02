import sqlite3

con = sqlite3.connect("dataBase.db")
cursor = con.cursor()

cursor.execute("""
INSERT INTO alunos (
    nome,
    email,
    senha,
)
VALUES (?, ?, ?)
""", (
    nome,
    email,
    senha
))

con.commit()
con.close()

print("Aluno cadastrado com sucesso!")


#isso aqui tava no teste
#import sqlite3
#
#con = sqlite3.connect("data.db")
#cursor = con.cursor()
#
#cursor.execute("SELECT * FROM alunos")
#
#for aluno in cursor.fetchall():
#    print(aluno)
#
#con.close()