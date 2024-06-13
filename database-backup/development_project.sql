-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2024 at 12:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `development_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `area`
--

CREATE TABLE `area` (
  `areaID` int(10) NOT NULL,
  `area` varchar(30) NOT NULL,
  `availability` varchar(10) NOT NULL,
  `active` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `area`
--

INSERT INTO `area` (`areaID`, `area`, `availability`, `active`) VALUES
(1, 'Kahawatta', 'yes', 'yes'),
(2, 'Balangoda', 'yes', 'yes'),
(3, 'Embilipitiya', 'yes', 'yes'),
(9, 'Pelmadulla', 'yes', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `cash_sale`
--

CREATE TABLE `cash_sale` (
  `cash_saleID` int(10) NOT NULL,
  `paymentID` int(10) NOT NULL,
  `cash_amount` float NOT NULL,
  `balance` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cash_sale`
--

INSERT INTO `cash_sale` (`cash_saleID`, `paymentID`, `cash_amount`, `balance`) VALUES
(13, 153, 16000, 300),
(14, 159, 600, 0),
(15, 164, 1200, 100),
(16, 166, 7000, 849.89),
(17, 168, 1200, 50),
(18, 170, 9000, 600),
(19, 171, 1100, 50),
(20, 172, 1020, 0.8),
(23, 175, 600, 0),
(24, 176, 2000, 200);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `categoryID` int(10) NOT NULL,
  `category` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryID`, `category`) VALUES
(1, 'Chicken'),
(3, 'Pork'),
(4, 'Sausages'),
(5, 'Chicken Parts');

-- --------------------------------------------------------

--
-- Table structure for table `cheque_sale`
--

CREATE TABLE `cheque_sale` (
  `cheque_saleID` int(10) NOT NULL,
  `paymentID` int(10) NOT NULL,
  `cheque_number` int(100) NOT NULL,
  `cheque_value` float NOT NULL,
  `bank_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cheque_sale`
--

INSERT INTO `cheque_sale` (`cheque_saleID`, `paymentID`, `cheque_number`, `cheque_value`, `bank_name`) VALUES
(13, 160, 1, 600, 'h'),
(14, 161, 12, 600, 'hnb'),
(15, 162, 12, 1400, 'hnb'),
(16, 167, 12, 600, 'hnb'),
(17, 169, 1234, 1200, 'HNB');

-- --------------------------------------------------------

--
-- Table structure for table `credit_sale`
--

CREATE TABLE `credit_sale` (
  `credit_saleID` int(10) NOT NULL,
  `paymentID` int(10) NOT NULL,
  `credit_amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `credit_sale`
--

INSERT INTO `credit_sale` (`credit_saleID`, `paymentID`, `credit_amount`) VALUES
(107, 154, 1400),
(108, 155, 600),
(109, 156, 7000),
(110, 157, 1200),
(111, 158, 2400),
(112, 163, 600),
(113, 165, 600);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customerID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `shop_name` varchar(50) NOT NULL,
  `areaID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customerID`, `userID`, `shop_name`, `areaID`) VALUES
(15, 22, 'Keels Super', 2),
(16, 29, 'Kahawatta Grocery ', 1),
(17, 21, 'Sarathchandra Mart', 3),
(24, 51, 'Meat Super', 1);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expenseID` int(10) NOT NULL,
  `expense_name` varchar(50) NOT NULL,
  `amount` int(10) NOT NULL,
  `date` date NOT NULL,
  `ostaffID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventoryID` int(10) NOT NULL,
  `stock_arrival` int(10) NOT NULL,
  `supplierID` int(10) NOT NULL,
  `purchase_date` date NOT NULL,
  `expire_date` date NOT NULL,
  `productID` int(10) NOT NULL,
  `wstaffID` int(10) NOT NULL,
  `batch_no` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventoryID`, `stock_arrival`, `supplierID`, `purchase_date`, `expire_date`, `productID`, `wstaffID`, `batch_no`) VALUES
(39, 1000, 1, '2024-06-08', '2024-06-29', 145, 2, 1),
(40, 500, 3, '2024-06-08', '2024-06-29', 146, 2, 1),
(41, 100, 2, '2024-06-10', '2024-06-12', 150, 2, 1),
(42, 15, 3, '2024-06-12', '2024-12-10', 154, 2, 2),
(43, 3, 3, '2024-06-12', '2024-06-29', 154, 2, 3),
(44, 30, 1, '2024-06-13', '2024-06-29', 145, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `loading`
--

CREATE TABLE `loading` (
  `loadingID` int(10) NOT NULL,
  `repID` int(10) NOT NULL,
  `date` date NOT NULL,
  `vehicleID` int(10) NOT NULL,
  `total_value` float NOT NULL,
  `userID` int(11) NOT NULL,
  `loading_status` varchar(20) NOT NULL,
  `areaID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loading`
--

INSERT INTO `loading` (`loadingID`, `repID`, `date`, `vehicleID`, `total_value`, `userID`, `loading_status`, `areaID`) VALUES
(102, 1, '2024-06-11', 1, 18000, 15, 'completed', 1),
(103, 1, '2024-06-11', 1, 30000, 15, 'completed', 1);

-- --------------------------------------------------------

--
-- Table structure for table `loading_products`
--

CREATE TABLE `loading_products` (
  `loadingID` int(11) NOT NULL,
  `productID` int(10) NOT NULL,
  `quantity` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loading_products`
--

INSERT INTO `loading_products` (`loadingID`, `productID`, `quantity`) VALUES
(102, 145, 10),
(102, 149, 10),
(103, 145, 5),
(103, 149, 0);

-- --------------------------------------------------------

--
-- Table structure for table `officestaff`
--

CREATE TABLE `officestaff` (
  `ostaffID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `hired_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentID` int(10) NOT NULL,
  `payment_type` varchar(10) NOT NULL,
  `customerID` int(10) NOT NULL,
  `saleID` int(10) NOT NULL,
  `discount` float DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`paymentID`, `payment_type`, `customerID`, `saleID`, `discount`, `payment_status`) VALUES
(153, 'cash', 15, 178, 0, 'fully paid'),
(154, 'credit', 16, 179, 0, 'fully paid'),
(155, 'credit', 15, 180, 0, 'fully paid'),
(156, 'credit', 17, 181, 0, 'not paid'),
(157, 'credit', 15, 182, 0, 'fully paid'),
(158, 'credit', 15, 183, 0, 'not paid'),
(159, 'cash', 15, 184, 0, 'fully paid'),
(160, 'cheque', 16, 185, 0, 'fully paid'),
(161, 'cheque', 16, 186, 0, 'fully paid'),
(162, 'cheque', 15, 187, 0, 'fully paid'),
(163, 'credit', 15, 188, 0, 'not paid'),
(164, 'cash', 15, 189, 100, 'fully paid'),
(165, 'credit', 15, 190, 0, 'not paid'),
(166, 'cash', 15, 191, 149.89, 'fully paid'),
(167, 'cheque', 15, 192, 0, 'fully paid'),
(168, 'cash', 15, 193, 50, 'fully paid'),
(169, 'cheque', 15, 194, 0, 'fully paid'),
(170, 'cash', 15, 195, 0, 'fully paid'),
(171, 'cash', 17, 196, 0, 'fully paid'),
(172, 'cash', 16, 197, 0, 'fully paid'),
(175, 'cash', 15, 200, 0, 'fully paid'),
(176, 'cash', 15, 201, 0, 'fully paid');

-- --------------------------------------------------------

--
-- Table structure for table `payment_log`
--

CREATE TABLE `payment_log` (
  `logID` int(10) NOT NULL,
  `payment_type` varchar(10) NOT NULL,
  `amount` float NOT NULL,
  `customerID` int(10) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_log`
--

INSERT INTO `payment_log` (`logID`, `payment_type`, `amount`, `customerID`, `date`) VALUES
(4, 'cash', 1200, 15, '2024-06-12'),
(5, 'cash', 5000, 17, '2024-06-12'),
(6, 'cash', 2000, 15, '2024-06-13');

-- --------------------------------------------------------

--
-- Table structure for table `pre_order`
--

CREATE TABLE `pre_order` (
  `preorderID` int(10) NOT NULL,
  `total_value` float NOT NULL,
  `date` date NOT NULL,
  `customerID` int(10) NOT NULL,
  `pre_order_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pre_order`
--

INSERT INTO `pre_order` (`preorderID`, `total_value`, `date`, `customerID`, `pre_order_status`) VALUES
(35, 18000, '2024-06-11', 17, 'pending'),
(36, 6000, '2024-06-12', 15, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `pre_order_products`
--

CREATE TABLE `pre_order_products` (
  `preorderID` int(10) NOT NULL,
  `productID` int(10) NOT NULL,
  `quantity` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pre_order_products`
--

INSERT INTO `pre_order_products` (`preorderID`, `productID`, `quantity`) VALUES
(35, 145, 10),
(35, 149, 10),
(36, 149, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(10) NOT NULL,
  `product_name` varchar(30) NOT NULL,
  `stock_total` float NOT NULL,
  `categoryID` int(10) NOT NULL,
  `wholesale_price` float NOT NULL,
  `selling_price` float NOT NULL,
  `date_added` date NOT NULL,
  `image_path` varchar(100) NOT NULL,
  `supplierID` int(10) NOT NULL,
  `active` varchar(10) NOT NULL,
  `threshold` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `product_name`, `stock_total`, `categoryID`, `wholesale_price`, `selling_price`, `date_added`, `image_path`, `supplierID`, `active`, `threshold`) VALUES
(145, 'Full Chicken', 293, 1, 1000, 1200, '2024-06-11', 'uploads\\1718088532730-892716327.jpg', 1, 'yes', 10),
(146, 'Half Chicken', 41.9, 1, 800, 1000, '2024-06-11', 'uploads\\1718088560826-808800141.jpg', 1, 'yes', 10),
(147, 'Home Pack 400g', 92.544, 1, 500, 700, '2024-06-11', 'uploads\\1718088619294-278816751.jpg', 1, 'yes', 10),
(149, 'Quarter Chicken', 177.89, 1, 400, 600, '2024-06-11', 'uploads\\1718088678959-467655845.jpg', 1, 'yes', 10),
(150, 'Chicken Breast', 95, 5, 1000, 1300, '2024-06-11', 'uploads\\1718088735317-948981312.jpg', 1, 'yes', 10),
(151, 'Chicken Skinless', 98, 1, 1300, 1600, '2024-06-10', 'uploads\\1718088774786-461985344.jpg', 1, 'yes', 10),
(152, 'Chicken Gizzard', 5.7, 5, 500, 700, '2024-06-11', 'uploads\\1718088845795-821183960.jpg', 1, 'yes', 10),
(153, 'Precut', 19, 5, 800, 1100, '2024-06-11', 'uploads\\1718088891289-340293998.jpg', 1, 'yes', 10),
(154, 'Sasuage 500g', 53, 4, 800, 1000, '2024-06-11', 'uploads\\1718089036046-112750840.jpg', 3, 'yes', 10),
(156, 'Pork', 12, 3, 900, 1300, '2024-06-11', 'uploads\\1718089733590-979783119.jpg', 3, 'yes', 10),
(158, 'Chicken Thigs', 35, 5, 300, 500, '2024-06-11', 'uploads\\1718211816161-197890584.jpg', 2, 'yes', 10),
(159, 'Chicken Breast', 100, 5, 800, 1200, '2024-06-13', 'uploads\\1718211893797-749596178.jpg', 2, 'yes', 10);

-- --------------------------------------------------------

--
-- Table structure for table `productsale`
--

CREATE TABLE `productsale` (
  `saleID` int(10) NOT NULL,
  `productID` int(10) NOT NULL,
  `quantity` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productsale`
--

INSERT INTO `productsale` (`saleID`, `productID`, `quantity`) VALUES
(178, 145, 5),
(178, 150, 5),
(178, 151, 2),
(179, 147, 2),
(180, 149, 1),
(181, 145, 10),
(181, 149, 10),
(182, 145, 1),
(183, 145, 2),
(184, 149, 1),
(185, 149, 1),
(186, 149, 1),
(187, 147, 2),
(188, 149, 1),
(189, 149, 2),
(190, 149, 1),
(191, 145, 3),
(191, 146, 2),
(191, 147, 1),
(192, 149, 1),
(193, 145, 1),
(194, 145, 1),
(195, 145, 7),
(196, 147, 1.5),
(197, 147, 1.456),
(200, 149, 1),
(201, 149, 3);

-- --------------------------------------------------------

--
-- Table structure for table `request_products`
--

CREATE TABLE `request_products` (
  `requestID` int(10) NOT NULL,
  `productID` int(10) NOT NULL,
  `quantity` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_products`
--

INSERT INTO `request_products` (`requestID`, `productID`, `quantity`) VALUES
(31, 149, 10),
(32, 147, 40),
(32, 149, 10),
(33, 149, 1),
(34, 149, 1),
(35, 149, 2),
(36, 149, 1),
(37, 149, 1),
(38, 151, 1),
(39, 151, 1),
(40, 151, 1),
(41, 151, 1),
(42, 151, 1),
(43, 151, 1),
(44, 145, 30),
(44, 149, 50),
(44, 150, 10),
(45, 145, 30),
(45, 149, 50),
(45, 150, 10),
(46, 145, 30),
(46, 149, 50),
(46, 150, 10),
(47, 149, 1),
(48, 149, 1),
(49, 149, 1),
(50, 145, 2),
(50, 146, 2),
(50, 147, 3),
(50, 149, 3),
(50, 150, 2),
(50, 151, 3),
(50, 152, 4),
(50, 153, 2),
(54, 149, 4);

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `saleID` int(10) NOT NULL,
  `sale_amount` float NOT NULL,
  `payment_type` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `note` text DEFAULT NULL,
  `userID` int(10) DEFAULT NULL,
  `customerID` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`saleID`, `sale_amount`, `payment_type`, `date`, `note`, `userID`, `customerID`) VALUES
(178, 15700, 'cash', '2024-06-02', 'Your note here', 15, 15),
(179, 1400, 'credit', '2024-06-02', 'Your note here', 15, 16),
(180, 600, 'credit', '2024-06-02', 'Your note here', 12, 15),
(181, 18000, 'credit', '2024-06-06', 'Your note here', 32, 17),
(182, 1200, 'credit', '2024-06-06', 'Your note here', 32, 15),
(183, 2400, 'credit', '2024-06-08', 'Your note here', 32, 15),
(184, 600, 'cash', '2024-06-09', 'Your note here', 15, 15),
(185, 600, 'cheque', '2024-06-09', 'Your note here', 15, 16),
(186, 600, 'cheque', '2024-06-09', 'Your note here', 15, 16),
(187, 1400, 'cheque', '2024-06-10', 'Your note here', 15, 15),
(188, 600, 'credit', '2024-06-10', 'Your note here', 15, 15),
(189, 1200, 'cash', '2024-06-11', 'Your note here', 15, 15),
(190, 600, 'credit', '2024-06-11', 'Your note here', 15, 15),
(191, 6300, 'cash', '2024-06-11', 'Your note here', 15, 15),
(192, 600, 'cheque', '2024-06-12', 'Your note here', 15, 15),
(193, 1200, 'cash', '2024-06-12', 'Your note here', 32, 15),
(194, 1200, 'cheque', '2024-06-12', 'Your note here', 32, 15),
(195, 8400, 'cash', '2024-06-12', 'Your note here', 12, 15),
(196, 1050, 'cash', '2024-06-12', 'Your note here', 12, 17),
(197, 1019.2, 'cash', '2024-06-12', 'Your note here', 12, 16),
(200, 600, 'cash', '2024-06-12', 'Your note here', 12, 15),
(201, 1800, 'cash', '2024-06-13', 'Your note here', 12, 15);

-- --------------------------------------------------------

--
-- Table structure for table `salesrep`
--

CREATE TABLE `salesrep` (
  `repID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `hired_date` date NOT NULL,
  `availability` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salesrep`
--

INSERT INTO `salesrep` (`repID`, `userID`, `hired_date`, `availability`) VALUES
(1, 32, '2024-06-01', 'yes'),
(2, 14, '2024-06-01', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `stock_request`
--

CREATE TABLE `stock_request` (
  `requestID` int(1) NOT NULL,
  `date` date NOT NULL,
  `supplierID` int(10) NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_request`
--

INSERT INTO `stock_request` (`requestID`, `date`, `supplierID`, `notes`) VALUES
(31, '2024-06-11', 1, 'Need chicken parts also'),
(32, '2024-06-11', 1, 'Need chicken parts also'),
(33, '2024-06-11', 1, 'Need chicken parts also'),
(34, '2024-06-11', 1, 'Need chicken parts also'),
(35, '2024-06-11', 1, 'Need chicken parts also'),
(36, '2024-06-11', 1, 'Need chicken parts also'),
(37, '2024-06-11', 1, 'Need chicken parts also'),
(38, '2024-06-11', 1, 'Need chicken parts also'),
(39, '2024-06-11', 1, 'Need chicken parts also'),
(40, '2024-06-11', 1, 'Need chicken parts also'),
(41, '2024-06-11', 1, 'Need chicken parts also'),
(42, '2024-06-11', 1, 'Need chicken parts also'),
(43, '2024-06-11', 1, 'Need chicken parts also'),
(44, '2024-06-11', 1, 'Need chicken parts also'),
(45, '2024-06-12', 1, 'Need chicken parts also'),
(46, '2024-06-12', 1, 'Give me some updates about newly arrived products of your company'),
(47, '2024-06-12', 1, 'Need some new variants of chicken parts also'),
(48, '2024-06-12', 1, 'i need some chicken parts also'),
(49, '2024-06-12', 1, 'i need some chicken parts also'),
(50, '2024-06-12', 1, 'Need some new variants of chicken parts also'),
(54, '2024-06-13', 1, 'i need some chicken parts also');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplierID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `supplier_company` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplierID`, `userID`, `supplier_company`) VALUES
(1, 18, 'Crysbro'),
(2, 16, 'Tops Chicken'),
(3, 17, 'Nelna');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(10) NOT NULL,
  `usertypeID` int(10) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `address` text NOT NULL,
  `active` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `usertypeID`, `username`, `password`, `firstname`, `lastname`, `email`, `phone`, `address`, `active`) VALUES
(12, 1, 'shehan', '1234', 'Shehan', 'Chamudith', 'schamudith@gmail.com', '0774439693', 'Ratnapura', 'yes'),
(13, 2, 'achila', '1234', 'Achila', 'Dilshan', 'achila@gmail.com', '0767439893', 'Kandy', 'yes'),
(14, 3, 'zafry', '1234', 'Zafry', 'Mubharak', 'john.doe@example.com', '123456789', 'New York', 'yes'),
(15, 4, 'theeka', '1234', 'Theekshana', 'Fernando', 'jane.smith@example.com', '9876543210', 'Los Angeles', 'yes'),
(16, 5, 'Tops', '1234', 'Tops', 'Chicken', 'shehanchamuscc@gmail.com', '0887736782', 'Colombo', 'yes'),
(17, 5, 'Nelna', '1234', 'Nelna', 'Pork', 'shehanchamu@gmail.com', '0774439693', 'Colombo', 'yes'),
(18, 5, 'Crysbro', '1234', 'Crysbro', 'Chicken', 'ukshehanchamudith@gmail.com', '0774439693', 'Kahawatta', 'yes'),
(21, 6, 'spar', '1234', 'Spar', 'Supermarket', 'sparsuper@gmail.com', '0774439693', 'Dalugama,Kelaniya', 'yes'),
(22, 6, 'keels', '1234', 'Keels', 'Super', 'keels@gmail.com', '0775185791', 'Colombo', 'yes'),
(29, 6, 'kmart', '1234', 'Kelani', 'Mart', 'kelanimart@gmail.com', '0775185791', 'Dalugama', 'yes'),
(32, 3, 'aadil', '1234', 'Aadil', 'Nazli', 'aadil@gmail.com', '0774439693', 'Galle', 'yes'),
(38, 4, 'upeak', '1234', 'Upeak', 'Amiru', 'upeak@gmail.com', '0775185792', 'Panadura', 'yes'),
(50, 2, 'sudeera', '1234', 'Sudheera', 'Gamalath', 'sgamalath06@gmail.com', '0774439560', 'Padukka', 'yes'),
(51, 6, 'meat', '1234', 'Meat', 'Super', 'meat@gmail.com', '0774439645', 'Pelmadulla', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `usertypeID` int(10) NOT NULL,
  `usertype_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`usertypeID`, `usertype_name`) VALUES
(1, 'Admin'),
(2, 'Office'),
(3, 'SalesRep'),
(4, 'Warehouse'),
(5, 'Supplier'),
(6, 'Customer');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicleID` int(10) NOT NULL,
  `vehicle_number` varchar(15) NOT NULL,
  `availability` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`vehicleID`, `vehicle_number`, `availability`) VALUES
(1, 'LA-9999', 'yes'),
(2, 'LD-8888', 'yes'),
(3, 'LA-7777', 'yes'),
(4, 'LC-4556', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `warehousestaff`
--

CREATE TABLE `warehousestaff` (
  `wstaffID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `hired_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehousestaff`
--

INSERT INTO `warehousestaff` (`wstaffID`, `userID`, `hired_date`) VALUES
(2, 15, '2024-05-01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`areaID`);

--
-- Indexes for table `cash_sale`
--
ALTER TABLE `cash_sale`
  ADD PRIMARY KEY (`cash_saleID`),
  ADD KEY `paymentID` (`paymentID`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `cheque_sale`
--
ALTER TABLE `cheque_sale`
  ADD PRIMARY KEY (`cheque_saleID`),
  ADD KEY `paymentID` (`paymentID`);

--
-- Indexes for table `credit_sale`
--
ALTER TABLE `credit_sale`
  ADD PRIMARY KEY (`credit_saleID`),
  ADD KEY `paymentID` (`paymentID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customerID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `areaID` (`areaID`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expenseID`),
  ADD KEY `ostaffID` (`ostaffID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventoryID`),
  ADD KEY `productID` (`productID`),
  ADD KEY `supplierID` (`supplierID`),
  ADD KEY `wstaffID` (`wstaffID`);

--
-- Indexes for table `loading`
--
ALTER TABLE `loading`
  ADD PRIMARY KEY (`loadingID`),
  ADD KEY `repID` (`repID`),
  ADD KEY `vehicleID` (`vehicleID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `areaID` (`areaID`);

--
-- Indexes for table `loading_products`
--
ALTER TABLE `loading_products`
  ADD PRIMARY KEY (`loadingID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `officestaff`
--
ALTER TABLE `officestaff`
  ADD PRIMARY KEY (`ostaffID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentID`),
  ADD KEY `customerID` (`customerID`),
  ADD KEY `saleID` (`saleID`);

--
-- Indexes for table `payment_log`
--
ALTER TABLE `payment_log`
  ADD PRIMARY KEY (`logID`),
  ADD KEY `customerID` (`customerID`);

--
-- Indexes for table `pre_order`
--
ALTER TABLE `pre_order`
  ADD PRIMARY KEY (`preorderID`),
  ADD KEY `customerID` (`customerID`);

--
-- Indexes for table `pre_order_products`
--
ALTER TABLE `pre_order_products`
  ADD PRIMARY KEY (`preorderID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indexes for table `productsale`
--
ALTER TABLE `productsale`
  ADD PRIMARY KEY (`saleID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `request_products`
--
ALTER TABLE `request_products`
  ADD PRIMARY KEY (`requestID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`saleID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `customerID` (`customerID`);

--
-- Indexes for table `salesrep`
--
ALTER TABLE `salesrep`
  ADD PRIMARY KEY (`repID`),
  ADD KEY `salesrep_ibfk_1` (`userID`);

--
-- Indexes for table `stock_request`
--
ALTER TABLE `stock_request`
  ADD PRIMARY KEY (`requestID`),
  ADD KEY `supplierID` (`supplierID`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplierID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `usertypeID` (`usertypeID`);

--
-- Indexes for table `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`usertypeID`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  ADD PRIMARY KEY (`wstaffID`),
  ADD KEY `userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `area`
--
ALTER TABLE `area`
  MODIFY `areaID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cash_sale`
--
ALTER TABLE `cash_sale`
  MODIFY `cash_saleID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cheque_sale`
--
ALTER TABLE `cheque_sale`
  MODIFY `cheque_saleID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `credit_sale`
--
ALTER TABLE `credit_sale`
  MODIFY `credit_saleID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customerID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expenseID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventoryID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `loading`
--
ALTER TABLE `loading`
  MODIFY `loadingID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `officestaff`
--
ALTER TABLE `officestaff`
  MODIFY `ostaffID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `payment_log`
--
ALTER TABLE `payment_log`
  MODIFY `logID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pre_order`
--
ALTER TABLE `pre_order`
  MODIFY `preorderID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `saleID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT for table `salesrep`
--
ALTER TABLE `salesrep`
  MODIFY `repID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stock_request`
--
ALTER TABLE `stock_request`
  MODIFY `requestID` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplierID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `usertypeID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicleID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  MODIFY `wstaffID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cash_sale`
--
ALTER TABLE `cash_sale`
  ADD CONSTRAINT `cash_sale_ibfk_1` FOREIGN KEY (`paymentID`) REFERENCES `payment` (`paymentID`);

--
-- Constraints for table `cheque_sale`
--
ALTER TABLE `cheque_sale`
  ADD CONSTRAINT `cheque_sale_ibfk_1` FOREIGN KEY (`paymentID`) REFERENCES `payment` (`paymentID`);

--
-- Constraints for table `credit_sale`
--
ALTER TABLE `credit_sale`
  ADD CONSTRAINT `credit_sale_ibfk_1` FOREIGN KEY (`paymentID`) REFERENCES `payment` (`paymentID`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `customer_ibfk_2` FOREIGN KEY (`areaID`) REFERENCES `area` (`areaID`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`ostaffID`) REFERENCES `officestaff` (`ostaffID`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`),
  ADD CONSTRAINT `inventory_ibfk_3` FOREIGN KEY (`wstaffID`) REFERENCES `warehousestaff` (`wstaffID`);

--
-- Constraints for table `loading`
--
ALTER TABLE `loading`
  ADD CONSTRAINT `loading_ibfk_1` FOREIGN KEY (`repID`) REFERENCES `salesrep` (`repID`),
  ADD CONSTRAINT `loading_ibfk_2` FOREIGN KEY (`vehicleID`) REFERENCES `vehicle` (`vehicleID`),
  ADD CONSTRAINT `loading_ibfk_3` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `loading_ibfk_4` FOREIGN KEY (`areaID`) REFERENCES `area` (`areaID`);

--
-- Constraints for table `loading_products`
--
ALTER TABLE `loading_products`
  ADD CONSTRAINT `loading_products_ibfk_1` FOREIGN KEY (`loadingID`) REFERENCES `loading` (`loadingID`),
  ADD CONSTRAINT `loading_products_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`);

--
-- Constraints for table `officestaff`
--
ALTER TABLE `officestaff`
  ADD CONSTRAINT `officestaff_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`),
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`saleID`) REFERENCES `sale` (`saleID`);

--
-- Constraints for table `payment_log`
--
ALTER TABLE `payment_log`
  ADD CONSTRAINT `payment_log_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`);

--
-- Constraints for table `pre_order`
--
ALTER TABLE `pre_order`
  ADD CONSTRAINT `pre_order_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`);

--
-- Constraints for table `pre_order_products`
--
ALTER TABLE `pre_order_products`
  ADD CONSTRAINT `pre_order_products_ibfk_1` FOREIGN KEY (`preorderID`) REFERENCES `pre_order` (`preorderID`),
  ADD CONSTRAINT `pre_order_products_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_3` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`);

--
-- Constraints for table `productsale`
--
ALTER TABLE `productsale`
  ADD CONSTRAINT `productsale_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `productsale_ibfk_2` FOREIGN KEY (`saleID`) REFERENCES `sale` (`saleID`);

--
-- Constraints for table `request_products`
--
ALTER TABLE `request_products`
  ADD CONSTRAINT `request_products_ibfk_1` FOREIGN KEY (`requestID`) REFERENCES `stock_request` (`requestID`),
  ADD CONSTRAINT `request_products_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`);

--
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `sale_ibfk_4` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`);

--
-- Constraints for table `salesrep`
--
ALTER TABLE `salesrep`
  ADD CONSTRAINT `salesrep_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `stock_request`
--
ALTER TABLE `stock_request`
  ADD CONSTRAINT `stock_request_ibfk_1` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`);

--
-- Constraints for table `supplier`
--
ALTER TABLE `supplier`
  ADD CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`usertypeID`) REFERENCES `usertype` (`usertypeID`);

--
-- Constraints for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  ADD CONSTRAINT `warehousestaff_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
