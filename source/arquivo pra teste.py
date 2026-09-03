import sqlite3
import hashlib

connectbd = sqlite3.connect("dataBase.db")
sqlrunner = connectbd.cursor()

x = "jk@gmail.com"
y = hashlib.sha256("jk".encode("utf-8")).hexdigest()

sqlrunner.execute("""
    SELECT * FROM alunos WHERE email = ? AND senha = ?
""",(x,y))

print(sqlrunner.fetchone())
connectbd.commit()
connectbd.close()
