**CosmoVault**

A beautiful steganography tool with an animated galaxy background for securely hiding and revealing messages within images.

**✨ Features**

🔐 Secure Steganography: Hide secret messages within images
🎨 Animated Galaxy Background: Stunning space-themed UI with twinkling stars, shooting stars, and nebulas
🌓 Dark/Light Mode: Toggle between cosmic themes
🔑 Encryption: Password-protected message encoding/decoding
📱 Responsive Design: Works on desktop and mobile devices
🌟 Multiple Star Types: Twinkling, sparkling, shining, and fast-twinkling stars
🌠 Shooting Stars: Realistic comet effects with glowing tails


**## 🧱 Tech Stack**

| Layer      | Tech Used              |
|------------|------------------------|
| Frontend   | React (Vite)           |
| Backend    | Flask + OpenCV         |
| Crypto     | AES-CBC + SHA256       |
| Styling    | CSS-in-JS + animations |
| Deployment | Vercel (frontend), Render (backend) |


**🧠 How It Works**

**🔐 Encoding Flow**
1. User uploads a PNG image.
2. Enters the message + a key (used for AES encryption).
3. Backend encrypts message using:

    - AES-CBC with SHA-256 derived key
    - PKCS7 padding
    - Appends a ::HASH::[sha256] for integrity verification
4. Encrypted bytes are embedded in the image’s pixel LSB.
5. Modified image is returned for download.

**🔎 Decoding Flow**
1. User uploads the encoded PNG and provides the original key.
2. Backend:
    - Extracts bytes from pixels
    - Decrypts using AES-CBC with same key
    - Verifies SHA-256 hash against message
3. If integrity is verified ✅ → returns the message.



**🛠️ Installation**

1. Clone the repository
    - git clone https://github.com/yourusername/stellarcrypt.git
2. Install dependencies
    - npm install
3. Start the development server
    - npm start
O4. pen your browser
    - Navigate to http://localhost:3000
  

**🏗️ Backend Setup**
This project requires a Python Flask backend for image processing:

1. Install Python dependencies
    - pip install flask pillow cryptography flask-cors
2. Create backend server (app.py)
3. Run the backend
    - python app.py
