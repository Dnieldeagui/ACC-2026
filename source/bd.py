import sqlite3

con = sqlite3.connect("data.db")
cursor = con.cursor()

cursor.executescript("""
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS professor;
DROP TABLE IF EXISTS turmas;
DROP TABLE IF EXISTS atividades;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS mensagens;
DROP TABLE IF EXISTS configuracoes;
DROP TABLE IF EXISTS suporte;

CREATE TABLE alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    idade INTEGER NOT NULL,
    turma INTEGER NOT NULL,
    professor TEXT NOT NULL,
    atividades TEXT NOT NULL
);

CREATE TABLE professor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    turma INTEGER NOT NULL,
    atividades TEXT NOT NULL,
    alunos TEXT NOT NULL
);

CREATE TABLE turmas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    professor TEXT NOT NULL,
    alunos TEXT NOT NULL
);

CREATE TABLE atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno TEXT NOT NULL,
    atividade TEXT NOT NULL,
    feedback TEXT NOT NULL
);

CREATE TABLE mensagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remetente TEXT NOT NULL,
    destinatario TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data DATE NOT NULL
);

CREATE TABLE configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno TEXT NOT NULL,
    configuracao TEXT NOT NULL
);

CREATE TABLE suporte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno TEXT NOT NULL,
    assunto TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data DATE NOT NULL
);
""")

con.commit()
con.close()

print("Banco recriado com sucesso!")