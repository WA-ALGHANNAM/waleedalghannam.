"""Personal portfolio Flask backend. Run: python app.py"""
import os
import re
import sqlite3
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / 'messages.db'
app = Flask(__name__, static_folder=None)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024


def initialize_database():
    with sqlite3.connect(DATABASE) as connection:
        connection.execute('''CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )''')


@app.get('/')
def home():
    return send_from_directory(BASE_DIR, 'index.html')


@app.get('/<path:filename>')
def assets(filename):
    if filename not in {'style.css', 'script.js'}:
        return jsonify(error='Not found'), 404
    return send_from_directory(BASE_DIR, filename)


@app.post('/api/contact')
def contact():
    if not request.is_json:
        return jsonify(error='يجب إرسال البيانات بصيغة JSON'), 415
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error='بيانات غير صحيحة'), 400
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip()
    message = str(data.get('message', '')).strip()
    if not (2 <= len(name) <= 100 and 10 <= len(message) <= 3000 and len(email) <= 254 and re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email)):
        return jsonify(error='تحقق من الاسم والبريد والرسالة'), 400
    with sqlite3.connect(DATABASE) as connection:
        connection.execute('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', (name, email, message))
    return jsonify(success=True, message='تم استلام رسالتك'), 201


initialize_database()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.environ.get('PORT', '5000')), debug=False)
