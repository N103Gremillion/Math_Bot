# 📚  Math_Bot (Book Tracking Bot)

## Dependencies
- to download dependencies use npm install in the root directory of the project
- npm version - 10.9.2
- node version - 23.10.0


## Running
npm start - will run the project 


## Overview
A backend-powered bot designed to help you track your reading progress through books. This tool stores your book data locally using **SQLite** and provides **graphical insights** into your reading habits.

---

## ✨ Features

- 📖 Track multiple books and your progress through each
- 🗃️ Store book data locally with **SQLite**
- 📊 Visualize reading progress with **graphs**
- 🔢 Log pages read and calculate total reading progress
- 🧠 Optional skill point system (if applicable to gamify reading)
- 📚 Manage a virtual bookshelf (add/remove books)
- 📅 Log daily reading progress with timestamps
- ⏱ View historical logs and stats

---

## Technologies Used

- **Node.js 
- **SQLite
- **asciichart https://www.npmjs.com/package/asciichart
- **discord.js https://discord.js.org/docs/packages/discord.js/14.21.0

---

## Commands / examples

```bash
# Add a book
add_to_bookshelf "The Hobbit" --total-pages 310

# Start reading
start_reading "The Hobbit"

# Log progress
log_progress "The Hobbit" --pages-read 20

# View current progress
view_logs "The Hobbit"

# Visualize progress graphically
view_progress_graph "The Hobbit"
