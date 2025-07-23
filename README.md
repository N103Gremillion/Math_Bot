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

## Commands

```bash
/command_name                     # Description

/ping                             # Ping server and display latency  
/ls                               # List commands and their descriptions  
/register_user                    # Adds a user to the database  
/remove_user                      # Removes a user from the database  
/register_book                    # Adds a book to the database  
/remove_book                      # Removes a book from the database  
/view_books                       # View a page of registered books  
/view_book                        # View info about a specific book  
/register_chapter                 # Register a chapter in one of the books  
/view_chapters                    # View all chapters in a book  
/register_section                 # Register a section in a book  
/help                             # Provides guidance on how to use the bot  
/register_total_chapters          # Add total chapter info to a selected book  
/add_to_bookshelf                 # Add a book to your bookshelf  
/remove_from_bookshelf            # Remove a book from your bookshelf  
/drop_bookshelf                   # Remove all books from your bookshelf  
/view_bookshelf                   # View all books in your bookshelf  
/start_reading                    # Tag a book as "Reading" to begin tracking  
/log_progress                     # Log progress in a book you are reading  
/view_logs                        # View past progress logs for a specific book  
/view_progress_graph              # View a graph of current and projected progress  
/increment_skill_points           # Increment the skill points of a user  
/view_all_skill_points            # View skill points for all users  
