const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, "users.txt");
const USERS_JSON_FILE = path.join(__dirname, "users.json");
const QUESTIONS_FILE = path.join(__dirname, "questions.txt");
const RESULTS_FILE = path.join(__dirname, "results.txt");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIR));

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "", "utf8");
}

function readUsers() {
  ensureFile(USERS_FILE);

  if (fs.existsSync(USERS_JSON_FILE)) {
    try {
      const users = JSON.parse(fs.readFileSync(USERS_JSON_FILE, "utf8") || "[]");
      if (Array.isArray(users)) return users;
    } catch (error) {
      fs.writeFileSync(USERS_JSON_FILE, "[]", "utf8");
      return [];
    }
  }

  const users = fs
    .readFileSync(USERS_FILE, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [username, password, fullName] = line.split("|");
      return {
        fullName: fullName || username,
        username,
        password
      };
    });

  writeUsers(users);
  return users;
}

function writeUsers(users) {
  fs.writeFileSync(USERS_JSON_FILE, JSON.stringify(users, null, 2), "utf8");
  fs.writeFileSync(
    USERS_FILE,
    users.map((user) => `${user.username}|${user.password}|${user.fullName}`).join("\n") + "\n",
    "utf8"
  );
}

function readQuestions() {
  ensureFile(QUESTIONS_FILE);

  return fs
    .readFileSync(QUESTIONS_FILE, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, id) => {
      const parts = line.split("|");
      return {
        id,
        question: parts[0],
        options: parts.slice(1, 5),
        answer: parts[5],
        subject: parts[6],
        level: parts[7]
      };
    });
}

app.post("/signup", (req, res) => {
  const fullName = String(req.body.fullName || "").trim();
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  if (!fullName || !username || !password) {
    return res.status(400).json({ message: "Full name, username and password are required" });
  }

  const users = readUsers();
  const exists = users.some((user) => user.username === username);

  if (exists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ fullName, username, password });
  writeUsers(users);
  res.json({ message: "Signup successful" });
});

app.post("/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  const users = readUsers();
  const user = users.find(
    (savedUser) => savedUser.username === username && savedUser.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid login" });

  res.json({ message: "Success", username, fullName: user.fullName || username });
});

app.get("/users/:username", (req, res) => {
  const users = readUsers();
  const user = users.find((savedUser) => savedUser.username === req.params.username);

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ username: user.username, fullName: user.fullName || user.username });
});

app.put("/users/:username", (req, res) => {
  const fullName = String(req.body.fullName || "").trim();
  if (!fullName) return res.status(400).json({ message: "Full name is required" });

  const users = readUsers();
  const user = users.find((savedUser) => savedUser.username === req.params.username);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.fullName = fullName;
  writeUsers(users);
  res.json({ message: "Profile updated", username: user.username, fullName: user.fullName });
});

app.get("/questions", (req, res) => {
  const { subject, level } = req.query;
  let questions = readQuestions();

  if (subject && level) {
    const filtered = questions.filter(
      (q) => q.subject === subject && q.level === level
    );
    if (filtered.length) questions = filtered;
  }

  res.json(questions);
});

app.post("/submit", (req, res) => {
  ensureFile(RESULTS_FILE);

  const username = String(req.body.username || "guest").trim();
  const subject = String(req.body.subject || "").trim();
  const level = String(req.body.level || "").trim();
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const questionIds = Array.isArray(req.body.questionIds) ? req.body.questionIds : [];

  const allQuestions = readQuestions();
  let score = 0;

  questionIds.forEach((questionId, index) => {
    const question = allQuestions.find((q) => q.id === Number(questionId));
    if (question && answers[index] === question.answer) score++;
  });

  const review = questionIds.map((questionId, index) => {
    const question = allQuestions.find((q) => q.id === Number(questionId));
    return {
      question: question ? question.question : "Question not found",
      options: question ? question.options : [],
      chosenAnswer: answers[index] || "",
      correctAnswer: question ? question.answer : "",
      isCorrect: Boolean(question && answers[index] === question.answer)
    };
  });

  const total = questionIds.length;
  const percent = total ? Number(((score / total) * 100).toFixed(2)) : 0;
  const result = {
    username,
    subject,
    level,
    score,
    total,
    percent,
    status: percent >= 40 ? "Pass" : "Fail",
    time: new Date().toLocaleString(),
    review
  };

  fs.appendFileSync(RESULTS_FILE, `${JSON.stringify(result)}\n`, "utf8");
  res.json(result);
});

app.get("/results/:username", (req, res) => {
  ensureFile(RESULTS_FILE);

  const username = req.params.username;
  const results = fs
    .readFileSync(RESULTS_FILE, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((result) => result.username === username)
    .reverse();

  res.json(results);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

