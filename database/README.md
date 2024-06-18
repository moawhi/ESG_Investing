# Database
This directory contains files relevant to the database.

## Requirements
- MySQL 8.0: To download, follow the guide for your system [here](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/installing.html)

## Setting up the Database
Navigate to the `database/` directory. Connect to your MySQL server:
```
mysql -u root -p
```
or
```
sudo mysql -u root -p
```
or any other variant of how you've configured how to connect to your root user for MySQL.
Next, while connected to MySQL, execute the following commands line by line:
```
CREATE DATABASE IF NOT EXISTS esg_management;
CREATE USER IF NOT EXISTS esg@localhost IDENTIFIED BY 'esg';
GRANT ALL PRIVILEGES ON esg_management.* TO esg@localhost;
FLUSH PRIVILEGES;
USE esg_management;
```
Next, execute:
```
source ddl.sql;
```
Once this script is finished, execute:
```
source example_dml.sql;
```
It may take a few minutes for the script to finish. Once this script is finished, your database should be populated and you can disconnect from MySQL.

## Structure
- `ddl.sql`: To define the schema of the database
- `example_dml.sql`: To populate the database with data
- `init_db`: bash script to set up the database