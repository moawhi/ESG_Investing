drop table if exists user;
create table user (
    `id` int primary key auto_increment,
    `email_address` varchar(100) unique key,
    `first_name` varchar(100),
    `last_name` varchar(100),
    `password` varchar(100),
    `blocked` boolean,
    `login_attempts` int
);