import sqlite3
import flask 
import hashlib
import codeBD
import secrets
# Sessão de importações de bibliotecas e o import codeDB é o outro código python usado para CRUD do banco de dados


### CONFIGURACOES DO SITE NAO MEXA
site = flask.Flask(__name__)
site.secret_key = "3440e27a867ca2fbbfe2adf49cecd08a700764c43046d6c4c26d4ccf1143da49"

#verifica as tabelas 
codeBD.verify_tables()

# ROTAS DA URL NO FLASK (usadas na url EX.: http://192.168.1.5:5000/ = home.html; http://192.168.1.5:5000/mapa = trilha.html)
@site.route("/")
def home():
    # Condicional para ver autenticar se o aluno esta logado e redireciona-lo para o dashboard
    if "aluno" in flask.session:
        aluno = flask.session["aluno"]
        try: 
            return flask.redirect(flask.url_for('dashboard_aluno'))
        except:
            return flask.redirect(flask.url_for('error'))
        
    # Condicional para ver autenticar se o professor esta logado e redireciona-lo para o dashboard
    elif "professor" in flask.session:
        professor = flask.session["professor"]
        try: 
            return flask.redirect(flask.url_for('dashboard_professor'))
        except:
            return flask.redirect(flask.url_for('error'))
        
    else:
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

# Rota do login e verificação do Bypass, verifica se o email e a senha constam no banco de dados.
@site.route("/login/aluno", methods=["GET", "POST"])
def login_aluno():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()

        if codeBD.searcher_aluno(email,senha):
            aluno = codeBD.searcher_aluno_id_session(email,senha)
            flask.session["aluno"] = aluno
            try:
                return flask.redirect(flask.url_for("dashboard_aluno"))
            except:
                return flask.redirect(flask.url_for('error'))
            
    try:
        return flask.render_template("login/login-aluno.html")
    except:
        return flask.redirect(flask.url_for('error'))


# Rota do login e verificação do Bypass, verifica se o email e a senha constam no banco de dados. 
@site.route("/login/professor", methods=["GET", "POST"])
def login_professor():
    if flask.request.method == "POST":
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()

        if codeBD.searcher_professor(email,senha):
            professor = codeBD.searcher_professor_id_session(email,senha)
            flask.session["professor"] = professor
            try:
                return flask.redirect(flask.url_for("dashboard_professor"))
            except:
                return flask.redirect(flask.url_for('error'))
    try:      
        return flask.render_template("login/login-professor.html")
    except:
        return flask.redirect(flask.url_for('error'))

# Rota de criação de contas e atualização delas no BD
@site.route("/register/aluno", methods=["GET", "POST"])
def register_aluno():
    if flask.request.method == "POST":
        
        nome = flask.request.form["nome"]
        email = flask.request.form["email"]
        senha = hashlib.sha256(flask.request.form["senha"].encode("utf-8")).hexdigest()
        
        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()
        
        sqlrunner.execute("""
            INSERT INTO alunos (nome, email, senha, id_session)
            VALUES (?, ?, ?, ?)
        """, (nome, email, senha, secrets.token_urlsafe(32)))

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


# Rota de criação de contas e atualização delas no BD
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
            INSERT INTO professores (nome, email,disciplina, senha, id_session)
            VALUES (?, ?, ?, ?, ?)
            """, (nome, email, disciplina, senha, secrets.token_urlsafe(32)))
        
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

# Condição que reconhece que o código está sendo rodado nesse arquivo como principal
if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)
