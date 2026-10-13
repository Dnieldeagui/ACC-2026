import sqlite3
import flask 
import hashlib
import codeBD

site = flask.Flask(__name__)
codeBD.verify_tables()

@site.route("/")
def home():
    try:
        return flask.render_template("home.html")
    except:
        return flask.redirect(flask.url_for('error'))


@site.route("/error")
def error():
    return flask.render_template("error_page.html")

@site.route("/mapa")
def mapa():
    try:
        return flask.render_template("map/trilha.html")
    except:
        return flask.redirect(flask.url_for('error'))

@site.route("/perfil")
def perfil():
    try:
        return flask.render_template("Perfil.html")
    except:
        return flask.redirect(flask.url_for('error'))


@site.route("/ofensiva")
def ofensiva():
    try:
        return flask.render_template("Ofensiva.html")
    except:
        return flask.redirect(flask.url_for('error'))

@site.route("/contato")
def contato():
    try:
        return flask.render_template("contato.html")
    except:
        return flask.redirect(flask.url_for('error'))

@site.route("/login/aluno", methods=["GET", "POST"])
def login_aluno():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()

        if codeBD.searcher_aluno(email,senha):
            try:
                return flask.redirect(flask.url_for("dashboard_aluno"))
            except:
                return flask.redirect(flask.url_for('error'))
            
    try:
        return flask.render_template("login/login-aluno.html")
    except:
        return flask.redirect(flask.url_for('error'))

 
@site.route("/login/professor", methods=["GET", "POST"])
def login_professor():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()

        if codeBD.searcher_professor(email,senha):
            try:
                return flask.redirect(flask.url_for("dashboard_professor"))
            except:
                return flask.redirect(flask.url_for('error'))
    try:      
        return flask.render_template("login/login-professor.html")
    except:
        return flask.redirect(flask.url_for('error'))


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
        try:
            return flask.redirect(flask.url_for("home"))
        except:
            return flask.redirect(flask.url_for('error'))
    try:
        return flask.render_template("register/register-aluno.html")
    except:
        return flask.redirect(flask.url_for('error'))


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

        try:
            return flask.redirect(flask.url_for("home"))
        except:
            return flask.redirect(flask.url_for('error'))

    try:
        return flask.render_template("register/register-professor.html")
    except:
        return flask.redirect(flask.url_for('error'))

    
@site.route("/dashboard/professor")
def dashboard_professor():
    try:
        return flask.render_template("dashboard/dashboard-professor.html")
    except:
        return flask.redirect(flask.url_for('error'))



@site.route("/dashboard/aluno")
def dashboard_aluno():
    try:
        return flask.render_template("dashboard/dashboard-aluno.html")
    except:
        return flask.redirect(flask.url_for('error'))


@site.route('/trilhas/atividades')
def atividades():
    fase = flask.request.args.get('fase', 1, type=int)
    try:
        return flask.render_template('map/atividades/atividades.html', fase=fase)
    except:
        return flask.redirect(flask.url_for('error'))


if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)
