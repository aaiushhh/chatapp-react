# 💬 ChatApp React

A sleek real-time chat application built using **React**, **Node.js**, and **Socket.IO**, allowing users to connect and chat instantly. Dockerized for hassle-free deployment.

![ChatApp Preview](./preview.gif)

---

## 🚀 Features

✅ Real-Time Messaging with Socket.IO  
✅ User Authentication System  
✅ Clean, Responsive UI  
✅ Dockerized Full-Stack Setup  
✅ MongoDB Integration

---

## 🛠️ Tech Stack

| Category       | Technologies                  |
|----------------|-------------------------------|
| Frontend       | React, CSS                    |
| Backend        | Node.js, Express              |
| Real-time Comm | Socket.IO                     |
| Database       | MongoDB                       |
| Deployment     | Docker, Docker Compose        |

---

## 📁 Project Structure

chatapp-react/
├── chat-app-backend/ # Express server + Socket.IO
│ └── server.js
├── chat-app-react/ # React frontend
│ └── src/
├── docker-compose.yml # Docker Compose setup
└── README.md # Project documentation

yaml
Copy
Edit

---

## 📦 Installation

### 🔧 Prerequisites

- Node.js & npm
- Docker & Docker Compose
- MongoDB Atlas URI or Local MongoDB setup

---

### 🧪 Local Development

1. **Clone the repository**:

```bash
git clone https://github.com/aaiushhh/chatapp-react.git
cd chatapp-react
Environment variables:

In chat-app-backend, create a .env file:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run the app with Docker:

bash
Copy
Edit
docker-compose up --build
🌐 Frontend: http://localhost:3000
🔗 Backend API: http://localhost:5000

✨ Screenshots
Login Screen	Chat Interface

📬 API Endpoints
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Login existing user
GET	/api/messages	Fetch message history
POST	/api/messages	Send a new message

🤝 Contributing
Want to contribute? Awesome!

Fork the repo

Create your feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

📫 Contact
Aayush Srivastava
🌐 Portfolio
📧 aayushsrivastava.dev@gmail.com
🐙 GitHub: @aaiushhh

Built with ❤️ by Aayush Srivastava

yaml
Copy
Edit

---

### ✅ To finalize:
- Add screenshots (`./screenshots/login.png`, `./screenshots/chat.png`)
- Add a `.env.example` file for user guidance (optional but helpful)
- Replace dummy contact info if needed

Let me know if you’d like a version with shields/badges or a README template with collapsible sections!
