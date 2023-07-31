// Importing the module
import fs from "fs";
const express = require("express");
const router = express.Router();
const controller_path = `${__dirname}/controllers`; // CONTTROLLER PATH 
const auth_dir = `${controller_path}/auth`;
const account_dir = `${controller_path}/account`;
const blog_dir = `${controller_path}/blog`;
const school_dir = `${controller_path}/school`;
const ecommerce_dir = `${controller_path}/ecommerce`;
const geo_utility_dir = `${controller_path}/utility/geo`;
const account_utility_dir = `${controller_path}/utility/account`;
const others_utility_dir = `${controller_path}/utility/others`;

fs.readdirSync(auth_dir).forEach((name:string) => {
	require(auth_dir + '/' + name)(router);
});

fs.readdirSync(account_dir).forEach((name:string) => {
	require(account_dir + '/' + name)(router);
});

fs.readdirSync(blog_dir).forEach((name:string) => {
	require(blog_dir + '/' + name)(router);
});

fs.readdirSync(ecommerce_dir).forEach((name:string) => {
	require(ecommerce_dir + '/' + name)(router);
});

fs.readdirSync(school_dir).forEach((name:string) => {
	require(school_dir + '/' + name)(router);
});

fs.readdirSync(geo_utility_dir).forEach(name => {
	require(geo_utility_dir+'/'+name)(router);
});

fs.readdirSync(account_utility_dir).forEach(name => {
	require(account_utility_dir+'/'+name)(router);
});

fs.readdirSync(others_utility_dir).forEach(name => {
	require(others_utility_dir+'/'+name)(router);
});

module.exports = router;