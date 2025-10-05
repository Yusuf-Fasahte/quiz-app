require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🟢 Create a new quiz
app.post("/quiz", async (req, res) => {
  try {
    const { title, timeLimit = 60 } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const id = uuidv4();
    await pool.query(
      "INSERT INTO quizzes (id, title, time_limit) VALUES ($1, $2, $3)",
      [id, title, timeLimit]
    );
    res.json({ id, title, time_limit: timeLimit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// 🟢 Update quiz (title or time limit)
app.put("/quiz/:id", async (req, res) => {
  const { title, timeLimit } = req.body;
  try {
    const result = await pool.query(
      "UPDATE quizzes SET title=$1, time_limit=$2 WHERE id=$3 RETURNING id,title,time_limit",
      [title, timeLimit, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update quiz" });
  }
});

// 🟢 Add questions to quiz
app.post("/quiz/:id/questions", async (req, res) => {
  const quizId = req.params.id;
  const { questions } = req.body;
  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Questions array is required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const q of questions) {
      const qid = uuidv4();
      const correctOptionId = uuidv4();
      await client.query(
        "INSERT INTO questions (id, quiz_id, text, correct_option_id) VALUES ($1, $2, $3, $4)",
        [qid, quizId, q.text, correctOptionId]
      );

      for (const [i, opt] of q.options.entries()) {
        const oid = i === q.correctIndex ? correctOptionId : uuidv4();
        await client.query(
          "INSERT INTO options (id, question_id, text) VALUES ($1, $2, $3)",
          [oid, qid, opt]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to add questions" });
  } finally {
    client.release();
  }
});

// 🟢 List all quizzes
app.get("/quiz", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, time_limit FROM quizzes ORDER BY title"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// 🟢 Get quiz questions (without answers)
app.get("/quiz/:id/questions", async (req, res) => {
  const quizId = req.params.id;
  try {
    const qRes = await pool.query(
      "SELECT id, text FROM questions WHERE quiz_id=$1",
      [quizId]
    );

    const questions = [];
    for (const q of qRes.rows) {
      const opts = await pool.query(
        "SELECT id, text FROM options WHERE question_id=$1",
        [q.id]
      );
      questions.push({ id: q.id, text: q.text, options: opts.rows });
    }

    const quizRes = await pool.query(
      "SELECT time_limit FROM quizzes WHERE id=$1",
      [quizId]
    );
    res.json({ timeLimit: quizRes.rows[0].time_limit, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// 🟢 Submit quiz answers
app.post("/quiz/:id/submit", async (req, res) => {
  const quizId = req.params.id;
  const answers = req.body || [];

  try {
    const qRes = await pool.query(
      "SELECT id, text, correct_option_id FROM questions WHERE quiz_id=$1",
      [quizId]
    );

    let score = 0;
    const details = [];

    for (const q of qRes.rows) {
      const optsRes = await pool.query(
        "SELECT id, text FROM options WHERE question_id=$1",
        [q.id]
      );
      const options = optsRes.rows;

      const userAnswer = answers.find((a) => a.questionId === q.id);
      const selectedOpt = userAnswer
        ? options.find((o) => o.id === userAnswer.selectedOptionId)
        : null;
      const correctOpt = options.find((o) => o.id === q.correct_option_id);

      const isCorrect = selectedOpt && selectedOpt.id === correctOpt.id;
      if (isCorrect) score++;

      details.push({
        question: q.text,
        options,
        selected: selectedOpt ? selectedOpt.text : null,
        correct: correctOpt.text,
        isCorrect,
      });
    }

    res.json({ score, total: qRes.rows.length, details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

// 🟢 Get quiz with full details (questions + options)
app.get("/quiz/:id/full", async (req, res) => {
  const quizId = req.params.id;
  try {
    const quizRes = await pool.query(
      "SELECT id,title,time_limit FROM quizzes WHERE id=$1",
      [quizId]
    );

    if (quizRes.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const qRes = await pool.query(
      "SELECT id, text, correct_option_id FROM questions WHERE quiz_id=$1",
      [quizId]
    );

    const questions = [];
    for (const q of qRes.rows) {
      const opts = await pool.query(
        "SELECT id, text FROM options WHERE question_id=$1",
        [q.id]
      );
      questions.push({
        id: q.id,
        text: q.text,
        correctOptionId: q.correct_option_id,
        options: opts.rows,
      });
    }

    res.json({ ...quizRes.rows[0], questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch full quiz" });
  }
});

// 🟢 Delete a question
app.delete("/question/:id", async (req, res) => {
  const qid = req.params.id;
  try {
    await pool.query("DELETE FROM options WHERE question_id=$1", [qid]);
    await pool.query("DELETE FROM questions WHERE id=$1", [qid]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

// 🟢 Update correct answer for a question
app.put("/question/:id", async (req, res) => {
  const qid = req.params.id;
  const { correctOptionId } = req.body;
  if (!correctOptionId)
    return res.status(400).json({ error: "correctOptionId is required" });

  try {
    await pool.query("UPDATE questions SET correct_option_id=$1 WHERE id=$2", [
      correctOptionId,
      qid,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update question" });
  }
});

// 🟢 Delete a quiz
app.delete("/quiz/:id", async (req, res) => {
  const quizId = req.params.id;
  try {
    await pool.query(
      "DELETE FROM options WHERE question_id IN (SELECT id FROM questions WHERE quiz_id=$1)",
      [quizId]
    );
    await pool.query("DELETE FROM questions WHERE quiz_id=$1", [quizId]);
    await pool.query("DELETE FROM quizzes WHERE id=$1", [quizId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

// 🟢 Add a new option to a question
app.post("/question/:id/options", async (req, res) => {
  const qid = req.params.id;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Option text required" });

  try {
    const oid = uuidv4();
    await pool.query(
      "INSERT INTO options (id, question_id, text) VALUES ($1, $2, $3)",
      [oid, qid, text]
    );
    res.json({ id: oid, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add option" });
  }
});

// 🟢 Delete an option
app.delete("/option/:id", async (req, res) => {
  const oid = req.params.id;
  try {
    await pool.query("DELETE FROM options WHERE id=$1", [oid]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete option" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
