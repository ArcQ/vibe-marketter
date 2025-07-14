import 'dotenv/config';
import Database from 'better-sqlite3';

const API_BASE = 'https://twitterapi.io/api/v2';

const TOKEN = process.env.TWITTER_BEARER_TOKEN;
if (!TOKEN) {
  console.error('TWITTER_BEARER_TOKEN missing');
  process.exit(1);
}

const POLL_INTERVAL = Number(process.env.POLL_INTERVAL_SECONDS || 300);
const BELLWETHER_IDS = (process.env.BELLWETHER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const CORE_LIST_ID = process.env.CORE_LIST_ID;
const DB_PATH = process.env.DB_PATH || 'poller.db';

const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS cursors (
  source TEXT PRIMARY KEY,
  since_id TEXT
);
CREATE TABLE IF NOT EXISTS tweets (
  id TEXT PRIMARY KEY,
  author_id TEXT,
  text TEXT,
  created_at TEXT,
  source TEXT
);
`);

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

function getSinceId(source) {
  const row = db.prepare('SELECT since_id FROM cursors WHERE source = ?').get(source);
  return row?.since_id;
}

function setSinceId(source, since) {
  db.prepare('INSERT OR REPLACE INTO cursors (source, since_id) VALUES (?, ?)').run(source, since);
}

function storeTweets(tweets, source) {
  const stmt = db.prepare('INSERT OR IGNORE INTO tweets (id, author_id, text, created_at, source) VALUES (?,?,?,?,?)');
  for (const t of tweets) {
    stmt.run(t.id, t.author_id, t.text, t.created_at, source);
  }
}

async function poll() {
  for (const id of BELLWETHER_IDS) {
    const source = `user:${id}`;
    const since = getSinceId(source);
    const url = new URL(`/users/${id}/tweets`, API_BASE);
    url.searchParams.set('exclude', 'retweets,replies');
    if (since) url.searchParams.set('since_id', since);
    const data = await fetchJSON(url.toString());
    const tweets = data.data || [];
    if (tweets.length) {
      storeTweets(tweets, source);
      setSinceId(source, tweets[0].id);
    }
  }

  if (CORE_LIST_ID) {
    const source = `list:${CORE_LIST_ID}`;
    const since = getSinceId(source);
    const url = new URL(`/lists/${CORE_LIST_ID}/tweets`, API_BASE);
    url.searchParams.set('max_results', '100');
    if (since) url.searchParams.set('since_id', since);
    const data = await fetchJSON(url.toString());
    const tweets = data.data || [];
    if (tweets.length) {
      storeTweets(tweets, source);
      setSinceId(source, tweets[0].id);
    }
  }
  console.log(`Polled at ${new Date().toISOString()}`);
}

poll().catch(err => console.error('Initial poll error', err));
setInterval(() => poll().catch(err => console.error('Polling error', err)), POLL_INTERVAL * 1000);
