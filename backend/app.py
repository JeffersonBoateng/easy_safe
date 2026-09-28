from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras

load_dotenv()

app = Flask(__name__)
CORS(app)


def get_db_connection():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    return conn


@app.route('/')
def home():
    return jsonify({'message': 'EasySafe backend is running'})


@app.route('/users')
def get_users():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT user_id, name, email FROM users;')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)


@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING user_id;',
        (data['name'], data['email'], generate_password_hash(data['password']))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'user_id': new_id, 'message': 'User created'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT user_id, name, email, password FROM users WHERE email = %s;', (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user is None:
        return jsonify({'message': 'Invalid email or password'}), 401

    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password'}), 401

    return jsonify({
        'message': 'Login successful',
        'user_id': user['user_id'],
        'name': user['name'],
        'email': user['email']
    }), 200


@app.route('/accounts')
def get_accounts():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if user_id:
        cur.execute('SELECT * FROM accounts WHERE user_id = %s;', (user_id,))
    else:
        cur.execute('SELECT * FROM accounts;')
    accounts = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(accounts)


@app.route('/accounts', methods=['POST'])
def create_account():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO accounts (user_id, name, account_type, balance, currency) VALUES (%s, %s, %s, %s, %s) RETURNING account_id;',
        (data['user_id'], data['name'], data['account_type'], data.get('balance', 0), data.get('currency', 'GHS'))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'account_id': new_id, 'message': 'Account created'}), 201


@app.route('/categories')
def get_categories():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if user_id:
        cur.execute('SELECT * FROM categories WHERE user_id = %s;', (user_id,))
    else:
        cur.execute('SELECT * FROM categories;')
    categories = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(categories)


@app.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO categories (user_id, name, category_type) VALUES (%s, %s, %s) RETURNING category_id;',
        (data['user_id'], data['name'], data['category_type'])
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'category_id': new_id, 'message': 'Category created'}), 201


@app.route('/transactions')
def get_transactions():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if user_id:
        cur.execute('''
            SELECT t.* FROM transactions t
            JOIN accounts a ON t.account_id = a.account_id
            WHERE a.user_id = %s
            ORDER BY t.transaction_date DESC;
        ''', (user_id,))
    else:
        cur.execute('SELECT * FROM transactions;')
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(transactions)


@app.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO transactions (account_id, category_id, amount, transaction_type, transaction_date) VALUES (%s, %s, %s, %s, COALESCE(%s, CURRENT_DATE)) RETURNING transaction_id;',
        (data['account_id'], data['category_id'], data['amount'], data['transaction_type'], data.get('transaction_date'))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'transaction_id': new_id, 'message': 'Transaction created'}), 201


if __name__ == '__main__':
    app.run(debug=True)