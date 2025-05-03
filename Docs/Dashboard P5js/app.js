from flask import Flask, jsonify, request
import mysql.connector

app = Flask(__name__)

DB_HOST = 'proyecto2.c8t44m2yibzq.us-east-1.rds.amazonaws.com'
DB_USER = 'admin'
DB_PASSWORD = 'arquig18'
DB_NAME = 'proyecto2'

def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

@app.route('/status')
def status():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM bombilla ORDER BY timestamp DESC LIMIT 1")
    bombilla = cursor.fetchone()
    cursor.execute("SELECT * FROM vibrador ORDER BY timestamp DESC LIMIT 1")
    vibrador = cursor.fetchone()
    cursor.execute("SELECT * FROM buzzer ORDER BY timestamp DESC LIMIT 1")
    buzzer = cursor.fetchone()
    conn.close()
    return jsonify({
        'bombilla': bombilla,
        'vibrador': vibrador,
        'buzzer': buzzer
    })

@app.route('/set_buzzer', methods=['POST'])
def set_buzzer():
    estado = request.json.get('estado')
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO buzzer (id_usuario, estado, timestamp, origen_cambio) VALUES (%s, %s, NOW(), %s)",
                   (1, estado, 'web_app'))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
