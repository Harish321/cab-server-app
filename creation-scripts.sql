CREATE TABLE `cabs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_number` varchar(50) NOT NULL,
  `driver_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_number` (`service_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cab_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('fuel','service','others') NOT NULL,
  `subtype` varchar(100) DEFAULT NULL,
  `comments` text,
  `paid_by` varchar(100) DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_expenses_cab_id_type_date` (`cab_id`,`type`,`date`),
  CONSTRAINT `fk_expenses_cab_id` FOREIGN KEY (`cab_id`) REFERENCES `cabs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cab_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_payments_cab_id_date` (`cab_id`,`date`),
  CONSTRAINT `fk_payments_cab_id` FOREIGN KEY (`cab_id`) REFERENCES `cabs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `salaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cab_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paid_by` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_salaries_cab_id_date` (`cab_id`,`date`),
  CONSTRAINT `fk_salaries_cab_id` FOREIGN KEY (`cab_id`) REFERENCES `cabs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cab_id` int NOT NULL,
  `total_trips` int DEFAULT '0',
  `distance_km` decimal(10,2) DEFAULT '0.00',
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_trips_cab_id_date` (`cab_id`,`date`),
  CONSTRAINT `fk_trips_cab_id` FOREIGN KEY (`cab_id`) REFERENCES `cabs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;