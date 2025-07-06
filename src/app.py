# src/app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
import io
import hashlib
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def derive_aes_key(key_str):
    return hashlib.sha256(key_str.encode()).digest()

def compute_sha256(data):
    return hashlib.sha256(data.encode()).hexdigest()

def aes_encrypt(message, key_str):
    key = derive_aes_key(key_str)
    iv = os.urandom(16)

    full_message = message + "::HASH::" + compute_sha256(message)

    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(full_message.encode()) + padder.finalize()

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return iv + ciphertext  # prepend IV to ciphertext

def aes_decrypt(encrypted_data, key_str):
    key = derive_aes_key(key_str)
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_data = decryptor.update(ciphertext) + decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    full_message = unpadder.update(padded_data) + unpadder.finalize()
    return full_message.decode()

def encode_message_in_image(image, encrypted_bytes):
    height, width, _ = image.shape
    max_capacity = height * width
    if len(encrypted_bytes) + 4 > max_capacity:
        raise ValueError("Message too large for this image.")

    # Store length (4 bytes) in first 4 pixels' Blue channel (channel 0)
    msg_len = len(encrypted_bytes)
    for i in range(4):
        row, col = divmod(i, width)
        image[row, col, 0] = (msg_len >> (8 * i)) & 0xFF

    # Store encrypted bytes in subsequent pixels' Blue channel
    idx = 4
    for byte in encrypted_bytes:
        row, col = divmod(idx, width)
        image[row, col, 0] = byte
        idx += 1

def decode_message_from_image(image):
    height, width, _ = image.shape

    # Read message length from first 4 pixels
    msg_len = 0
    for i in range(4):
        row, col = divmod(i, width)
        msg_len |= image[row, col, 0] << (8 * i)

    max_capacity = height * width
    if msg_len + 4 > max_capacity:
        raise ValueError("Encoded message length exceeds image capacity.")

    encrypted_data = []
    for idx in range(4, 4 + msg_len):
        row, col = divmod(idx, width)
        encrypted_data.append(image[row, col, 0])
    return bytes(encrypted_data)

@app.route('/encode', methods=['POST'])
@app.route('/encode', methods=['POST'])
def encode_api():
    try:
        file = request.files.get('image')
        message = request.form.get('message')
        key = request.form.get('key')

        if not file or not message or not key:
            return jsonify({"error": "Image, message, and key are required."}), 400

        filename = secure_filename(file.filename)
        npimg = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"error": "Invalid image file."}), 400

        encrypted_data = aes_encrypt(message, key)
        encode_message_in_image(image, encrypted_data)

        success, encoded_img = cv2.imencode('.png', image)
        if not success:
            return jsonify({"error": "Image encoding failed"}), 500

        return send_file(
            io.BytesIO(encoded_img.tobytes()),
            mimetype='image/png',
            as_attachment=True,
            download_name='encoded_image.png'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/decode', methods=['POST'])
def decode_api():
    try:
        file = request.files.get('image')
        key = request.form.get('key')

        if not file or not key:
            return jsonify({"error": "Image and key are required."}), 400

        npimg = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"error": "Invalid image file."}), 400

        encrypted_data = decode_message_from_image(image)
        decrypted_full = aes_decrypt(encrypted_data, key)

        if "::HASH::" not in decrypted_full:
            return jsonify({"error": "Integrity marker missing."}), 400

        msg, stored_hash = decrypted_full.split("::HASH::")
        computed_hash = compute_sha256(msg)

        if computed_hash != stored_hash:
            return jsonify({"error": "Message integrity check failed."}), 400

        return jsonify({"message": msg, "integrity": "verified"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
