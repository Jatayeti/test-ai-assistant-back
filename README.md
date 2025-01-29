# AI Assistant Backend

## Project Description

This project is a backend server for an AI Assistant that provides real-time conversational capabilities, weather updates, web search, and task management. It is built with **Node.js** and **Express.js** and integrates with **OpenAI's Realtime API**, **OpenWeather API**, and **Tavily API**. It also includes a simple **task management system** using a MySQL database.

## Setup and Installation

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (>= 16.x)
- **npm** or **yarn**
- **MySQL Database**

### Installation Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/ai-assistant-backend.git
   cd ai-assistant-backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up the `.env` file:

   ```sh
   cp .env.example .env
   ```

   Edit the `.env` file and provide values for:

   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4o-mini-realtime-preview
   WEATHER_API_KEY=your_openweather_api_key
   TAVILY_API_KEY=your_tavily_api_key
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=ai_assistant
   ```

4. Run database migrations:

   ```sh
   node migrate.js up
   ```

5. Start the server:

   ```sh
   npm start
   ```

   The server should now be running at `http://localhost:3000`.

## API Endpoint Documentation

### **1. Create AI Session**

**Endpoint:** `POST /session`

- **Description:** Creates a new OpenAI Realtime session.
- **Response:**
  ```json
  {
    "id": "sess_xxx",
    "client_secret": { "value": "secret_key" }
  }
  ```

### **2. WebRTC Offer**

**Endpoint:** `POST /webrtc-offer`

- **Description:** Sends an SDP offer to OpenAI.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer ephemeral_key"
  }
  ```
- **Body:**
  ```json
  {
    "sdp": "session_description"
  }
  ```
- **Response:**
  ```json
  {
    "type": "answer",
    "sdp": "session_description"
  }
  ```

### **3. Get Weather**

**Endpoint:** `GET /weather`

- **Query Params:**
  ```json
  {
    "location": "New York"
  }
  ```
- **Response:**
  ```json
  {
    "location": "New York",
    "temperature": 22.5,
    "description": "Clear sky"
  }
  ```

### **4. Search the Web**

**Endpoint:** `POST /search`

- **Body:**
  ```json
  {
    "query": "latest tech news"
  }
  ```
- **Response:**
  ```json
  [
    {
      "title": "Tech News Today",
      "url": "https://example.com",
      "snippet": "Latest updates on technology..."
    }
  ]
  ```

### **5. Task Management Endpoints**

#### Create a Task

**Endpoint:** `POST /api/todos`

- **Body:**
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false
  }
  ```

#### Get All Tasks

**Endpoint:** `GET /api/todos`

- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false
    }
  ]
  ```

#### Update a Task

**Endpoint:** `PUT /api/todos/:id`

- **Body:**
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, eggs, bread and cheese",
    "completed": true
  }
  ```
- **Response:**
  ```json
  {
    "message": "Todo updated successfully"
  }
  ```

#### Delete a Task

**Endpoint:** `DELETE /api/todos/:id`

- **Response:**
  ```json
  {
    "message": "Todo deleted successfully"
  }
  ```

## Notes

- This project uses **Express.js** for handling API routes.
- Database is managed with **MySQL**.
- WebRTC is used for real-time interactions with OpenAI.
- Weather data is fetched from **OpenWeather API**.
- Web search functionality is powered by **Tavily API**.

## License

This project is licensed under the **MIT License**.

