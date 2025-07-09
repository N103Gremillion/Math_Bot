import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, insert_books_table } from "../../tables/books";
import { BookField } from "./BookField";


interface Open_Library_Book_Response {
  full_title?: string;
  title?: string;
  number_of_pages: number;
  covers: number[];
  author? : string;
  authors?: Array<{ key: string } | string >;
}


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

  if (!book_info!.title || !book_info!.author || !book_info!.number_of_pages){
    cmd.reply(
      wrap_str_in_code_block(
        `Issue fetching book with ISBN: ${isbn}.
Could not fetch vital infor like title, author, and page count.`
      )
    );
  }
  // try and add the book to books table
  const book_registered : boolean = await insert_books_table(isbn, book_info.title, book_info.author, book_info.number_of_pages, book_info.cover_id);
  let resulting_response : string = "";
  
  if (book_registered) {  
    resulting_response =
`=================== Insertion successful for =======================
Book Title: ${book_info.title}
Book Author: ${book_info.author}
Page Count: ${book_info.number_of_pages}`;
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
    const response : Response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
      headers: {
        "User-Agent" : "MathBot/0.1 (nathan103grem@gmail.com)"
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
    
    const data : Open_Library_Book_Response = await response.json();

    // map the data onto the Book_Info res
    let res : BookInfo = {
      isbn : isbn,
      title : data.full_title ?? data.title ?? "Unknown Title",
      author : await get_author_info_from_response(data),
      number_of_pages: data.number_of_pages,
      cover_id : Array.isArray(data.covers) ? data.covers[0] : undefined
    };
    return res;

  } catch (error) {
    console.log(`Issue fetching book with ISBN: ${isbn}.`, error);
    return null;
  }
}

async function get_author_info_from_response(data : Open_Library_Book_Response) : Promise<string> {
  // first see if the author is given directly on the author field of the body
  if (data.author && data.author[0]){
    return data.author[0];
  }
  // else try and query the author info from the key in the authors field of the body
  else if (data.authors && Array.isArray(data.authors) && data.authors[0]) {
    const first_author_info = data.authors[0];
    // Subcase 1: if it is a hard coded string of the author name
    if (typeof first_author_info === 'string') {
      return first_author_info;
    }
    // Subcase 2: if the info is an object with a key we can query the resulting info
    else if (first_author_info.key){
      return fetch_author_with_key(first_author_info.key);
    }
  } 
  // else we have no other way off fetching the author name
  return "Unknown Author";
}

async function fetch_author_with_key(author_key : string) : Promise<string> {
  const author_resp = await fetch(`https://openlibrary.org${author_key}.json`, {
    headers: {
      "User-Agent": "MathBot/0.1 (nathan103grem@gmail.com)"
    }
  });
  if (author_resp.ok) {
    const author_data = await author_resp.json();
    if (author_data.name) {
      return author_data.name;
    }
    console.log(`Issue fetching author name with key ${author_key}.`);
    return "Unknown Author";
  } 
  else {
    return "Unknown Author";
  }
}

export const register_book_command : Command = {
  command: "register_book",
  command_type: COMMAND_TYPE.REGISTER_BOOK,
  description: "Adds a book to the database",
  action: execute_register_book,
  requires_params : true
}