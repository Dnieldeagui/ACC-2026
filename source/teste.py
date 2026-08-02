import sqlite3
from flask import Flask, render_template, request

site = Flask(__name__)

@site.route("/")
def home():
    return render_template("home.html")


@site.route("/mapa")
def mapa():
    return render_template("Mapa.html")


@site.route("/perfil")
def perfil():
    return render_template("Perfil.html")


@site.route("/ofensiva")
def ofensiva():
    return render_template("Ofensiva.html")


@site.route("/login/aluno", methods=["GET", "POST"])
def login_aluno():
    if request.method == "POST":
        email = request.form["email"]
        senha = request.form["senha"]

        print(f"Email: {email}")
        print(f"Senha: {senha}")

        # Aqui você fará a consulta ao banco futuramente

    return render_template("login/login-aluno.html")


@site.route("/login/professor", methods=["GET", "POST"])
def login_professor():
    if request.method == "POST":
        email = request.form["email"]
        senha = request.form["senha"]

        print(f"Email: {email}")
        print(f"Senha: {senha}")

    return render_template("login/login-professor.html")


@site.route("/register/aluno", methods=["GET", "POST"])
def register_aluno():
    print("Método:", request.method)

    if request.method == "POST":
        print("Recebi um POST!")
        print(request.form)

    return render_template("register/register-aluno.html")


@site.route("/register/professor", methods=["GET", "POST"])
def register_professor():
    if request.method == "POST":
        pass
#        if valid_login(request.form['email'],request.form['password']):
#            return log_the_user_in(request.form['email'])
        
    return render_template("register/register-professor.html")


if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)