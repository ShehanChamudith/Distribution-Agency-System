-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2024 at 04:54 PM
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
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customerID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `area` varchar(30) NOT NULL,
  `shop_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customerID`, `userID`, `area`, `shop_name`) VALUES
(1, 21, 'Kelaniya', 'Spar Super Market'),
(2, 22, 'Colombo', 'Keels Super'),
(5, 25, 'w', '');

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
  `batch_no` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventoryID`, `stock_arrival`, `supplierID`, `purchase_date`, `expire_date`, `productID`, `wstaffID`, `batch_no`) VALUES
(25, 20, 1, '2024-05-01', '2024-05-31', 35, 2, 1),
(26, 30, 3, '2024-04-15', '2024-05-31', 90, 2, 2),
(27, 20, 3, '2024-05-14', '2024-05-31', 91, 2, 3),
(30, 30, 2, '2024-05-15', '2024-05-31', 93, 2, 4),
(32, 70, 1, '2024-05-16', '2024-05-31', 97, 2, 5),
(34, 100, 3, '2024-05-16', '2024-05-31', 95, 2, 6),
(35, 5, 3, '2024-05-16', '2024-05-31', 136, 2, 8),
(36, 5, 1, '2024-05-03', '2024-06-06', 136, 2, 5);

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
  `payment_type` int(10) NOT NULL,
  `customerID` int(10) NOT NULL,
  `saleID` int(10) NOT NULL,
  `payment_amount` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pre_order`
--

CREATE TABLE `pre_order` (
  `preorderID` int(10) NOT NULL,
  `quantity` int(10) NOT NULL,
  `pre_order_amount` int(10) NOT NULL,
  `date` date NOT NULL,
  `productID` int(10) NOT NULL,
  `customerID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(10) NOT NULL,
  `product_name` varchar(30) NOT NULL,
  `stock_total` int(10) NOT NULL,
  `categoryID` int(10) NOT NULL,
  `wholesale_price` int(10) NOT NULL,
  `selling_price` int(10) NOT NULL,
  `date_added` date NOT NULL,
  `image_path` varchar(100) NOT NULL,
  `supplierID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `product_name`, `stock_total`, `categoryID`, `wholesale_price`, `selling_price`, `date_added`, `image_path`, `supplierID`) VALUES
(35, 'Full Chicken', 87, 1, 1200, 1450, '2024-05-04', 'uploads\\1715540975512-zedge profile.png', 2),
(90, 'Pork 400g Pack', 230, 3, 200, 300, '2024-04-30', 'uploads\\1715540975512-zedge profile.png', 1),
(91, 'Sausages', 220, 4, 300, 500, '2024-05-08', 'uploads\\1715540975512-zedge profile.png', 3),
(93, 'Chicken Breast', 230, 1, 200, 600, '2024-05-01', 'uploads\\1715540975512-zedge profile.png', 2),
(95, 'Sausage Catering', 100, 4, 450, 800, '2024-04-30', 'uploads\\1715540975512-zedge profile.png', 3),
(97, 'Half Chicken', 70, 1, 200, 300, '2024-05-09', 'uploads\\1715540975512-zedge profile.png', 2),
(98, 'Drumsticks', 0, 5, 20, 40, '2024-05-08', 'uploads/1715540975512-zedge profile.png', 2),
(136, 'Pork 1kg Pack', 10, 3, 200, 300, '2024-05-16', 'uploads\\1715948155175-134684008.jpg', 3);

-- --------------------------------------------------------

--
-- Table structure for table `productsale`
--

CREATE TABLE `productsale` (
  `saleID` int(10) NOT NULL,
  `productID` int(10) NOT NULL,
  `quantity` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `saleID` int(10) NOT NULL,
  `sale_amount` int(10) NOT NULL,
  `payment_type` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `note` text NOT NULL,
  `userID` int(10) NOT NULL,
  `wstaffID` int(10) NOT NULL,
  `repID` int(10) NOT NULL,
  `customerID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salesrep`
--

CREATE TABLE `salesrep` (
  `repID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `hired_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 18, 'Tops Chicken'),
(2, 16, 'Crysbro'),
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
  `address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `usertypeID`, `username`, `password`, `firstname`, `lastname`, `email`, `phone`, `address`) VALUES
(12, 1, 'shehan', '1234', 'Shehan', 'Chamudith', 'schamudith@gmail.com', '0774439693', 'Ratnapura'),
(13, 2, 'achila', '4567', 'Achila', 'Dilshan', 'achila@gmail.com', '0767439893', 'Kandy'),
(14, 3, 'john_doe', 'password123', 'John', 'Doe', 'john.doe@example.com', '1234567890', 'New York'),
(15, 4, 'jane_smith', 'password456', 'Jane', 'Smith', 'jane.smith@example.com', '9876543210', 'Los Angeles'),
(16, 5, 'Crysbro', 'pw123', 'Crysbro', 'Chicken', 'abc@gmail.com', '0887736782', 'Colombo'),
(17, 5, 'Nelna', '1234', 'Nelna', 'Pork', 'def@gmail.com', '0774439693', 'Colombo'),
(18, 5, 'Tops', 'tops123', 'Tops', 'Chicken', 'tops@gmail.com', '0774439693', 'Kahawatta'),
(21, 6, 'spar', '$2b$10$d6qeTLWpXtImgb3QHpUdb.UI6V7TutCNaCbSp204cHYxV3s2QuHK2', 'Spar', 'Supermarket', 'sparsuper@gmail.com', '0774439693', 'Dalugama,Kelaniya'),
(22, 6, 'keels', '$2b$10$fjAS2TROghptBO.qcDwJFOKM4Q85w/aIIl5YFMb5GJeXhVy7zg.UK', 'Keels', 'Super', 'keels@gmail.com', '0775185791', 'Colombo'),
(25, 6, 'w', '$2b$10$wpCCa2tthn2393zUppumZ.YECJ2YpuOz5FRidMuZJJMcYyuI.PbEi', 'w', 'w', 'ww@d', '0775185791', 'Colombo');

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
(1, 'admin'),
(2, 'office'),
(3, 'salesRep'),
(4, 'warehouse'),
(5, 'supplier'),
(6, 'customer');

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
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customerID`),
  ADD KEY `userID` (`userID`);

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
-- Indexes for table `pre_order`
--
ALTER TABLE `pre_order`
  ADD PRIMARY KEY (`preorderID`),
  ADD KEY `customerID` (`customerID`);

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
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`saleID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `wstaffID` (`wstaffID`),
  ADD KEY `repID` (`repID`),
  ADD KEY `customerID` (`customerID`);

--
-- Indexes for table `salesrep`
--
ALTER TABLE `salesrep`
  ADD PRIMARY KEY (`repID`),
  ADD KEY `salesrep_ibfk_1` (`userID`);

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
-- Indexes for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  ADD PRIMARY KEY (`wstaffID`),
  ADD KEY `userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customerID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expenseID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventoryID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `officestaff`
--
ALTER TABLE `officestaff`
  MODIFY `ostaffID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pre_order`
--
ALTER TABLE `pre_order`
  MODIFY `preorderID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `saleID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salesrep`
--
ALTER TABLE `salesrep`
  MODIFY `repID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplierID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `usertypeID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  MODIFY `wstaffID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

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
-- Constraints for table `pre_order`
--
ALTER TABLE `pre_order`
  ADD CONSTRAINT `pre_order_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`);

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
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `sale_ibfk_2` FOREIGN KEY (`wstaffID`) REFERENCES `warehousestaff` (`wstaffID`),
  ADD CONSTRAINT `sale_ibfk_3` FOREIGN KEY (`repID`) REFERENCES `salesrep` (`repID`),
  ADD CONSTRAINT `sale_ibfk_4` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`);

--
-- Constraints for table `salesrep`
--
ALTER TABLE `salesrep`
  ADD CONSTRAINT `salesrep_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

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
