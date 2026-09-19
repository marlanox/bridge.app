// Loads the shared-spec content (copied into pwa/content/ — see PARITY.md) and
// exposes the same L()/LF() pattern the iOS app uses, so screen code reads the same
// way on both platforms.

const LANG_KEY = "bridge.language";

let strings = { en: {}, ru: {} };
let decksById = {};
let roomsByKind = {};
let flowSteps = [];
let currentLang = localStorage.getItem(LANG_KEY) || null;

export async function loadContent() {
  const [en, ru, decks, rooms, flow] = await Promise.all([
    fetch("content/strings.en.json").then((r) => r.json()),
    fetch("content/strings.ru.json").then((r) => r.json()),
    fetch("content/decks.json").then((r) => r.json()),
    fetch("content/rooms.json").then((r) => r.json()),
    fetch("content/flow.json").then((r) => r.json()),
  ]);
  strings = { en, ru };
  decksById = decks;
  roomsByKind = rooms;
  flowSteps = flow.steps;
}

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

/** Looks up `key` in the chosen language — mirrors iOS `L()`. */
export function L(key) {
  const table = strings[currentLang || "en"];
  return (table && table[key]) ?? key;
}

/** `L` plus printf-style `%@`/%d/%.0f substitution — mirrors iOS `LF()`. */
export function LF(key, ...args) {
  let s = L(key);
  let i = 0;
  return s.replace(/%@|%d|%\.\d+f/g, () => {
    const v = args[i++];
    return v === undefined ? "" : String(v);
  });
}

export function deck(id) {
  return decksById[id] || { id, nameKey: "deck.unknown.name", cards: [] };
}

export function room(kind) {
  return roomsByKind[kind];
}

export function allRoomKinds() {
  return Object.keys(roomsByKind).sort((a, b) => roomsByKind[a].order - roomsByKind[b].order);
}

export function flowOrder() {
  return flowSteps;
}

/** Cards grouped by category in declared order — mirrors `Deck.sections` on iOS. */
export function deckSections(d) {
  const order = [];
  const buckets = {};
  for (const card of d.cards) {
    const key = card.category ?? "__none__";
    if (!(key in buckets)) {
      order.push(card.category ?? null);
      buckets[key] = [];
    }
    buckets[key].push(card);
  }
  return order.map((cat) => ({ category: cat, cards: buckets[cat ?? "__none__"] }));
}
