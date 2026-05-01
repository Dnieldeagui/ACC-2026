import sqlite3
data = sqlite3.connect("data.db")
execu = data.cursor()

def addata(x,y):
    execu.execute(f"""INSERT INTO escola
                  VALUES('{x}','{y}')
    """)
    data.commit()
addata("alo","ala")
