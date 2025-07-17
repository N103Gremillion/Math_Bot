import { fetch_book_by_ISBN } from "../src/commands/books/register_book";
import { insert_authors_table } from "../src/tables/authors";
import { add_total_chapters_to_book, BookInfo, fetch_book_and_author_info, fetch_books_info, fetch_page_count, fetch_total_chapters, insert_books_table } from "../src/tables/books";
import { ChapterInfo, insert_chapters_table } from "../src/tables/chapters";
import { insert_sections_table } from "../src/tables/sections";
import { get_book_info_str } from "../src/utils/util";

const MODERN_OPERATING_SYSTEMS_ISBN : string = "978-0133591620";
const HOW_TO_PROVE_IT_ISBN : string = "978‑1‑108‑42418‑9";

// insert specific books
export async function insert_Modern_Operating_Systems() : Promise<void> {
  
  // first add to genearl book info
  await manually_register_book(MODERN_OPERATING_SYSTEMS_ISBN);

  // register total chapters
  await manually_register_total_chapters(MODERN_OPERATING_SYSTEMS_ISBN, 13);

  // insert chapter info
  const chapters : ChapterInfo[] = [
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "INTRODUCTION", chapter_number : 1, 
      sections : 12, start_page : 3, end_page : 84
    }, // chapter 1
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "PROCESSES AND THREADS", chapter_number : 2, 
      sections : 7, start_page : 85, end_page : 181
    }, // chapter 2
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "MEMORY MANAGEMENT", chapter_number : 3, 
      sections : 9, start_page : 182, end_page : 264
    }, // chapter 3
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "FILE SYSTEMS", chapter_number : 4, 
      sections : 7, start_page : 265, end_page : 336
    }, // chapter 4
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "INPUT/OUTPUT", chapter_number : 5, 
      sections : 10, start_page : 337, end_page : 435
    }, // chapter 5
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "DEADLOCKS", chapter_number : 6, 
      sections : 9, start_page : 436, end_page : 472
    }, // chapter 6
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "VIRTUALIZATION AND THE CLOUD", chapter_number : 7, 
      sections : 13, start_page : 473, end_page : 519
    }, // chapter 7
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "MULTIPLE PROCESSOR SYSTEMS", chapter_number : 8, 
      sections : 5, start_page : 520, end_page : 594
    }, // chapter 8
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "SECURITY", chapter_number : 9, 
      sections : 12, start_page : 595, end_page : 713
    }, // chapter 9
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "CASE STUDY 1: UNIX, LINUX, AND ANDROID", chapter_number : 10, 
      sections : 9, start_page : 714, end_page : 856
    }, // chapter 10
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "CASE STUDY 2: WINDOWS 8", chapter_number : 11, 
      sections : 11, start_page : 857, end_page : 981
    }, // chapter 11
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "OPERATING SYSTEM DESIGN", chapter_number : 12, 
      sections : 7, start_page : 982, end_page : 1030
    }, // chapter 12
    {
      book_isbn : MODERN_OPERATING_SYSTEMS_ISBN, chapter_name : "READING LIST AND BIBLIOGRAPHY", chapter_number : 13, 
      sections : 2, start_page : 1031, end_page : 1041
    }, // chapter 13
  ];
  await manually_register_chapters(chapters);

  // INSERT section info
}

export async function insert_How_To_Prove_It() : Promise<void> {
  // first add to general book info
  await manually_register_book(HOW_TO_PROVE_IT_ISBN);
}

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

export async function manually_register_chapters(chapters : ChapterInfo[]) : Promise<void> {
  for (let i = 0; i < chapters.length; i++) {
    await manually_register_chapter(chapters[i]!);
  }
}

export async function manually_register_chapter (
  chapter_info : ChapterInfo
) : Promise<void> {

  // handle checking for valid input 
  const book_isbn : string = chapter_info.book_isbn!;
  const chapter_name : string = chapter_info.chapter_name!;
  const chapter_number : number = chapter_info.chapter_number!;
  const total_sections : number = chapter_info.sections!;
  const start_page : number = chapter_info.start_page!;
  const end_page : number = chapter_info.end_page!;


  // check if sections make sense
  if (total_sections <= 0) {
    console.log(`Total sections is to small it must be > 0.`);
    return;
  } else if (total_sections > 10000) {
    console.log(`Total sections is to large it must be < 10000.`);
    return;
  }

  // query the total chapters
  const total_book_chapters : number = await fetch_total_chapters(book_isbn);

  // check for invalid chapter number values
  if (total_book_chapters === -1) {
    console.log(
    `Register total chapters in book before entering chapter information.
Book ISBN: ${book_isbn}`
    );
    return;
  }
  else if (chapter_number < 1) {
    console.log(`Chapter number is to small it must be > 0`);
    return; 
  }
  else if (chapter_number > total_book_chapters) {
    console.log(`Chapter number is to large this book has a max of ${total_book_chapters} chapters.`);
    return;
  }

  // query page information 
  const page_count : number = await fetch_page_count(book_isbn);
  
  if (page_count === -1) {
    console.log(
    `Issue fetching from books table.
Invalid book_id.`
    );
    return; 
  }
  else if (start_page < 0) {
    console.log(`Start page can not be less than 0`);
    return; 
  } else if (end_page < 0) {
    console.log(`End page can not be less than 0`);
    return; 
  } else if (start_page > page_count) {
    console.log(`Start page can not be greater than total pages in book, this book has a total of ${page_count} pages.`);
    return; 
  } else if (end_page > page_count) {
    console.log(`End page can not be greater than total pages in book, this book has a total of ${page_count} pages.`);
    return;
  } else if (end_page < start_page) {
    console.log(`End page cannot be greater then end page. Input(start_page : ${start_page}, end_page : ${end_page})`);
    return;
  }

  const insert_successful : boolean = await insert_chapters_table(book_isbn, chapter_name, chapter_number, total_sections, start_page, end_page);

  if (!insert_successful) {
    console.log(
    `====================== Insertion issue for =======================
Chapter name: ${chapter_name}
Chapter number: ${chapter_number}
Total sections: ${total_sections}
Start page: ${start_page}
End page: ${end_page}`
    ); 
  } else {
    console.log(
    `=================== Insertion successful for =======================
Chapter name: ${chapter_name}
Chapter number: ${chapter_number}
Total sections: ${total_sections}
Start page: ${start_page}
End page: ${end_page}`
    );
  }

}

export async function manually_register_total_chapters(
  book_ISBN : string, 
  total_chapters : number, 
) : Promise<void> {
  
  if (total_chapters <= 0) {
    console.log(
      `Total Chapters must be greater than 0.
Invalid input for Total Chapters: ${total_chapters}`
    );
    return;
  }

  if (!Number.isInteger(total_chapters)) {
    console.log(
      `Total Chapters must be a whole number.
Invalid input for Total Chapters: ${total_chapters}`
    );
    return;
  }

  // try to add the info to the database
  const registration_successful : boolean = await add_total_chapters_to_book(book_ISBN, total_chapters);
  const book : BookInfo = (await fetch_book_and_author_info(book_ISBN))!;
  const book_str : string = get_book_info_str(book);

  if (registration_successful) {
    console.log(
      `============== Successful insert for total chapters ====================
${book_str}`
    );
  } else {
    console.log(
      `============== Issue inserting total chapters ====================
Book ISBN: ${book_ISBN}.
Total Chapters: ${total_chapters}`
    );
  }

}