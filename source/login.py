# Importação de Bibliotecas
import sqlite3
from pathlib import Path

# Caminho do banco de dados e o seu nome
ROOT_DIR = Path(__file__).parent # Caminho do arquivo
DB_NAME = 'db.sqlite3' # Nome do arquivo
DB_FILE =   ROOT_DIR / DB_NAME # Arquivo do database
TABLE_NAME = 'login' #nome da tabela

connection = sqlite3.connect(DB_FILE) # Inicia a conexão com o bd
cursor = connection.cursor() # Inicia o cursor/CRUD do bd


# Criação da tabela
cursor.execute(
    f'CREATE TABLE IF NOT EXISTS {TABLE_NAME}' # Cria a tabela se ela não existir
    '('
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' # Auto-incrementação automática da Id do usuário
    'mail TEXT UNIQUE,'
    'password TEXT,'
    'name TEXT,'
    'cargo BOOLEAN'
    ')'
)
connection.commit() # Commita o código

# Função usada para printar os valores
def exibir_tabela():
    cursor.execute(
        f'SELECT * FROM {TABLE_NAME} '
    )
    for row in cursor.fetchall():
        print(row)
    connection.commit()

# Função usada para inserir valores na tabela sem o SqlInjection e erro de duplicata de email
def inserir_valores(mail, password, name, cargo):
    try:
        cursor.execute(
            f'INSERT INTO {TABLE_NAME} (mail, password, name, cargo) '
            'VALUES (?, ?, ?, ?)', (mail, password, name, cargo)
        )
        connection.commit()
        print("Usuário cadastrado com sucesso")
    except sqlite3.IntegrityError:
        print('O email inserido já foi registrado')

# Exemplo de inserção de dados
inserir_valores(
    'ExemploEmail@gmail.com',
    'senha_daora1234',
    'Nome_exemplo',
    'Cargo_exemplo'
)

print('\n')
exibir_tabela()

cursor.close() # Fecha o cursor
connection.close() # Fecha a conexão com o bd