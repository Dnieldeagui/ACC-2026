import flask_login
import flask
import sqlite3
import hashlib
import secrets
import codeBD

site = flask.Flask(__name__)
site.config("SESSION_PERMANENT") = False
site.config("SESSION_TYPE") = "filesystem"
flask_login.Session(site)




@site.route("/error")
def error():
    return flask.render_template("error_page.html")


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


if __name__ == "__main__":
    site.run(host="0.0.0.0", port=5000, debug=True)
