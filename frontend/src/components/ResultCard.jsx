import React from "react";
import { motion } from "framer-motion";

export default function ResultCard({ grade }) {
  const rounded = Math.round(grade * 100) / 100;
  const colorClass = grade >= 85 ? "from-green-400 to-green-500" : grade >= 70 ? "from-yellow-400 to-yellow-500" : "from-red-400 to-red-500";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-4 p-4 rounded-lg shadow-md bg-gradient-to-r to-teal-400"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Predicted Final Grade</h3>
          <p className="text-sm text-white/90 mt-1">This is the model's predicted score based on the features you provided.</p>
        </div>

        <div className={`px-5 py-3 rounded-lg text-white font-bold text-2xl bg-gradient-to-r ${colorClass}`}>
          {rounded}
        </div>
      </div>
    </motion.div>
  );
}