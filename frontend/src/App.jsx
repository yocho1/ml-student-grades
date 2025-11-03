import React from "react";
import GradeForm from "./components/GradeForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-800">Student Grade Predictor</h1>
          <p className="text-sm text-slate-500 mt-1">Enter features — get a predicted final grade</p>
        </header>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <GradeForm />
        </div>

        <footer className="mt-6 text-center text-xs text-slate-400">
          Built with ♥ — connects to /predict_grade
        </footer>
      </div>
    </div>
  );
}
