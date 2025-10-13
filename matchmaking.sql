/*
 Navicat Premium Data Transfer

 Source Server         : matchmaking
 Source Server Type    : SQLite
 Source Server Version : 3035005
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005
 File Encoding         : 65001

 Date: 13/10/2025 17:26:37
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
INSERT INTO "activities" VALUES (1, '2025-07-19', '2025-07-10 20:00:00', '爱情解密·性格测试', '在活动开始前，男嘉宾与女嘉宾们分别给出自己外貌、穿搭属性和性格属性、爱好的对应标签
现场在无直白问答交流下率先抽签匹配
开启两轮书店线索卡解密游戏
两轮比赛中分别有两组嘉宾获胜
晩餐前
我们开启数次Speed Date
在交流中遇见有趣的灵魂
拉近彼此的距离
餐前，我们进行数字抽签分配座位
在晚餐的过程中
再次进行不同的趣味游戏
调动全场的热闹气氛
让嘉宾在游戏中更深度了解彼此
从中看到异性最真实的一面
间接给自己和对方留下关系开始的伏笔。', '', 1, '2025-07-01 09:00:00', '常州市潞立方二楼', 'outdoor_activity', 99.9, 20, '25-35岁');
INSERT INTO "activities" VALUES (2, '2025-08-10', '2025-08-05 20:00:00', '户外烧烤相亲会', '在美丽的郊外公园举办户外烧烤活动，让大家在轻松愉快的氛围中相知相识，活动包含烧烤、游戏互动、自我介绍等环节。', '', 1, '2025-07-20 14:30:00', '常州某公园', 'themed_party', 68.0, 30, '22-32岁');
INSERT INTO "activities" VALUES (3, '2025-09-22', '2025-09-15 22:00:00', '咖啡厅浪漫邂逅', '在温馨的咖啡厅环境中，通过精心设计的交流环节，让单身那女友更多深入交流了解的机会。', '', 1, '2025-09-10 16:15:00', '常州某咖啡厅', 'group_activity', 128.0, 40, '20-35岁');
INSERT INTO "activities" VALUES (4, '2025-10-05T14:00', '2025-09-30T20:00', '命理之八字姻缘——探寻传统姻缘智慧', '和陌生人一起，来场走心下午茶。
🫂这一场，让我们撕掉社会标签，用最中式的MBTI来遇见新朋友。卸下防备，畅所欲言！
.
📝活动环节：
🎈环节一：全新卡牌破冰小游戏 30mins
通过卡牌游戏展示自己，轻松破冰，畅所欲言。也可以分享自己对爱情或八字风水的看法与体验。
🎈环节二：专业老师分享 1-1.5hrs
深度交流，借助五行配比知识更好地了解自己。探索中式MBTI的魅力，解锁自己的闪光点，了解最适合自己的异性性格。
🎈环节三：休息与茶歇享用 15mins
茶品介绍与品茶知识分享，体会申时茶的魅力。享用佐茶小食，自由聊天，和新朋友们共度休闲小食光。
🎈环节四：趣味互动 45mins
惊喜八字小游戏，放松愉悦心情。八字恋爱话题分享，深度有效社交。
.
🤗参与本次活动你将收获：
1. 基础五行配比与八字知识
2. 简单看相识人技巧
3. 申时茶品鉴知识
4. 三五兴趣相投的新朋友
.
📆时间：10月5日周六 2-5pm
📍地点：常州市经开区潞立方人二楼心桥婚恋', '福利：提供特色茶饮、精致茶点；参与即可获赠“姻缘命理小解析”体验券
 
报名提示
 
请于9月30日前通过心桥婚恋官方渠道（微信公众号/客服电话等）确认席位，解锁专属缘分社交场域。', 1, '2025-10-13 09:21:08', '常州市潞立方二楼', 'speed_dating', 38.0, 20, '25~35岁');

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
INSERT INTO "activity_photos" VALUES (1, 1, '/uploads/7.19-1.jpg');
INSERT INTO "activity_photos" VALUES (2, 1, '/uploads/7.19-2.jpg');
INSERT INTO "activity_photos" VALUES (3, 2, '/uploads/8.10-1.jpg');
INSERT INTO "activity_photos" VALUES (4, 2, '/uploads/8.10-2.jpg');
INSERT INTO "activity_photos" VALUES (5, 3, '/uploads/active1.jpg');
INSERT INTO "activity_photos" VALUES (6, 4, '/uploads/10.5-1.jpg');
INSERT INTO "activity_photos" VALUES (7, 4, '/uploads/10.5-2.jpg');
INSERT INTO "activity_photos" VALUES (8, 4, '/uploads/10.5-3.jpg');
INSERT INTO "activity_photos" VALUES (9, 4, '/uploads/10.5-4.jpg');

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
INSERT INTO "sqlite_sequence" VALUES ('activities', 4);
INSERT INTO "sqlite_sequence" VALUES ('activity_photos', 9);
INSERT INTO "sqlite_sequence" VALUES ('activity_registrations', 7);
INSERT INTO "sqlite_sequence" VALUES ('activities', 3);
INSERT INTO "sqlite_sequence" VALUES ('activity_photos', 5);
INSERT INTO "sqlite_sequence" VALUES ('user_details', 28);
INSERT INTO "sqlite_sequence" VALUES ('users', 49);
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
INSERT INTO "user_details" VALUES (1, 2, '', '张三', '男', '13800138000', '北京', 28, '1997-05-15', '牛', '金牛座', 178, 70, '15-20万', '本科', '软件工程师', '互联网', 'single', '运动、音乐、旅游', 'yes', '父母退休，家庭和睦', '1-2年内', 1, 0, '河北省', '石家庄市', '桥西区', '中山路1号', '北京', '北京市', '朝阳区', '建国路88号', '性格开朗，有责任心，喜欢运动', 24, 30, 160, 170, '不限', '10万以上', '大专以上', 'single', 0, 0, '北京及周边', 1, '希望找到一位温柔善良、有共同话题的女生', '性格开朗，有责任心，喜欢运动');
INSERT INTO "user_details" VALUES (2, 3, '', '李四', '女', '13900139000', '上海', 25, '2000-08-20', '龙', '狮子座', 165, 52, '10-15万', '本科', '教师', '教育', 'single', '阅读、烘焙、瑜伽', 'no', '独生女，父母公务员', '2-3年内', 0, 1, '江苏省', '南京市', '鼓楼区', '汉口路2号', '上海', '上海市', '徐汇区', '漕溪路99号', '性格温和，喜欢安静的生活', 26, 35, 175, 185, '稳定职业', '15万以上', '本科以上', 'single', 1, 1, '上海及周边', 1, '希望找到一位成熟稳重、有事业心的男生', '性格温和，喜欢安静的生活');
INSERT INTO "user_details" VALUES (3, 4, '', '王五', '男', '13700137000', '广州', 32, '1993-12-10', '鸡', '射手座', 182, 75, '20-30万', '硕士', '金融分析师', '金融', 'single', '投资、健身、摄影', 'no', '普通家庭，父母经商', '1年内', 1, 1, '广东省', '深圳市', '南山区', '科技园3号', '广州', '广州市', '天河区', '珠江新城188号', '事业型，追求上进', 28, 33, 165, 175, '不限', '20万以上', '本科以上', 'single', 1, 1, '广州及周边', 0, '希望找到一位理解支持我事业的伴侣', '事业型，追求上进');
INSERT INTO "user_details" VALUES (4, 5, '', '赵六', '女', '13600136000', '深圳', 27, '1998-03-25', '虎', '白羊座', 168, 55, '15-20万', '本科', '市场经理', '快消品', 'single', '舞蹈、美食、旅行', 'yes', '知识分子家庭', '2年内', 1, 0, '浙江省', '杭州市', '西湖区', '文三路5号', '深圳', '深圳市', '福田区', '华强北路66号', '独立自信，热爱生活', 28, 38, 175, 185, '有事业心', '20万以上', '本科以上', 'single', 1, 0, '深圳及周边', 1, '希望找到一位有品位、懂生活的绅士', '独立自信，热爱生活');
INSERT INTO "user_details" VALUES (5, 6, '苏州影视男', NULL, '男', NULL, NULL, 32, NULL, NULL, NULL, 187, NULL, '1.3w', '专科', '影视行业', NULL, 'single', '摩托车', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏苏州', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏苏州人，32岁，专科学历，从事影视行业，月收入1.3w。爱好摩托车。');
INSERT INTO "user_details" VALUES (6, 7, '武进护士', NULL, '女', NULL, NULL, 25, NULL, NULL, NULL, 161, NULL, '8k', '本科', '武进中医院护士', NULL, 'single', '宠物', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '常州武进', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '常州武进人，25岁，本科学历，从事武进中医院护士，月收入8k。爱好宠物。');
INSERT INTO "user_details" VALUES (7, 8, '常州机械男', NULL, '男', NULL, NULL, 29, NULL, NULL, NULL, 177, NULL, '7k', '专科', '机械厂职工', NULL, 'single', '动漫', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏常州', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏常州人，29岁，专科学历，从事机械厂职工，月收入7k。爱好动漫。');
INSERT INTO "user_details" VALUES (8, 9, '武进母婴姐', NULL, '女', NULL, NULL, 37, NULL, NULL, NULL, 160, NULL, '8k', '专科', '母婴店管理者', NULL, 'single', '做饭', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '常州武进', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '常州武进人，37岁，专科学历，从事母婴店管理者，月收入8k。爱好做饭。');
INSERT INTO "user_details" VALUES (9, 10, '常州教育男', NULL, '男', NULL, NULL, 34, NULL, NULL, NULL, 168, NULL, '2w', '本科', '教育培训', NULL, 'single', '学习', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏常州', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏常州人，34岁，本科学历，从事教育培训，月收入2w。爱好学习。');
INSERT INTO "user_details" VALUES (10, 11, '常州私营业主', NULL, '女', NULL, NULL, 34, NULL, NULL, NULL, 158, NULL, '8k', '高中', '私营业主', NULL, 'single', '宠物', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏常州', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏常州人，34岁，高中学历，从事私营业主，月收入8k。爱好宠物。');
INSERT INTO "user_details" VALUES (11, 12, '常州管理男', NULL, '男', NULL, NULL, 34, NULL, NULL, NULL, 172, NULL, '2w', '硕士', '企业管理', NULL, 'single', '旅游', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏常州', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏常州人，34岁，硕士学历，从事企业管理，月收入2w。爱好旅游。');
INSERT INTO "user_details" VALUES (12, 13, '武进公务员', NULL, '女', NULL, NULL, 30, NULL, NULL, NULL, 160, NULL, '2w', '硕士', '公务员', NULL, 'single', '做饭', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '常州武进', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '常州武进人，30岁，硕士学历，从事公务员，月收入2w。爱好做饭。');
INSERT INTO "user_details" VALUES (13, 14, '沭阳动物园员工', NULL, '男', NULL, NULL, 32, NULL, NULL, NULL, 177, NULL, '7k', '本科', '淹城动物园员工', NULL, 'single', '摩托车', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏沭阳', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏沭阳人，32岁，本科学历，从事淹城动物园员工，月收入7k。爱好摩托车。');
INSERT INTO "user_details" VALUES (14, 15, '宿迁电信员工', NULL, '女', NULL, NULL, 29, NULL, NULL, NULL, 162, NULL, '1.1w', '本科', '电信公司正式员工', NULL, 'single', '旅游', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '江苏宿迁', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '江苏宿迁人，29岁，本科学历，从事电信公司正式员工，月收入1.1w。爱好旅游。');

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
INSERT INTO "users" VALUES (6, 'user_male_1', '$2b$10$NjsoJeopRvUiUHWHWqH4C.pTwyVYWq9FnllFE9pqxAI45KPVVNBrS', '/uploads/male.jpg', 1, 'user', '2025-10-13 04:52:49');
INSERT INTO "users" VALUES (7, 'user_female_1', '$2b$10$isGFth8xgUDY77rcpIx0yOIUTOtHQlpSjmMuXlrpkP6ATWzN9w2r2', '/uploads/female.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (8, 'user_male_2', '$2b$10$pwJ3uK5XF36AGuM/QGXN2uVaA2TG7MmLH8.rQCw7E3UV8ib4rAXZS', '/uploads/male.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (9, 'user_female_2', '$2b$10$oS.fziex1KR22aREZ28OruJvsU/9SyKXGIYg82sSDKbGCpDBNBaTu', '/uploads/female.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (10, 'user_male_3', '$2b$10$sPLgJ.jH8RxwK3yW0W7H5uJK0RONNtHy96M0Lc79Lnu4RYDPLyaIy', '/uploads/male.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (11, 'user_female_3', '$2b$10$6NRXZDJIMFwguqiRI9pKveX977r/tXmsWBImGM41M8aoUg3k.GeCm', '/uploads/female.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (12, 'user_male_4', '$2b$10$caJpOApiMEGmwE0xf7VkXur8mDc5WI7ggUtT8BcaImtvYVwJapguy', '/uploads/male.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (13, 'user_female_4', '$2b$10$A1hCBdDvJe.Z6KJfLedt1eFoNWSllKC//UOHBGe.HZ3.7sUZOPf22', '/uploads/female.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (14, 'user_male_5', '$2b$10$uMgJu28UtE2T3zTuEzmdYOaANVASHqF5Bqu09/4eqTy6ikjxe5f/m', '/uploads/male.jpg', 1, 'user', '2025-10-13 04:52:50');
INSERT INTO "users" VALUES (15, 'user_female_5', '$2b$10$7zoTMK0DtaTo4nrWUbmqUu2TpEWKvuTCDApex0gksSZ0t8EwbbDk2', '/uploads/female.jpg', 1, 'user', '2025-10-13 04:52:50');

-- ----------------------------
-- Auto increment value for activities
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 4 WHERE name = 'activities';

-- ----------------------------
-- Auto increment value for activity_photos
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 9 WHERE name = 'activity_photos';

-- ----------------------------
-- Auto increment value for activity_registrations
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 7 WHERE name = 'activity_registrations';

-- ----------------------------
-- Auto increment value for user_details
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 28 WHERE name = 'user_details';

-- ----------------------------
-- Auto increment value for users
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 49 WHERE name = 'users';

PRAGMA foreign_keys = true;
