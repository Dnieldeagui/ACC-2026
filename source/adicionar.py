import sqlite3

con = sqlite3.connect("dataBase.db")
cursor = con.cursor()

cursor.execute("""
INSERT INTO alunos (
    nome,
    email,
    senha,
    idade,
    turma,
    professor,
    atividades
)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", (
    "João",
    "joao@email.com",
    "123456",
    16,
    101,
    "Carlos",
    ""
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