import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { BookInfo } from "../tables/books"
import { fetch_user_id } from "../tables/users";

export async function get_user_id_from_interaction(cmd : ChatInputCommandInteraction | StringSelectMenuInteraction) : Promise<number> {
    const user_name : string  = cmd.user.username;
    const user_id : number = await fetch_user_id(user_name);
    return user_id;
}

export function wrap_str_in_code_block(str: string): string {
    return `\`\`\`\n${str}\n\`\`\``
}

// construct the string with the given book info
export function get_book_info_str(book_info : BookInfo) : string {
    // if get author info
    let authors_string : string = get_authors_str(book_info.authors);
    
    const chapter_count_str = get_chapter_info_str(book_info.total_chapters);

    // attach all or it and return
    const res_string = 
    `Book Title: ${book_info.title}
Book Authors: ${authors_string}
Page Count: ${book_info.number_of_pages}
Total Chapters: ${chapter_count_str}`;

    return res_string;
}

export function get_chapter_info_str(total_chapters : number | undefined | null) : string {
    return total_chapters !== undefined && total_chapters !== null
        ? total_chapters.toString()
        : "Not Registered";
}

export function get_authors_str(authors : string[]) : string {
    let authors_str : string = ""; 
    const n : number = authors.length;
    for (let i = 0; i < n; i++) {
        const author : string | undefined = authors[i];
        if(!author || author === "Unknown Author" || author === "Unknown Authors") continue;
        authors_str += author;
        if (i !== n - 1) authors_str += ", ";
    }
    if (authors_str === "") {
        authors_str = "Unknown Author";
    }
    return authors_str;
}