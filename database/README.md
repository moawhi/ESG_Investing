# Database
This directory contains files relevant to the database.

## Requirements
- MySQL 8.0: To download, follow the guide for your system [here](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/installing.html)

## Setting up the Database
Execute the following commands in the `database/` directory:
```
chmod +x init_db
./init_db
```
Please note you will need to enter your root user password as some of the bash script commands will use `sudo`.

## Structure
- `ddl.sql`: To define the schema of the database
- `example_dml.sql`: To populate the database with data
- `init_db`: bash script to set up the database