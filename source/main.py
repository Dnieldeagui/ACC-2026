# Sessão de importações de bibliotecas e o import codeDB é o outro código python usado para CRUD do banco de dados
import sqlite3
import flask 
import hashlib
import codeBD
import secrets
import string

def gerar_codigo():
    caracteres = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(caracteres) for _ in range(6))

### CONFIGURACOES DO SITE ###
site = flask.Flask(__name__)
site.secret_key = "3440e27a867ca2fbbfe2adf49cecd08a700764c43046d6c4c26d4ccf1143da49"

# Verifica as tabelas
codeBD.verify_tables()

# ROTAS DA URL NO FLASK
@site.route("/")
def home():
    if "aluno" in flask.session:
        try: 
            return flask.redirect(flask.url_for('dashboard_aluno'))
        except:
            return flask.redirect(flask.url_for('error'))
    elif "professor" in flask.session:
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

@site.route("/logout/button", methods=["POST"])
def logout_button():
    flask.session.clear()
    return flask.redirect(flask.url_for('home'))

@site.route("/mapa", methods=["POST", "GET"])
def mapa():
    if flask.request.method == "POST":
        nome = flask.request.form["atividade"]
        link = flask.request.form["link"]
        turma = flask.request.form["turma"]

        id_session = flask.session.get("professor")
        id_professor = codeBD.searcher_professor_id(id_session)

        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()
                
        sqlrunner.execute("""
            INSERT INTO atividades (nome, link, turma_id, professor_id)
            VALUES (?, ?, ?, ?)
        """,(nome, link, turma, id_professor))
        connectbd.commit()
        connectbd.close()

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

@site.route("/contato", methods = ["POST", "GET"])
def contato():
    if flask.request.method == "POST":
        name = flask.request.form["nome"]
        email = flask.request.form["email"]
        mensagem = flask.request.form["mensagem"]
        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()
                
        sqlrunner.execute("""
            INSERT INTO mensagens (nome,email,mensagem)
            VALUES (?, ?, ?)
        """,(name,email,mensagem))
        connectbd.commit()
        connectbd.close()
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

# 🔥 ROTA DO DASHBOARD DO PROFESSOR ATUALIZADA (Aceita POST e envia turmas)
@site.route("/dashboard/professor", methods=["GET", "POST"])
def dashboard_professor():
    if "professor" not in flask.session:
        return flask.redirect(flask.url_for('home'))

    id_session = flask.session.get("professor")
    id_professor = codeBD.searcher_professor_id(id_session)

    connectbd = sqlite3.connect("dataBase.db")
    sqlrunner = connectbd.cursor()

    if flask.request.method == "POST":
        nome = flask.request.form["atividade"]
        link = flask.request.form["link"]
        turma = flask.request.form["turma"]

        sqlrunner.execute("""
            INSERT INTO atividades (nome, link, turma_id, professor_id)
            VALUES (?, ?, ?, ?)
        """, (nome, link, turma, id_professor))
        connectbd.commit()
        
        connectbd.close()
        return flask.redirect(flask.url_for("mapa"))

    sqlrunner.execute("SELECT id, ano, disciplina, codigo FROM turmas WHERE professor_id = ?", (id_professor,))
    turmas = sqlrunner.fetchall()
    connectbd.close()

    try:
        return flask.render_template("dashboard/dashboard-professor.html", turmas=turmas)
    except Exception as e:
        print(e)
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

@site.route("/turmas", methods=["GET", "POST"])
def turmas():
    if "aluno" in flask.session:
        id_session = flask.session.get("aluno")
        id_aluno = codeBD.searcher_aluno_id(id_session)

        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("SELECT nome FROM alunos WHERE id = ?", (id_aluno,))
        r = sqlrunner.fetchone()
        nome_aluno = r[0] if r else "Usuário"

        if flask.request.method == "POST":
            codigo = flask.request.form.get("codigo", "").upper().strip()
            sqlrunner.execute("SELECT id FROM turmas WHERE codigo = ?", (codigo,))
            t = sqlrunner.fetchone()
            if t and id_aluno:
                try:
                    sqlrunner.execute("INSERT INTO alunos_turmas (aluno_id, turma_id) VALUES (?, ?)", (id_aluno, t[0]))
                    connectbd.commit()
                except sqlite3.IntegrityError:
                    pass
            connectbd.close()
            return flask.redirect(flask.url_for("turmas"))

        turmas = []
        atividades_aluno = []
        
        if id_aluno:
            sqlrunner.execute("""
                SELECT t.id, t.ano, t.disciplina, t.codigo
                FROM turmas t
                JOIN alunos_turmas at ON at.turma_id = t.id
                WHERE at.aluno_id = ?
            """, (id_aluno,))
            turmas = sqlrunner.fetchall()

            sqlrunner.execute("""
                SELECT a.nome, a.link, p.nome 
                FROM atividades a
                JOIN turmas t ON t.id = a.turma_id
                JOIN alunos_turmas at ON at.turma_id = t.id
                JOIN professores p ON p.id = a.professor_id
                WHERE at.aluno_id = ?
            """, (id_aluno,))
            atividades_aluno = sqlrunner.fetchall()

        connectbd.close()
        return flask.render_template("turmas.html", nome_professor=nome_aluno, turmas=turmas, atividades=atividades_aluno)

    elif "professor" in flask.session:
        id_session = flask.session.get("professor")
        id_professor = codeBD.searcher_professor_id(id_session)
        professor = codeBD.searcher_professor_nome(id_professor) or "Usuário"

        if flask.request.method == "POST":
            ano = flask.request.form["ano"]
            disciplina = flask.request.form["disciplina"]
            codigo = flask.request.form["codigo"]

            connectbd = sqlite3.connect("dataBase.db")
            sqlrunner = connectbd.cursor()
            sqlrunner.execute("""
                INSERT INTO turmas (ano, disciplina, codigo, professor_id)
                VALUES (?, ?, ?, ?)
            """, (ano, disciplina, codigo, id_professor))
            connectbd.commit()
            connectbd.close()
            return flask.redirect(flask.url_for("turmas"))

        connectbd = sqlite3.connect("dataBase.db")
        sqlrunner = connectbd.cursor()
        sqlrunner.execute("SELECT id, ano, disciplina, codigo FROM turmas WHERE professor_id = ?", (id_professor,))
        turmas = sqlrunner.fetchall()

        sqlrunner.execute("""
            SELECT a.nome, a.link, t.ano, t.disciplina
            FROM atividades a
            JOIN turmas t ON t.id = a.turma_id
            WHERE a.professor_id = ?
        """, (id_professor,))
        atividades_prof = sqlrunner.fetchall()
        
        connectbd.close()
        return flask.render_template("turmas.html", nome_professor=professor, turmas=turmas, atividades=atividades_prof)

    return flask.render_template("turmas.html", nome_professor="Usuário", turmas=[], atividades=[])

@site.route("/perfil/aluno", methods=["POST", "GET"])
def perfil_aluno():
    if "aluno" not in flask.session:
        return flask.redirect(flask.url_for('home'))

    id_session = flask.session.get("aluno")
    id_aluno = codeBD.searcher_aluno_id(id_session)

    aluno_nome = codeBD.searcher_aluno_nome(id_aluno) or "Usuário"
    aluno_email = codeBD.searcher_aluno_email(id_aluno) or "exemplo@email.com"

    if flask.request.method == "POST":
        acao = flask.request.form.get("acao")

        if acao == "editar_perfil":
            novo_nome = flask.request.form["nome"]
            novo_email = flask.request.form["email"]

            connectbd = sqlite3.connect("dataBase.db")
            sqlrunner = connectbd.cursor()
            sqlrunner.execute("UPDATE alunos SET nome = ?, email = ? WHERE id = ?", (novo_nome, novo_email, id_aluno))
            connectbd.commit()
            connectbd.close()

            flask.flash("Perfil alterado com sucesso!", "sucesso")
            return flask.redirect(flask.url_for('perfil_aluno'))

        elif acao == "alterar_senha":
            senha_atual = flask.request.form["senha_atual"]
            senha_nova = flask.request.form["senha_nova"]
            senha_atual_hash = hashlib.sha256(senha_atual.encode("utf-8")).hexdigest()

            connectbd = sqlite3.connect("dataBase.db")
            sqlrunner = connectbd.cursor()
            sqlrunner.execute("SELECT senha FROM alunos WHERE id = ?", (id_aluno,))
            resultado = sqlrunner.fetchone()
            connectbd.close()
            senha_real = resultado[0] if resultado else None

            if senha_atual_hash == senha_real:
                senha_nova_hash = hashlib.sha256(senha_nova.encode("utf-8")).hexdigest()
                connectbd = sqlite3.connect("dataBase.db")
                sqlrunner = connectbd.cursor()
                sqlrunner.execute("UPDATE alunos SET senha = ? WHERE id = ?", (senha_nova_hash, id_aluno))
                connectbd.commit()
                connectbd.close()
                flask.flash("Senha alterada com sucesso!", "sucesso")
            else:
                flask.flash("A senha atual está incorreta. Tente novamente.", "erro")

            return flask.redirect(flask.url_for('perfil_aluno'))

    return flask.render_template("profile/perfil-aluno.html", nome=aluno_nome, email=aluno_email)

@site.route("/perfil/professor", methods=["POST", "GET"])
def perfil_professor():
    if "professor" not in flask.session:
        return flask.redirect(flask.url_for('home'))

    id_session = flask.session.get("professor")
    id_professor = codeBD.searcher_professor_id(id_session)

    professor_nome = codeBD.searcher_professor_nome(id_professor) or "Usuário"
    professor_email = codeBD.searcher_professor_email(id_professor) or "exemplo@email.com"
    professor_disciplina = codeBD.searcher_professor_disciplina(id_professor) or "Disciplina"

    if flask.request.method == "POST":
        acao = flask.request.form.get("acao")

        if acao == "editar_perfil":
            nome = flask.request.form["nome"]
            email = flask.request.form["email"]
            disciplina = flask.request.form["disciplina"]

            connectbd = sqlite3.connect("dataBase.db")
            sqlrunner = connectbd.cursor()
            sqlrunner.execute("UPDATE professores SET nome = ?, email = ?, disciplina = ? WHERE id = ?", (nome, email, disciplina, id_professor))
            connectbd.commit()
            connectbd.close()

            flask.flash("Perfil alterado com sucesso!", "sucesso")
            return flask.redirect(flask.url_for('perfil_professor'))

        elif acao == "alterar_senha":
            senha_atual = flask.request.form["senha_atual"]
            senha_nova = flask.request.form["senha_nova"]
            senha_atual_hash = hashlib.sha256(senha_atual.encode("utf-8")).hexdigest()

            connectbd = sqlite3.connect("dataBase.db")
            sqlrunner = connectbd.cursor()
            sqlrunner.execute("SELECT senha FROM professores WHERE id = ?", (id_professor,))
            resultado = sqlrunner.fetchone()
            connectbd.close()
            senha_real = resultado[0] if resultado else None

            if senha_atual_hash == senha_real:
                senha_nova_hash = hashlib.sha256(senha_nova.encode("utf-8")).hexdigest()
                connectbd = sqlite3.connect("dataBase.db")
                sqlrunner = connectbd.cursor()
                sqlrunner.execute("UPDATE professores SET senha = ? WHERE id = ?", (senha_nova_hash, id_professor))
                connectbd.commit()
                connectbd.close()
                flask.flash("Senha alterada com sucesso!", "sucesso")
            else:
                flask.flash("A senha atual está incorreta. Tente novamente.", "erro")

            return flask.redirect(flask.url_for('perfil_professor')) 

    return flask.render_template("profile/perfil-professor.html", nome=professor_nome, email=professor_email, disciplina=professor_disciplina)

if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)