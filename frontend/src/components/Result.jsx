import React from "react";
import { motion } from "framer-motion";

export default function Result({ result, onRestart }) {
  const percentage = ((result.score / result.total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        Results
      </h2>
      <p className="mb-2 text-lg">
        You answered{" "}
        <span className="font-bold text-green-400">{result.score}</span> out of{" "}
        {result.total} correctly
      </p>
      <p className="mb-6 text-lg">
        Score Percentage:{" "}
        <span className="font-bold text-cyan-400">{percentage}%</span>
      </p>

      <div className="space-y-4 mb-6">
        {result.details.map((d, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl backdrop-blur-md ${
              d.isCorrect
                ? "bg-green-500/20 border border-green-500/40"
                : "bg-red-500/20 border border-red-500/40"
            }`}
          >
            <p className="font-semibold mb-2">{d.question}</p>
            <p>
              <span className="font-medium">Your answer:</span>{" "}
              {d.selected || (
                <span className="italic text-gray-400">No answer</span>
              )}
            </p>
            <p>
              <span className="font-medium">Correct answer:</span> {d.correct}
            </p>
            <p
              className={`mt-1 font-bold ${
                d.isCorrect ? "text-green-400" : "text-red-400"
              }`}
            >
              {d.isCorrect ? "Correct" : "Incorrect"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button onClick={onRestart} className="btn px-6 py-2 font-semibold">
          Restart
        </button>
      </div>
    </motion.div>
  );
}
