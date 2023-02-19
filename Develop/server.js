const express = require("express");
// inquire prompt
const inquirer = require("inquirer");
const { default: Choice } = require("inquirer/lib/objects/choice");

// import and reuqire mysql2
const mysql = require("mysql2/promise");

// express middleware
const PORT = process.env.PORT || 3002;
const app = express();

const run = async () => {
  // connect to database
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Baleful12!",
    database: "employee_db",
  });

  console.log("Connected to the employee_db database.");

  const menu = [
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View all roles",
        "View all employees",
        "View all departments",
        "Add departments",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
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
    {
      type: "input",
      name: "role ",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "what is the salary of the role? ",
    },
    {
      type: "list",
      name: "department",
      message: "what department does the role belong to?",
      choice: ["Engineering", " Finance", " Legal", "Sales"],
    },
  ];

  const addEmployee = [
    {
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
      choice: [
        "Sales Lead",
        "Salesperson",
        "Lead Engineer",
        "Software Engineer",
        "Account Manager",
        "Accountant",
        "Legal Team Lead",
        "Lawyer",
      ],
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choice: ["insert manager list"],
    },
  ];

  const updateRole = async () => {
    // TODO fetch list of users and list of roles
    const userArray = await db.query("SELECT * FROM employee");
    const roleArray = await db.query("SELECT * FROM roles");

    console.log(userArray);
    console.log(roleArray);

    const questions = [
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choice: [userArray],
      },
      {
        type: "list",
        name: "role",
        message: "Which role do you want to assign the elected employee?",
        choice: [roleArray],
      },
    ];

    inquirer.prompt(questions).then(async (response) => {
      // const name = response.addEmployee
      // const role = response.role
      await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
        "role_id",
        "id",
      ]);
      //
    });
  };

  const mainMenuPrompt = () => {
    inquirer.prompt(menu).then(async (response) => {
      console.log(response.menu);

      if (response.menu === "View all departments") {
        console.log("list of departments");
        const res = await db.query("SELECT * FROM department");
        console.log(res);
        mainMenuPrompt();
      } else if (response.menu === "View all roles") {
        const res = await db.query("SELECT * FROM roles");
        console.log(res);
        mainMenuPrompt();
      } else if (response.menu === "View all employees") {
        console.log("List of employees");
        const res = await db.query("SELECT * FROM employee");
        console.log(res);
        mainMenuPrompt();
      } else if (response.menu === "Add departments") {
        inquirer.prompt(addDepartment).then(async (res) => {
          const response = await db.query(
            "INSERT INTO department( department) VALUES (?)",
            [res.department]
          );
          console.log(response);
          mainMenuPrompt();

          //add to department table
        });
        // console.log("department added");
      } else if (response.menu === "Add a role") {
        inquirer.prompt(addRole).then(async (res) => {
          //add to role table
          const response = await db.query(
            "INSERT INTO roles (title, salary, department_id) VALUES (?)",
            [res.title, res.salary, res.department_id]
          );
          console.log("adding role");
        });
      } else if (response.menu === "Add an employee") {
        inquirer.prompt(addEmployee).then(async (res) => {
          //add to employee table
          const response = await db.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)",
            [res.first_name, res.last_name, res.role_id, res.manager_id]
          );
          console.log("adding employee");
        });
      } else if (response.menu === "Update an employee role") {
        const promptQuestions = updateRole();

        console.log("updaitng role");
      }
    });
  };

  mainMenuPrompt();

  // funciton listManagers(to list managers in data)
  // function update employee manager
  // function view employees by manger
  // function view employees by department
  // function delete departments, roles & employees

  // // TODO: Create a function to write README file
  // function writeToFile(fileName, data) {}

  // // TODO: Create a function to initialize app
  // function init() {}

  // // Function call to initialize app
  // init();
};

run();
