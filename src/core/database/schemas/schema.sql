SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sort_name` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_code` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `states`;
CREATE TABLE `states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(225) NOT NULL,
  `country_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `states_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `state_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` varchar(20) NOT NULL,
  `status_id` int DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `acct_typ` varchar(50) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(50) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `gender` varchar(8) NOT NULL,
  `photo` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `accounts_ibfk_3` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `accounts_ibfk_4` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` varchar(20) DEFAULT NULL,
  `status_id` int DEFAULT NULL,
  `token` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` varchar(20) DEFAULT NULL,
  `receiver` varchar(20) DEFAULT NULL,
  `sender` varchar(20) DEFAULT NULL,
  `ref_id` varchar(20) DEFAULT NULL,
  `subject` varchar(50) NOT NULL,
  `content` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`receiver`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `message_trail`;
CREATE TABLE `message_trail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` varchar(20) DEFAULT NULL,
  `message_id` int DEFAULT NULL,
  `status_id` int DEFAULT 3,
  `content` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `message_trail_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `message_trail_ibfk_2` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_trail_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `listing_types`;
CREATE TABLE `listing_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `listings`;
CREATE TABLE `listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` varchar(20) DEFAULT NULL,
  `listing_type_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `status_id` int DEFAULT 3,
  `name` varchar(50) NOT NULL,
  `price` varchar(10) NOT NULL,
  `discount` varchar(10) DEFAULT NULL,
  `stock` varchar(10) DEFAULT NULL,
  `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_2` FOREIGN KEY (`listing_type_id`) REFERENCES `listing_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `listings_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `school_categories`;
CREATE TABLE `school_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school_id` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `schools`;
CREATE TABLE `schools` (
  `id` varchar(20) NOT NULL,
  `account_id` varchar(20) DEFAULT NULL,
  `reg_code` varchar(30) NOT NULL,
  `reg_date` varchar(20) NOT NULL,
  `about` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `schools_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
