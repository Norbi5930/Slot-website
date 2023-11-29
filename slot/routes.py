from flask import render_template, redirect, url_for, flash

from slot import app, db, bcrypt
from slot.forms import RegisterForm
from slot.models import User


with app.app_context():
    db.create_all()

@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html", title="Kezdőlap")



@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode("utf-8")
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash("Sikeres regisztráció!", "success")
        return redirect(url_for("home"))

    return render_template("register.html", title="Regisztráció", form=form)

