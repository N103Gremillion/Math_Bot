import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { get_book_info_str, wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, insert_books_table } from "../../tables/books";
import { BookField } from "./BookField";
import { insert_authors_table } from "../../tables/authors";



interface Open_Library_Book_Response {
  full_title?: string;
  title?: string;
  number_of_pages: number;
  covers: number[];
  author? : string;
  authors?: Array<{ key: string } | string >;
}

const HEADER_INFO = {
  "User-Agent": "MathBot/0.1 (nathan103grem@gmail.com)"
}

export async function execute_register_book (cmd : ChatInputCommandInteraction) : Promise<void> {

  // get isbn from response
  const isbn : string = cmd.options.getString(BookField.ISBN)!;

  const book_info : BookInfo | null = await fetch_book_by_ISBN(isbn); 

  if (book_info === null || book_info === undefined) {
    await cmd.reply(
      wrap_str_in_code_block(
        `Issue fetching book with ISBN: ${isbn}.
Either this books info is not available or the isbn is invalid.`
      )
    );
    return;
  }

  if (!book_info!.title || !book_info!.authors || !book_info!.number_of_pages){ 
    await cmd.reply(
      wrap_str_in_code_block(
        `Issue fetching book with ISBN: ${isbn}.
Could not fetch vital infor like title, author, and page count.`
      )
    );
    return;
  }

  // try and add the book to books table
  const book_registered : boolean = await insert_books_table(isbn, book_info.title, book_info.number_of_pages, book_info.cover_id);
  // try and add author info to authors table
  await insert_authors_table(isbn, book_info.authors);
  let resulting_response : string = get_book_info_str(book_info);


  if (book_registered ) {  
    resulting_response =
`=================== Insertion successful for =======================
${resulting_response}`;
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
      headers : HEADER_INFO
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
      authors : await get_authors_info_from_response(data),
      number_of_pages: data.number_of_pages,
      cover_id : Array.isArray(data.covers) ? data.covers[0] : undefined
    };
    return res;

  } catch (error) {
    console.log(`Issue fetching book with ISBN: ${isbn}.`, error);
    return null;
  }
}

async function get_authors_info_from_response(data : Open_Library_Book_Response) : Promise<string[]> {
  const authors : string[] = []

  // Case 1: author field is a simple array of strings
  if (Array.isArray(data.author) && data.author.length > 0){
    authors.push(...data.author);
  }
  // else try and query the authors info from the key in the authors field of the body
  else if (data.authors && Array.isArray(data.authors) && data.authors.length > 0) {
    for (let i = 0; i < data.authors.length; i++) {
      const author_info : { key: string } | string | undefined = data.authors[i]; 
      if (author_info === undefined) {
        continue;
      }
      else if (typeof author_info === 'string'){
        authors.push(author_info)
      } else {
        authors.push(await fetch_author_with_key(author_info.key))
      }
    }
  }
  // else we have no other way off fetching the author name
  else {
    authors.push("Unknown Authors")
  }
  
  return authors;
}

async function fetch_author_with_key(author_key : string) : Promise<string> {
  const author_resp = await fetch(`https://openlibrary.org${author_key}.json`, {
    headers : HEADER_INFO
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