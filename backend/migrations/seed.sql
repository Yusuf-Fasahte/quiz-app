-- Insert 2 sample quizzes with time_limit
INSERT INTO quizzes (id, title, time_limit) VALUES
  ('quiz-1', 'Math & Logic Quiz', 45),
  ('quiz-2', 'General Knowledge Quiz', 90)
ON CONFLICT DO NOTHING;

-- Questions for Math & Logic Quiz
INSERT INTO questions (id, quiz_id, text, correct_option_id) VALUES
  ('q1', 'quiz-1', 'What is 5 + 7?', 'q1o2'),
  ('q2', 'quiz-1', 'What comes next in sequence: 2, 4, 8, 16, ?', 'q2o3')
ON CONFLICT DO NOTHING;

INSERT INTO options (id, question_id, text) VALUES
  ('q1o1','q1','10'),
  ('q1o2','q1','12'),
  ('q1o3','q1','14'),

  ('q2o1','q2','24'),
  ('q2o2','q2','20'),
  ('q2o3','q2','32')
ON CONFLICT DO NOTHING;

-- Questions for General Knowledge Quiz
INSERT INTO questions (id, quiz_id, text, correct_option_id) VALUES
  ('q3', 'quiz-2', 'Which planet is known as the Red Planet?', 'q3o2'),
  ('q4', 'quiz-2', 'Who wrote "Hamlet"?', 'q4o1')
ON CONFLICT DO NOTHING;

INSERT INTO options (id, question_id, text) VALUES
  ('q3o1','q3','Earth'),
  ('q3o2','q3','Mars'),
  ('q3o3','q3','Venus'),

  ('q4o1','q4','William Shakespeare'),
  ('q4o2','q4','Charles Dickens'),
  ('q4o3','q4','Leo Tolstoy')
ON CONFLICT DO NOTHING;
