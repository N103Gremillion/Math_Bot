import { BookInfo, fetch_books_info, insert_books_table } from "../src/tables/books";
import { insert_chapters_table } from "../src/tables/chapters";
import { insert_sections_table } from "../src/tables/sections";

export async function insert_dummy_data(): Promise<void> {
  await insert_dummy_books();
  await insert_dummy_chapters();
  await insert_dummy_sections();
}

export async function insert_dummy_books(): Promise<void> {
  try {
    for (let i = 0; i < 10; i++) {
      const title = `Book ${i + 1}`;
      const author = `Author ${i + 1}`;
      const pageCount = 200 + i;
      const chapterCount = 15;
      const description = `This is the ${i + 1} book`;

      const insert_successful = await insert_books_table(
        title,
        author,
        pageCount,
        chapterCount,
        description
      );

      if (insert_successful) {
        console.log(`Inserted: ${title}`);
      } else {
        console.warn(`Failed to insert: ${title}`);
      }
    }
  } catch (err) {
    console.error("Error inserting dummy book data:", err);
  }
}

// this expects that the previous query has already been run
export async function insert_dummy_chapters(): Promise<void> {
  try {
    const books: BookInfo[] = await fetch_books_info();

    for (const book of books) {
      for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
        const totalSections = 10;
        const chapterTitle = `Chapter ${chapterNum}`;
        const startPage = 1 + (chapterNum - 1) * 10;
        const endPage = startPage + 9;

        const inserted = await insert_chapters_table(
          book.id!,
          chapterTitle,
          chapterNum,
          totalSections,
          startPage,
          endPage
        );

        if (inserted) {
          console.log(`Inserted ${chapterTitle} for ${book.title}`);
        } else {
          console.warn(`Failed to insert ${chapterTitle} for ${book.title}`);
        }
      }
    }
  } catch (err) {
    console.error("Error inserting dummy chapters:", err);
  }
}


export async function insert_dummy_sections(): Promise<void> {
  try {
    const books = await fetch_books_info();

    for (const book of books) {
      const chapterCount = book.chapters ?? 0;

      for (let chapter = 1; chapter <= chapterCount; chapter++) {
        for (let section = 1; section <= 2; section++) {
          const sectionName = `Section ${section}`;
          const startPage = 10 * (chapter - 1) + (section - 1) * 3 + 1;
          const endPage = startPage + 2;
          const totalQuestions = 5 + section; // Arbitrary example

          const success = await insert_sections_table(
            book.id!,
            chapter,
            section,
            sectionName,
            startPage,
            endPage,
            totalQuestions
          );

          if (success) {
            console.log(`Inserted Section ${section} for Book ${book.title}, Chapter ${chapter}`);
          } else {
            console.warn(`Failed to insert Section ${section} for Book ${book.title}, Chapter ${chapter}`);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error inserting dummy sections:", err);
  }
}
