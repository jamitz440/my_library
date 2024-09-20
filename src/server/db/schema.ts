// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `my_library_${name}`);

export const books = createTable(
  "book",
  {
    id: serial("id").primaryKey().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    user_id: varchar("user_id", { length: 256 }),
    rating: integer("rating"),
    review: text("review"),
    authors: text("authors").array(),
    pages: integer("pages"),
    published: varchar("published", { length: 256 }),
    synopsis: text("synopsis"),
    image: varchar("image"),
    read: boolean("read"),
    readAt: timestamp("readAt", { withTimezone: true }),
    owned: boolean("owned"),
    theme: varchar("theme", { length: 256 }),
    subjects: varchar("subjects").array(),
    reservedBy: varchar("reserved"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  }),
);

export const user = createTable(
  "user",
  {
    id: serial("id").primaryKey().notNull(),
    user_id: varchar("user_id", { length: 256 }),
    goal: integer("goal"),
    theme: varchar("theme", { length: 256 }),
  },
  (example) => ({
    titleIndex: index("user_idx").on(example.user_id),
  }),
);
