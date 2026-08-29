import sqlite3
import flask 
import hashlib


site = flask.Flask(__name__)

@site.route("/")
def home():
    return flask.render_template("home.html")


@site.route("/mapa")
def mapa():
    return flask.render_template("Mapa.html")


@site.route("/perfil")
def perfil():
    return flask.render_template("Perfil.html")


@site.route("/ofensiva")
def ofensiva():
    return flask.render_template("Ofensiva.html")


@site.route("/contato")
def contato():
    return flask.render_template("contato.html")


@site.route("/login/aluno", methods=["GET", "POST"])
def login_aluno():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()

    return flask.render_template("login/login-aluno.html")


@site.route("/login/professor", methods=["GET", "POST"])
def login_professor():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()

    return flask.render_template("login/login-professor.html")


@site.route("/register/aluno", methods=["GET", "POST"])
def register_aluno():
    if flask.request.method == "POST":
        
        nome = flask.request.form["nome"]
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()
        
        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()

        sqlrunner.execute("""
            INSERT INTO alunos (nome, email, senha)
            VALUES (?, ?, ?)
        """, (nome, email, senha))

        connectbd.commit()
        connectbd.close()
        return flask.redirect(flask.url_for("home"))
    return flask.render_template("register/register-aluno.html")


@site.route("/register/professor", methods=["GET", "POST"])
def register_professor():
    if flask.request.method == "POST":
        nome = flask.request.form["nome"]
        email = flask.request.form["email"]
        disciplina = flask.request.form["disciplina"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()
                
        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()
        
        sqlrunner.execute("""
            INSERT INTO professores (nome, email,disciplina, senha)
            VALUES (?, ?, ?, ?)
            """, (nome, email, disciplina, senha))
        
        connectbd.commit()
        connectbd.close()
        
    
        return flask.redirect(flask.url_for("home"))
    return flask.render_template("register/register-professor.html")

    
@site.route("/dashboard/professor")
def dashboard_professor():
    return flask.render_template("dashboards/dashboard-professor.html")


if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)
