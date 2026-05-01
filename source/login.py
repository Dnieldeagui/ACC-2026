import sqlite3
data = sqlite3.connect("data.db")
execu = data.cursor()
dados = execu.execute("""SELECT * FROM escola
""")
print(dados.fetchall())
