import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, User, Activity, Moon, Users, CheckCircle, RotateCcw } from "lucide-react";
import ResultCard from "./ResultCard";

const API = import.meta.env.VITE_API_URL || "/api";

export default function GradeForm() {
  const [form, setForm] = useState({
    study_hours: 6,
    attendance: 0.9,
    previous_score: 75,
    sleep_hours: 7,
    extracurricular: 1,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "extracurricular" ? parseInt(value) : parseFloat(value),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post(`${API}/predict_grade`, form, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(res.data.predicted_grade);
    } catch {
      setError("Unable to get prediction. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      label: "Study Hours / Day",
      name: "study_hours",
      icon: BookOpen,
      min: 0,
      max: 24,
      step: 0.5,
      color: "text-blue-500"
    },
    {
      label: "Attendance Rate (0-1)",
      name: "attendance",
      icon: User,
      min: 0,
      max: 1,
      step: 0.01,
      color: "text-green-500"
    },
    {
      label: "Previous Score",
      name: "previous_score",
      icon: Activity,
      min: 0,
      max: 100,
      step: 1,
      color: "text-purple-500"
    },
    {
      label: "Sleep Hours / Night",
      name: "sleep_hours",
      icon: Moon,
      min: 0,
      max: 24,
      step: 0.5,
      color: "text-indigo-500"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={submit} className="space-y-6">
        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.name} className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <field.icon className={`w-4 h-4 ${field.color}`} />
                {field.label}
              </label>
              <div className="relative">
                <input
                  name={field.name}
                  type="number"
                  value={form[field.name]}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white hover:border-slate-300 group-hover:shadow-md"
                  required
                />
              </div>
            </div>
          ))}

          {/* Extracurricular Activity */}
          <div className="md:col-span-2 group">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              Extracurricular Activity
            </label>
            <select
              name="extracurricular"
              value={form.extracurricular}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white hover:border-slate-300 group-hover:shadow-md"
            >
              <option value={0}>❌ No participation</option>
              <option value={1}>✅ Active participation</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Predict My Grade
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => setForm({
              study_hours: 6,
              attendance: 0.9,
              previous_score: 75,
              sleep_hours: 7,
              extracurricular: 1,
            })}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3"
            >
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                ⚠️
              </div>
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <ResultCard grade={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}