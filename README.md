# Recruiter Desk

A one-page web app for recruitment consultants. The home page has five workflow buttons. Click one, attach the document, press **Generate**, and Claude writes the result back.

| Workflow | Attach | You get |
|---|---|---|
| **Candidate Summary** | CV (+ call notes) | Client-ready candidate profile |
| **Job Advert** | Job description / client brief | 3 headlines, full advert, short social version |
| **Candidate–Job Match** | CV + job description | Match score, requirements table, risks, screening questions |
| **Call Notes → Admin** | Call/meeting notes or transcript | CRM note, key details, action list, follow-up email |
| **Client Research & Outreach** | Info on a prospect | Research brief, call opener, outreach email, LinkedIn message, follow-up |

Accepts PDF, Word (.docx), text files and images (up to 5 per run). There's also an optional notes box for extra context, or for pasting text instead of attaching a file.

## Run it

You need Node.js 18+ and an Anthropic API key.

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Then open http://localhost:3000.

### Settings (optional environment variables)

- `CLAUDE_MODEL`: defaults to `claude-opus-5-5`
- `CLAUDE_EFFORT`: `low` (default, fastest), `medium` or `high` (more thorough, slower)
- `PORT`: defaults to `3000`

## Changing the prompts

All five prompts and the shared house style live in [`workflows.js`](workflows.js). Edit the text and restart. To add a sixth workflow, add another entry to the list and a new button appears on the home page.
