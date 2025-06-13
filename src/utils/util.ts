import { database_g } from "../entry"

export function wrap_str_in_code_block(str: string): string {
    return `\`\`\`\n${str}\n\`\`\``
}