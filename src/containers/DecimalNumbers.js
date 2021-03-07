import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import DecimalNumberTable from "../components/DecimalNumber/DecimalNumberTable";
var moment = require("moment");

const DecimalNumber = () => {
  const [decimalNumbers, setDecimalNumbers] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getDecimalNumbers = async () => {
      const decimalNumbersFromServer = await fetchDecimalNumbers();
      setDecimalNumbers(decimalNumbersFromServer);
    };
    getDecimalNumbers();
  }, []);

  // Fetch DecimalNumbers
  const fetchDecimalNumbers = async () => {
    const res = await fetch("http://localhost:3001/api/v1/decimalNumbers");
    const data = await res.json();
    let columns = [];
    let rows = data.decimalNumbers.rows;
    let locColumns = [];
    if (data.decimalNumbers.count > 0)
      locColumns = Object.keys(data.decimalNumbers.rows[0]);

    locColumns.forEach(item => {
      let obj = {};
      switch (item) {
        case "id":
          obj.headerName = "ID";
          obj.field = item;
          break;
        case "name":
          obj.headerName = "Название";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "createdAt":
          obj.headerName = "Дата создания";
          obj.field = item;
          obj.flex = 0.2;
          break;
        case "updatedAt":
          obj.headerName = "Дата редактирования";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "note":
          obj.headerName = "Примечание";
          obj.field = item;
          obj.flex = 0.4;
          break;
        default:
          break;
      }
      if (data.decimalNumbers.count > 0 && item !== "deletedAt") {
        columns.push(obj);
      }
    });

    let decimalNumbers = {};
    decimalNumbers.rows = rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      return row;
    });
    decimalNumbers.columns = columns;
    return decimalNumbers;
  };

  // Add DecimalNumber
  const addDecimalNumber = async decimalNumber => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/decimalNumbers/", {
        method: "POST",
        body: JSON.stringify(decimalNumber),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [];
      if (decimalNumbers.columns.length > 0) {
        data.decimalNumber[0].createdAt = moment(
          data.decimalNumber.createdAt
        ).format("YYYY.MM.DD HH:mm");
        data.decimalNumber[0].updatedAt = moment(
          data.decimalNumber.updatedAt
        ).format("YYYY.MM.DD HH:mm");
        newRows = [...decimalNumbers.rows, data.decimalNumber[0]];
        let newDecimalNumbers = Object.assign(
          {},
          { columns: decimalNumbers.columns, rows: newRows }
        );
        setDecimalNumbers(newDecimalNumbers);
      } else {
        const decimalNumbersFromServer = await fetchDecimalNumbers();
        setDecimalNumbers(decimalNumbersFromServer);
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

  // Add DecimalNumber
  const updateDecimalNumber = async decimalNumber => {
    console.log("decimalNumber = ", decimalNumber);
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/decimalNumbers/${decimalNumber.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(decimalNumber)
        }
      );

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      data.decimalNumber.createdAt = moment(
        data.decimalNumber.createdAt
      ).format("YYYY.MM.DD HH:mm");
      data.decimalNumber.updatedAt = moment(
        data.decimalNumber.updatedAt
      ).format("YYYY.MM.DD HH:mm");
      let newRows = [];
      if (decimalNumbers.columns.length > 0) {
        newRows = decimalNumbers.rows.map(loc =>
          loc.id === decimalNumber.id ? data.decimalNumber : loc
        );
        let newDecimalNumbers = Object.assign(
          {},
          { columns: decimalNumbers.columns, rows: newRows }
        );
        setDecimalNumbers(newDecimalNumbers);
      } else {
        const decimalNumbersFromServer = await fetchDecimalNumbers();
        setDecimalNumbers(decimalNumbersFromServer);
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

  // Delete DecimalNumber
  const deleteDecimalNumber = async parameters => {
    try {
      await fetch(
        `http://localhost:3001/api/v1/decimalNumbers/${parameters.id}`,
        {
          method: "DELETE"
        }
      );

      let newRows = decimalNumbers.rows.filter(row => row.id !== parameters.id);
      let newDecimalNumbers = Object.assign(
        {},
        { columns: decimalNumbers.columns, rows: newRows }
      );
      setDecimalNumbers(newDecimalNumbers);
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
    <DecimalNumberTable
      decimalNumbers={decimalNumbers}
      deleteDecimalNumber={deleteDecimalNumber}
      addDecimalNumber={addDecimalNumber}
      updateDecimalNumber={updateDecimalNumber}
    ></DecimalNumberTable>
  );
};

export default DecimalNumber;
