import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizBuilder({ api, quiz, isNew, onDone }) {
  const [quizId, setQuizId] = useState(quiz ? quiz.id : null);
  const [title, setTitle] = useState(quiz ? quiz.title : "");
  const [timeLimit, setTimeLimit] = useState(quiz ? quiz.time_limit || 60 : 60);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(!isNew);

  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);

  useEffect(() => {
    if (!isNew && quizId) {
      axios
        .get(`${api}/quiz/${quizId}/full`)
        .then((res) => {
          setQuestions(res.data.questions);
          setTitle(res.data.title);
          setTimeLimit(res.data.time_limit || 60);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [api, quizId, isNew]);

  const saveQuizMeta = async () => {
    if (!title.trim()) {
      alert("Enter a quiz title first.");
      return null;
    }
    try {
      if (isNew && !quizId) {
        const res = await axios.post(`${api}/quiz`, { title, timeLimit });
        setQuizId(res.data.id);
        return res.data.id;
      } else {
        await axios.put(`${api}/quiz/${quizId}`, { title, timeLimit });
        return quizId;
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz");
      return null;
    }
  };

  const addQuestion = async () => {
    if (
      !text.trim() ||
      options.some((o) => !o.trim()) ||
      correctIndex === null
    ) {
      alert("Fill all fields and pick a correct option.");
      return;
    }

    let id = quizId;
    if (isNew && !quizId) {
      id = await saveQuizMeta();
      if (!id) return;
    }

    axios
      .post(`${api}/quiz/${id}/questions`, {
        questions: [{ text, options, correctIndex }],
      })
      .then(() => axios.get(`${api}/quiz/${id}/full`))
      .then((res) => setQuestions(res.data.questions))
      .catch((err) => console.error(err));

    setText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
  };

  const deleteQuestion = (qid) => {
    if (!window.confirm("Delete this question?")) return;
    axios
      .delete(`${api}/question/${qid}`)
      .then(() => setQuestions((qs) => qs.filter((q) => q.id !== qid)))
      .catch((err) => console.error(err));
  };

  const updateCorrect = (qid, optionId) => {
    axios
      .put(`/question/${qid}`, { correctOptionId: optionId })
      .then(() =>
        setQuestions((qs) =>
          qs.map((q) =>
            q.id === qid ? { ...q, correctOptionId: optionId } : q
          )
        )
      )
      .catch((err) => console.error(err));
  };

  const addOption = (qid) => {
    const text = prompt("Enter new option text:");
    if (!text) return;
    axios
      .post(`${api}/question/${qid}/options`, { text })
      .then((res) =>
        setQuestions((qs) =>
          qs.map((q) =>
            q.id === qid ? { ...q, options: [...q.options, res.data] } : q
          )
        )
      )
      .catch((err) => console.error(err));
  };

  const deleteOption = (qid, oid) => {
    if (!window.confirm("Delete this option?")) return;
    axios
      .delete(`${api}/option/${oid}`)
      .then(() =>
        setQuestions((qs) =>
          qs.map((q) =>
            q.id === qid
              ? { ...q, options: q.options.filter((o) => o.id !== oid) }
              : q
          )
        )
      )
      .catch((err) => console.error(err));
  };

  if (loading) return <div className="text-center">Loading quiz...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isNew ? "Create New Quiz" : `Edit Quiz: ${title}`}
      </h2>

      {/* Title + Time Limit Section */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-300">Title</label>
          <input
            type="text"
            placeholder="Enter quiz title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-300">Time Limit</label>
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Minutes"
              value={Math.floor(timeLimit / 60)}
              onChange={(e) => {
                const mins = parseInt(e.target.value) || 0;
                setTimeLimit(mins * 60 + (timeLimit % 60));
              }}
              className="w-1/2"
            />
            <input
              type="number"
              placeholder="Seconds"
              value={timeLimit % 60}
              onChange={(e) => {
                const secs = parseInt(e.target.value) || 0;
                setTimeLimit(Math.floor(timeLimit / 60) * 60 + secs);
              }}
              className="w-1/2"
            />
          </div>
        </div>

        <button
          onClick={saveQuizMeta}
          className="btn-green py-3 px-2 rounded-xl"
        >
          Save Quiz Settings
        </button>
      </div>

      {/* Add Question Section */}
      <div className="mb-6 p-4 card">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter question..."
          className="w-full mb-4"
        />

        {options.map((opt, i) => (
          <div key={i} className="flex items-center space-x-3 mb-2">
            <input
              type="radio"
              checked={correctIndex === i}
              onChange={() => setCorrectIndex(i)}
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Option ${i + 1}`}
              className="flex-1"
            />
          </div>
        ))}

        <button onClick={addQuestion} className="btn rounded-xl mt-3">
          Add Question
        </button>
      </div>

      {/* Questions List Section */}
      <div className="space-y-3 mb-6">
        {questions.map((q) => (
          <div key={q.id} className="p-4 card">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">{q.text}</div>
              <button
                onClick={() => deleteQuestion(q.id)}
                className="btn-red text-sm rounded-xl px-3 py-1"
              >
                Delete Question
              </button>
            </div>

            <ul className="ml-4 space-y-2">
              <AnimatePresence>
                {q.options.map((opt) => (
                  <motion.li
                    key={opt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      checked={q.correctOptionId === opt.id}
                      onChange={() => updateCorrect(q.id, opt.id)}
                    />
                    <span
                      className={`flex-1 ${
                        q.correctOptionId === opt.id
                          ? "text-green-400 font-semibold"
                          : ""
                      }`}
                    >
                      {opt.text}
                    </span>
                    {q.options.length > 2 && (
                      <button
                        onClick={() => deleteOption(q.id, opt.id)}
                        className="btn-red text-xs px-2 py-1 rounded-xl"
                      >
                        Delete
                      </button>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {q.options.length < 4 && (
              <button
                onClick={() => addOption(q.id)}
                className="btn text-xs mt-2 rounded-xl px-3 py-1"
              >
                Add Option
              </button>
            )}
          </div>
        ))}
      </div>

      <button onClick={onDone} className="btn-green rounded-xl px-6 py-2">
        Done
      </button>
    </div>
  );
}
