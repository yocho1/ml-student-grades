import React from "react";
import GradeForm from "./components/GradeForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-4 shadow-lg">
            🎓
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Student Grade Predictor
          </h1>
          <p className="text-slate-600 text-lg">
            Predict your academic performance with AI insights
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-8">
          <GradeForm />
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-slate-500 text-sm">
          Built with ❤️ using Flask + React + Tailwind
        </footer>
      </div>
    </div>
  );
}