import {
  pgTable, uuid, text, integer,
  boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["buyer", "seller", "agent"]);
export const listingTypeEnum = pgEnum("listing_type", ["sale", "rent"]);
export const propertyTypeEnum = pgEnum("property_type", ["apartment", "house", "land", "commercial", "office"]);
export const statusEnum = pgEnum("status", ["active", "sold", "rented", "inactive"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  role: roleEnum("role").default("buyer").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  titleUz: text("title_uz").notNull(),
  titleRu: text("title_ru").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  price: integer("price").notNull(),
  priceType: text("price_type").default("total"),
  listingType: listingTypeEnum("listing_type").notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  status: statusEnum("status").default("active").notNull(),
  rooms: integer("rooms"),
  area: integer("area"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  city: text("city").notNull(),
  district: text("district"),
  address: text("address"),
  images: text("images").array(),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedListings = pgTable("saved_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  listingId: uuid("listing_id").references(() => listings.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type SavedListing = typeof savedListings.$inferSelect;