/*
 Navicat Premium Data Transfer

 Source Server         : matchmaking_1
 Source Server Type    : SQLite
 Source Server Version : 3035005
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005
 File Encoding         : 65001

 Date: 13/10/2025 12:09:26
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS "activities";
CREATE TABLE "activities" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "date" DATE NOT NULL,
  "registration_deadline" DATETIME NOT NULL,
  "title" TEXT NOT NULL,
  "details" TEXT,
  "notes" TEXT,
  "status" INTEGER DEFAULT 1,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "location" TEXT,
  "type" TEXT,
  "price" REAL DEFAULT 0,
  "max_participants" INTEGER DEFAULT 0,
  "age_range" TEXT
);

-- ----------------------------
-- Records of activities
-- ----------------------------
INSERT INTO "activities" VALUES (1, '2025-10-15', '2025-10-10 18:00:00', '秋季户外烧烤相亲会', '在美丽的郊外公园举办户外烧烤活动，让大家在轻松愉快的氛围中相识相知。活动包含烧烤、游戏互动、自我介绍等环节。', '请穿着舒适的运动装，自带水杯', 1, '2025-09-20 09:00:00', '江苏常州公园', 'outdoor_activity', 99.9, 50, '25-35岁');
INSERT INTO "activities" VALUES (2, '2025-10-22', '2025-10-18 20:00:00', '咖啡厅浪漫邂逅', '在温馨的咖啡厅环境中，通过精心设计的交流环节，让单身男女有更多深入了解的机会。', '建议着装整洁大方', 1, '2025-09-21 14:30:00', '常州武进区咖啡厅', 'themed_party', 68.0, 30, '22-32岁');
INSERT INTO "activities" VALUES (3, '2025-09-05', '2025-09-01 22:00:00', 'KTV欢唱交友派对', '在KTV包间内举办唱歌交友活动，通过音乐拉近彼此距离，活动包含破冰游戏、情歌对唱、自由交流等环节。', '欢迎自带拿手歌曲', 1, '2025-09-22 16:15:00', '常州新北区KTV', 'group_activity', 128.0, 40, '20-35岁');

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
INSERT INTO "activity_photos" VALUES (1, 1, '/uploads/active3.jpg');
INSERT INTO "activity_photos" VALUES (2, 1, '/uploads/active4.jpg');
INSERT INTO "activity_photos" VALUES (3, 2, '/uploads/active1.jpg');
INSERT INTO "activity_photos" VALUES (4, 2, '/uploads/active6.jpg');
INSERT INTO "activity_photos" VALUES (5, 3, '/uploads/active2.jpg');

-- ----------------------------
-- Table structure for activity_registrations
-- ----------------------------
DROP TABLE IF EXISTS "activity_registrations";
CREATE TABLE "activity_registrations" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "activity_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "registration_time" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT DEFAULT 'confirmed',
  "notes" TEXT,
  FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  UNIQUE ("activity_id" ASC, "user_id" ASC)
);

-- ----------------------------
-- Records of activity_registrations
-- ----------------------------
INSERT INTO "activity_registrations" VALUES (1, 1, 2, '2025-09-23 16:00:00', 'confirmed', '期待认识新朋友');
INSERT INTO "activity_registrations" VALUES (2, 1, 3, '2025-09-23 16:30:00', 'confirmed', '希望遇到合适的另一半');
INSERT INTO "activity_registrations" VALUES (3, 2, 4, '2025-09-23 17:00:00', 'confirmed', '咖啡厅环境很适合交流');
INSERT INTO "activity_registrations" VALUES (4, 3, 5, '2025-09-23 17:30:00', 'confirmed', '喜欢唱歌，希望能找到共同爱好的人');
INSERT INTO "activity_registrations" VALUES (5, 3, 2, '2025-09-25 05:22:11', 'confirmed', NULL);
INSERT INTO "activity_registrations" VALUES (6, 2, 2, '2025-09-25 05:22:18', 'confirmed', NULL);
INSERT INTO "activity_registrations" VALUES (7, 2, 3, '2025-09-25 05:51:01', 'confirmed', NULL);

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
INSERT INTO "sqlite_sequence" VALUES ('activities', 3);
INSERT INTO "sqlite_sequence" VALUES ('activity_photos', 5);
INSERT INTO "sqlite_sequence" VALUES ('user_details', 15);
INSERT INTO "sqlite_sequence" VALUES ('users', 36);
INSERT INTO "sqlite_sequence" VALUES ('activity_registrations', 7);

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
  "personal_introduction" TEXT,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  UNIQUE ("user_id" ASC)
);

-- ----------------------------
-- Records of user_details
-- ----------------------------
INSERT INTO "user_details" VALUES (1, 2, '阳光男孩', '张三', '男', '13800138000', '北京', 28, '1997-05-15', '牛', '金牛座', 178, 70, '15-20万', '本科', '软件工程师', '互联网', 'single', '运动、音乐、旅游', 'yes', '父母退休，家庭和睦', '1-2年内', 1, 0, '河北省', '石家庄市', '桥西区', '中山路1号', '北京', '北京市', '朝阳区', '建国路88号', '性格开朗，有责任心，喜欢运动', 24, 30, 160, 170, '不限', '10万以上', '大专以上', 'single', 0, 0, '北京及周边', 1, '希望找到一位温柔善良、有共同话题的女生', '性格开朗，有责任心，喜欢运动');
INSERT INTO "user_details" VALUES (2, 3, '甜美女孩', '李四', '女', '13900139000', '上海', 25, '2000-08-20', '龙', '狮子座', 165, 52, '10-15万', '本科', '教师', '教育', 'single', '阅读、烘焙、瑜伽', 'no', '独生女，父母公务员', '2-3年内', 0, 1, '江苏省', '南京市', '鼓楼区', '汉口路2号', '上海', '上海市', '徐汇区', '漕溪路99号', '性格温和，喜欢安静的生活', 26, 35, 175, 185, '稳定职业', '15万以上', '本科以上', 'single', 1, 1, '上海及周边', 1, '希望找到一位成熟稳重、有事业心的男生', '性格温和，喜欢安静的生活');
INSERT INTO "user_details" VALUES (3, 4, '稳重先生', '王五', '男', '13700137000', '广州', 32, '1993-12-10', '鸡', '射手座', 182, 75, '20-30万', '硕士', '金融分析师', '金融', 'single', '投资、健身、摄影', 'no', '普通家庭，父母经商', '1年内', 1, 1, '广东省', '深圳市', '南山区', '科技园3号', '广州', '广州市', '天河区', '珠江新城188号', '事业型，追求上进', 28, 33, 165, 175, '不限', '20万以上', '本科以上', 'single', 1, 1, '广州及周边', 0, '希望找到一位理解支持我事业的伴侣', '事业型，追求上进');
INSERT INTO "user_details" VALUES (4, 5, '优雅lady', '赵六', '女', '13600136000', '深圳', 27, '1998-03-25', '虎', '白羊座', 168, 55, '15-20万', '本科', '市场经理', '快消品', 'single', '舞蹈、美食、旅行', 'yes', '知识分子家庭', '2年内', 1, 0, '浙江省', '杭州市', '西湖区', '文三路5号', '深圳', '深圳市', '福田区', '华强北路66号', '独立自信，热爱生活', 28, 38, 175, 185, '有事业心', '20万以上', '本科以上', 'single', 1, 0, '深圳及周边', 1, '希望找到一位有品位、懂生活的绅士', '独立自信，热爱生活');

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
INSERT INTO "users" VALUES (1, 'admin', '$2b$10$nDz3q42Bvl4amoaj0w.ahOPqmTvRrrc9l6KMolfKNqjvlF5x9cBp.', '/uploads/customer.png', 1, 'admin', '2025-09-22 07:48:46');
INSERT INTO "users" VALUES (2, 'zhangsan', '$2b$10$F2GfhqUTgzT.YqAsYa6YXu0k8TQQbaggM2gANYaQZZNYORE6y/ADa', '/uploads/male.jpg', 1, 'user', '2025-09-23 10:30:00');
INSERT INTO "users" VALUES (3, 'lisi', '$2b$10$g2n3IZ3J4iRhFFI3Fpn4mOk/b2cNAPi0ePH1e53rIJ8b5kyC07Tp6', '/uploads/female.jpg', 1, 'user', '2025-09-23 11:00:00');
INSERT INTO "users" VALUES (4, 'wangwu', '$2b$10$Uat5UfO3Htrszx1pHXq41.5bUZP4xM5EQ5mSD/nEkDCZihAwvTbjm', '/uploads/male.jpg', 1, 'user', '2025-09-23 14:20:00');
INSERT INTO "users" VALUES (5, 'zhaoliu', '$2b$10$imWeOYRPSWjb68dGq.hvnerIXMpKuJ/OsMdLrgE3j.40LRiyY/88m', '/uploads/female.jpg', 1, 'user', '2025-09-23 15:45:00');

-- ----------------------------
-- Auto increment value for activities
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 3 WHERE name = 'activities';

-- ----------------------------
-- Auto increment value for activity_photos
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 5 WHERE name = 'activity_photos';

-- ----------------------------
-- Auto increment value for activity_registrations
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 7 WHERE name = 'activity_registrations';

-- ----------------------------
-- Auto increment value for user_details
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 15 WHERE name = 'user_details';

-- ----------------------------
-- Auto increment value for users
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 36 WHERE name = 'users';

PRAGMA foreign_keys = true;
