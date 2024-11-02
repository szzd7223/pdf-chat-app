import React from 'react';
import type { Question } from '../types';

interface Props {
  questions: Question[];
}

export function QuestionList({ questions }: Props) {
  return (
    <div className="space-y-6">
      {questions.map((qa) => (
        <div key={qa.id} className="space-y-2">
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-200 p-4 rounded-lg shadow">
            <p className="font-medium">You:</p>
            <p>{qa.question}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-4 rounded-lg shadow">
            <p className="font-medium">Answer:</p>
            <p>{qa.answer}</p>
            <div className="text-xs text-gray-300 mt-2">{new Date(qa.timestamp).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
