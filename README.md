# 💬 ChatApp React

A sleek and modern real-time chat application built using **React**, **Node.js**, and **Socket.IO**, allowing users to connect and chat instantly. The entire stack is dockerized for seamless development and deployment.

![ChatApp Preview](./preview.gif)

---

## 🚀 Features

✨ Real-time messaging with Socket.IO  
🔐 Secure user authentication system  
📱 Responsive and elegant UI  
🐳 Full-stack Docker setup for easy deployment  
💾 MongoDB integration for persistent storage

---

## 🛠️ Tech Stack

| Layer        | Technologies               |
|--------------|-----------------------------|
| Frontend     | React, CSS                  |
| Backend      | Node.js, Express            |
| Realtime     | Socket.IO                   |
| Database     | MongoDB                     |
| DevOps       | Docker, Docker Compose      |

---

## 📁 Project Structure

```
chatapp-react/
├── chat-app-backend/       # Express server + Socket.IO
│   └── server.js
├── chat-app-react/         # React frontend
│   └── src/
├── docker-compose.yml      # Docker Compose setup
└── README.md               # Project documentation
```

---

## 📦 Getting Started

### 🔧 Prerequisites

- Node.js & npm
- Docker & Docker Compose
- MongoDB Atlas URI or Local MongoDB setup

### 🧪 Local Development

1. **Clone the repository**:

```bash
git clone https://github.com/aaiushhh/chatapp-react.git
cd chatapp-react
```

2. **Set up environment variables**:

Create a `.env` file in `chat-app-backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. **Run the app with Docker**:

```bash
docker-compose up --build
```

> 🌐 Frontend: http://localhost:3000  
> 🔗 Backend API: http://localhost:5000

---

## ✨ Screenshots

| Login Screen                          | Chat Interface                          |
|--------------------------------------|-----------------------------------------|
| ![Login](./screenshots/login.png)    | ![Chat](./screenshots/chat.png)         |

---

## 📬 API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | /api/register     | Register a new user      |
| POST   | /api/login        | Login existing user      |
| GET    | /api/messages     | Fetch message history    |
| POST   | /api/messages     | Send a new message       |

---

## 🤝 Contributing

Want to contribute? Awesome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## 📫 Contact

**Aayush Srivastava**  
🌐 [Portfolio](https://aaiushhh.github.io)  
📧 aayushsrivastava.dev@gmail.com  
🐙 GitHub: [@aaiushhh](https://github.com/aaiushhh)

---

> Built with ❤️ by Aayush Srivastava
