import React from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

export default function ResultCard({ grade }) {
  const rounded = Math.round(grade * 100) / 100;
  
  const getGradeInfo = (score) => {
    if (score >= 85) return {
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50 border-emerald-200",
      textColor: "text-emerald-700",
      icon: <TrendingUp className="w-5 h-5" />,
      message: "Excellent! Keep up the great work!",
      emoji: "🎉"
    };
    if (score >= 70) return {
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 border-amber-200",
      textColor: "text-amber-700",
      icon: <TrendingUp className="w-5 h-5" />,
      message: "Good job! There's room for improvement.",
      emoji: "👍"
    };
    return {
      color: "from-rose-500 to-red-500",
      bgColor: "bg-rose-50 border-rose-200",
      textColor: "text-rose-700",
      icon: <TrendingDown className="w-5 h-5" />,
      message: "Let's work on improving your study habits!",
      emoji: "💪"
    };
  };

  const gradeInfo = getGradeInfo(grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${gradeInfo.bgColor} border-2 rounded-2xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Predicted Final Grade</h3>
        </div>
        <div className={`p-2 rounded-lg ${gradeInfo.bgColor}`}>
          {gradeInfo.icon}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradeInfo.textColor} mb-1`}>
            {gradeInfo.emoji} {gradeInfo.message}
          </p>
          <p className="text-slate-600 text-sm">
            Based on your current study habits and performance metrics
          </p>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className={`px-6 py-4 rounded-xl bg-gradient-to-r ${gradeInfo.color} text-white font-bold text-2xl shadow-lg ml-4`}
        >
          {rounded}
        </motion.div>
      </div>
    </motion.div>
  );
}