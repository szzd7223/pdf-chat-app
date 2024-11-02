from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import uuid
from datetime import datetime
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import Together
from dotenv import load_dotenv
from langchain_together import ChatTogether

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect('documents.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS documents
        (id TEXT PRIMARY KEY, name TEXT, path TEXT, uploaded_at TIMESTAMP)
    ''')
    conn.commit()
    conn.close()

init_db()

embeddings = HuggingFaceEmbeddings()
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)


try:
    api_key = os.getenv('TOGETHER_API_KEY')
    if not api_key:
        raise ValueError("TOGETHER_API_KEY environment variable not set")
    
    llm = ChatTogether(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        temperature=0.7,
        max_tokens=512,
        api_key=api_key
    )
except Exception as e:
    print(f"Error initializing Together LLM: {e}")
    raise

class QuestionRequest(BaseModel):
    document_id: str
    question: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(400, "Only PDF files are allowed")

        os.makedirs("uploads", exist_ok=True)

        doc_id = str(uuid.uuid4())
        file_path = f"uploads/{doc_id}.pdf"
        
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(400, "The uploaded file is empty")
        
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        if not os.path.exists(file_path):
            raise HTTPException(500, "Failed to save the uploaded file")

        try:
            loader = PyPDFLoader(file_path)
            pages = loader.load()
            if not pages:
                raise HTTPException(400, "The PDF file appears to be empty or corrupted")
            
            texts = text_splitter.split_documents(pages)
            
            Chroma.from_documents(
                documents=texts,
                embedding=embeddings,
                persist_directory=f"uploads/{doc_id}_vectors"
            )
        except Exception as e:
            os.remove(file_path)
            raise HTTPException(500, f"Failed to process the PDF: {str(e)}")

        try:
            conn = sqlite3.connect('documents.db')
            c = conn.cursor()
            c.execute(
                "INSERT INTO documents (id, name, path, uploaded_at) VALUES (?, ?, ?, ?)",
                (doc_id, file.filename, file_path, datetime.now().isoformat())
            )
            conn.commit()
        except Exception as e:
            os.remove(file_path)
            if os.path.exists(f"uploads/{doc_id}_vectors"):
                import shutil
                shutil.rmtree(f"uploads/{doc_id}_vectors")
            raise HTTPException(500, f"Database error: {str(e)}")
        finally:
            conn.close()

        return {
            "id": doc_id,
            "name": file.filename,
            "uploadedAt": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"An unexpected error occurred: {str(e)}")

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        conn = sqlite3.connect('documents.db')
        c = conn.cursor()
        c.execute("SELECT path FROM documents WHERE id = ?", (request.document_id,))
        result = c.fetchone()
        conn.close()

        if not result:
            raise HTTPException(404, "Document not found")

        vector_store = Chroma(
            persist_directory=f"uploads/{request.document_id}_vectors",
            embedding_function=embeddings
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever()
        )

        answer = qa_chain.run(request.question)

        if not answer:
            raise HTTPException(500, "Failed to generate an answer")

        return {
            "id": str(uuid.uuid4()),
            "documentId": request.document_id,
            "question": request.question,
            "answer": answer,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"An error occurred while processing your question: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)