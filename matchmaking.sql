/*
 Navicat Premium Data Transfer

 Source Server         : matchmaking
 Source Server Type    : SQLite
 Source Server Version : 3035005
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005
 File Encoding         : 65001

 Date: 24/09/2025 11:27:18
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS "activities";
CREATE TABLE "activities" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "date" DATE NOT NULL,
  "title" TEXT NOT NULL,
  "details" TEXT,
  "notes" TEXT,
  "status" INTEGER DEFAULT 1,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Records of activities
-- ----------------------------

-- ----------------------------
-- Table structure for activity_photos
-- ----------------------------
DROP TABLE IF EXISTS "activity_photos";
CREATE TABLE "activity_photos" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "activity_id" INTEGER NOT NULL,
  "photo_url" TEXT NOT NULL,
  FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- ----------------------------
-- Records of activity_photos
-- ----------------------------

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

-- ----------------------------
-- Records of sqlite_sequence
-- ----------------------------
INSERT INTO "sqlite_sequence" VALUES ('users', 5);

-- ----------------------------
-- Table structure for user_details
-- ----------------------------
DROP TABLE IF EXISTS "user_details";
CREATE TABLE "user_details" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "nickname" TEXT,
  "real_name" TEXT,
  "gender" TEXT,
  "phone" TEXT,
  "phone_location" TEXT,
  "age" INTEGER,
  "birthday" DATE,
  "zodiac" TEXT,
  "constellation" TEXT,
  "height" INTEGER,
  "weight" INTEGER,
  "income" TEXT,
  "education" TEXT,
  "occupation" TEXT,
  "industry" TEXT,
  "marital_status" TEXT,
  "hobbies" TEXT,
  "only_child" TEXT,
  "family_background" TEXT,
  "marriage_timeline" TEXT,
  "has_car" BOOLEAN DEFAULT 0,
  "has_house" BOOLEAN DEFAULT 0,
  "household_province" TEXT,
  "household_city" TEXT,
  "household_district" TEXT,
  "household_street" TEXT,
  "current_province" TEXT,
  "current_city" TEXT,
  "current_district" TEXT,
  "current_street" TEXT,
  "characteristics" TEXT,
  "expected_age_min" INTEGER,
  "expected_age_max" INTEGER,
  "expected_height_min" INTEGER,
  "expected_height_max" INTEGER,
  "expected_occupation" TEXT,
  "expected_income" TEXT,
  "expected_education" TEXT,
  "expected_marital_status" TEXT,
  "expected_has_car" BOOLEAN,
  "expected_has_house" BOOLEAN,
  "expected_location" TEXT,
  "accept_children" BOOLEAN,
  "other_notes" TEXT,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  UNIQUE ("user_id" ASC)
);

-- ----------------------------
-- Records of user_details
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "avatar" TEXT,
  "status" INTEGER DEFAULT 1,
  "role" TEXT DEFAULT 'user',
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("username" ASC)
);

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "users" VALUES (1, 'admin', '$2b$10$nDz3q42Bvl4amoaj0w.ahOPqmTvRrrc9l6KMolfKNqjvlF5x9cBp.', NULL, 1, 'admin', '2025-09-22 07:48:46');

-- ----------------------------
-- Auto increment value for users
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 5 WHERE name = 'users';

PRAGMA foreign_keys = true;
