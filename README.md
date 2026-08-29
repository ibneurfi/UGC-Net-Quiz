# UGC NET Quiz

## Run locally

1. Install Node.js 18 or newer.
2. Put at least 10 processed questions in each of Unit 1 through Unit 10 in `question-bank.json` for the all-topics mock test (100 questions total).
3. Start the server:

   `npm.cmd start` (use `npm.cmd` if PowerShell blocks `npm`)

4. Open <http://localhost:3000> in your browser.

Do not open `index.html` directly: the local question bank is served by the local server.

## Question bundle format

`question-bank.json` must be an array. Each question needs `unit`, `q`, `options` (four strings), `correct` (0-3), and `exp`. The **Paper 2 : LIS** choice uses questions from all units; other choices filter by unit.

The quiz uses only the local question bank and does not need an API key or paid plan.

## Publish with GitHub Pages

This project can run as a free static website on GitHub Pages. Upload `index.html`, `practice.html`, and `question-bank.json` to a GitHub repository. In the repository, open **Settings → Pages** → **Source: Deploy from a branch** → **Branch: main** (or your default branch).

You do not need to upload `server.js`, `package.json`, `.env`, or Node.js for GitHub Pages. To add questions later, edit `question-bank.json`, commit the change, and GitHub Pages will publish the update automatically.

Questions are selected by unit. The first option, **Paper 2 : LIS (All Topics)**, randomly selects exactly 10 questions from each Unit 1–10 (100 total). Unit 1–Unit 10 options use all questions available in the selected unit. Mock tests have a 120-minute time limit; practice mode remains untimed.

For future topic-specific filtering, add a `topic` value to each question. Use the exact option value from the HTML, for example:

`Cataloguing & Classification Standards (AACR2, RDA, DDC, CC)`

Example:

```json
{
  "unit": "Unit 2",
  "topic": "Cataloguing & Classification Standards (AACR2, RDA, DDC, CC)",
  "q": "Your question?",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correct": 0,
  "exp": "Explanation"
}
```

Keep all questions in the same `question-bank.json`; separate files would require extra loading logic.
