from slot import db, login_manager

@login_manager.user_loader
def load_user(id):
    return User.query.get(str(id))




class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)



    def get_id(self):
        return self.user_id