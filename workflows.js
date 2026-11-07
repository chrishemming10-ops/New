// The five recruiter workflows. Each one is a button on the home page.
// Edit the `prompt` text to change what Claude produces — no other code needs to change.

const HOUSE_STYLE = `You are an expert recruitment consultant's assistant with 19 years of desk experience.
Write in UK English. Be concise, specific and commercially sharp. Never invent facts that are
not in the documents provided — if something important is missing, flag it in a short
"Gaps to check" list at the end. Use clear headings and bullet points (Markdown).`;

export const workflows = [
  {
    id: "candidate-summary",
    title: "Candidate Summary",
    blurb: "Turn a CV into a client-ready candidate profile.",
    attach: "Attach the candidate's CV (plus any call notes)",
    prompt: `Using the attached CV (and any notes), write a client-ready candidate summary to send to a hiring manager.

Structure:
1. **Headline** – one line: role, years' experience, key selling point.
2. **Snapshot** – current role, location, availability/notice, salary expectations (if stated), registrations/qualifications.
3. **Why they stand out** – 4–6 bullets, evidence-based, with numbers where available.
4. **Career overview** – short reverse-chronological summary.
5. **Motivation for moving** – only if stated in the notes.
6. **Gaps to check** – anything the consultant should confirm before sending.

Keep it under 350 words. Do not include the candidate's personal contact details.`,
  },
  {
    id: "job-advert",
    title: "Job Advert",
    blurb: "Turn a job spec or client notes into an advert that gets applies.",
    attach: "Attach the job description or client brief",
    prompt: `Using the attached job description / client brief, write a compelling job advert.

Deliver:
1. **3 headline options** (punchy, include role + location).
2. **The advert** (250–400 words): an opening hook aimed at the candidate, "What's in it for you" bullets (pay, hours, benefits, progression), "The role", "What you'll need", and a clear call to action.
3. **Short version** (under 80 words) for LinkedIn / social / job board summaries.

Write for the candidate, not the client. Avoid clichés ("rockstar", "fast-paced environment") and keep it inclusive and compliant (no age, gender or other discriminatory wording).`,
  },
  {
    id: "candidate-job-match",
    title: "Candidate–Job Match",
    blurb: "Score a CV against a role and get screening questions.",
    attach: "Attach the CV and the job description",
    prompt: `Compare the attached CV against the attached job description.

Deliver:
1. **Match score** out of 10 with a one-line verdict (Submit / Submit with caveats / Don't submit).
2. **Requirements check** – a table: Requirement | Evidence from CV | Met? (✅ / ⚠️ / ❌).
3. **Strengths to sell** – top 3, phrased so the consultant can use them with the client.
4. **Risks / gaps** – what might make the client say no.
5. **Screening questions** – 5–7 targeted questions to ask the candidate to close the gaps.

If only one document is attached, say which one is missing and do the best analysis you can.`,
  },
  {
    id: "call-notes-admin",
    title: "Call Notes → Admin",
    blurb: "Turn rough call or meeting notes into CRM notes and follow-up emails.",
    attach: "Attach your call notes, transcript or meeting notes",
    prompt: `Turn the attached call / meeting notes (or transcript) into finished admin.

Deliver:
1. **CRM note** – tidy, factual summary ready to paste into the CRM (who, when, key points, outcome).
2. **Key details captured** – bullets for anything structured: availability, salary/rate, locations, notice, preferences, decision-makers, timelines.
3. **Action list** – who does what by when (consultant actions first).
4. **Follow-up email** – a ready-to-send email to the person on the call, confirming what was agreed and next steps.

Keep the email warm, professional and under 180 words.`,
  },
  {
    id: "client-outreach",
    title: "Client Research & Outreach",
    blurb: "Turn info on a prospect into a research brief and BD messages.",
    attach: "Attach info about the prospect (website copy, job ad, LinkedIn page, notes)",
    prompt: `Using the attached information about a prospective client, prepare business-development material.

Deliver:
1. **Research brief** – who they are, size/locations, what they appear to be hiring for, likely pain points, and any hooks (growth, new sites, recent hires, live vacancies).
2. **Angle** – the single best reason they should take a call from us.
3. **Call opener** – a natural 30-second phone opening plus 3 discovery questions.
4. **Outreach email** – under 150 words, personalised, one clear ask.
5. **LinkedIn message** – under 300 characters.
6. **Follow-up email** – a short bump for 4–5 days later.

Sound like a credible specialist recruiter, not a salesperson. No generic flattery.`,
  },
];

export const systemPrompt = HOUSE_STYLE;
