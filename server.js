const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const questionBankPath = path.join(root, "question-bank.json");

function loadEnv() {
    const envPath = path.join(root, ".env");
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (match && !process.env[match[1]]) {
            process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
        }
    }
}

loadEnv();

function sendJson(res, status, body) {
    const payload = JSON.stringify(body);
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(payload);
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
            if (body.length > 10_000) reject(new Error("Request body is too large."));
        });
        req.on("end", () => resolve(body));
        req.on("error", reject);
    });
}

function getLocalQuestions(requestUrl) {
    if (!fs.existsSync(questionBankPath)) {
        throw new Error("question-bank.json is missing. Add your question bundle to the project folder.");
    }
    const bank = JSON.parse(fs.readFileSync(questionBankPath, "utf8"));
    if (!Array.isArray(bank)) throw new Error("question-bank.json must contain a JSON array.");
    const topic = requestUrl.searchParams.get("topic") || "";
    const matches = topic === "Paper 2 : LIS (All Topics)"
        ? bank
        : bank.filter(question => question.topic === topic || question.unit === topic);
    if (!matches.length) {
        throw new Error(`No local questions are available for ${topic}.`);
    }
    const questionLimit = topic === "Paper 2 : LIS (All Topics)" ? 50 : matches.length;
    return matches.sort(() => Math.random() - 0.5).slice(0, questionLimit);
}

const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && requestUrl.pathname === "/api/questions") {
        try {
            return sendJson(res, 200, { questions: getLocalQuestions(requestUrl) });
        } catch (error) {
            return sendJson(res, 503, { error: error.message });
        }
    }
    if (req.method === "GET" && requestUrl.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(fs.readFileSync(path.join(root, "index.html")));
    }
    if (req.method === "GET" && requestUrl.pathname === "/practice.html") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(fs.readFileSync(path.join(root, "practice.html")));
    }
    res.writeHead(404);
    res.end("Not found");
});

server.listen(port, () => {
    console.log(`UGC NET quiz running at http://localhost:${port}`);
});
