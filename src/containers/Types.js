import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TypeTable from "../components/Type/TypeTable";
var moment = require("moment");

const Type = () => {
  const [types, setTypes] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getTypes = async () => {
      const typesFromServer = await fetchTypes();
      setTypes(typesFromServer);
    };
    getTypes();
  }, []);

  // Fetch Types
  const fetchTypes = async () => {
    const res = await fetch("http://localhost:3001/api/v1/types");
    const data = await res.json();
    let columns = [];
    let rows = data.types.rows;
    let locColumns = [];
    if (data.types.count > 0) locColumns = Object.keys(data.types.rows[0]);

    locColumns.forEach(item => {
      let obj = {};
      switch (item) {
        case "id":
          obj.hide = true;
          obj.headerName = "ID";
          obj.field = item;
          break;
        case "number":
          obj.headerName = "Номер";
          obj.field = item;
          obj.flex = 0.15;
          obj.headerClassName = "super-app-theme--header";
          break;
        case "name":
          obj.headerName = "Название";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "createdAt":
          obj.headerName = "Дата создания";
          obj.field = item;
          obj.flex = 0.25;
          break;
        case "updatedAt":
          obj.headerName = "Дата редактирования";
          obj.field = item;
          obj.flex = 0.25;
          break;
        case "note":
          obj.headerName = "Примечание";
          obj.field = item;
          obj.flex = 0.4;
          break;
        default:
          break;
      }
      if (data.types.count > 0 && item !== "deletedAt") {
        columns.push(obj);
      }
    });

    let types = {};
    types.rows = rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      return row;
    });
    types.columns = columns;
    return types;
  };

  // Add Type
  const addType = async type => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/types/", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(type)
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [];
      if (types.columns.length > 0) {
        data.type[0].createdAt = moment(data.type.createdAt).format(
          "YYYY.MM.DD HH:mm"
        );
        data.type[0].updatedAt = moment(data.type.updatedAt).format(
          "YYYY.MM.DD HH:mm"
        );
        newRows = [...types.rows, data.type[0]];
        let newTypes = Object.assign(
          {},
          { columns: types.columns, rows: newRows }
        );
        setTypes(newTypes);
      } else {
        const typesFromServer = await fetchTypes();
        setTypes(typesFromServer);
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

  // Add Type
  const updateType = async type => {
    try {
      console.log(JSON.stringify(type));
      const res = await fetch(`http://localhost:3001/api/v1/types/${type.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(type)
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      data.type.createdAt = moment(data.type.createdAt).format(
        "YYYY.MM.DD HH:mm"
      );
      data.type.updatedAt = moment(data.type.updatedAt).format(
        "YYYY.MM.DD HH:mm"
      );
      let newRows = [];
      if (types.columns.length > 0) {
        newRows = types.rows.map(loc => (loc.id === type.id ? data.type : loc));
        let newTypes = Object.assign(
          {},
          { columns: types.columns, rows: newRows }
        );
        setTypes(newTypes);
      } else {
        const typesFromServer = await fetchTypes();
        setTypes(typesFromServer);
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

  // Delete Type
  const deleteType = async parameters => {
    try {
      await fetch(`http://localhost:3001/api/v1/types/${parameters.id}`, {
        method: "DELETE"
      });

      let newRows = types.rows.filter(row => row.id !== parameters.id);
      let newTypes = Object.assign(
        {},
        { columns: types.columns, rows: newRows }
      );
      setTypes(newTypes);
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
    <TypeTable
      types={types}
      deleteType={deleteType}
      addType={addType}
      updateType={updateType}
    ></TypeTable>
  );
};

export default Type;
