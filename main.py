from app import app
from google_auth import google_auth
import routes

app.register_blueprint(google_auth)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
