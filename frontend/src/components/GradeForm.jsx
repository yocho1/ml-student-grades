import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ResultCard from "./ResultCard";

// Use a relative API base in dev so Vite proxy can forward to backend
const API = import.meta.env.VITE_API_URL || "/api";

export default function GradeForm() {
  const [form, setForm] = useState({
    study_hours: 6.0,
    attendance: 0.9,
    previous_score: 75,
    sleep_hours: 7.0,
    extracurricular: 1,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // convert numeric values
    setForm(prev => ({
      ...prev,
      [name]: name === "extracurricular" ? parseInt(value || 0) : parseFloat(value || 0)
    }));
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        study_hours: parseFloat(form.study_hours),
        attendance: parseFloat(form.attendance),
        previous_score: parseFloat(form.previous_score),
        sleep_hours: parseFloat(form.sleep_hours),
        extracurricular: parseInt(form.extracurricular, 10),
      };

      const res = await axios.post(`${API}/predict_grade`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      });

      setResult(res.data.predicted_grade);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Study hours / day</span>
          <input
            name="study_hours"
            type="number"
            step="0.1"
            min="0"
            max="24"
            value={form.study_hours}
            onChange={handleChange}
            className="mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Attendance (0–1)</span>
          <input
            name="attendance"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={form.attendance}
            onChange={handleChange}
            className="mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Previous score</span>
          <input
            name="previous_score"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={form.previous_score}
            onChange={handleChange}
            className="mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Sleep hours</span>
          <input
            name="sleep_hours"
            type="number"
            step="0.1"
            min="0"
            max="24"
            value={form.sleep_hours}
            onChange={handleChange}
            className="mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </label>

        <label className="flex flex-col md:col-span-2">
          <span className="text-sm text-slate-600">Extracurricular (0 or 1)</span>
          <select
            name="extracurricular"
            value={form.extracurricular}
            onChange={handleChange}
            className="mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            <option value={0}>0 — None</option>
            <option value={1}>1 — Participates</option>
          </select>
        </label>

        <div className="md:col-span-2 flex items-center justify-between gap-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium shadow ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600"
            }`}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" strokeOpacity="0.3"/></svg>
            ) : null}
            {loading ? "Predicting..." : "Predict Grade"}
          </button>

          <button
            type="button"
            onClick={() => { setForm({ study_hours:6, attendance:0.9, previous_score:75, sleep_hours:7, extracurricular:1 }); setResult(null); setError(null); }}
            className="px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <ResultCard grade={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
