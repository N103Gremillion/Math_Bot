import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, insert_books_table } from "../../tables/books";
import { BookField } from "./BookField";
import { wrap } from "module";

export async function execute_register_book (cmd : ChatInputCommandInteraction) : Promise<void> {

  // get isbn from response
  const isbn : string = cmd.options.getString(BookField.ISBN)!;

  const book_info : BookInfo | null = await fetch_book_by_ISBN(isbn)

  if (book_info === null || book_info === undefined) {
    cmd.reply(
      wrap_str_in_code_block(
        `Issue fetching book with ISBN: ${isbn}.
Either this books info is not available or the isbn is invalid.`
      )
    );
    return;
  }

  if (!book_info!.title || !book_info!.author || !book_info!.page_count){
    cmd.reply(
      wrap_str_in_code_block(
        `Issue fetching book with ISBN: ${isbn}.
Could not fetch vital infor like title, author, and page count.`
      )
    );
  }
  // try and add the book to books table
  const book_registered : boolean = await insert_books_table(isbn, book_info.title, book_info.author, book_info.page_count, book_info.cover_id);
  let resulting_response : string = "";

  console.log(book_info);
  
  if (book_registered) {  
    resulting_response =
`=================== Insertion successful for =======================
Book Title: ${book_info.title}
Book Author: ${book_info.author}
Page Count: ${book_info.page_count}`;
  } else {
    resulting_response = 
`=================== Insertion failed for =======================
Issue inserting book with ISBN: ${isbn}.
This ISBN is likely already registered. 
Note: you can view registered books using /view_books.`;
  }
  await cmd.reply(wrap_str_in_code_block(resulting_response));
} 

async function fetch_book_by_ISBN(isbn : string) : Promise<BookInfo | null> {
  try {
    const response : Response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
    
    const data : any = await response.json();

    // map the data onto the Book_Info res
    let res : BookInfo = {
      isbn : isbn,
      title : data.full_title ?? data.title ?? "Unknown Title",
      author : "", // needs to be fetched with the author key
      page_count: (data.number_of_pages !== undefined && data.number_of_pages !== null) ? data.number_of_pages : null,
      cover_id : Array.isArray(data.covers) ? data.covers[0] : null,
    };
    
    // fetch the author using the author key
    if (data.authors && Array.isArray(data.authors) && data.authors.length > 0 && data.authors[0] && data.authors[0].key) {
      const author_key = data.authors[0].key;
      const authorResp = await fetch(`https://openlibrary.org${author_key}.json`);
      if (authorResp.ok) {
        const authorData = await authorResp.json();
        res.author = authorData.name ?? "Unknown Author";
      } else {
        res.author = "Unknown Author";
      }
    }

    return res;

  } catch (error) {
    console.log(`Issue fetching book with ISBN: ${isbn}.`, error);
    return null;
  }
}

export const register_book_command : Command = {
  command: "register_book",
  command_type: COMMAND_TYPE.REGISTER_BOOK,
  description: "Adds a book to the database",
  action: execute_register_book,
  requires_params : true
}