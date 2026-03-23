-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 20, 2026 at 05:25 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u905431022_apto`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `employerId` int(11) NOT NULL,
  `companyName` varchar(255) NOT NULL,
  `companyEmail` varchar(255) DEFAULT NULL,
  `companyPhone` varchar(255) DEFAULT NULL,
  `companyWebsite` varchar(255) DEFAULT NULL,
  `companySize` varchar(255) DEFAULT NULL,
  `companyIndustry` varchar(255) DEFAULT NULL,
  `companyDescription` text DEFAULT NULL,
  `country` varchar(255) DEFAULT 'India',
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `companyTagline` varchar(255) DEFAULT NULL,
  `companyAbout` text DEFAULT NULL,
  `companyCategory` varchar(255) DEFAULT NULL,
  `linkedinUrl` varchar(255) DEFAULT NULL,
  `facebookUrl` varchar(255) DEFAULT NULL,
  `instagramUrl` varchar(255) DEFAULT NULL,
  `twitterUrl` varchar(255) DEFAULT NULL,
  `youtubeUrl` varchar(255) DEFAULT NULL,
  `githubUrl` varchar(255) DEFAULT NULL,
  `whatsappNumber` varchar(255) DEFAULT NULL,
  `googleMapsUrl` varchar(255) DEFAULT NULL,
  `GST` varchar(399) DEFAULT NULL,
  `PAN` varchar(299) DEFAULT NULL,
  `foundedYear` int(11) NOT NULL,
  `pincode` varchar(100) DEFAULT NULL,
  `fullAddress` varchar(1000) DEFAULT NULL,
  `companyLogo` varchar(1000) DEFAULT NULL,
  `companyPhotos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`companyPhotos`)),
  `employerRole` enum('owner','hr','recruiter','admin') NOT NULL DEFAULT 'owner',
  `companyStatus` enum('pending','submitted','approved','rejected') NOT NULL DEFAULT 'pending',
  `description` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `employerId`, `companyName`, `companyEmail`, `companyPhone`, `companyWebsite`, `companySize`, `companyIndustry`, `companyDescription`, `country`, `state`, `city`, `createdAt`, `updatedAt`, `companyTagline`, `companyAbout`, `companyCategory`, `linkedinUrl`, `facebookUrl`, `instagramUrl`, `twitterUrl`, `youtubeUrl`, `githubUrl`, `whatsappNumber`, `googleMapsUrl`, `GST`, `PAN`, `foundedYear`, `pincode`, `fullAddress`, `companyLogo`, `companyPhotos`, `employerRole`, `companyStatus`, `description`) VALUES
(4, 9, 'Pooja Enterprises', 'happycoding41@gmail.com', '7217619794', 'https://masala.adsdigitalmedia.com/', '11-50', NULL, NULL, 'India', 'd', NULL, '2026-02-28 10:32:03', '2026-02-28 10:32:50', 'Pooja Ho Har Jagh', NULL, 'IT Services & Consulting', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', 'https://masala.adsdigitalmedia.com/', '27ABCDE1234F2Z5', 'EQYAO9231B', 2022, '110085', '107 Naharpur sector-7\r\nRohini', '/uploads/companyDocuments/1772274770421-320580539.png', '[]', 'owner', 'pending', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
(5, 10, 'Dr. Arun\'s Dental Care', 'Dr.Arundentalcare@outlook.com', '7011745944', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', '11-50', NULL, NULL, 'India', 'Delhi', NULL, '2026-02-28 12:32:38', '2026-02-28 12:33:22', 'ywhsh', NULL, 'IT Services & Consulting', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', '98272928272', 'https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps', NULL, NULL, 2014, '110045', 'Flat no. 191, Capital Apartments, Pocket 6, Sector 1A Dwarka, Nasirpur, Delhi, 110045', '/uploads/companyDocuments/1772282001991-598001873.png', '[]', 'owner', 'pending', 'masbmbsabdabmcnkcndsmcdamcascbasmjcbasmcbnasmcbasmcbascbasjcbasdjkchaskjcbnsakjcbsajcbasjkcbaskcbasjcbasjcbascbasjkcbascbaskcbaskcbnaskcbaskcbnaskcbaskcnbaskcbaskcbaskcbaskcbaskcbaskcbaskc'),
(6, 11, 'Apto Solutions', 'jitendra@aptohr.com', '9540999909', NULL, '51-200', NULL, NULL, 'India', 'e', NULL, '2026-03-05 08:07:03', '2026-03-05 08:07:16', NULL, NULL, 'Information Technology (IT)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1987, NULL, NULL, NULL, '[]', 'owner', 'pending', NULL),
(7, 12, 'Sachin Enterpries', 'happycoding41@gmail.com', '7217619794', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', '11-50', NULL, NULL, 'India', 'New Delhi', NULL, '2026-03-16 08:53:19', '2026-03-16 08:54:49', 'keep it short & catch', NULL, 'IT Services & Consulting', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', '7217619794', 'https://www.justdial.com/Delhi/Devi-Dayal-Enterprises-Near-Dda-Market-Pocket-E-Rohini-Sector-8/011P2304711_BZDET', NULL, NULL, 2020, '110085', '107 Naharpur sector-7\r\nRohini', '/uploads/companyDocuments/1773651289372-23588273.png', '[]', 'owner', 'pending', 'To celebrate the launch of the Codex app, we’ve doubled your Codex rate limits for a limited time.\r\n\r\nHigher limits mean more room to explore ideas — run more agents in parallel, try harder projects, and iterate without slowing down.\r\n\r\nApplies everywhere you use Codex — CLI, IDE extension, cloud, and in the app.\r\n\r\nWe can’t wait to see what you build.\r\n\r\nBest,\r\nThe Codex team');

-- --------------------------------------------------------

--
-- Table structure for table `employers`
--

CREATE TABLE `employers` (
  `id` int(11) NOT NULL,
  `employerName` varchar(255) NOT NULL,
  `employerContactNumber` varchar(255) NOT NULL,
  `employerEmail` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otpExpireTime` datetime DEFAULT NULL,
  `accountStatus` enum('active','blocked','pending','company-details-pending','waiting-for-verification') NOT NULL DEFAULT 'pending',
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employers`
--

INSERT INTO `employers` (`id`, `employerName`, `employerContactNumber`, `employerEmail`, `otp`, `otpExpireTime`, `accountStatus`, `password`, `createdAt`, `updatedAt`) VALUES
(9, 'Anish Jha', '7217619794', 'happycoding41@gmail.com', NULL, NULL, 'company-details-pending', '$2b$10$L3VDSuy2hCL40lzTD3j2neuslntnC9ljKNRyKXiELLv24b2KaDZ96', '2026-02-28 10:30:40', '2026-02-28 10:30:52'),
(10, 'Dr.Arun Dentalcare', '7011745948', 'dr.arundentalcare@outlook.com', NULL, NULL, 'company-details-pending', '$2b$10$cZdIyrHvi1q/YnveUtvW9OSsFsbB3vTAfosn9XcU81dWO54YyCMz.', '2026-02-28 12:31:48', '2026-02-28 12:31:53'),
(11, 'JITENDRA KUMAR', '9540999909', 'jitendra@aptohr.com', NULL, NULL, 'company-details-pending', '$2b$10$38Er/iMKrVgVaLbtIDA.MueWOR.FHo4szYRVUW831U66Riu62ZfcO', '2026-03-05 08:04:46', '2026-03-05 08:05:03'),
(12, 'Pooja Sanjay Khimani', '9820276655', 'sachin123@gmail.com', NULL, NULL, 'company-details-pending', '$2b$10$.Oj19xkxBT5f/zd4pw8fFuWcmQHKfOgVWBaSNG.Ft5iruXk1YNchC', '2026-03-16 08:51:34', '2026-03-16 08:51:40');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `employerId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL,
  `jobTitle` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `jobCategory` varchar(255) DEFAULT NULL,
  `jobDescription` text NOT NULL,
  `requiredSkills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requiredSkills`)),
  `jobType` enum('full-time','part-time','internship','contract','freelance') DEFAULT 'full-time',
  `workMode` enum('onsite','remote','hybrid') DEFAULT 'onsite',
  `salaryType` enum('monthly','yearly') DEFAULT 'monthly',
  `currency` varchar(255) DEFAULT 'INR',
  `salaryMin` int(11) DEFAULT NULL,
  `salaryMax` int(11) DEFAULT NULL,
  `hideSalary` tinyint(1) DEFAULT 0,
  `experienceMin` int(11) DEFAULT 0,
  `experienceMax` int(11) DEFAULT 0,
  `openings` int(11) DEFAULT 1,
  `shiftType` enum('day','night','rotational','flexible') DEFAULT NULL,
  `noticePeriod` varchar(255) DEFAULT NULL,
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `education` varchar(255) DEFAULT NULL,
  `applyType` enum('easy-apply','external-link','email') DEFAULT 'easy-apply',
  `applyLink` varchar(255) DEFAULT NULL,
  `applyEmail` varchar(255) DEFAULT NULL,
  `status` enum('draft','under-verification','active','closed','paused') DEFAULT 'draft',
  `isFeatured` tinyint(1) DEFAULT 0,
  `expiryDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `otp` varchar(255) DEFAULT NULL,
  `otpExpiry` datetime DEFAULT NULL,
  `otpVerified` tinyint(1) NOT NULL DEFAULT 0,
  `country` varchar(1000) DEFAULT 'India',
  `state` varchar(1000) DEFAULT NULL,
  `city` varchar(1000) DEFAULT NULL,
  `locationText` varchar(1000) DEFAULT NULL,
  `jobResponsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`jobResponsibilities`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `employerId`, `companyId`, `jobTitle`, `slug`, `jobCategory`, `jobDescription`, `requiredSkills`, `jobType`, `workMode`, `salaryType`, `currency`, `salaryMin`, `salaryMax`, `hideSalary`, `experienceMin`, `experienceMax`, `openings`, `shiftType`, `noticePeriod`, `benefits`, `education`, `applyType`, `applyLink`, `applyEmail`, `status`, `isFeatured`, `expiryDate`, `createdAt`, `updatedAt`, `otp`, `otpExpiry`, `otpVerified`, `country`, `state`, `city`, `locationText`, `jobResponsibilities`) VALUES
(6, 9, 4, 'Senior Full-Stack Developer (MERN / Next.js)', 'senior-full-stack-developer-mern-nextjs', 'Web Developer', 'We are seeking a talented Full-Stack Developer to join our fast-growing product team sing Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page edit', '[\"React\",\"Next.js\",\"Node.js\",\"TypeScript\",\"PostgreSQL\",\"AWS\",\"Git\"]', 'full-time', 'hybrid', 'monthly', 'INR', 140000, 240000, 0, 4, 9, 2, 'day', '30-45 days', '[\"Health Insurance\",\"Flexible Hours\",\"Performance Bonus\",\"Learning Budget\"]', 'Bachelor\'s Degree', 'easy-apply', NULL, NULL, 'active', 0, '2026-03-30 00:00:00', '2026-02-28 10:37:46', '2026-02-28 10:42:00', NULL, NULL, 1, 'India', 'Karnataka', 'Bengaluru', 'Bengaluru, Karnataka (Koramangala)', '[\"One\",\"Two\",\"Oanejdejw\"]'),
(7, 10, 5, 'Stack Developer (MERN / Next.js)', 'stack-developer-mern-nextjs', 'Warehouse Associate', 'We are seeking a talented Full-Stack Developer to join our fast-growing product team...We are seeking a talented Full-Stack Developer to join our fast-growing product team...', '[\"React\",\"Next.js\",\"Node.js\",\"TypeScript\",\"PostgreSQL\",\"AWS\",\"Git\"]', 'full-time', 'hybrid', 'monthly', 'INR', 140000, 240000, 0, 4, 9, 2, 'day', '30-45 days', '[\"Health Insurance\",\"Flexible Hours\",\"Performance Bonus\",\"Learning Budget\"]', 'Bachelor\'s Degree', 'easy-apply', NULL, NULL, 'active', 0, '2026-03-30 00:00:00', '2026-02-28 12:33:51', '2026-02-28 12:34:00', NULL, NULL, 1, 'India', 'Karnataka', 'Bengaluru', 'Bengaluru, Karnataka (Koramangala)', '[\"One\",\"Two\"]'),
(8, 10, 5, '(MERN / Next.js)', 'mern-nextjs', 'Picker / Packer', 'We are seeking a talented Full-Stack Developer to join our fast-growing product team...We are seeking a talented Full-Stack Developer to join our fast-growing product team...', '[\"React\",\"Next.js\",\"Node.js\",\"TypeScript\",\"PostgreSQL\",\"AWS\",\"Git\"]', 'full-time', 'hybrid', 'monthly', 'INR', 140000, 240000, 0, 4, 9, 2, 'day', '30-45 days', '[\"Health Insurance\",\"Flexible Hours\",\"Performance Bonus\",\"Learning Budget\"]', 'Bachelor\'s Degree', 'easy-apply', NULL, NULL, 'active', 0, '2026-03-30 00:00:00', '2026-02-28 12:41:10', '2026-02-28 12:42:00', NULL, NULL, 1, 'India', 'Karnataka', 'Bengaluru', 'Bengaluru, Karnataka (Koramangala)', '[\"One\",\"Two\"]');

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` enum('applied','under_review','shortlisted','interview_stage','final_shortlist','selected','rejected','withdrawn') NOT NULL DEFAULT 'applied',
  `appliedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `shortlistedAt` datetime DEFAULT NULL,
  `shortlistedByAdminId` int(11) DEFAULT NULL,
  `sentToEmployerAt` datetime DEFAULT NULL,
  `employerDecisionAt` datetime DEFAULT NULL,
  `employerDecisionById` int(11) DEFAULT NULL,
  `employerDecisionComment` text DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `coverLetter` text DEFAULT NULL,
  `expectedSalary` int(11) DEFAULT NULL,
  `noticePeriod` varchar(255) DEFAULT NULL,
  `internalNotes` text DEFAULT NULL,
  `notesForCandidate` text DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `isSelected` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_applications`
--

INSERT INTO `job_applications` (`id`, `jobId`, `userId`, `status`, `appliedAt`, `shortlistedAt`, `shortlistedByAdminId`, `sentToEmployerAt`, `employerDecisionAt`, `employerDecisionById`, `employerDecisionComment`, `resume`, `coverLetter`, `expectedSalary`, `noticePeriod`, `internalNotes`, `notesForCandidate`, `rejectionReason`, `isSelected`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(2, 6, 4, 'applied', '2026-02-28 10:44:12', NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/UserCv/1772275451062-722199384.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-02-28 10:44:12', '2026-02-28 10:44:12', NULL),
(3, 6, 5, 'applied', '2026-02-28 12:30:35', NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/UserCv/1772281752703-946151644.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-02-28 12:30:35', '2026-02-28 12:30:35', NULL),
(4, 7, 4, 'applied', '2026-02-28 12:35:19', NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/UserCv/1772275451062-722199384.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-02-28 12:35:19', '2026-02-28 12:35:19', NULL),
(5, 8, 4, 'applied', '2026-02-28 12:42:25', NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/UserCv/1772275451062-722199384.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-02-28 12:42:25', '2026-02-28 12:42:25', NULL),
(6, 8, 7, 'applied', '2026-03-16 08:48:31', NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/UserCv/1773650720687-303411457.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-03-16 08:48:31', '2026-03-16 08:48:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `login_otps`
--

CREATE TABLE `login_otps` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `contactNumber` varchar(255) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `otpExpireTime` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_otps`
--

INSERT INTO `login_otps` (`id`, `userId`, `contactNumber`, `otp`, `otpExpireTime`, `isUsed`, `createdAt`, `updatedAt`) VALUES
(28, 8, '0982027665', '784242', '2026-02-24 07:53:22', 1, '2026-02-24 07:43:22', '2026-02-24 07:43:34'),
(29, 8, '0982027665', '467107', '2026-02-25 06:54:59', 1, '2026-02-25 06:44:59', '2026-02-25 06:45:06'),
(30, 3, '8287229430', '370517', '2026-02-25 12:08:39', 1, '2026-02-25 11:58:39', '2026-02-25 11:58:51'),
(31, 3, '8287229430', '570576', '2026-02-25 12:41:56', 1, '2026-02-25 12:31:56', '2026-02-25 12:32:05'),
(32, 3, '8287229430', '319069', '2026-02-26 05:19:20', 1, '2026-02-26 05:09:20', '2026-02-26 05:09:31'),
(33, 2, '9910909090', '264405', '2026-02-26 05:21:01', 1, '2026-02-26 05:11:01', '2026-02-26 05:11:10'),
(34, 2, '9910909090', '418146', '2026-02-26 05:21:36', 1, '2026-02-26 05:11:36', '2026-02-26 05:11:42'),
(35, 2, '9910909090', '815892', '2026-02-26 05:22:41', 1, '2026-02-26 05:12:41', '2026-02-26 05:12:52'),
(36, 2, '9910909090', '230384', '2026-02-26 05:25:13', 0, '2026-02-26 05:15:13', '2026-02-26 05:15:13'),
(37, 2, '9910909090', '717193', '2026-02-26 05:25:20', 1, '2026-02-26 05:15:20', '2026-02-26 05:15:24'),
(38, 2, '9910909090', '733228', '2026-02-26 05:29:53', 1, '2026-02-26 05:19:53', '2026-02-26 05:19:58'),
(39, 2, '9910909090', '477935', '2026-02-26 05:30:49', 1, '2026-02-26 05:20:49', '2026-02-26 05:20:54'),
(40, 2, '9910909090', '202995', '2026-02-26 05:32:04', 1, '2026-02-26 05:22:04', '2026-02-26 05:22:07'),
(41, 8, '0982027665', '438974', '2026-02-26 05:32:48', 1, '2026-02-26 05:22:48', '2026-02-26 05:22:54'),
(42, 2, '9910909090', '515649', '2026-02-26 05:37:04', 1, '2026-02-26 05:27:04', '2026-02-26 05:27:07'),
(43, 2, '9910909090', '698048', '2026-02-26 05:48:34', 1, '2026-02-26 05:38:34', '2026-02-26 05:38:39'),
(44, 1, '9876543210', '519411', '2026-02-26 06:16:38', 1, '2026-02-26 06:06:38', '2026-02-26 06:06:48'),
(45, 8, '0982027665', '872962', '2026-02-26 06:17:48', 1, '2026-02-26 06:07:48', '2026-02-26 06:07:51'),
(46, 1, '9876543210', '896735', '2026-02-26 06:35:57', 1, '2026-02-26 06:25:57', '2026-02-26 06:26:00'),
(47, 8, '0982027665', '259357', '2026-02-26 06:36:13', 1, '2026-02-26 06:26:13', '2026-02-26 06:26:18'),
(48, 3, '8287229430', '647280', '2026-02-26 08:10:16', 1, '2026-02-26 08:00:16', '2026-02-26 08:00:30'),
(49, 4, '7217619794', '123456', '2026-02-28 12:45:11', 1, '2026-02-28 12:35:11', '2026-02-28 12:35:15'),
(50, 6, '9540999909', '123456', '2026-03-13 05:31:49', 1, '2026-03-13 05:21:49', '2026-03-13 05:21:55'),
(51, 11, '9540999909', '123456', '2026-03-13 05:33:01', 1, '2026-03-13 05:23:01', '2026-03-13 05:23:04'),
(52, 11, '9540999909', '123456', '2026-03-16 06:03:50', 1, '2026-03-16 05:53:50', '2026-03-16 05:53:53'),
(53, 6, '9540999909', '123456', '2026-03-16 06:04:46', 1, '2026-03-16 05:54:46', '2026-03-16 05:54:52');

-- --------------------------------------------------------

--
-- Table structure for table `profile_details`
--

CREATE TABLE `profile_details` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `experience` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`experience`)),
  `educations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`educations`)),
  `profileImage` varchar(255) DEFAULT NULL,
  `percentageOfAccountComplete` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `noExperince` int(11) DEFAULT NULL,
  `headline` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile_details`
--

INSERT INTO `profile_details` (`id`, `userId`, `skills`, `experience`, `educations`, `profileImage`, `percentageOfAccountComplete`, `createdAt`, `updatedAt`, `noExperince`, `headline`) VALUES
(1, 1, '[\"React\",\"javascript\",\"node js\"]', '[{\"position\":\"Full Stack Developer\",\"company\":\"Hbs\",\"startDate\":\"2023-06\",\"endDate\":\"2026-07\",\"salary\":\"40000\",\"description\":\"Hello Bro How Are You\"}]', '[{\"degree\":\"BCA\",\"institute\":\"Rajeev Gandhi Inisutute\",\"startYear\":\"2022\",\"endYear\":\"2026\",\"grade\":\"8.9\",\"description\":\"Ok\"}]', '/uploads/profileimage/1771830514331-302217992.jpeg', 100, '2026-02-23 05:40:56', '2026-02-23 07:33:25', 0, 'Full Stack Developer'),
(2, 3, '[]', '[]', '[{\"degree\":\"BCA\",\"institute\":\"IGNOU\",\"startYear\":\"2022\",\"endYear\":\"2023\",\"grade\":\"9\",\"description\":\"Best Student\"}]', '/uploads/profileimage/1771833330628-136662659.png', 90, '2026-02-23 07:54:12', '2026-02-25 12:34:25', 1, 'Frontend Developer With hardworking'),
(3, 4, '[\"React\",\"Js\"]', '[{\"position\":\"Softwarre\",\"company\":\"Tech solutions\",\"startDate\":\"2023-07\",\"endDate\":\"2026-07\",\"salary\":\"12LPA\",\"description\":\"Res\"}]', '[{\"degree\":\"Btech\",\"institute\":\"DTA\",\"startYear\":\"2022\",\"endYear\":\"2024\",\"grade\":\"8.7\",\"description\":\"Des\"}]', '/uploads/profileimage/1772275526392-33174428.png', 100, '2026-02-28 10:43:50', '2026-02-28 10:46:38', 0, 'Mern stack'),
(4, 5, '[\"React\"]', '[{\"position\":\"uisusu\",\"company\":\"Tech\",\"startDate\":\"2026-02\",\"endDate\":\"2026-02\",\"salary\":\"5151\",\"description\":\"hello\"}]', '[]', '/uploads/profileimage/1772281749998-790695254.png', 80, '2026-02-28 12:28:24', '2026-02-28 12:30:12', 0, 'Full Stack Devloper'),
(5, 6, '[]', '[]', '[]', NULL, 20, '2026-03-05 08:02:12', '2026-03-05 08:02:20', NULL, NULL),
(6, 7, '[\"React\",\"javascript\"]', '[{\"position\":\"Softar engirr\",\"company\":\"Pooja Enterprises\",\"startDate\":\"2025-01\",\"endDate\":\"2026-03\",\"salary\":\"12LPA\",\"description\":\"Key \"}]', '[{\"degree\":\"B.Tech\",\"institute\":\"DTU\",\"startYear\":\"2022\",\"endYear\":\"2025\",\"grade\":\"8.7\",\"description\":\"Good\"}]', '/uploads/profileimage/1773650713159-226989588.png', 100, '2026-03-16 08:44:22', '2026-03-16 08:47:42', 0, 'Full stack developer');

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250225000001-create-job-applications.js'),
('20260219061501-create-users.js'),
('20260219061557-create-profile-details.js'),
('20260219071140-create-login-otps.js'),
('20260221103150-create-employers.js'),
('20260221103155-create-companies.js'),
('20260221103203-create-jobs.js'),
('20260221112327-update-companies-add-new-fields.js'),
('20260225064928-create-job-applications.js'),
('20260225081119-update-job.js'),
('20260225081342-add-otp-fields-to-jobs.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `contactNumber` varchar(255) NOT NULL,
  `emailAddress` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otpExpireTime` datetime DEFAULT NULL,
  `accountActive` tinyint(1) DEFAULT 0,
  `uploadedCv` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `role` varchar(1000) DEFAULT 'user',
  `profileDetailsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userName`, `contactNumber`, `emailAddress`, `password`, `otp`, `otpExpireTime`, `accountActive`, `uploadedCv`, `createdAt`, `updatedAt`, `role`, `profileDetailsId`) VALUES
(1, 'Anish Jha', '7217619793', 'anishjha896@gmail.com', '$2b$10$yZhpqKQnUvfDjb0QZYQC6OUYMRKOxyUyt/gz9vdQxzboykdm9uNqm', NULL, NULL, 1, '/uploads/UserCv/1771832407838-689238142.pdf', '2026-02-23 05:40:56', '2026-02-23 07:40:07', 'user', 1),
(3, 'Happy Coding', '8287229430', 'happycoding41@gmail.com', '$2b$10$a/3fwhL0jxhh5AEnZWVvoOVY8vU8I9imc8qO15glNdDDbGg5iJaz6', NULL, NULL, 1, '/uploads/UserCv/1772022865436-999665882.pdf', '2026-02-23 07:54:12', '2026-02-25 12:34:25', 'user', 2),
(4, 'ANITA KUMARI', '7217619794', 'anitakumari@gmail.com', '$2b$10$aIr.MNIhJsLtgok3hOHoouhS35Ap3yPTc6QF9uhNyeRQZrTXH8wuO', NULL, NULL, 1, '/uploads/UserCv/1772275451062-722199384.pdf', '2026-02-28 10:43:50', '2026-02-28 10:44:11', 'user', 3),
(5, 'Shivam Pal', '9876545678', 'coders@gmail.com', '$2b$10$y3yqBmdWmlZt.Rj0PJiDeOuPwW.iq/TBkWd7V0a6KA9Do9OBgzMoa', NULL, NULL, 1, '/uploads/UserCv/1772281752703-946151644.pdf', '2026-02-28 12:28:24', '2026-02-28 12:29:12', 'user', 4),
(6, 'Jitenda Kumar', '9540999909', 'jitendra@aptohr.com', '$2b$10$D6LzMAJeUODtI9HfXCpMleUfUzgvgVDq6K847PCr7nzLPe.OkB23i', NULL, NULL, 1, NULL, '2026-03-05 08:02:12', '2026-03-05 08:02:20', 'user', 5),
(7, 'sachin yadav', '7217619797', 'sachin@gmail.com', '$2b$10$ld5DFV6AjIHURX7yxfVvMu25Qgerlp3priFNnZ.Y.xNEzGwKa2Sdi', NULL, NULL, 1, '/uploads/UserCv/1773650720687-303411457.pdf', '2026-03-16 08:44:22', '2026-03-16 08:45:20', 'user', 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companies_employer_id` (`employerId`);

--
-- Indexes for table `employers`
--
ALTER TABLE `employers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employerContactNumber` (`employerContactNumber`),
  ADD UNIQUE KEY `employerEmail` (`employerEmail`),
  ADD KEY `employers_employer_email` (`employerEmail`),
  ADD KEY `employers_employer_contact_number` (`employerContactNumber`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `jobs_employer_id` (`employerId`),
  ADD KEY `jobs_company_id` (`companyId`),
  ADD KEY `jobs_slug` (`slug`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_applications_jobId_userId_unique` (`jobId`,`userId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `shortlistedByAdminId` (`shortlistedByAdminId`),
  ADD KEY `employerDecisionById` (`employerDecisionById`),
  ADD KEY `job_applications_status` (`status`),
  ADD KEY `job_applications_is_selected` (`isSelected`);

--
-- Indexes for table `login_otps`
--
ALTER TABLE `login_otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profile_details`
--
ALTER TABLE `profile_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `emailAddress` (`emailAddress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `employers`
--
ALTER TABLE `employers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `login_otps`
--
ALTER TABLE `login_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `profile_details`
--
ALTER TABLE `profile_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`employerId`) REFERENCES `employers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`employerId`) REFERENCES `employers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `job_applications_ibfk_3` FOREIGN KEY (`shortlistedByAdminId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `job_applications_ibfk_4` FOREIGN KEY (`employerDecisionById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `profile_details`
--
ALTER TABLE `profile_details`
  ADD CONSTRAINT `profile_details_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
