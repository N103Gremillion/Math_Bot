import { BookStatus, BookStatusStr } from './../tables/bookshelf';
import { EmbedBuilder } from "discord.js";
import { BookInfo, fetch_books_with_isbns } from "../tables/books";
import { get_authors_str, get_chapter_info_str } from "../utils/util";
import { get_cover_url_medium, get_cover_url_small } from "./books/view_book_info";
import { BookshelfInfo } from "../tables/bookshelf";

export function get_book_embed(book : BookInfo) : EmbedBuilder {

  const embed : EmbedBuilder = new EmbedBuilder()
    .setTitle(book.title)
    .setAuthor({name : get_authors_str(book.authors)})
    .setImage(get_cover_url_medium(book.cover_id))
    .setFooter({text : `Page Count : ${book.number_of_pages}
Chapter Count : ${get_chapter_info_str(book.total_chapters)}`
    });
  
  return embed;
}

export async function get_book_embeds(bookshelf_state : BookshelfInfo[]) : Promise<EmbedBuilder[]> {
  const books : BookInfo[] = await fetch_books_with_isbns(bookshelf_state);
  const n : number = books.length;
  const res : EmbedBuilder[] = [];

  for (let i = 0; i < n; i += 1) {
    const book : BookInfo | undefined = books[i];
    const entry : BookshelfInfo | undefined = bookshelf_state[i];
    if (!book || !entry) continue;

    const status_symbol = get_satus_symbol(entry.status);


    const embed : EmbedBuilder = new EmbedBuilder()
      .setTitle(`${book.title}`)
      .setAuthor({name : `${status_symbol}
${get_authors_str(book.authors)}`})
      .setFooter({
        text : `Current Page: ${entry.cur_page}
Page Count: ${book.number_of_pages}
Chapter Count: ${get_chapter_info_str(book.total_chapters)}`  
      });
    
    const cover_url : string = get_cover_url_medium(book.cover_id);
    if (cover_url) {
      embed.setImage(cover_url);
    }
    res.push(embed);
  }
  return res;
}

function get_satus_symbol(status : BookStatus | undefined) : string {
  const pending : string = "🟡 Pending";
  const reading : string = "🟢 Reading";
  const complete : string = "✅ Completed";
  if (!status || status === BookStatusStr.Pending) {
    return pending;
  } 
  else if (status === BookStatusStr.Reading) {
    return reading;
  } else {
    return complete;
  }
}