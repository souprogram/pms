import fs from "fs";
import path from "path";

export function renderTemplate(
  templatePath: string,
  variables: Record<string, string>,
): string {
  let html = fs.readFileSync(
    path.join(__dirname, `${templatePath}.html`),
    "utf8",
  );

  for (const key in variables) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(regex, variables[key]);
  }

  return html;
}
