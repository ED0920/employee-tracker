const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

// express middleware
const PORT = process.env.PORT || 3002;
const app = express();

const run = async () => {
  // connect to database
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
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

  const addRole = async () => {
    const departmentQuery = await db.query("SELECT * from department");

    const deptNames = departmentQuery[0].map((dept) => dept.department);

    const questions = [
      {
        type: "input",
        name: "role",
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
        choices: deptNames,
      },
    ];

    const res = await inquirer.prompt(questions);

    const departmentId = departmentQuery[0].find(
      (dept) => dept.department === res.department
    ).id;

    await db.query(
      "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
      [res.role, res.salary, departmentId]
    );
    console.log("adding role");
    mainMenuPrompt();
  };

  const addEmployee = async () => {
    const roleQuery = await db.query("SELECT * from roles");
    const roleNames = roleQuery[0].map((roleName) => roleName.title);
    const managerQuery = await db.query(
      "SELECT * FROM employee WHERE manager_id IS NOT NULL"
    );
    const managerNames = managerQuery[0].map(
      (manager) => manager.first_name + " " + manager.last_name
    );

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
        choices: roleNames,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managerNames,
      },
    ];
    const res = await inquirer.prompt(addEmployee);

    await db.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
      [res.first_name, res.last_name, res.role_id, res.manager_id]
    );
    console.log(res);
    mainMenuPrompt();
  };

  const updateRole = async () => {
    // TODO fetch list of users and list of roles
    const userArray = await db.query("SELECT * FROM employee");
    const roleArray = await db.query("SELECT * FROM roles");
    const userNames = userArray[0].map(
      (user) => user.first_name + " " + user.last_name
    );
    const roleName = roleArray[0].map((role) => role.title);

    const questions = [
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: userNames,
      },
      {
        type: "list",
        name: "role",
        message: "Which role do you want to assign the selected employee?",
        choices: roleName,
      },
    ];

    const res = await inquirer.prompt(questions);

    const userId = userArray[0].find((user) => {
      return user.first_name + " " + user.last_name === res.employee;
    }).id;

    const roleId = roleArray[0].find((role) => {
      return role.title === res.role;
    }).id;

    await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
      userId,
      roleId,
    ]);
    mainMenuPrompt();
  };

  const mainMenuPrompt = () => {
    inquirer.prompt(menu).then(async (response) => {
      console.log(response.menu);

      if (response.menu === "View all departments") {
        console.log("list of departments");
        const res = await db.query("SELECT * FROM department");
        console.table(res[0]);
        mainMenuPrompt();
      } else if (response.menu === "View all roles") {
        const res = await db.query("SELECT * FROM roles");
        console.table(res[0]);
        mainMenuPrompt();
      } else if (response.menu === "View all employees") {
        console.log("List of employees");
        const res = await db.query("SELECT * FROM employee");
        console.table(res[0]);
        mainMenuPrompt();
      } else if (response.menu === "Add departments") {
        inquirer.prompt(addDepartment).then(async (res) => {
          const response = await db.query(
            "INSERT INTO department( department) VALUES (?)",
            [res.department]
            // fetch departments list
          );
          console.log(response);
          mainMenuPrompt();

          //add to department table
        });
        // console.log("department added");
      } else if (response.menu === "Add a role") {
        addRole();
      } else if (response.menu === "Add an employee") {
        addEmployee();
      } else if (response.menu === "Update an employee role") {
        updateRole();
      }
    });
  };

  mainMenuPrompt();
};

run();
