import { EmbedBuilder } from "discord.js";
import { BookInfo } from "../tables/books";
import { get_authors_str, get_chapter_info_str } from "../utils/util";
import { get_cover_url_medium, get_cover_url_small } from "./books/view_book_info";

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

export function get_book_embeds(books : BookInfo[]) : EmbedBuilder[] {
  const n : number = books.length;
  const res : EmbedBuilder[] = [];

  for (let i = 0; i < n; i += 1) {
    const book : BookInfo | undefined = books[i];
    if (!book) continue;

    const embed : EmbedBuilder = new EmbedBuilder()
      .setTitle(book.title)
      .setAuthor({name : get_authors_str(book.authors)})
      .setFooter({
        text : `Page Count: ${book.total_chapters}
Chapter Count: ${get_chapter_info_str(book.total_chapters)}`  
      });
    
    const cover_url : string = get_cover_url_small(book.cover_id);
    if (cover_url) {
      embed.setImage(cover_url);
    }
    res.push(embed);
  }
  return res;
}