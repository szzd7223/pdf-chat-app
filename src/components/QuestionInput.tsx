import React, { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onAsk: (question: string) => Promise<void>;
  disabled?: boolean;
}

export function QuestionInput({ onAsk, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    try {
      setIsAsking(true);
      await onAsk(question);
      setQuestion('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to get answer');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={
          disabled
            ? 'Select a document to ask questions'
            : 'Ask a question about the document...'
        }
        disabled={disabled || isAsking}
        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-gray-100"
      />
      <button
        type="submit"
        disabled={disabled || isAsking || !question.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 dark:text-blue-400"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
