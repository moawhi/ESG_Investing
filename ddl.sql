drop table if exists user;
create table user (
    `id` int primary key auto_increment,
    `email_address` varchar(100) unique key,
    `first_name` varchar(100),
    `last_name` varchar(100),
    `password` varchar(100),
    `blocked` boolean,
    `login_attempts` int,

);

drop table if exists company;
create table company(
    `perm_id` bigint primary key,
    `industry` varchar(100), -- industry type of the company
    `name` varchar(100) unique key, -- name of the company
    `info` text, -- introduction of the company
    `esg_rating` double, -- a global esg score
    `industry_ranking` int -- esg score ranking
);

drop table if exists company_esg_raw_data;
create table company_esg_raw_data(
    `id` int primary key auto_increment,
    `metric_id` int, -- id of the metric
    `metric_name` varchar(100), -- name of the metric
    `metric_score` int, -- score of the metric
    `metric_year` int, -- fiscal year of the company for which the metric is calculated / gathered
    `company_id` bigint, -- permanent identifier number of the company
    `company_name` varchar(100), -- name of the company
    `pillar` char(1), -- ESG flag
    `provider_name` varchar(100) -- Name of the data provider
);

drop table if exists raw_metric;
create table raw_metric(
    `id` int primary key auto_increment,
    `name` varchar(100),
    `pillar` char(1), -- ESG flag
    `description` text -- description of the metric
);

drop table if exists framework;
create table framework(
    `id` int primary key auto_increment,
    `name` varchar(100),
    `info` text -- introduction of the framework
);

drop table if exists framework_metric;
create table framework_metric(
    `id` int primary key auto_increment,
    `framework_id` int, -- the metric belongs to which framework
    `weight` double, -- the default weight
    `name` varchar(100),
    `description` text -- description of the metric
);

drop table if exists framework_company_mapping;
create table framework_company_mapping(
    `company_id` bigint,
    `framework_id` int,
    primary key (`company_id`, `framework_id`)
);

drop table if exists framework_metric_raw_metric_mapping;
create table framework_metric_raw_metric_mapping(
    `framework_metric_id` int, -- id of metric in framework
    `raw_metric_id` int, -- id of raw metric
    `weight` double, -- the default weight
    primary key (`framework_metric_id`, `raw_metric_id`)
);

