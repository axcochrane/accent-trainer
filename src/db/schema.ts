import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Accents ──────────────────────────────────────────────────────────────────

export const accents = pgTable("accents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accentsRelations = relations(accents, ({ many }) => ({
  phonemeShifts: many(phonemeShifts),
  words: many(words),
}));

// ── Phoneme Shifts ───────────────────────────────────────────────────────────

export const phonemeShifts = pgTable("phoneme_shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accentId: uuid("accent_id")
    .notNull()
    .references(() => accents.id),
  fromSound: text("from_sound").notNull(),
  toSound: text("to_sound").notNull(),
  ipaFrom: text("ipa_from"),
  ipaTo: text("ipa_to"),
  description: text("description"),
  exampleWord: text("example_word"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const phonemeShiftsRelations = relations(
  phonemeShifts,
  ({ one, many }) => ({
    accent: one(accents, {
      fields: [phonemeShifts.accentId],
      references: [accents.id],
    }),
    wordPhonemeShifts: many(wordPhonemeShifts),
  }),
);

// ── Words ────────────────────────────────────────────────────────────────────

export const words = pgTable("words", {
  id: uuid("id").primaryKey().defaultRandom(),
  accentId: uuid("accent_id")
    .notNull()
    .references(() => accents.id),
  text: text("text").notNull(),
  ipaStandard: text("ipa_standard"),
  ipaAccent: text("ipa_accent"),
  difficulty: integer("difficulty").notNull(),
  pronunciationCue: text("pronunciation_cue"),
  exampleSentence: text("example_sentence"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wordsRelations = relations(words, ({ one, many }) => ({
  accent: one(accents, {
    fields: [words.accentId],
    references: [accents.id],
  }),
  wordPhonemeShifts: many(wordPhonemeShifts),
  userProgress: many(userProgress),
}));

// ── Word ↔ Phoneme Shifts (join table) ───────────────────────────────────────

export const wordPhonemeShifts = pgTable("word_phoneme_shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  wordId: uuid("word_id")
    .notNull()
    .references(() => words.id),
  phonemeShiftId: uuid("phoneme_shift_id")
    .notNull()
    .references(() => phonemeShifts.id),
});

export const wordPhonemeShiftsRelations = relations(
  wordPhonemeShifts,
  ({ one }) => ({
    word: one(words, {
      fields: [wordPhonemeShifts.wordId],
      references: [words.id],
    }),
    phonemeShift: one(phonemeShifts, {
      fields: [wordPhonemeShifts.phonemeShiftId],
      references: [phonemeShifts.id],
    }),
  }),
);

// ── User Progress ────────────────────────────────────────────────────────────

export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  wordId: uuid("word_id")
    .notNull()
    .references(() => words.id),
  accentId: uuid("accent_id")
    .notNull()
    .references(() => accents.id),
  attempts: integer("attempts").notNull().default(0),
  bestScore: integer("best_score").notNull().default(0),
  mastered: boolean("mastered").notNull().default(false),
  lastFeedback: jsonb("last_feedback"),
  lastAttemptedAt: timestamp("last_attempted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  word: one(words, {
    fields: [userProgress.wordId],
    references: [words.id],
  }),
  accent: one(accents, {
    fields: [userProgress.accentId],
    references: [accents.id],
  }),
}));
