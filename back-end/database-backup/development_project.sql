-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2024 at 12:05 PM
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
  `area` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `wstaffID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `date_added` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `product_name`, `stock_total`, `categoryID`, `wholesale_price`, `selling_price`, `date_added`) VALUES
(35, 'Full chicken', 1000, 1, 1300, 1450, '2024-05-04'),
(90, 'Pork 400g', 0, 3, 200, 300, '2024-05-01'),
(91, 'Sausages', 0, 4, 300, 500, '2024-05-08'),
(93, 'Chicken Breast', 0, 5, 200, 600, '2024-05-03');

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
(1, 1, 'Crysbro');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(10) NOT NULL,
  `usertype` varchar(20) NOT NULL,
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

INSERT INTO `user` (`userID`, `usertype`, `username`, `password`, `firstname`, `lastname`, `email`, `phone`, `address`) VALUES
(1, 'admin', 'abc', '1234', 'Shehan', 'Chamudith', 'schamudith@gmail.com', '0774439693', '274/1, Buluwana, Atakalanpanna.'),
(2, 'office', 'achila', '456', 'Achila', 'Dilshan', 'achila@gmail.com', '0887736782', 'Peradeniya,Kandy'),
(10, 'admin', 'user', '$2b$10$Lqxv75zYuDylOYTn4QFhh.EoY.9A1AxCqK7HiCRUI3OTVztA80ojW', 'User', 'User', 'user@gmail.com', '0774439693', 'Ratnapura'),
(11, 'warehouse', 'def', '12345', 'def', 'ghi', 'def@gmail.com', '0887736782', 'colombo');

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
(1, 11, '2024-04-30');

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
  ADD PRIMARY KEY (`userID`);

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
  MODIFY `customerID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expenseID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventoryID` int(10) NOT NULL AUTO_INCREMENT;

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
  MODIFY `productID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

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
  MODIFY `supplierID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  MODIFY `wstaffID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Constraints for table `warehousestaff`
--
ALTER TABLE `warehousestaff`
  ADD CONSTRAINT `warehousestaff_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
