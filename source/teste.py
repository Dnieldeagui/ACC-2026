import sqlite3
import flask 
import hashlib


site = flask.Flask(__name__)

connectbd = sqlite3.connect("dataBase.db")
sqlrunner = connectbd.cursor()

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


@site.route("/login/aluno", methods=["GET", "POST"])
def login_aluno():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = flask.request.form["senha"]

        print(f"Email: {email}")
        print(f"Senha: {senha}")

        # Aqui você fará a consulta ao banco futuramente

    return flask.render_template("login/login-aluno.html")


@site.route("/login/professor", methods=["GET", "POST"])
def login_professor():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = flask.request.form["senha"]

        print(f"Email: {email}")
        print(f"Senha: {senha}")

    return flask.render_template("login/login-professor.html")


@site.route("/register/aluno", methods=["GET", "POST"])
def register_aluno():
    if flask.request.method == "POST":
        
        nome = flask.request.form["nome"]
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()
        
        sqlrunner.execute("""
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
        
        return flask.redirect(flask.url_for("home"))
    return flask.render_template("register/register-aluno.html")


@site.route("/register/professor", methods=["GET", "POST"])
def register_professor():
    if flask.request.method == "POST":
        nome = flask.request.form["nome"]
        email = flask.request.form["email"]
        senha = hash(flask.request.form["senha"])
        
        
    
        return flask.redirect(flask.url_for("home"))
    return flask.render_template("register/register-professor.html")


if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)
