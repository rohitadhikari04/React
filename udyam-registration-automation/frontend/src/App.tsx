import React from 'react';
import DynamicForm from './components/DynamicForm';

export default function App() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Udyam Registration</h1>
      <DynamicForm />
    </div>
  );
}