import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import EmployeeTable from "../components/Employee/EmployeeTable";
var moment = require("moment");

const Employee = () => {
  const [employees, setEmployees] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getEmployees = async () => {
      const employeesFromServer = await fetchEmployees();
      setEmployees(employeesFromServer);
    };
    getEmployees();
  }, []);

  // Fetch Employees
  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:3001/api/v1/employees");
    const data = await res.json();
    let columns = [];
    let rows = data.employees.rows;
    let locColumns = [];
    if (data.employees.count > 0)
      locColumns = Object.keys(data.employees.rows[0]);

    locColumns.forEach(item => {
      let obj = {};
      switch (item) {
        case "id":
          obj.headerName = "ID";
          obj.field = item;
          obj.hide = true;
          break;
        case "name":
          obj.headerName = "Имя";
          obj.field = item;
          obj.flex = 0.35;
          break;
        case "secondName":
          obj.headerName = "Фамилия";
          obj.field = item;
          obj.flex = 0.35;
          break;
        case "fatherName":
          obj.headerName = "Отчество";
          obj.field = item;
          obj.flex = 0.35;
          break;
        case "createdAt":
          obj.headerName = "Дата создания";
          obj.field = item;
          obj.flex = 0.2;
          break;
        case "updatedAt":
          obj.headerName = "Дата редактирования";
          obj.field = item;
          obj.flex = 0.2;
          break;
        case "note":
          obj.headerName = "Примечание";
          obj.field = item;
          obj.flex = 0.4;
          break;
        default:
          break;
      }
      if (data.employees.count > 0 && item !== "deletedAt") {
        columns.push(obj);
      }
    });

    let employees = {};
    employees.rows = rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      return row;
    });
    employees.columns = columns;
    return employees;
  };

  // Add Employee
  const addEmployee = async employee => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/employees/", {
        method: "POST",
        body: JSON.stringify(employee),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [];
      if (employees.columns.length > 0) {
        data.employee[0].createdAt = moment(data.employee.createdAt).format(
          "YYYY.MM.DD HH:mm"
        );
        data.employee[0].updatedAt = moment(data.employee.updatedAt).format(
          "YYYY.MM.DD HH:mm"
        );
        newRows = [...employees.rows, data.employee[0]];
        let newEmployees = Object.assign(
          {},
          { columns: employees.columns, rows: newRows }
        );
        setEmployees(newEmployees);
      } else {
        const employeesFromServer = await fetchEmployees();
        setEmployees(employeesFromServer);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  // Add Employee
  const updateEmployee = async employee => {
    console.log("employee = ", employee);
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/employees/${employee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(employee)
        }
      );

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      data.employee.createdAt = moment(data.employee.createdAt).format(
        "YYYY.MM.DD HH:mm"
      );
      data.employee.updatedAt = moment(data.employee.updatedAt).format(
        "YYYY.MM.DD HH:mm"
      );
      let newRows = [];
      if (employees.columns.length > 0) {
        newRows = employees.rows.map(loc =>
          loc.id === employee.id ? data.employee : loc
        );
        let newEmployees = Object.assign(
          {},
          { columns: employees.columns, rows: newRows }
        );
        setEmployees(newEmployees);
      } else {
        const employeesFromServer = await fetchEmployees();
        setEmployees(employeesFromServer);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  // Delete Employee
  const deleteEmployee = async parameters => {
    try {
      await fetch(`http://localhost:3001/api/v1/employees/${parameters.id}`, {
        method: "DELETE"
      });

      let newRows = employees.rows.filter(row => row.id !== parameters.id);
      let newEmployees = Object.assign(
        {},
        { columns: employees.columns, rows: newRows }
      );
      setEmployees(newEmployees);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  return (
    <EmployeeTable
      employees={employees}
      deleteEmployee={deleteEmployee}
      addEmployee={addEmployee}
      updateEmployee={updateEmployee}
    ></EmployeeTable>
  );
};

export default Employee;
