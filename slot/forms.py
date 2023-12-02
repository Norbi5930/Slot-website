from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, SubmitField
from wtforms.validators import Length, Email, EqualTo, InputRequired, ValidationError

from slot import bcrypt
from slot.models import User

class RegisterForm(FlaskForm):
    username = StringField(render_kw={"placeholder": "Felhasználónév"}, validators=[InputRequired(), Length(min=3)])
    email = EmailField(render_kw={"placeholder": "E-mail"}, validators=[InputRequired(), Email(message="A megadott formátum nem megfelelő!")])
    password = PasswordField(render_kw={"placeholder": "Jelszó"}, validators=[InputRequired()])
    password_confirm = PasswordField(render_kw={"placeholder": "Jelszó újra"}, validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Regisztráció")


    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()

        if user:
            raise ValidationError(message="A felhasználónév már foglalt!")
        
        if len(username.data) <= 0:
            raise ValidationError(message="Ez a mező kitöltése kötelező!")
        
    def validate_email(self, email):
        email = User.query.filter_by(email=email.data).first()

        if email:
            raise ValidationError(message="Az E-mail cím már foglalt!")
    
    
    def validate_password(self, password):

        if len(password.data) <= 0:
            raise ValidationError(message="Ez a mező kitöltése kötelező!")
        elif len(password.data) < 8:
            raise ValidationError(message="A jelszónak legalább 8 karakternek kell lennie!")
        


class LoginForm(FlaskForm):
    username = StringField(render_kw={"placeholder": "Felhasználónév"}, validators=[InputRequired()])
    password = PasswordField(render_kw={"placeholder": "Jelszó"}, validators=[InputRequired()])
    submit = SubmitField("Bejelentkezés")



class PasswordChange(FlaskForm):
    old_password = PasswordField(render_kw={"placeholder": "Régi jelszó"}, validators=[InputRequired()])
    new_password = PasswordField(render_kw={"placeholder": "Új jelszó"}, validators=[InputRequired(), Length(min=8)])
    new_password_confirm = PasswordField(render_kw={"placeholder": "Új jelszó újra"}, validators=[InputRequired(), Length(min=8)])
    submit = SubmitField("Megváltoztatás")