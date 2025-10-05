import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Quiz({ quiz, api, onSubmit }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    axios
      .get(`${api}/quiz/${quiz.id}/questions`)
      .then((r) => {
        setQuestions(r.data.questions);
        setTimeLeft(r.data.timeLimit || 60);
      })
      .catch((err) => console.error("Failed to load questions:", err));
  }, [quiz, api]);

  useEffect(() => {
    if (timeLeft === null) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (qid, oid) => {
    setAnswers({ ...answers, [qid]: oid });
  };

  const handleSubmit = () => {
    const payload = Object.keys(answers).map((qid) => ({
      questionId: qid,
      selectedOptionId: answers[qid],
    }));
    axios
      .post(`${api}/quiz/${quiz.id}/submit`, payload)
      .then((r) => onSubmit(r.data))
      .catch((err) => console.error("Failed to submit quiz:", err));
  };

  if (!questions || questions.length === 0)
    return <div className="text-center text-gray-300">Loading quiz...</div>;

  const q = questions[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          {quiz.title}
        </h2>
        <div className="text-sm font-mono text-cyan-300">
          ⏳ {timeLeft}s left
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={q.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 card p-6"
      >
        <div className="text-lg font-semibold mb-4">{q.text}</div>
        <div className="grid gap-3">
          {q.options.map((o) => (
            <button
              key={o.id}
              onClick={() => handleSelect(q.id, o.id)}
              className={`p-4 rounded-xl border backdrop-blur-lg transition-all ${
                answers[q.id] === o.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-transparent shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-gray-200"
              }`}
            >
              {o.text}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between mt-6">
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="btn-gray px-6 py-2 rounded-lg text-white font-semibold shadow disabled:opacity-30"
        >
          Previous
        </button>
        {index === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn-green px-6 py-2 rounded-lg font-semibold shadow"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="btn px-6 py-2 rounded-lg font-semibold shadow"
          >
            Next
          </button>
        )}
      </div>
    </motion.div>
  );
}
