from flask import render_template, redirect, url_for, flash, abort, request
from flask_login import login_user, logout_user, current_user, login_required

from slot import app, db, bcrypt
from slot.forms import RegisterForm, LoginForm, PasswordChange, UploadForm, WithdrawForm
from slot.models import User
from .api_request import make_deposit, make_withdrawal
from .emial import SuccessRegistration


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
        user = User(username=form.username.data, email=form.email.data, password=hashed_password, balance=50)
        db.session.add(user)
        db.session.commit()
        SuccessRegistration(form.username.data, form.email.data).send_mail()
        flash("Sikeres regisztráció!", "success")
        return redirect(url_for("home"))

    return render_template("register.html", title="Regisztráció", form=form)



@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()

        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, False)
            flash("Sikeres bejelentkezés!", "success")
            return redirect(url_for("home"))
        else:
            flash("Sikertelen bejelentkezés! Rossz felhasználónév vagy jelszó!", "danger")
            return redirect(url_for("login"))

    return render_template("login.html", title="Bejelentkezés", form=form)


@app.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    form = PasswordChange()

    return render_template("settings.html", title="Beállítások", form=form)


@app.route("/password_change/<int:id>", methods=["GET", "POST"])
@login_required
def password_change(id):
    form = PasswordChange()

    if form.validate_on_submit():
        user = User.query.get_or_404(id)
        if user.username  == current_user.username:
            if form.new_password.data == form.new_password_confirm.data:
                if bcrypt.check_password_hash(user.password, form.old_password.data):
                    new_password = bcrypt.generate_password_hash(form.new_password.data)
                    user.password = new_password
                    db.session.commit()
                    flash("Sikeres jelszóváltás!", "success")
                    logout_user()
                    return redirect(url_for("login"))
                else:
                    flash("A régi jelszó nem egyezik!", "danger")
            else:
                flash("A két új jelszó nem egyezik meg egymással!", "danger")
        else:
            abort(403)
        return redirect(url_for("settings"))
    return redirect(url_for("settings"))


@app.route("/profile/<int:id>", methods=["GET", "POST"])
def profile(id):
    user = User.query.get_or_404(id)



    return render_template("profile.html", title="Profile")



@app.route("/upload/money=<int:money>", methods=["GET", "POST"])
def upload(money):
    form=UploadForm()

    if form.validate_on_submit():
        card_number = form.card_number.data.replace("-", "")
        money_to_deposit = money
        if make_deposit(card_number, form.cvc_code.data, money_to_deposit):
            current_user.balance += money
            db.session.commit()
            flash("Sikeres tranzakció!", "success")
        else:
            flash("Sikertelen tranzakció!", "danger")
        return redirect(url_for("profile", id=current_user.user_id))
    



    return render_template("upload.html", title="Feltöltés", form=form)

@app.route("/withdraw/money=<int:money>", methods=["GET", "POST"])
def withdraw(money):
    form = WithdrawForm()

    if form.validate_on_submit():
        card_number = form.card_number.data.replace("-", "")
        money_to_withdraw = money
        if make_withdrawal(card_number, form.cvc_code.data, money_to_withdraw):
            current_user.balance -= money
            db.session.commit()
            flash("Sikeres tranzakció!", "success")
        else:
            flash("Sikertelen tranzakció!", "danger")
        return redirect(url_for("profile", id=current_user.user_id))
    
    return render_template("withdraw.html", title="Kifizetés", form=form)



@app.errorhandler(404)
def error_page(error):
    status_code = getattr(error, "code", 500)

    if status_code == 404:
        flash("Valami hiba lépett fel a művelet közben!", "danger")
        return redirect(url_for("home"))


@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    try:
        logout_user()
        flash("Sikeres kijelentkezés!", "info")
    except:
        flash("Valami hiba történt!", "danger")
    return redirect(url_for("home"))
