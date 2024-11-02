## Overview
This project consists of a frontend built with React and TypeScript, styled with Tailwind CSS, and a backend built with FastAPI and Python 3.10.3. The application processes PDF documents, enabling users to upload files and receive answers to questions based on the document's content. LangChain and LLaMA 3 are used for PDF parsing and question answering functionalities.

## Technology Stack
### Frontend
- **React**: Used for building the user interface.
- **TypeScript**: Adds static typing to the frontend for improved development experience and error handling.
- **Tailwind CSS**: Used for styling the frontend.

### Backend
- **FastAPI**: Provides the backend framework for handling API requests.
- **Python 3.10.3**: The version of Python used, running in a virtual environment for isolation.

### Document Processing
- **LangChain**: Manages document processing and question-answering pipeline.
- **LLaMA 3**: Performs the language model processing for PDF parsing and answering questions.

## Architecture
1. **Frontend-Backend Communication**: The frontend communicates with the backend through specific API endpoints.
2. **PDF Document Processing**:
   - The frontend allows users to upload PDF documents.
   - The backend receives the documents, parses them using LangChain and LLaMA 3, and processes user queries related to the document content.

## API Endpoints
- **/upload**: Endpoint to upload PDFs for processing.
- **/query**: Endpoint to send user queries based on the uploaded PDF content.

## Setup and Installation

### Prerequisites
- Node.js
- Python 3.10.3
- Virtual environment manager (such as `venv`)


