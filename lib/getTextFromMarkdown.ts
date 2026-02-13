export default function getTextFromMarkdown(markdown: string): string {
    return markdown.replace(/[#_*~`>+-]/g, "").trim();
}