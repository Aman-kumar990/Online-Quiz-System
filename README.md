# Online Quiz System

A web-based Online Quiz System for creating, managing, and attempting quizzes. The system allows users to answer questions, calculate scores, view results, and manage quiz-related data using a simple web interface.

## Features

- User-friendly quiz interface
- Admin login system
- Dashboard for quiz management
- Add and manage quiz questions
- Auto-generated question IDs
- Multiple-choice questions
- Attempt quizzes online
- Automatic score calculation
- View quiz results
- Transaction/history-style result records
- JSON-based local data storage
- Node.js and Express.js server
- C backend demo for quiz/question operations

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- JSON
- C

## Project Structure

```text
online-quiz-system/
├── backend/
│   └── quiz.c
├── data/
│   ├── questions.json
│   ├── users.json
│   └── results.json
├── frontend/
│   ├── login.html
│   ├── dashboard.html
│   ├── quiz.html
│   ├── result.html
│   ├── style.css
│   └── script.js
└── middleware/
    ├── server.js
    ├── package.json
    └── package-lock.json
Installation
Clone the repository:

git clone https://github.com/your-username/Online-Quiz-System.git
cd Online-Quiz-System
Go to the middleware folder:

cd middleware
Install dependencies:

npm install
Start the server:

npm start
Open the app in your browser:

http://localhost:3000/login.html
Default Admin Login
Username: admin
Password: admin123
API Features
The Express server provides endpoints for:

Login
Add quiz question
View questions
Delete question
Update question
Start quiz
Submit quiz
Calculate score
View results
View quiz history
Dashboard summary reports
C Backend Demo
The backend/quiz.c file contains a simple C program that demonstrates quiz/question management operations.

To compile it:

gcc backend/quiz.c -o quiz
To run it:

./quiz
On Windows:

quiz.exe
Important Note
Do not upload node_modules to GitHub. It can be regenerated using:

npm install
If your JSON files contain real user or result data, clear them before uploading publicly.

Author
Created by Aman.


**Recommended `.gitignore`**

```gitignore
node_modules/
npm-debug.log*
.env

.DS_Store
Thumbs.db

*.exe
*.o
*.out

.vscode/
.idea/

# Optional: ignore local/private data if needed
# data/*.json
Files You Should Upload

Upload these:

backend/quiz.c
data/questions.json
data/users.json
data/results.json
frontend/login.html
frontend/dashboard.html
frontend/quiz.html
frontend/result.html
frontend/style.css
frontend/script.js
middleware/server.js
middleware/package.json
middleware/package-lock.json
README.md
.gitignore
Do not upload these:

middleware/node_modules/
node_modules/
*.exe
MinGW Installer.lnk
GitHub About Section

Description:
A web-based Online Quiz System using HTML, CSS, JavaScript, Node.js, Express, JSON storage, and a C backend demo.

Topics:
online-quiz-system quiz-application nodejs expressjs javascript html css json c-programming web-application quiz-system
