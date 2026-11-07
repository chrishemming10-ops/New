import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import Anthropic from "@anthropic-ai/sdk";
import { workflows, systemPrompt } from "./workflows.js";

const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
// "low" keeps answers fast; raise to "medium" or "high" for more thorough output.
const EFFORT = process.env.CLAUDE_EFFORT || "low";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 5 } });
const app = express();

app.use(express.static("public"));
app.use("/vendor", express.static("node_modules/marked"));

// Workflow list for the home page (prompt text stays on the server).
app.get("/api/workflows", (_req, res) => {
  res.json(workflows.map(({ id, title, blurb, attach }) => ({ id, title, blurb, attach })));
});

// Convert one uploaded file into Claude content blocks.
async function toContentBlocks(file) {
  const name = file.originalname;
  const type = file.mimetype;
  const lower = name.toLowerCase();

  if (type === "application/pdf" || lower.endsWith(".pdf")) {
    return [{
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: file.buffer.toString("base64") },
      title: name,
    }];
  }
  if (/^image\/(png|jpeg|gif|webp)$/.test(type)) {
    return [
      { type: "text", text: `Image attached: ${name}` },
      { type: "image", source: { type: "base64", media_type: type, data: file.buffer.toString("base64") } },
    ];
  }
  if (lower.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return [{ type: "text", text: `<document name="${name}">\n${value}\n</document>` }];
  }
  if (type.startsWith("text/") || /\.(txt|md|csv|rtf|html?)$/.test(lower)) {
    return [{ type: "text", text: `<document name="${name}">\n${file.buffer.toString("utf8")}\n</document>` }];
  }
  throw new Error(`Unsupported file type: ${name}. Use PDF, Word (.docx), text or an image.`);
}

app.post("/api/run/:id", upload.array("files", 5), async (req, res) => {
  const workflow = workflows.find((w) => w.id === req.params.id);
  if (!workflow) return res.status(404).json({ error: "Unknown workflow" });

  const notes = (req.body?.notes || "").trim();
  const files = req.files || [];
  if (files.length === 0 && !notes) {
    return res.status(400).json({ error: "Attach a document (or paste some text) first." });
  }

  let content;
  try {
    content = (await Promise.all(files.map(toContentBlocks))).flat();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  if (notes) content.push({ type: "text", text: `<consultant_notes>\n${notes}\n</consultant_notes>` });
  content.push({ type: "text", text: workflow.prompt });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      system: systemPrompt,
      output_config: { effort: EFFORT },
      // If a request is declined by a safety classifier, retry on Anthropic's recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [{ role: "user", content }],
    });

    req.on("close", () => stream.abort());

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(event.delta.text);
      }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      res.write("\n\n_Claude declined to process this request. Try rephrasing or a different document._");
    } else if (final.stop_reason === "max_tokens") {
      res.write("\n\n_Output was cut off — try a shorter document._");
    }
    res.end();
  } catch (err) {
    if (res.writableEnded) return;
    console.error(err);
    let msg = "Something went wrong talking to Claude.";
    if (err instanceof Anthropic.AuthenticationError) msg = "Invalid or missing ANTHROPIC_API_KEY.";
    else if (err instanceof Anthropic.RateLimitError) msg = "Rate limited — wait a moment and try again.";
    else if (err instanceof Anthropic.BadRequestError) msg = `Request rejected: ${err.message}`;
    else if (err instanceof Anthropic.APIConnectionError) msg = "Couldn't reach the Claude API.";
    res.write(`\n\n**Error:** ${msg}`);
    res.end();
  }
});

app.listen(PORT, () => console.log(`Recruiter Desk running on http://localhost:${PORT}`));
