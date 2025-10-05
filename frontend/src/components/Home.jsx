import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Home({ onStart, onBuild, onNewQuiz, api }) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, [api]);

  const fetchQuizzes = () => {
    axios
      .get(api + "/quiz")
      .then((r) => setQuizzes(r.data))
      .catch((err) => console.error("Error fetching quizzes:", err));
  };

  const deleteQuiz = (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    axios
      .delete(`${api}/quiz/${id}`)
      .then(() => setQuizzes((qs) => qs.filter((q) => q.id !== id)))
      .catch((err) => console.error("Error deleting quiz:", err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Available Quizzes
        </h2>
        <button onClick={onNewQuiz} className="btn">
          New Quiz
        </button>
      </div>

      <div className="space-y-5">
        {quizzes.map((q) => (
          <motion.div
            key={q.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between card p-5"
          >
            <div>
              <div className="font-semibold text-lg">{q.title}</div>
              <div className="text-sm text-gray-400">
                Time Limit: {q.time_limit}s
              </div>
            </div>
            <div className="space-x-2">
              <button onClick={() => onStart(q)} className="btn">
                Start
              </button>
              <button
                onClick={() => onBuild(q)}
                className="btn-green px-4 py-2 rounded-lg font-semibold text-white shadow hover:opacity-90"
              >
                Edit
              </button>
              <button
                onClick={() => deleteQuiz(q.id)}
                className="btn-red px-4 py-2 rounded-lg font-semibold text-white shadow hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
        {quizzes.length === 0 && (
          <div className="text-sm text-gray-400">No quizzes available.</div>
        )}
      </div>
    </motion.div>
  );
}
