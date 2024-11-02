# PDF Question & Answer Application

A full-stack application that enables users to upload PDF documents and ask questions about their content using Llama 3 and LangChain for intelligent document processing and question answering.

## 🚀 Features

- **PDF Document Management**
  - Upload and store PDF documents
  - Extract and process text content

- **AI-Powered Question & Answer System**
  - Llama 3 integration via Together API
  - Smart document context understanding
  - Natural language question processing
  - Context-aware response generation

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance web framework
- **LangChain** - Document processing and LLM integration
  - Document loaders
  - Text splitters
- **Together API** - Llama 3 model integration
- **PyMuPDF** - PDF text extraction
- **SQLite** - Document metadata storage

### Frontend
- **React** with TypeScript
- **Modern UI components** - Intuitive user experience
- **Type-safe development** - Robust application architecture
- **Real-time feedback** - Upload and processing status


## 🏗️ Architecture

### Backend Endpoints
```
POST /api/documents - Upload PDF documents
POST /api/questions - Submit questions and receive answers
GET  /api/documents - Retrieve list of uploaded documents
```

## 💻 Installation

1. Clone the repository
```bash
git clone https://github.com/szzd7223/pdf-chat-app.git
```

2. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up .env and enter your_api_key

## 🚦 Running the Application

### Backend
```bash
cd backend
python main.py
```

### Frontend
```bash
cd frontend
npm start
```
