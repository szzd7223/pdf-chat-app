export interface Document {
    id: string;
    name: string;
    uploadedAt: string;
  }
  
  export interface Question {
    id: string;
    documentId: string;
    question: string;
    answer: string;
    timestamp: string;
  }
  
  export interface ApiError {
    detail: string;
    status: number;
  }