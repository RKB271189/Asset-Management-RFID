-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2020 at 10:59 AM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `relcon_tag_scanner`
--

-- --------------------------------------------------------

--
-- Table structure for table `assetmaster`
--

CREATE TABLE `assetmaster` (
  `Id` bigint(20) NOT NULL,
  `Asset_Code` varchar(100) DEFAULT NULL,
  `Asset_Type` int(11) DEFAULT NULL,
  `Asset_Type_Code` varchar(50) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `Site_Code` varchar(50) DEFAULT NULL,
  `Tag_Id` varchar(50) DEFAULT NULL,
  `Tag_Status` tinyint(4) DEFAULT NULL,
  `Serial_Number` varchar(100) DEFAULT NULL,
  `Model_Number` varchar(100) DEFAULT NULL,
  `Create_Date` datetime DEFAULT NULL,
  `Modify_Date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assetmaster`
--

INSERT INTO `assetmaster` (`Id`, `Asset_Code`, `Asset_Type`, `Asset_Type_Code`, `Description`, `Site_Code`, `Tag_Id`, `Tag_Status`, `Serial_Number`, `Model_Number`, `Create_Date`, `Modify_Date`) VALUES
(4, '10052', 1001, NULL, 'Dispenser Glibarco Surefill', 'SITECODE', '152265844785', 0, 'MKI00978HJJ5t99', 'GHY890IOP89KI0', '2020-05-23 12:13:28', '2020-05-23 12:13:28'),
(5, '10062', 1001, NULL, 'Dispenser Glibarco Surefill', 'SITECODE', '152265844786', 0, 'MKI00978HJJ5t95', 'GHY890IOP89KI1', '2020-05-23 12:23:07', '2020-05-23 12:23:07'),
(6, '10072', 1002, NULL, 'TP thermal printer', 'SITECODE', '152265844789', 0, 'MKI00978HJJ5T98', 'GHY890IOP89KI52', '2020-05-23 12:23:53', '2020-05-23 12:23:53'),
(8, '10051', 1002, NULL, 'TP thermal printer -9001', 'SITECODE', '152265844785', 0, 'MKI00978HJJ5t99', 'GHY890IOP89KI1', '2020-05-23 14:49:24', '2020-05-23 14:49:24'),
(9, '10078', 1003, NULL, 'Fore Cort Controller (FCC)', 'SITE5568', '152265844781', 0, 'MKI00978HJJ5t90', 'GHY890IOP89KI9', '2020-05-25 14:13:00', '2020-05-25 14:13:00'),
(11, '10058', 1002, NULL, 'Metallic Thermal Printer With LCD Display', 'SITE5568', '190JHYU90OKJ', 0, 'KLO0KJS7U8I9', 'GHY890IOP89KI1', '2020-05-26 09:47:42', '2020-05-26 09:47:42'),
(12, '10087', 1003, NULL, 'Grey Fore Court Controller Dual', 'SITECODE', '15226584478511WE', 0, 'QSPLOI90K5654SSD', 'MN5265DS2ASSA55', '2020-05-26 10:21:44', '2020-05-26 10:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `rolelist`
--

CREATE TABLE `rolelist` (
  `Id` int(11) NOT NULL,
  `Role_Type` varchar(50) DEFAULT NULL,
  `Role_Name` varchar(50) DEFAULT NULL,
  `Role_Access` varchar(100) DEFAULT NULL,
  `Role_Code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rolelist`
--

INSERT INTO `rolelist` (`Id`, `Role_Type`, `Role_Name`, `Role_Access`, `Role_Code`) VALUES
(1, 'Engineer', 'Site Engineer', NULL, 1),
(2, 'Warehouse', 'WareHouse', NULL, 2),
(8, 'Admin', 'Administration', NULL, 3),
(9, 'Filed Engineer', 'Tracker', NULL, 4),
(10, 'Officer', 'Official Men', NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `sitemaster`
--

CREATE TABLE `sitemaster` (
  `Id` bigint(20) NOT NULL,
  `Site_Code` varchar(50) DEFAULT NULL,
  `Site_Name` varchar(50) DEFAULT NULL,
  `State` varchar(50) DEFAULT NULL,
  `City` varchar(50) DEFAULT NULL,
  `Region` varchar(50) DEFAULT NULL,
  `District` varchar(50) DEFAULT NULL,
  `Zone` varchar(50) DEFAULT NULL,
  `Address1` varchar(50) DEFAULT NULL,
  `Address2` varchar(50) DEFAULT NULL,
  `Create_Date` datetime DEFAULT NULL,
  `Modify_Date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sitemaster`
--

INSERT INTO `sitemaster` (`Id`, `Site_Code`, `Site_Name`, `State`, `City`, `Region`, `District`, `Zone`, `Address1`, `Address2`, `Create_Date`, `Modify_Date`) VALUES
(4, 'SITE5568', 'RELCON LAB', 'GUJARAT', 'VADODARA', 'GUJARAT', 'VADODARA', 'WEST', 'Everest Hub', 'Narayan Garden', '2020-05-25 13:43:40', '2020-05-25 13:43:40'),
(5, 'SITECODE', 'RELCON LAB TEST', 'VADODARA', 'BARODA', 'GUJARAT', 'VADODARA', 'WEST ', 'test-1', 'test-2', '2020-05-26 10:20:44', '2020-05-26 10:20:44');

-- --------------------------------------------------------

--
-- Table structure for table `tagevent`
--

CREATE TABLE `tagevent` (
  `Id` bigint(20) NOT NULL,
  `Asset_Id` bigint(20) DEFAULT NULL,
  `Tag_Id` varchar(50) DEFAULT NULL,
  `User_Id` bigint(20) DEFAULT NULL,
  `Generate_Time` datetime DEFAULT NULL,
  `Modify_Time` datetime DEFAULT NULL,
  `Site_Code` varchar(50) DEFAULT NULL,
  `Longitude` decimal(11,8) DEFAULT NULL,
  `Latitude` decimal(10,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tagevent`
--

INSERT INTO `tagevent` (`Id`, `Asset_Id`, `Tag_Id`, `User_Id`, `Generate_Time`, `Modify_Time`, `Site_Code`, `Longitude`, `Latitude`) VALUES
(1, 11, '190JHYU90OKJ', 5, '2020-05-26 11:04:44', '2020-05-26 11:04:44', 'SITE5568', '73.13000000', '0.99999999'),
(2, 9, '152265844781', 5, '2020-05-26 11:17:18', '2020-05-26 11:17:18', 'SITE5568', '0.99999999', '0.99999999'),
(3, 11, '190JHYU90OKJ', 5, '2020-05-26 11:36:50', '2020-05-26 11:36:50', 'SITE5568', '0.99999999', '0.99999999'),
(4, 11, '190JHYU90OKJ', 5, '2020-05-26 11:39:14', '2020-05-26 11:39:14', 'SITE5568', '0.99999999', '0.99999999'),
(5, 9, '152265844781', 5, '2020-05-26 11:43:43', '2020-05-26 11:43:43', 'SITE5568', '0.99999999', '0.99999999'),
(6, 9, '152265844781', 5, '2020-05-26 11:46:31', '2020-05-26 11:46:31', 'SITE5568', '0.99999999', '0.99999999'),
(7, 9, '152265844781', 5, '2020-05-26 12:39:46', '2020-05-26 12:39:46', 'SITE5568', '0.99999999', '0.99999999'),
(8, 11, '190JHYU90OKJ', 5, '2020-05-26 12:44:00', '2020-05-26 12:44:00', 'SITE5568', '0.99999999', '0.99999999'),
(9, 9, '152265844781', 5, '2020-05-26 12:47:58', '2020-05-26 12:47:58', 'SITE5568', '0.99999999', '0.99999999'),
(10, 9, '152265844781', 5, '2020-05-26 12:49:45', '2020-05-26 12:49:45', 'SITE5568', '0.99999999', '0.99999999'),
(11, 9, '152265844781', 5, '2020-05-26 12:52:34', '2020-05-26 12:52:34', 'SITE5568', '0.99999999', '0.99999999'),
(12, 9, '152265844781', 5, '2020-05-26 12:56:59', '2020-05-26 12:56:59', 'SITE5568', '0.99999999', '0.99999999'),
(13, 9, '152265844781', 5, '2020-05-26 13:31:37', '2020-05-26 13:31:37', 'SITE5568', '73.13422560', '22.32753370'),
(14, 11, '190JHYU90OKJ', 5, '2020-05-26 13:31:45', '2020-05-26 13:31:45', 'SITE5568', '73.13422560', '22.32753370');

-- --------------------------------------------------------

--
-- Table structure for table `tagtracking`
--

CREATE TABLE `tagtracking` (
  `Id` bigint(20) NOT NULL,
  `Track_Time` datetime DEFAULT NULL,
  `Site_Code` varchar(50) DEFAULT NULL,
  `Asset_Id` bigint(50) DEFAULT NULL,
  `Asset_Code` varchar(100) DEFAULT NULL,
  `Tag_Id` varchar(50) DEFAULT NULL,
  `User_Id` bigint(20) DEFAULT NULL,
  `Latitude` decimal(10,8) DEFAULT NULL,
  `Longitude` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `typemaster`
--

CREATE TABLE `typemaster` (
  `Id` bigint(20) NOT NULL,
  `Type_Code` varchar(50) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `typemaster`
--

INSERT INTO `typemaster` (`Id`, `Type_Code`, `Description`) VALUES
(3, '1001', 'Dispenser(DU)'),
(4, '1002', 'Thermal Printer(TP)'),
(6, '1003', 'Fore Cort Controller (FCC)');

-- --------------------------------------------------------

--
-- Table structure for table `usermaster`
--

CREATE TABLE `usermaster` (
  `User_Id` bigint(20) NOT NULL,
  `Login_Id` varchar(50) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `Email_Id` varchar(100) DEFAULT NULL,
  `Mobile_No` bigint(20) DEFAULT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) DEFAULT NULL,
  `Role_Id` int(11) DEFAULT NULL,
  `Is_Active` tinyint(4) DEFAULT NULL,
  `Create_Date` datetime DEFAULT NULL,
  `Modify_Date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usermaster`
--

INSERT INTO `usermaster` (`User_Id`, `Login_Id`, `Password`, `Email_Id`, `Mobile_No`, `First_Name`, `Last_Name`, `Role_Id`, `Is_Active`, `Create_Date`, `Modify_Date`) VALUES
(5, 'Relcon', 'relcon123', 'rahul.baraiya05@gmail.com', 9427412789, 'fsdfsdf', 'sdfsdfdsf', 1, 1, '2020-05-20 14:52:12', '2020-05-20 14:52:12'),
(6, 'Relcon_1', 'relcon123', 'rahul.baraiya@gmail.com', 9426470009, 'Relcon ', 'Lab', 1, 1, '2020-05-21 17:07:32', '2020-05-21 17:07:32'),
(17, 'Rahul', 'relcon123', 'asdasdasdasdasdasd', 9426478952, 'Rahul', 'Baraiya', 1, 1, '2020-05-23 10:44:35', '2020-05-23 10:44:35'),
(18, 'Relcon1232', 'relcon123', 'xyz.hu@gmail.com', 9427412782, 'Rahul', 'Baraiya', 2, 1, '2020-05-23 10:48:56', '2020-05-23 10:48:56'),
(19, 'Relcon1212', 'relcon123', 'abc.hu@gmail.xio', 5685984584, 'Rahul', 'Baraiya', 1, 1, '2020-05-23 10:51:00', '2020-05-23 10:51:00'),
(20, 'ahbbvd', 'relcon123', 'asdasdasd@gmail.com', 2545565895, 'Rahul', 'Baraiya', 2, 1, '2020-05-23 10:51:38', '2020-05-23 10:51:38'),
(21, 'reqqq', 'erq1231', 'rah.ba@gmail.com', 8596478596, 'Rahul', 'Baraiya', 2, 1, '2020-05-25 13:35:51', '2020-05-25 13:35:51'),
(22, 'Admin', 'admin@123', 'rah.ba@yahoo.com', 9425586656, 'Administrator', 'Admin', 3, 1, '2020-05-25 15:17:36', '2020-05-25 15:17:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assetmaster`
--
ALTER TABLE `assetmaster`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Asset_Code` (`Asset_Code`);

--
-- Indexes for table `rolelist`
--
ALTER TABLE `rolelist`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `sitemaster`
--
ALTER TABLE `sitemaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tagevent`
--
ALTER TABLE `tagevent`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tagtracking`
--
ALTER TABLE `tagtracking`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `typemaster`
--
ALTER TABLE `typemaster`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Type_Code` (`Type_Code`);

--
-- Indexes for table `usermaster`
--
ALTER TABLE `usermaster`
  ADD PRIMARY KEY (`User_Id`),
  ADD UNIQUE KEY `Login_Id` (`Login_Id`),
  ADD UNIQUE KEY `Email_Id` (`Email_Id`),
  ADD UNIQUE KEY `Mobile_No` (`Mobile_No`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assetmaster`
--
ALTER TABLE `assetmaster`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `rolelist`
--
ALTER TABLE `rolelist`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sitemaster`
--
ALTER TABLE `sitemaster`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tagevent`
--
ALTER TABLE `tagevent`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tagtracking`
--
ALTER TABLE `tagtracking`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typemaster`
--
ALTER TABLE `typemaster`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `usermaster`
--
ALTER TABLE `usermaster`
  MODIFY `User_Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
