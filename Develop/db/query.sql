SELECT employee.id as employee, role.id 
FROM roles
LEFT JOIN employee
on role.id = employee.role_id

SELECT department.id AS department, role.id
FROM roles
LEFT JOIN department
ON role.id = department.id
ORDER BY department.department