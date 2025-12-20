# Project Structure - Therapy AI

This document provides a detailed overview of the Therapy AI codebase structure to assist developers in understanding the architecture and flow of the application.

## 📂 Directory Overview

### `src/`
The core source code of the application.

- **`app.js`**: The main Express application setup, including middleware configuration and route definitions.
- **`server.js`**: The entry point that initializes database connections (MongoDB, Redis, Qdrant) and starts the HTTP server.

#### `src/config/`
Contains configuration files for external services and databases.
- `mongodbConfig.js`: MongoDB connection logic using Mongoose.
- `redisConfig.js`: Redis client setup for caching and session management.
- `qdrantdbConfig.js`: Qdrant client configuration for vector search.

#### `src/controllers/`
Handles incoming HTTP requests and orchestrates calls to services.
- `aiController.js`: Manages AI-related interactions.
- `authController.js`: Handles user login and signup.
- `notesController.js`: CRUD operations for user notes.

#### `src/services/`
The "brain" of the application. Contains the complex business logic.
- **`aiRespponseService.js`**: Interfaces with Google Gemini AI.
- **`qdrandOperationsService.js`**: Manages vector embeddings and searches in Qdrant.
- **`redisService.js`**: Handles short-term conversation history in Redis.
- **`generateSystemPrompService.js`**: Implements the RAG logic by combining system instructions, short-term memory, and long-term memory.
- **`geminiVoiceModelService.js`**: Handles voice-related AI features.

#### `src/models/`
Mongoose schemas for data persistence.
- `User.js`: User profile and authentication data.
- `Note.js`: Schema for user-created therapeutic notes.

#### `src/routes/`
Defines the API endpoints and maps them to controllers.
- `aiRoute.js`, `authRoute.js`, `notesRoute.js`, `settingsRoute.js`.

#### `src/views/`
EJS templates for the frontend.
- `index.ejs`: Main chat interface.
- `landing.ejs`: Project landing page.
- `auth.ejs`: Login/Signup pages.

### `public/`
Static assets served by the application.
- `css/`: Stylesheets.
- `js/`: Client-side JavaScript for interactivity and voice handling.
- `assets/`: Images and other static files.

## 🔄 Data Flow (RAG Pipeline)

1. **User Input**: User sends a message via the chat interface.
2. **Embedding**: The `generateEmbeddingsConfig.js` service creates a vector representation of the input.
3. **Retrieval**:
   - `redisService` fetches the last 5 messages for immediate context.
   - `qdrandOperationsService` searches Qdrant for semantically similar past interactions.
4. **Augmentation**: `generateSystemPrompService` compiles the system prompt, conversation history, and retrieved memories.
5. **Generation**: `aiRespponseService` sends the augmented prompt to Gemini AI.
6. **Response**: The AI's response is sent back to the user and stored in both Redis and Qdrant for future context.
