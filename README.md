# Therapy AI - Intelligent Mental Health Companion

Therapy AI is a sophisticated, stateful AI-driven platform designed to provide personalized mental health support. Built with a focus on deep context awareness and long-term memory, it leverages Retrieval-Augmented Generation (RAG) to offer meaningful, therapeutic conversations.

## 🚀 Key Features

- **Stateful AI Conversations**:Therapy AI remembers your past interactions using a dual-memory system (Redis for short-term, Qdrant for long-term).
- **RAG (Retrieval-Augmented Generation)**: Dynamically retrieves relevant past context to provide highly personalized responses.
- **Voice Integration**: Supports voice-to-text and text-to-voice for a more natural interaction.
- **Personalized Notes**: Users can create and manage notes which are also indexed for AI context.
- **Secure Authentication**: Robust JWT-based authentication system with secure password hashing.

## 🛠️ Technical Stack

- **Backend**: Node.js, Express.js
- **AI/LLM**: Google Gemini AI (`@google/genai`)
- **Vector Database**: Qdrant (for long-term semantic memory)
- **Caching/Session**: Redis (for short-term conversation history)
- **Database**: MongoDB & Mongoose (for user data and notes)
- **Frontend**: EJS (Templating Engine), Vanilla CSS, JavaScript

## 🧠 Architecture & Skills Demonstrated

### 1. Advanced RAG Implementation
I implemented a custom RAG pipeline that:
- Generates embeddings for user inputs using Gemini's embedding models.
- Performs semantic search in **Qdrant** to find relevant past conversations or notes.
- Combines this context with the current conversation history from **Redis**.
- Injects this "memory" into the system prompt for the LLM.

### 2. Stateful AI Logic
The backend manages conversation state across sessions. By using Redis, I ensured that the AI maintains immediate context, while Qdrant provides a "subconscious" memory of all previous interactions.

### 3. Voice Processing Pipeline
Implemented a service to handle audio data, converting it into formats suitable for AI processing and back into speech, enhancing accessibility.

### 4. Scalable Backend Design
The project follows a clean MVC (Model-View-Controller) architecture with a dedicated `services` layer for complex business logic, ensuring maintainability and scalability.

## 📁 Project Structure

```text
src/
├── config/         # Database and service configurations
├── controllers/    # Request handlers
├── middlewares/    # Auth and validation logic
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── services/       # Core business logic (AI, RAG, DB operations)
├── utils/          # Helper functions
└── views/          # EJS templates
```

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AtharvMahajan-Skyris/therapyAi-Official.git
   cd therapyAi-Official
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root and add:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   REDIS_URL=your_redis_url
   QDRANT_URL=your_qdrant_url
   GEMENI_AIP_KEY=your_gemini_api_key
   JWT_SECRET=your_secret
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

## 🤝 Contribution
> This project was developed as a hackathon entry.
> - **Backend & AI Logic**: Developed by [Atharv Mahajan](https://github.com/AtharvMahajan-Skyris). I leveraged AI tools to deepen my understanding and learning of complex backend patterns and AI integrations.
> - **Frontend**: Crafted by a talented collaborator/friend.
> - **Documentation**: Generated with the assistance of **Antigravity AI**.

---
*Developed with ❤️ by Atharv Mahajan*
