const express = require("express");

// import and reuqire mysql2
const mysql = require("mysql2");

// express middleware
const PORT = process.env.PORT || 3002;
const app = express();

// connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Password123!",
    database: "employee_db",
  },
  console.log("Connected to the employee_db database.")
);

// indquire prompt
const inquirer = require("inquirer");
const { default: Choice } = require("inquirer/lib/objects/choice");

const menu = [
  {
    type: "list",
    name: "menu",
    message: "What would you like to do?",
    choices: [
      "View Employees",
      "View all roles",
      "View all employees",
      "View all departments",
      "Add departments",
      "Add a role",
      "Add an employee",
      "Update an employee role",
    ],
  },
  {
    type: "",
    name: " ",
    message: "",
  },
];

const addDepartment = [
  {
    type: "input",
    name: "department",
    message: "What is the name of the department?",
  },
];
const addRole = [
  { type: "input", name: "role ", message: "What is the name of the role?" },
  {
    type: "input",
    name: "salary",
    message: "what is the salary of the role? ",
  },
  {
    type: "list",
    name: "department",
    message: "what department does the role belong to?",
    choice: ['Engineering', ' Finance', ' Legal', 'Sales']
  },
];

const addEmployee = [{
    type: "input",
    name: "first_name",
    message: "What is the employee's first name?",
},
{
    type: "input",
    name: "last_name",
    message: "What is the employee's last name?",
},
{
    type: "list",
    name: "role",
    message: "What is the employee's role?",
    choice: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
  },
  {
    type: "list",
    name: "manager",
    message: "Who is the employee's manager?",
    choice: [insert manager list]
  },
];

const updateRole = [
    {type: "list",
    name: "employee",
    message: "Whcih emplee's role do you want to update?",
choice:['insert list of roles']}
]

funciton listManagers(to list managers in data)


// TODO: Create a function to write README file
function writeToFile(fileName, data) {}

// TODO: Create a function to initialize app
function init() {}

// Function call to initialize app
init();
