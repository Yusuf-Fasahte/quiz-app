import React, { useState } from "react";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import QuizBuilder from "./components/QuizBuilder";

export default function App() {
  const api = "http://localhost:4000"; // adjust port if needed
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("home"); // home | builder | quiz | result | builder-new

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Glass container */}
      <div className="w-full max-w-5xl card p-8">
        {mode === "home" && (
          <Home
            api={api}
            onStart={(q) => {
              setQuiz(q);
              setMode("quiz");
            }}
            onBuild={(q) => {
              setQuiz(q);
              setMode("builder");
            }}
            onNewQuiz={() => {
              setQuiz(null);
              setMode("builder-new");
            }}
          />
        )}
        {mode === "quiz" && quiz && !result && (
          <Quiz
            quiz={quiz}
            api={api}
            onSubmit={(r) => {
              setResult(r);
              setMode("result");
            }}
          />
        )}
        {mode === "result" && result && (
          <Result
            result={result}
            onRestart={() => {
              setQuiz(null);
              setResult(null);
              setMode("home");
            }}
          />
        )}
        {mode === "builder" && quiz && (
          <QuizBuilder
            api={api}
            quiz={quiz}
            isNew={false}
            onDone={() => {
              setQuiz(null);
              setMode("home");
            }}
          />
        )}
        {mode === "builder-new" && (
          <QuizBuilder
            api={api}
            quiz={null}
            isNew={true}
            onDone={() => {
              setQuiz(null);
              setMode("home");
            }}
          />
        )}
      </div>
    </div>
  );
}
