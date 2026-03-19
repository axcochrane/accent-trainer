import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import {
  accents,
  phonemeShifts,
  wordPhonemeShifts,
  words,
  userProgress,
} from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// ── Accent ────────────────────────────────────────────────────────────────────

const glaswegianAccent = {
  name: "Scottish (Glaswegian)",
  region: "Glasgow, Scotland",
  description:
    "The Glaswegian accent is one of Scotland's most distinctive, known for its melodic cadence, glottal stops, and unique vowel shifts.",
};

// ── Phoneme Shifts ────────────────────────────────────────────────────────────

const phonemeShiftData = [
  {
    key: "ou-to-oo",
    fromSound: "OU",
    toSound: "OO",
    ipaFrom: "/a\u028A/",
    ipaTo: "/u\u02D0/",
    description:
      "The 'ow' sound becomes a long 'oo'. Round your lips.",
    exampleWord: "down \u2192 doon",
  },
  {
    key: "glottal-stop",
    fromSound: "T",
    toSound: "\u0294 (glottal stop)",
    ipaFrom: "/t/",
    ipaTo: "/\u0294/",
    description:
      "The 't' in the middle/end of words is replaced by a catch in the throat.",
    exampleWord: "bottle \u2192 bo'le",
  },
  {
    key: "long-a-to-eh",
    fromSound: "Long A",
    toSound: "EH",
    ipaFrom: "/e\u026A/",
    ipaTo: "/\u025B\u02D0/",
    description: "The long 'a' becomes a short 'eh' sound.",
    exampleWord: "name \u2192 nehm",
  },
  {
    key: "oh-to-aw",
    fromSound: "OH",
    toSound: "AW",
    ipaFrom: "/o\u028A/",
    ipaTo: "/\u0254\u02D0/",
    description: "The 'oh' sound becomes 'aw'.",
    exampleWord: "no \u2192 naw",
  },
  {
    key: "rhotic-r",
    fromSound: "R (approximant)",
    toSound: "R (rolled/trilled)",
    ipaFrom: "/\u0279/",
    ipaTo: "/r/",
    description:
      "R's are rolled or trilled, especially after vowels.",
    exampleWord: "car \u2192 carrr",
  },
  {
    key: "oo-to-u",
    fromSound: "OO",
    toSound: "U (centralized)",
    ipaFrom: "/u\u02D0/",
    ipaTo: "/\u0289/",
    description: "The 'oo' becomes a centralized 'u'.",
    exampleWord: "school \u2192 schul",
  },
  {
    key: "i-to-ah",
    fromSound: "Long I",
    toSound: "AH",
    ipaFrom: "/a\u026A/",
    ipaTo: "/\u0251\u02D0/",
    description: "The long 'i' becomes a flat 'ah'.",
    exampleWord: "night \u2192 naht",
  },
  {
    key: "ch-loch",
    fromSound: "K/CH",
    toSound: "CH (guttural)",
    ipaFrom: "/k/",
    ipaTo: "/x/",
    description:
      "The 'ch' is a soft guttural sound from the back of the throat.",
    exampleWord: "loch",
  },
  {
    key: "wh-distinction",
    fromSound: "W",
    toSound: "WH (breathy)",
    ipaFrom: "/w/",
    ipaTo: "/\u028D/",
    description: "WH words have a breathy 'hw' sound.",
    exampleWord: "what",
  },
  {
    key: "short-i",
    fromSound: "Short I",
    toSound: "Short I (central)",
    ipaFrom: "/\u026A/",
    ipaTo: "/\u026A\u0308/",
    description: "Short 'i' is slightly more central.",
    exampleWord: "bit",
  },
] as const;

// ── Words ─────────────────────────────────────────────────────────────────────

type WordSeed = {
  text: string;
  ipaStandard: string | null;
  ipaAccent: string | null;
  difficulty: number;
  pronunciationCue: string;
  exampleSentence: string;
  shifts: string[]; // keys into phonemeShiftData
};

const wordData: WordSeed[] = [
  // ── Difficulty 1: single common shift, short words ──
  {
    text: "doon",
    ipaStandard: "/da\u028An/",
    ipaAccent: "/du\u02D0n/",
    difficulty: 1,
    pronunciationCue: "Replace the 'ow' in 'down' with a long 'oo' sound.",
    exampleSentence: "Ah'm goin' doon tae the shops.",
    shifts: ["ou-to-oo"],
  },
  {
    text: "hoose",
    ipaStandard: "/ha\u028As/",
    ipaAccent: "/hu\u02D0s/",
    difficulty: 1,
    pronunciationCue: "Say 'house' but replace the 'ow' with 'oo'.",
    exampleSentence: "Come intae the hoose, it's freezin'.",
    shifts: ["ou-to-oo"],
  },
  {
    text: "oot",
    ipaStandard: "/a\u028At/",
    ipaAccent: "/u\u02D0t/",
    difficulty: 1,
    pronunciationCue: "Say 'out' with an 'oo' sound instead of 'ow'.",
    exampleSentence: "Are ye goin' oot the night?",
    shifts: ["ou-to-oo"],
  },
  {
    text: "aboot",
    ipaStandard: "/\u0259\u02C8ba\u028At/",
    ipaAccent: "/\u0259\u02C8bu\u02D0t/",
    difficulty: 1,
    pronunciationCue: "Say 'about' replacing the 'ow' with 'oo'.",
    exampleSentence: "Whit's that aw aboot?",
    shifts: ["ou-to-oo"],
  },
  {
    text: "moose",
    ipaStandard: "/ma\u028As/",
    ipaAccent: "/mu\u02D0s/",
    difficulty: 1,
    pronunciationCue: "Say 'mouse' with a long 'oo' in the middle.",
    exampleSentence: "There's a wee moose in the kitchen!",
    shifts: ["ou-to-oo"],
  },
  {
    text: "toon",
    ipaStandard: "/ta\u028An/",
    ipaAccent: "/tu\u02D0n/",
    difficulty: 1,
    pronunciationCue: "Replace the 'ow' in 'town' with 'oo'.",
    exampleSentence: "We're headin' intae toon the day.",
    shifts: ["ou-to-oo"],
  },
  {
    text: "broon",
    ipaStandard: "/bra\u028An/",
    ipaAccent: "/bru\u02D0n/",
    difficulty: 1,
    pronunciationCue: "Say 'brown' with 'oo' instead of 'ow'.",
    exampleSentence: "Pass us the broon sauce.",
    shifts: ["ou-to-oo"],
  },
  {
    text: "coo",
    ipaStandard: "/ka\u028A/",
    ipaAccent: "/ku\u02D0/",
    difficulty: 1,
    pronunciationCue: "Say 'cow' with a long 'oo' sound.",
    exampleSentence: "Look at that big coo in the field.",
    shifts: ["ou-to-oo"],
  },
  {
    text: "noo",
    ipaStandard: "/na\u028A/",
    ipaAccent: "/nu\u02D0/",
    difficulty: 1,
    pronunciationCue: "Say 'now' replacing the 'ow' with 'oo'.",
    exampleSentence: "Come here right noo!",
    shifts: ["ou-to-oo"],
  },
  {
    text: "hoo",
    ipaStandard: "/ha\u028A/",
    ipaAccent: "/hu\u02D0/",
    difficulty: 1,
    pronunciationCue: "Say 'how' with a long 'oo' sound.",
    exampleSentence: "Hoo are ye daein'?",
    shifts: ["ou-to-oo"],
  },
  {
    text: "roon",
    ipaStandard: "/ra\u028And/",
    ipaAccent: "/ru\u02D0n/",
    difficulty: 1,
    pronunciationCue: "Say 'round' with 'oo' instead of 'ow'.",
    exampleSentence: "Go roon the back.",
    shifts: ["ou-to-oo"],
  },
  {
    text: "floo'er",
    ipaStandard: "/fl\u0254\u02D0r/",
    ipaAccent: "/flu\u02D0\u0294\u025Br/",
    difficulty: 1,
    pronunciationCue:
      "Say 'floor' with 'oo' and a glottal stop before the 'er'.",
    exampleSentence: "Watch the floo'er, it's just been mopped.",
    shifts: ["ou-to-oo", "glottal-stop"],
  },

  // ── Difficulty 2: single less-common shift ──
  {
    text: "naw",
    ipaStandard: "/no\u028A/",
    ipaAccent: "/n\u0254\u02D0/",
    difficulty: 2,
    pronunciationCue: "Say 'no' but with an 'aw' sound.",
    exampleSentence: "Naw, ah'm no goin'.",
    shifts: ["oh-to-aw"],
  },
  {
    text: "gaw",
    ipaStandard: "/\u0261o\u028A/",
    ipaAccent: "/\u0261\u0254\u02D0/",
    difficulty: 2,
    pronunciationCue: "Say 'go' replacing the 'oh' with 'aw'.",
    exampleSentence: "Just gaw hame, will ye?",
    shifts: ["oh-to-aw"],
  },
  {
    text: "wa'er",
    ipaStandard: "/\u02C8w\u0254\u02D0t\u0259r/",
    ipaAccent: "/\u02C8w\u0254\u02D0\u0294\u0259r/",
    difficulty: 2,
    pronunciationCue:
      "Say 'water' but replace the 't' with a glottal stop.",
    exampleSentence: "Gies a glass of wa'er.",
    shifts: ["glottal-stop"],
  },
  {
    text: "bo'le",
    ipaStandard: "/\u02C8b\u0252t\u0259l/",
    ipaAccent: "/\u02C8b\u0252\u0294\u0259l/",
    difficulty: 2,
    pronunciationCue:
      "Say 'bottle' — catch your throat where the 't' would be.",
    exampleSentence: "Pass us that bo'le.",
    shifts: ["glottal-stop"],
  },
  {
    text: "bu'er",
    ipaStandard: "/\u02C8b\u028Ct\u0259r/",
    ipaAccent: "/\u02C8b\u028C\u0294\u0259r/",
    difficulty: 2,
    pronunciationCue: "Say 'butter' with a glottal stop instead of 't'.",
    exampleSentence: "Put some bu'er on yer toast.",
    shifts: ["glottal-stop"],
  },
  {
    text: "li'le",
    ipaStandard: "/\u02C8l\u026At\u0259l/",
    ipaAccent: "/\u02C8l\u026A\u0294\u0259l/",
    difficulty: 2,
    pronunciationCue:
      "Say 'little' — the double 't' becomes a throat catch.",
    exampleSentence: "Just a li'le bit mair.",
    shifts: ["glottal-stop"],
  },
  {
    text: "nehm",
    ipaStandard: "/ne\u026Am/",
    ipaAccent: "/n\u025B\u02D0m/",
    difficulty: 2,
    pronunciationCue: "Say 'name' but with 'eh' instead of the long 'a'.",
    exampleSentence: "Whit's yer nehm?",
    shifts: ["long-a-to-eh"],
  },
  {
    text: "tehk",
    ipaStandard: "/te\u026Ak/",
    ipaAccent: "/t\u025B\u02D0k/",
    difficulty: 2,
    pronunciationCue: "Say 'take' replacing the long 'a' with 'eh'.",
    exampleSentence: "Tehk that wi' ye.",
    shifts: ["long-a-to-eh"],
  },
  {
    text: "mehk",
    ipaStandard: "/me\u026Ak/",
    ipaAccent: "/m\u025B\u02D0k/",
    difficulty: 2,
    pronunciationCue: "Say 'make' with 'eh' instead of 'ay'.",
    exampleSentence: "Can ye mehk us a cuppa?",
    shifts: ["long-a-to-eh"],
  },
  {
    text: "leht",
    ipaStandard: "/le\u026At/",
    ipaAccent: "/l\u025B\u02D0t/",
    difficulty: 2,
    pronunciationCue: "Say 'late' with 'eh' instead of the long 'a'.",
    exampleSentence: "Ye're always leht!",
    shifts: ["long-a-to-eh"],
  },
  {
    text: "schul",
    ipaStandard: "/sku\u02D0l/",
    ipaAccent: "/sk\u0289l/",
    difficulty: 2,
    pronunciationCue: "Say 'school' with a centralized 'u' instead of 'oo'.",
    exampleSentence: "The weans are aff tae schul.",
    shifts: ["oo-to-u"],
  },
  {
    text: "ful",
    ipaStandard: "/fu\u02D0l/",
    ipaAccent: "/f\u0289l/",
    difficulty: 2,
    pronunciationCue: "Say 'fool' with a shorter, centralized 'u' sound.",
    exampleSentence: "Dinnae be a ful.",
    shifts: ["oo-to-u"],
  },

  // ── Difficulty 3: two shifts per word ──
  {
    text: "naht",
    ipaStandard: "/na\u026At/",
    ipaAccent: "/n\u0251\u02D0\u0294/",
    difficulty: 3,
    pronunciationCue:
      "Say 'night' — flatten the 'i' to 'ah' and use a glottal stop for the 't'.",
    exampleSentence: "Are ye oot the naht?",
    shifts: ["i-to-ah", "glottal-stop"],
  },
  {
    text: "raht",
    ipaStandard: "/ra\u026At/",
    ipaAccent: "/r\u0251\u02D0\u0294/",
    difficulty: 3,
    pronunciationCue:
      "Say 'right' with a flat 'ah' and a glottal stop at the end.",
    exampleSentence: "Yer no raht in the heid.",
    shifts: ["i-to-ah", "glottal-stop"],
  },
  {
    text: "faht",
    ipaStandard: "/fa\u026At/",
    ipaAccent: "/f\u0251\u02D0\u0294/",
    difficulty: 3,
    pronunciationCue:
      "Say 'fight' with a flat 'ah' and a glottal stop for the final 't'.",
    exampleSentence: "There wis a big faht ootside.",
    shifts: ["i-to-ah", "glottal-stop"],
  },
  {
    text: "birrd",
    ipaStandard: "/b\u025D\u02D0d/",
    ipaAccent: "/b\u026Ard/",
    difficulty: 3,
    pronunciationCue: "Say 'bird' with a strong rolled 'r'.",
    exampleSentence: "There's a wee birrd on the windae.",
    shifts: ["rhotic-r", "short-i"],
  },
  {
    text: "carrr",
    ipaStandard: "/k\u0251\u02D0r/",
    ipaAccent: "/k\u0251r\u02D0/",
    difficulty: 3,
    pronunciationCue: "Say 'car' rolling the 'r' at the end.",
    exampleSentence: "That's a braw carrr ye've got.",
    shifts: ["rhotic-r"],
  },
  {
    text: "fourr",
    ipaStandard: "/f\u0254\u02D0r/",
    ipaAccent: "/f\u0254r\u02D0/",
    difficulty: 3,
    pronunciationCue: "Say 'four' with a rolled 'r' at the end.",
    exampleSentence: "There's fourr of us goin'.",
    shifts: ["rhotic-r"],
  },
  {
    text: "dreich",
    ipaStandard: null,
    ipaAccent: "/dri\u02D0x/",
    difficulty: 3,
    pronunciationCue:
      "A Scots word meaning dreary/wet. End with a guttural 'ch' like 'loch'.",
    exampleSentence: "It's pure dreich ootside the day.",
    shifts: ["ch-loch", "rhotic-r"],
  },
  {
    text: "braw",
    ipaStandard: null,
    ipaAccent: "/br\u0254\u02D0/",
    difficulty: 3,
    pronunciationCue:
      "A Scots word meaning beautiful/great. Roll the 'r' and say 'aw'.",
    exampleSentence: "That's a braw day, so it is.",
    shifts: ["rhotic-r", "oh-to-aw"],
  },
  {
    text: "wean",
    ipaStandard: null,
    ipaAccent: "/we\u02D0n/",
    difficulty: 3,
    pronunciationCue:
      "A Scots word meaning child. Say 'wane' with a long 'eh' vowel.",
    exampleSentence: "The wean's been greetin' aw day.",
    shifts: ["long-a-to-eh"],
  },
  {
    text: "ken",
    ipaStandard: null,
    ipaAccent: "/k\u025Bn/",
    difficulty: 3,
    pronunciationCue: "A Scots word meaning 'know'. Short, sharp 'eh' sound.",
    exampleSentence: "Ah ken whit ye mean.",
    shifts: ["long-a-to-eh"],
  },

  // ── Difficulty 4: multiple shifts + phrases ──
  {
    text: "doon the wa'er",
    ipaStandard: null,
    ipaAccent: "/du\u02D0n \u00F0\u0259 w\u0254\u02D0\u0294\u0259r/",
    difficulty: 4,
    pronunciationCue:
      "Means 'on holiday'. Combine the 'oo' shift in 'doon' with the glottal stop in 'wa'er'.",
    exampleSentence: "We're away doon the wa'er for the Fair.",
    shifts: ["ou-to-oo", "glottal-stop"],
  },
  {
    text: "gonnae no dae that",
    ipaStandard: null,
    ipaAccent: "/\u0261\u0252n\u0259 no\u02D0 de\u02D0 \u00F0at/",
    difficulty: 4,
    pronunciationCue:
      "Means 'don't do that'. Flatten the vowels and use the 'aw' shift for 'no'.",
    exampleSentence: "Gonnae no dae that, yer makin' a mess!",
    shifts: ["oh-to-aw", "long-a-to-eh"],
  },
  {
    text: "yer aff yer heid",
    ipaStandard: null,
    ipaAccent: "/j\u025Br af j\u025Br hi\u02D0d/",
    difficulty: 4,
    pronunciationCue:
      "Means 'you're crazy'. Roll the 'r' in 'yer' and use the 'eh' shift in 'heid'.",
    exampleSentence: "Ye want tae dae that? Yer aff yer heid!",
    shifts: ["rhotic-r", "long-a-to-eh"],
  },
  {
    text: "gie it laldy",
    ipaStandard: null,
    ipaAccent: "/\u0261i\u02D0 \u026At l\u0251ldi/",
    difficulty: 4,
    pronunciationCue:
      "Means 'give it everything'. The 'ah' sound in 'laldy' uses the flat vowel shift.",
    exampleSentence: "Come on, gie it laldy on the dance floo'er!",
    shifts: ["i-to-ah"],
  },
  {
    text: "haud yer wheesht",
    ipaStandard: null,
    ipaAccent: "/h\u0254\u02D0d j\u025Br \u028Di\u02D0\u0283t/",
    difficulty: 4,
    pronunciationCue:
      "Means 'be quiet'. Use the breathy 'wh' in 'wheesht' and roll the 'r' in 'yer'.",
    exampleSentence: "Haud yer wheesht, the bairn's sleeping!",
    shifts: ["wh-distinction", "rhotic-r"],
  },
  {
    text: "away an bile yer heid",
    ipaStandard: null,
    ipaAccent: "/\u0259\u02C8we\u02D0 \u0259n ba\u026Al j\u025Br hi\u02D0d/",
    difficulty: 4,
    pronunciationCue:
      "Means 'go away'. Combine the long 'eh' in 'away' with the 'i' shift in 'bile'.",
    exampleSentence: "Och, away an bile yer heid!",
    shifts: ["long-a-to-eh", "i-to-ah"],
  },
  {
    text: "it's a braw bricht moonlicht nicht",
    ipaStandard: null,
    ipaAccent: "/\u026Ats \u0259 br\u0254\u02D0 br\u026Axt mu\u02D0nl\u026Axt n\u026Axt/",
    difficulty: 4,
    pronunciationCue:
      "A famous Scots phrase. Use the guttural 'ch' in 'bricht', 'moonlicht', and 'nicht'.",
    exampleSentence:
      "Step ootside — it's a braw bricht moonlicht nicht the nicht.",
    shifts: ["ch-loch", "rhotic-r", "i-to-ah"],
  },
  {
    text: "whit's fur ye'll no go past ye",
    ipaStandard: null,
    ipaAccent: "/\u028D\u026Ats f\u028Cr ji\u02D0l no\u02D0 \u0261o\u02D0 p\u0251st ji\u02D0/",
    difficulty: 4,
    pronunciationCue:
      "Means 'what's meant to be will be'. Use the breathy 'wh' in 'whit's' and 'aw' in 'no'.",
    exampleSentence:
      "Dinnae worry aboot it — whit's fur ye'll no go past ye.",
    shifts: ["wh-distinction", "oh-to-aw"],
  },
  {
    text: "yer bum's oot the windae",
    ipaStandard: null,
    ipaAccent: "/j\u025Br b\u028Cmz u\u02D0t \u00F0\u0259 w\u026A\u0308nde\u02D0/",
    difficulty: 4,
    pronunciationCue:
      "Means 'you're talking nonsense'. Combine 'oo' in 'oot' with central 'i' in 'windae'.",
    exampleSentence: "Yer bum's oot the windae if ye think that's true.",
    shifts: ["ou-to-oo", "short-i"],
  },
  {
    text: "pure dead brilliant",
    ipaStandard: null,
    ipaAccent: "/pj\u0289r d\u025Bd br\u026Al\u026A\u0308\u0259nt/",
    difficulty: 4,
    pronunciationCue:
      "Means 'absolutely great'. Use centralized 'u' in 'pure' and rolled 'r' in 'brilliant'.",
    exampleSentence: "That gig was pure dead brilliant!",
    shifts: ["oo-to-u", "rhotic-r", "short-i"],
  },

  // ── Difficulty 5: full sentences with cadence ──
  {
    text: "Ah'm away tae the shops, dae ye want anythin'?",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Full Glaswegian cadence. Flatten the 'a' sounds, use glottal stops, and keep a rising intonation at the end.",
    exampleSentence: "I'm going to the shops, do you want anything?",
    shifts: ["long-a-to-eh", "glottal-stop", "oh-to-aw"],
  },
  {
    text: "Aye, that's pure magic so it is",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Classic Glaswegian emphasis pattern — 'so it is' is a tag for emphasis. Centralize the 'u' in 'pure'.",
    exampleSentence: "Yes, that's really wonderful.",
    shifts: ["oo-to-u", "short-i"],
  },
  {
    text: "Whit ye daein' the night?",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Use breathy 'wh' in 'whit', flatten 'i' in 'night' to 'ah', and drop the 'g' in 'daein'.",
    exampleSentence: "What are you doing tonight?",
    shifts: ["wh-distinction", "i-to-ah", "long-a-to-eh"],
  },
  {
    text: "He's no right in the heid, that yin",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "The 'aw' shift on 'no', flat 'ah' on 'right', and 'eh' on 'heid'. 'Yin' means 'one'.",
    exampleSentence: "He's not right in the head, that one.",
    shifts: ["oh-to-aw", "i-to-ah", "long-a-to-eh"],
  },
  {
    text: "Ma maw says ye cannae come oot",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Use 'aw' in 'maw', 'oo' in 'oot', and the long 'eh' in 'cannae'.",
    exampleSentence: "My mom says you can't come out.",
    shifts: ["oh-to-aw", "ou-to-oo", "long-a-to-eh"],
  },
  {
    text: "She wis fair scunnered wi' the weather",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Roll the 'r' in 'fair', 'scunnered', and 'weather'. Use the 'eh' shift in 'fair' and glottal stop in 'weather'.",
    exampleSentence: "She was really disgusted with the weather.",
    shifts: ["rhotic-r", "long-a-to-eh", "glottal-stop"],
  },
  {
    text: "Ah dinnae ken whit ye're on aboot",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Combine breathy 'wh' in 'whit', 'oo' in 'aboot', and 'eh' in 'dinnae' and 'ken'.",
    exampleSentence: "I don't know what you're talking about.",
    shifts: ["wh-distinction", "ou-to-oo", "long-a-to-eh"],
  },
  {
    text: "Gies a brek, will ye?",
    ipaStandard: null,
    ipaAccent: null,
    difficulty: 5,
    pronunciationCue:
      "Use the 'eh' shift in 'brek' (break). Rising intonation on the tag question 'will ye?'.",
    exampleSentence: "Give me a break, will you?",
    shifts: ["long-a-to-eh", "short-i"],
  },
];

// ── Seed runner ───────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding accent-trainer database...\n");

  // 1. Clear existing data in reverse FK order
  console.log("Clearing existing data...");
  await db.delete(userProgress);
  await db.delete(wordPhonemeShifts);
  await db.delete(words);
  await db.delete(phonemeShifts);
  await db.delete(accents);
  console.log("  Done.\n");

  // 2. Insert accent
  console.log("Inserting accent...");
  const [accent] = await db.insert(accents).values(glaswegianAccent).returning();
  console.log(`  Created accent: ${accent.name} (${accent.id})\n`);

  // 3. Insert phoneme shifts
  console.log("Inserting phoneme shifts...");
  const shiftMap = new Map<string, string>(); // key -> id

  for (const shift of phonemeShiftData) {
    const [inserted] = await db
      .insert(phonemeShifts)
      .values({
        accentId: accent.id,
        fromSound: shift.fromSound,
        toSound: shift.toSound,
        ipaFrom: shift.ipaFrom,
        ipaTo: shift.ipaTo,
        description: shift.description,
        exampleWord: shift.exampleWord,
      })
      .returning();
    shiftMap.set(shift.key, inserted.id);
    console.log(`  ${shift.fromSound} -> ${shift.toSound} (${inserted.id})`);
  }
  console.log(`  Created ${shiftMap.size} phoneme shifts.\n`);

  // 4. Insert words and link to phoneme shifts
  console.log("Inserting words...");
  let wordCount = 0;
  let linkCount = 0;

  for (const word of wordData) {
    const [inserted] = await db
      .insert(words)
      .values({
        accentId: accent.id,
        text: word.text,
        ipaStandard: word.ipaStandard,
        ipaAccent: word.ipaAccent,
        difficulty: word.difficulty,
        pronunciationCue: word.pronunciationCue,
        exampleSentence: word.exampleSentence,
      })
      .returning();
    wordCount++;

    // Link to phoneme shifts
    for (const shiftKey of word.shifts) {
      const shiftId = shiftMap.get(shiftKey);
      if (!shiftId) {
        console.warn(`  Warning: unknown shift key "${shiftKey}" for word "${word.text}"`);
        continue;
      }
      await db.insert(wordPhonemeShifts).values({
        wordId: inserted.id,
        phonemeShiftId: shiftId,
      });
      linkCount++;
    }

    console.log(
      `  [${word.difficulty}] ${word.text} (${word.shifts.length} shifts)`,
    );
  }

  console.log(`\n  Created ${wordCount} words with ${linkCount} shift links.\n`);

  // Summary
  console.log("Seed complete!");
  console.log(`  Accent:         1`);
  console.log(`  Phoneme shifts: ${shiftMap.size}`);
  console.log(`  Words:          ${wordCount}`);
  console.log(`  Word-shift links: ${linkCount}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
