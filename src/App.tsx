import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Brain } from 'lucide-react';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentList } from './components/DocumentList';
import { QuestionInput } from './components/QuestionInput';
import { QuestionList } from './components/QuestionList';
import type { Document, Question, ApiError } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>();
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    const doc: Document = await response.json();
    setDocuments((prev) => [...prev, doc]);
  }, []);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (!selectedDoc) return;

    const response = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: selectedDoc,
        question,
      }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    const answer: Question = await response.json();
    setQuestions((prev) => [...prev, answer]);
  }, [selectedDoc]);

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '!bg-gray-800 !text-white'
        }}
      />
      
      {/* Sidebar */}
      <aside className="w-1/4 p-4 space-y-6 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold">Document Q&A</h1>
        </div>
        
        <DocumentUpload onUpload={handleUpload} />
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Documents</h2>
          <DocumentList
            documents={documents}
            selectedId={selectedDoc}
            onSelect={setSelectedDoc}
          />
          {documents.length === 0 && (
            <p className="text-center py-4 text-gray-400">
              No documents uploaded yet
            </p>
          )}
        </div>
      </aside>
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <QuestionList questions={questions} />
          {questions.length === 0 && (
            <div className="p-8 rounded-lg shadow text-center bg-gray-800 text-gray-400">
              <p>No questions asked yet.</p>
              <p className="mt-2 text-sm">
                Start by selecting a document and asking a question.
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <QuestionInput onAsk={handleAskQuestion} disabled={!selectedDoc} />
          {!selectedDoc && (
            <p className="text-sm mt-2 text-gray-400">
              Please select a document to ask questions.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;