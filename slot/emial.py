from flask import render_template
from flask_mail import Message, Mail
from . import app



mail = Mail(app)


class SuccessRegistration:
    def __init__(self, username, email):
        self.username = username
        self.email = email

    def send_mail(self):
        try:
            msg = Message(f"Üdvözlünk, {self.username}", sender="bnorbert0925@gmail.com" ,recipients=[self.email])
            msg.html = render_template("register_email.html", name=self.username)
            mail.send(msg)
            return
        except ValueError as error:
            return error