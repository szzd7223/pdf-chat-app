# Document Q&A App

## Frontend Documentation

### Overview
The main file, `App.tsx`, initializes the app’s core functionalities:
- **Document Upload**: Allows users to upload PDF documents.
- **Document Selection**: Enables selecting a document for asking questions.
- **Question Submission**: Allows asking questions related to the selected document.
- **Answer Display**: Shows answers fetched from the backend.

### Components
#### DocumentList
Displays a list of uploaded documents, highlights the selected document, and calls `onSelect` when a document is clicked.
- **Props**:
  - `documents`: Array of documents
  - `selectedId`: ID of selected document
  - `onSelect`: Callback for document selection

#### DocumentUpload
Implements drag-and-drop and file selection for PDFs, showing feedback on upload success/failure.
- **Props**:
  - `onUpload`: Callback for successful upload

#### QuestionInput
Accepts user questions about the selected document, calling `onAsk` to submit the question.
- **Props**:
  - `onAsk`: Callback to submit question
  - `disabled`: Boolean to disable input if no document is selected

#### QuestionList
Displays each question-answer pair with a timestamp.
- **Props**:
  - `questions`: Array of question-answer objects

### API Interaction
Defined in `App.tsx` by `API_URL` (default `http://localhost:8000`).
- **Document Upload**: `POST /upload`
  - Uploads a PDF file via FormData.
- **Question Submission**: `POST /ask`
  - Sends `document_id` and `question` as JSON.

## Backend Documentation

### Overview
This FastAPI backend manages document uploads, saves metadata to a SQLite database, and answers user questions about documents using an LLM-powered QA chain with embeddings.

### API Endpoints
#### POST /upload
Uploads a PDF file, processes it, and stores metadata.
- **Request**: `file` (PDF file)
- **Response**:
  - `id`: Document ID
  - `name`: Filename
  - `uploadedAt`: Timestamp of upload
- **Steps**:
  1. Verifies the file type (only PDFs allowed).
  2. Saves the file locally in `uploads/`.
  3. Processes the PDF by splitting it into chunks and generating embeddings with HuggingFace.
  4. Saves document metadata (`ID`, `name`, `path`, `timestamp`) to `documents.db`.
- **Error Handling**:
  - `400`: Invalid file type or empty file.
  - `500`: Processing or database error.

#### POST /ask
Answers a question based on the selected document's content.
- **Request**:
  - `document_id`: ID of the document to query
  - `question`: User question
- **Response**:
  - `id`: Question ID
  - `documentId`: Document ID
  - `question`: Original question
  - `answer`: Generated answer
  - `timestamp`: Answer timestamp
- **Steps**:
  1. Verifies if the document exists in `documents.db`.
  2. Loads the vector store for the selected document.
  3. Uses RetrievalQA with the Together LLM to generate an answer.
- **Error Handling**:
  - `404`: Document not found.
  - `500`: Error in question processing or answer generation.

### Database
A SQLite database (`documents.db`) stores document metadata with the following schema:
- `ID`: Unique identifier (UUID)
- `Name`: Original filename
- `Path`: File storage path
- `Uploaded_at`: Timestamp of upload

### External Libraries and Services
- **LangChain**: For text splitting and QA chain configuration.
- **Chroma**: Embeddings-based vector store.
- **Together LLM**: Language model for generating answers.
- **HuggingFace Embeddings**: Embedding generation for text chunks.

### Error Handling
Custom error handling is implemented using `HTTPException` for:
- Invalid file type, empty file, missing document (`404`), and processing issues (`500`).
