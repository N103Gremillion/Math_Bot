import { fetch_book_by_ISBN } from "../src/commands/books/register_book";
import { insert_authors_table } from "../src/tables/authors";
import { BookInfo, fetch_books_info, insert_books_table } from "../src/tables/books";
import { insert_chapters_table } from "../src/tables/chapters";
import { insert_sections_table } from "../src/tables/sections";

// fill books with a bunch of random books
export async function insert_random_books(): Promise<void> {
  const isbns: string[] = [
    "9780143127741", // Sapiens
    "9780307277671", // The Road
    "9780062316097", // The Alchemist
    "9781451673319", // Fahrenheit 451
    "9780439023528", // The Hunger Games
    "9780261103573", // The Fellowship of the Ring
    "9781982137458", // The Midnight Library
    "9781501124020", // It Ends With Us
    "9780316769488", // The Catcher in the Rye
    "9780385472579", // Zen and the Art of Motorcycle Maintenance
    "9780307346605", // The Book Thief
    "9780446310789", // To Kill a Mockingbird
    "9780743273565", // The Great Gatsby
    "9780618640157", // The Hobbit
    "9780061120084", // Brave New World
    "9780316015844", // Twilight
    "9780441013593", // Dune
    "9780590353427", // Harry Potter and the Sorcerer's Stone
    "9781593279509", // Eloquent JavaScript
    "9780131103627", // The C Programming Language
    "9781491950296", // Designing Data-Intensive Applications
    "9780132350884", // Clean Code
    "9780596007126", // Head First Design Patterns
    "9780201633610", // Design Patterns
    "9780262033848", // Introduction to Algorithms
    "9780134685991", // Effective Java
    "9781982137274", // Verity
    "9780385547345", // The Lincoln Highway
    "9780143110439", // Outliers
    "9780385484510", // The Four Agreements
    "9780316017930", // New Moon
    "9780385333498", // The Time Traveler’s Wife
    "9781501139154", // The Silent Patient
    "9781984822185", // Atomic Habits
    "9780812981605", // The Power of Habit
    "9780062457738", // The Subtle Art of Not Giving a F*ck
    "9780140449266", // Meditations - Marcus Aurelius
    "9780451524935", // 1984
    "9780156012195", // The Little Prince
    "9780060935467", // Of Mice and Men
    "9780679783275", // Pride and Prejudice
    "9780140283334", // Guns, Germs, and Steel
    "9780060850524", // Freakonomics
    "9780060976842", // The 7 Habits of Highly Effective People
    "9781400032716", // Life of Pi
    "9780812973815", // The Kite Runner
    "9781455586691", // The Girl on the Train
    "9780812988406", // A Man Called Ove
    "9780525559474", // Where the Crawdads Sing
    "9780374533557", // Thinking, Fast and Slow
  ];

  for (const isbn of isbns) {
    try {
      await manually_register_book(isbn);
    } catch (err) {
      console.error(`Failed to register ISBN ${isbn}:`, err);
    }
  }
}

export async function insert_How_To_Prove_It() : Promise<void> {
  
}

export async function manually_register_book (isbn : string) : Promise<void> {

  const book_info : BookInfo | null = await fetch_book_by_ISBN(isbn); 

  if (book_info === null || book_info === undefined) {
    console.log("book_info is null.")
    return; 
  }

  if (!book_info!.title || !book_info!.authors || !book_info!.number_of_pages){ 
    console.log("missing info on book.");
    return;
  }

  // try and add the book to books table
  const book_registered : boolean = await insert_books_table(isbn, book_info.title, book_info.number_of_pages, book_info.cover_id);
  // try and add author info to authors table
  const author_registerd : boolean = await insert_authors_table(isbn, book_info.authors);

  if (book_registered && author_registerd) {
    console.log("Book insert successful.");
  } else {
    console.log("Issue inserting book.")
  }
} 

