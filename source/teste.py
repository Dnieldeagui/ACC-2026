import sqlite3
import flask
#isso aqui so é util se as paginas tiverem dentro de uma pasta chamada templates(nao da pra usar caminho absolutos)
#site = flask.Flask(__name__)

#puta merda 
site = flask.Flask(__name__)

@site.route("/")
def home():
    #return flask.render_template("/workspaces/ACC-2026/pages/home.html")
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

@site.route("/login/aluno")
def login_aluno():
    return flask.render_template("login/login-aluno.html")
#a cada segundo estou mas perto da insanidade completa

@site.route("/login/professor")
def login_professor():
    return flask.render_template("login/login-professor.html")

site.run()


#vai tomar no cu na proxima reuniao tem que separar essas porras por pasta caralho