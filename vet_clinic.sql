-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Aug 22, 2026 at 04:47 AM
-- Server version: 8.0.44
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vet_clinic`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `admin_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('super_admin','admin','staff') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`admin_id`, `username`, `email`, `password_hash`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@vetclinic.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 1, '2026-08-22 02:18:32', '2025-08-20 02:15:41', '2026-08-22 02:18:32');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `staff_id` int DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `duration_min` smallint DEFAULT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled','no_show') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `visit_type` enum('scheduled','walk_in','emergency') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'scheduled',
  `notes` text COLLATE utf8mb4_general_ci,
  `created_by_admin_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `pet_id`, `staff_id`, `appointment_date`, `appointment_time`, `duration_min`, `status`, `visit_type`, `notes`, `created_by_admin_id`, `created_at`, `updated_at`) VALUES
(11, 2, 3, '2026-03-16', '10:00:00', NULL, 'confirmed', 'scheduled', 'None', NULL, '2026-03-14 09:10:28', '2026-03-14 09:12:19'),
(12, 1, 3, '2026-03-17', '09:00:00', NULL, 'confirmed', 'scheduled', 'none', NULL, '2026-03-16 01:27:38', '2026-03-16 13:25:09');

--
-- Triggers `appointments`
--
DELIMITER $$
CREATE TRIGGER `trg_appt_confirmed_staff_insert` BEFORE INSERT ON `appointments` FOR EACH ROW BEGIN
  IF NEW.status = 'confirmed' AND NEW.staff_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'BUSINESS RULE: A confirmed appointment must have a staff member assigned (staff_id cannot be NULL).';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_appt_confirmed_staff_update` BEFORE UPDATE ON `appointments` FOR EACH ROW BEGIN
  IF NEW.status = 'confirmed' AND NEW.staff_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'BUSINESS RULE: A confirmed appointment must have a staff member assigned (staff_id cannot be NULL).';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_appt_pet_sync` AFTER UPDATE ON `appointments` FOR EACH ROW BEGIN
  IF OLD.pet_id <> NEW.pet_id THEN
    UPDATE `medical_records`
       SET `pet_id` = NEW.pet_id
     WHERE `appointment_id` = NEW.appointment_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `appointment_services`
--

CREATE TABLE `appointment_services` (
  `appointment_service_id` int NOT NULL,
  `appointment_id` int NOT NULL,
  `service_id` int NOT NULL,
  `service_price_snapshot` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Junction table: many services per appointment with price snapshot';

--
-- Dumping data for table `appointment_services`
--

INSERT INTO `appointment_services` (`appointment_service_id`, `appointment_id`, `service_id`, `service_price_snapshot`, `created_at`) VALUES
(24, 11, 7, 45.00, '2026-03-14 09:12:15'),
(25, 11, 3, 300.00, '2026-03-14 09:12:15'),
(26, 11, 8, 50.00, '2026-03-14 09:12:15'),
(27, 11, 6, 40.00, '2026-03-14 09:12:15'),
(28, 11, 2, 25.00, '2026-03-14 09:12:15'),
(29, 11, 1, 85.00, '2026-03-14 09:12:15'),
(31, 12, 3, 300.00, '2026-03-16 13:25:09');

--
-- Triggers `appointment_services`
--
DELIMITER $$
CREATE TRIGGER `trg_as_billing_sync_delete` AFTER DELETE ON `appointment_services` FOR EACH ROW BEGIN
                    UPDATE `billing`
                       SET `subtotal` = (
                           SELECT COALESCE(SUM(`service_price_snapshot`), 0)
                             FROM `appointment_services`
                            WHERE `appointment_id` = OLD.appointment_id
                       )
                     WHERE `appointment_id` = OLD.appointment_id;
                END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_as_billing_sync_insert` AFTER INSERT ON `appointment_services` FOR EACH ROW BEGIN
                    UPDATE `billing`
                       SET `subtotal` = (
                           SELECT COALESCE(SUM(`service_price_snapshot`), 0)
                             FROM `appointment_services`
                            WHERE `appointment_id` = NEW.appointment_id
                       )
                     WHERE `appointment_id` = NEW.appointment_id;
                END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_as_billing_sync_update` AFTER UPDATE ON `appointment_services` FOR EACH ROW BEGIN
                    UPDATE `billing`
                       SET `subtotal` = (
                           SELECT COALESCE(SUM(`service_price_snapshot`), 0)
                             FROM `appointment_services`
                            WHERE `appointment_id` = NEW.appointment_id
                       )
                     WHERE `appointment_id` = NEW.appointment_id;
                END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `billing`
--

CREATE TABLE `billing` (
  `billing_id` int NOT NULL,
  `appointment_id` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_status` enum('unpaid','partial','paid','refunded','void') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'unpaid',
  `due_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `billing`
--

INSERT INTO `billing` (`billing_id`, `appointment_id`, `subtotal`, `discount_amount`, `tax_amount`, `total_amount`, `payment_status`, `due_date`, `notes`, `created_at`, `updated_at`) VALUES
(12, 11, 545.00, 0.00, 0.00, 545.00, 'paid', NULL, '', '2026-03-14 09:10:28', '2026-03-14 09:13:01'),
(13, 12, 300.00, 0.00, 0.00, 300.00, 'unpaid', NULL, NULL, '2026-03-16 01:27:38', '2026-03-16 13:25:09');

--
-- Triggers `billing`
--
DELIMITER $$
CREATE TRIGGER `trg_billing_compute_insert` BEFORE INSERT ON `billing` FOR EACH ROW BEGIN
  SET NEW.total_amount = NEW.subtotal - NEW.discount_amount + NEW.tax_amount;
  IF NEW.total_amount < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'BILLING ERROR: Computed total_amount (subtotal - discount + tax) is negative. Check discount and tax values.';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_billing_compute_update` BEFORE UPDATE ON `billing` FOR EACH ROW BEGIN
  SET NEW.total_amount = NEW.subtotal - NEW.discount_amount + NEW.tax_amount;
  IF NEW.total_amount < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'BILLING ERROR: Computed total_amount (subtotal - discount + tax) is negative. Check discount and tax values.';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `post_id` int NOT NULL,
  `admin_id` int DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_general_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_general_ci,
  `excerpt` text COLLATE utf8mb4_general_ci,
  `author` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Display byline; admin_id handles system auth',
  `featured_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `external_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Website blog posts (CMS module)';

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`post_id`, `admin_id`, `title`, `slug`, `content`, `excerpt`, `author`, `featured_image`, `external_url`, `is_published`, `is_featured`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 1, '10 Essential Tips for New Pet Owners', '10-essential-tips-for-new-pet-owners', 'Bringing home a new pet is exciting but can also be overwhelming. Here are 10 essential tips to help you and your new companion start off on the right paw...', 'Essential guidance for new pet parents to ensure a smooth transition for their furry friends.', 'Dr. Sarah Johnson', NULL, NULL, 1, 1, '2026-03-03 08:29:38', '2026-03-03 16:04:47', '2026-03-03 16:30:03'),
(2, 1, 'The Importance of Regular Dental Care for Pets', 'importance-of-regular-dental-care-for-pets', 'Just like humans, pets need regular dental care to maintain good health. Learn why dental hygiene is crucial for your pets overall well-being...', 'Understanding why dental care is essential for your pets health and happiness.', 'Dr. Michael Chen', NULL, NULL, 1, 1, '2025-08-20 02:15:41', '2026-03-03 16:04:47', '2026-03-03 16:31:26'),
(3, 1, 'Preparing Your Pet for Emergency Situations', 'preparing-your-pet-for-emergency-situations', 'Emergencies can happen when we least expect them. Being prepared can make all the difference in your pet\'s outcome...', 'Learn how to prepare for and handle pet emergencies before they happen.', 'Lisa Rodriguez', NULL, NULL, 1, 1, '2025-08-20 02:15:41', '2026-03-03 16:04:47', '2026-03-07 04:29:27'),
(4, NULL, 'Toxic Foods for Dogs and Cats', 'toxic-foods-for-dogs-and-cats', 'A comprehensive list of foods that are dangerous for pets, including chocolate, grapes, onions, and more.', 'A comprehensive list of foods that are dangerous for pets, including chocolate, grapes, onions, and more.', 'External Source', NULL, 'https://www.petpoisonhelpline.com/poisons/', 1, 0, '2025-08-20 09:39:19', '2026-03-03 16:04:47', '2026-03-03 16:44:26'),
(5, NULL, 'Spaying and Neutering Your Pet', 'spaying-and-neutering-your-pet', 'Learn about the benefits of spaying and neutering, including health advantages and population control.', 'Learn about the benefits of spaying and neutering, including health advantages and population control.', 'External Source', NULL, 'https://www.aspca.org/pet-care/general-pet-care/spayneuter-your-pet', 1, 0, '2025-08-20 09:39:19', '2026-03-03 16:04:47', '2026-03-03 16:45:44'),
(6, NULL, 'Microchipping Your Pet: What You Need to Know', 'microchipping-your-pet-what-you-need-to-know', 'Everything about pet microchips - how they work, the procedure, and why they\'re important for pet recovery.', 'Everything about pet microchips - how they work, the procedure, and why they\'re important for pet recovery.', 'External Source', NULL, 'https://www.avma.org/resources-tools/pet-owners/petcare/microchipping-animals', 1, 0, '2025-08-20 09:39:19', '2026-03-03 16:04:47', '2026-03-03 16:46:33');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `message_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('new','read','responded','archived') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'new',
  `replied_by` int DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`message_id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `replied_by`, `replied_at`, `created_at`) VALUES
(1, 'Lorenz Estrera', 'estreralorenz9@gmail.com', '09063194201', 'General Question', 'khuftrsrresfyugio', 'responded', NULL, NULL, '2026-03-03 16:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `faq_id` int NOT NULL,
  `question` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `answer` text COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='FAQ entries (CMS module)';

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`faq_id`, `question`, `answer`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'What should I bring to my pet\'s first appointment?', 'Please bring any previous medical records, a list of current medications, and a stool sample if possible.', 'Appointments', 1, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(2, 'Do you offer emergency services?', 'Yes, we provide 24/7 emergency services.', 'Emergency', 2, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(3, 'How often should my pet have a wellness exam?', 'Annual for healthy adults; twice yearly for seniors over 7 years.', 'Preventive Care', 3, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(4, 'What payment methods do you accept?', 'Cash, credit/debit cards, GCash, Maya, and bank transfer.', 'Payment', 4, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47');

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `record_id` int NOT NULL,
  `appointment_id` int NOT NULL,
  `pet_id` int NOT NULL COMMENT 'Denormalized; auto-populated by trigger; kept in sync by trg_appt_pet_sync',
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `temperature_c` decimal(4,1) DEFAULT NULL,
  `diagnosis` text COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Required: a record without a diagnosis is clinically incomplete',
  `treatment` text COLLATE utf8mb4_general_ci,
  `prescribed_meds` text COLLATE utf8mb4_general_ci,
  `follow_up_date` date DEFAULT NULL,
  `follow_up_notes` text COLLATE utf8mb4_general_ci,
  `vet_remarks` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Triggers `medical_records`
--
DELIMITER $$
CREATE TRIGGER `trg_medical_record_populate` BEFORE INSERT ON `medical_records` FOR EACH ROW BEGIN
  DECLARE v_pet_id INT DEFAULT NULL;

  SELECT `pet_id` INTO v_pet_id
    FROM `appointments`
   WHERE `appointment_id` = NEW.appointment_id;

  IF v_pet_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'INTEGRITY ERROR: Cannot create medical record — appointment not found or has no pet assigned.';
  END IF;

  SET NEW.pet_id = v_pet_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `subscriber_id` int NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(101) COLLATE utf8mb4_general_ci GENERATED ALWAYS AS (concat(`first_name`,_utf8mb4' ',`last_name`)) VIRTUAL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`subscriber_id`, `email`, `first_name`, `last_name`, `is_active`, `subscribed_at`, `unsubscribed_at`) VALUES
(1, 'estreralorenz9@gmail.com', 'Lorenz Edward Tadeo', 'Estrera', 1, '2025-08-25 09:06:04', NULL),
(3, 'leestrera647.pbox@parsu.edu.ph', 'Lorenz', 'Edward Estrera', 1, '2026-03-06 05:38:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `owners`
--

CREATE TABLE `owners` (
  `owner_id` int NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Required: clinic must be able to reach owner',
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zip_code` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `owners`
--

INSERT INTO `owners` (`owner_id`, `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `province`, `zip_code`, `created_at`, `updated_at`) VALUES
(1, 'Lorenz', 'Estrera', 'estreralorenz9@gmail.com', '09063194201', NULL, NULL, NULL, NULL, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(2, 'Angela Karla', 'Barbacena', 'angelakarlabarba01@gmail.com', '09926006394', 'Zone 7 Salvacion', 'Tigaon', 'Camarines Sur', '4420', '2026-03-07 13:22:02', '2026-03-07 13:22:02'),
(3, 'Test', 'Multi Service', 'testmulti@gmail.com', '09171234567', NULL, NULL, NULL, NULL, '2026-03-14 08:06:51', '2026-03-14 08:06:51'),
(4, 'Test', 'Multi Service Subagent', 'subagent@gmail.com', '09171234567', NULL, NULL, NULL, NULL, '2026-03-14 08:17:30', '2026-03-14 08:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `billing_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('Cash','Credit Card','Debit Card','GCash','Maya','Bank Transfer','Other') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Cash',
  `reference_no` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `received_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `billing_id`, `amount`, `payment_method`, `reference_no`, `payment_date`, `received_by`, `notes`, `created_at`) VALUES
(1, 12, 545.00, 'Cash', '', '2026-04-27 12:09:19', 1, '', '2026-04-27 12:09:19');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `pet_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `species` enum('Dog','Cat','Bird','Rabbit','Reptile','Fish','Other') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Dog',
  `breed` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('Male','Female','Unknown') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Unknown',
  `color` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `microchip_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`pet_id`, `owner_id`, `name`, `species`, `breed`, `gender`, `color`, `date_of_birth`, `weight_kg`, `microchip_number`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Jose', 'Dog', 'Gamadya', 'Male', 'Itoman', '2005-11-05', 5.50, '0922225100', 0, '2026-03-03 16:04:47', '2026-03-10 03:57:33'),
(2, 1, 'Saf', 'Cat', 'Gamadya', 'Unknown', 'Itoman', '2005-11-05', 5.50, '0922225101', 0, '2026-03-03 17:05:12', '2026-03-10 03:57:30'),
(4, 3, 'Buddy', 'Other', NULL, 'Unknown', NULL, NULL, NULL, NULL, 1, '2026-03-14 08:06:51', '2026-03-14 08:06:51'),
(5, 4, 'Buddy Subagent', 'Dog', NULL, 'Unknown', NULL, NULL, NULL, NULL, 1, '2026-03-14 08:17:30', '2026-03-14 08:17:30');

--
-- Triggers `pets`
--
DELIMITER $$
CREATE TRIGGER `trg_pet_dob_insert` BEFORE INSERT ON `pets` FOR EACH ROW BEGIN
  IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth >= CURDATE() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'VALIDATION: pets.date_of_birth must be a date in the past (before today).';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_pet_dob_update` BEFORE UPDATE ON `pets` FOR EACH ROW BEGIN
  IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth >= CURDATE() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'VALIDATION: pets.date_of_birth must be a date in the past (before today).';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Other',
  `icon` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'fas fa-stethoscope',
  `base_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `duration_min` smallint DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `name`, `description`, `category`, `icon`, `base_price`, `duration_min`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Wellness Exams', 'Comprehensive health checkups.', 'Preventive Care', 'fas fa-stethoscope', 85.00, 45, 1, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(2, 'Vaccinations', 'Core and non-core vaccinations.', 'Preventive Care', 'fas fa-stethoscope', 25.00, 20, 2, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(3, 'Dental Care', 'Professional dental cleaning and extractions.', 'Dental', 'fas fa-tooth', 300.00, 90, 3, 1, '2026-03-03 16:04:47', '2026-03-05 10:53:16'),
(4, 'Surgery', 'Routine and emergency surgical procedures.', 'Surgery', 'fas fa-stethoscope', 500.00, 120, 4, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(5, 'Emergency Care', '24/7 emergency veterinary services.', 'Emergency', 'fas fa-stethoscope', 150.00, 60, 5, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(6, 'Pet Grooming', 'Full-service grooming.', 'Grooming', 'fas fa-stethoscope', 40.00, 60, 6, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47'),
(7, 'Boarding', 'Overnight boarding with personalized care.', 'Boarding', 'fas fa-home', 45.00, NULL, 7, 1, '2026-03-03 16:04:47', '2026-03-05 10:52:54'),
(8, 'Laboratory Services', 'In-house blood work and diagnostics.', 'Diagnostics', 'fas fa-stethoscope', 50.00, 30, 8, 1, '2026-03-03 16:04:47', '2026-03-03 16:04:47');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int NOT NULL,
  `admin_user_id` int DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(101) COLLATE utf8mb4_general_ci GENERATED ALWAYS AS (concat(`first_name`,_utf8mb4' ',`last_name`)) STORED COMMENT 'Computed display name for view compatibility',
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Staff',
  `specialization` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `credentials` text COLLATE utf8mb4_general_ci,
  `photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` smallint NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `hired_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Clinic staff members';

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `admin_user_id`, `first_name`, `last_name`, `email`, `phone`, `role`, `specialization`, `credentials`, `photo`, `display_order`, `is_active`, `hired_date`, `created_at`, `updated_at`) VALUES
(1, 1, 'Sarah', 'Johnson', 'sarah.johnson@vetclinic.com', NULL, 'Lead Veterinarian', 'DVM, AAHA Certified', 'Dr. Johnson has over 15 years of experience in veterinary medicine and specializes in small animal care. She is passionate about preventive medicine and building lasting relationships with pets and their families.', 'img_68a5a2c4edcd2_1755685572.jpeg', 1, 1, '2010-06-01', '2026-03-03 16:04:47', '2026-03-03 16:07:40'),
(2, NULL, 'Michael', 'Chen', 'michael.chen@vetclinic.com', NULL, 'Veterinarian Surgeon', 'DVM, Surgery Specialist', 'Dr. Chen specializes in surgical procedures and emergency care. With 10 years of experience, he has performed thousands of successful surgeries and is known for his gentle approach with anxious pets.', 'img_68a5a35b37807_1755685723.jpg', 2, 1, '2015-03-15', '2026-03-03 16:04:47', '2026-03-03 16:06:15'),
(3, NULL, 'Lisa', 'Rodriguez', 'lisa.rodriguez@vetclinic.com', NULL, 'Veterinary Technician', 'CVT, Licensed Veterinary Technician', 'Lisa has been with our clinic for 8 years and is our lead veterinary technician. She assists with all procedures and is exceptional at making pets feel comfortable during their visits.', 'img_69a7085e889b3_1772554334.jpeg', 3, 1, '2018-01-10', '2026-03-03 16:04:47', '2026-03-03 16:12:15');

--
-- Triggers `staff`
--
DELIMITER $$
CREATE TRIGGER `trg_staff_hired_date_insert` BEFORE INSERT ON `staff` FOR EACH ROW BEGIN
  IF NEW.hired_date IS NOT NULL AND NEW.hired_date > CURDATE() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'VALIDATION: staff.hired_date cannot be a future date.';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_staff_hired_date_update` BEFORE UPDATE ON `staff` FOR EACH ROW BEGIN
  IF NEW.hired_date IS NOT NULL AND NEW.hired_date > CURDATE() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT =
      'VALIDATION: staff.hired_date cannot be a future date.';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `testimonial_id` int NOT NULL,
  `owner_id` int DEFAULT NULL,
  `client_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `pet_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `testimonial` text COLLATE utf8mb4_general_ci NOT NULL,
  `rating` tinyint NOT NULL DEFAULT '5',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`testimonial_id`, `owner_id`, `client_name`, `pet_name`, `testimonial`, `rating`, `is_featured`, `is_approved`, `created_at`) VALUES
(1, NULL, 'Jennifer Smith', 'Max', 'The team took such great care of Max during his surgery.', 5, 1, 1, '2026-03-03 16:04:47'),
(2, NULL, 'Robert Martinez', 'Luna', 'Dr. Johnson made Luna feel comfortable immediately. Highly recommend!', 5, 1, 1, '2026-03-03 16:04:47'),
(3, NULL, 'Emily Davis', 'Charlie', 'Professional, caring, and knowledgeable. 3 years and counting.', 5, 1, 1, '2026-03-03 16:04:47'),
(4, NULL, 'Lorenz Estrera', 'Jose', 'Im tell\'n you guys this is the best vet clinic in the world!', 5, 1, 1, '2026-03-06 05:53:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `uq_admin_username` (`username`),
  ADD UNIQUE KEY `uq_admin_email` (`email`),
  ADD KEY `idx_admin_active` (`is_active`),
  ADD KEY `idx_admin_last_login` (`last_login`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD UNIQUE KEY `uq_staff_slot` (`staff_id`,`appointment_date`,`appointment_time`),
  ADD KEY `idx_appt_pet` (`pet_id`),
  ADD KEY `idx_appt_staff` (`staff_id`),
  ADD KEY `idx_appt_date` (`appointment_date`),
  ADD KEY `idx_appt_status` (`status`),
  ADD KEY `idx_appt_date_time_staff` (`appointment_date`,`appointment_time`,`staff_id`),
  ADD KEY `idx_appt_creator` (`created_by_admin_id`);

--
-- Indexes for table `appointment_services`
--
ALTER TABLE `appointment_services`
  ADD PRIMARY KEY (`appointment_service_id`),
  ADD UNIQUE KEY `uq_appt_service` (`appointment_id`,`service_id`),
  ADD KEY `idx_as_appointment` (`appointment_id`),
  ADD KEY `idx_as_service` (`service_id`);

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`billing_id`),
  ADD UNIQUE KEY `uq_billing_appointment` (`appointment_id`),
  ADD KEY `idx_billing_status` (`payment_status`),
  ADD KEY `idx_billing_due` (`due_date`),
  ADD KEY `idx_billing_status_due` (`payment_status`,`due_date`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`post_id`),
  ADD UNIQUE KEY `uq_post_slug` (`slug`),
  ADD KEY `idx_post_admin` (`admin_id`),
  ADD KEY `idx_post_pub_featured` (`is_published`,`is_featured`),
  ADD KEY `idx_post_published_at` (`published_at`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_contact_status` (`status`),
  ADD KEY `idx_contact_created_at` (`created_at`),
  ADD KEY `idx_contact_replied_by` (`replied_by`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`faq_id`),
  ADD KEY `idx_faq_active_order` (`is_active`,`display_order`),
  ADD KEY `idx_faq_category` (`category`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`record_id`),
  ADD UNIQUE KEY `uq_record_appointment` (`appointment_id`),
  ADD KEY `idx_record_pet` (`pet_id`),
  ADD KEY `idx_record_follow_up` (`follow_up_date`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`subscriber_id`),
  ADD UNIQUE KEY `uq_subscriber_email` (`email`),
  ADD KEY `idx_subscriber_active` (`is_active`);

--
-- Indexes for table `owners`
--
ALTER TABLE `owners`
  ADD PRIMARY KEY (`owner_id`),
  ADD UNIQUE KEY `uq_owner_email` (`email`),
  ADD KEY `idx_owner_name` (`last_name`,`first_name`),
  ADD KEY `idx_owner_phone` (`phone`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_payment_billing` (`billing_id`),
  ADD KEY `idx_payment_date` (`payment_date`),
  ADD KEY `idx_payment_received_by` (`received_by`),
  ADD KEY `idx_payment_method` (`payment_method`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`pet_id`),
  ADD UNIQUE KEY `uq_microchip` (`microchip_number`),
  ADD KEY `idx_pet_owner` (`owner_id`),
  ADD KEY `idx_pet_species` (`species`),
  ADD KEY `idx_pet_active` (`is_active`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `idx_service_category` (`category`),
  ADD KEY `idx_service_active` (`is_active`),
  ADD KEY `idx_service_order` (`display_order`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `uq_staff_email` (`email`),
  ADD KEY `idx_staff_role` (`role`),
  ADD KEY `idx_staff_admin` (`admin_user_id`),
  ADD KEY `idx_staff_active` (`is_active`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`testimonial_id`),
  ADD KEY `idx_testimonial_owner` (`owner_id`),
  ADD KEY `idx_testimonial_display` (`is_approved`,`is_featured`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointment_services`
--
ALTER TABLE `appointment_services`
  MODIFY `appointment_service_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `billing`
--
ALTER TABLE `billing`
  MODIFY `billing_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `post_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `faq_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `record_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `subscriber_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `owners`
--
ALTER TABLE `owners`
  MODIFY `owner_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `pet_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `testimonial_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appt_created_by` FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin_users` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appt_pet` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appt_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `appointment_services`
--
ALTER TABLE `appointment_services`
  ADD CONSTRAINT `fk_as_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_as_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `fk_billing_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `fk_post_author` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `fk_contact_replied_by` FOREIGN KEY (`replied_by`) REFERENCES `admin_users` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `fk_record_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_record_pet` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_billing` FOREIGN KEY (`billing_id`) REFERENCES `billing` (`billing_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_staff` FOREIGN KEY (`received_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `fk_pet_owner` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`owner_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_staff_admin_user` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `fk_testimonial_owner` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`owner_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
