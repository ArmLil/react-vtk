import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import NamingTable from "../components/Naming/NamingTable";
var moment = require("moment");

const Naming = () => {
  const [namings, setNamings] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getNamings = async () => {
      const namingsFromServer = await fetchNamings();
      setNamings(namingsFromServer);
    };
    getNamings();
  }, []);

  // Fetch Namings
  const fetchNamings = async () => {
    const res = await fetch("http://localhost:3001/api/v1/namings");
    const data = await res.json();
    let columns = [];
    let rows = data.namings.rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      if (row.type) row.type = row.type.name;
      return row;
    });
    let locColumns = [];
    if (data.namings.count > 0) locColumns = Object.keys(data.namings.rows[0]);

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
        case "type":
          obj.headerName = "Тип";
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
      if (data.namings.count > 0 && item !== "deletedAt" && item !== "typeId") {
        columns.push(obj);
      }
    });

    let namings = {};

    // move the type in 3 column left
    columns.forEach((col, index) => {
      if (col.headerName === "Тип") {
        columns.splice(index, 1);
        columns.splice(index - 3, 0, col);
      }
    });

    namings.rows = rows;
    namings.columns = columns;
    return namings;
  };

  // Add Naming
  const addNaming = async naming => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/namings/", {
        method: "POST",
        body: JSON.stringify(naming),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [];
      data.naming.type = data.naming.type.name;
      if (namings.columns.length > 0) {
        data.naming.createdAt = moment(data.naming.createdAt).format(
          "YYYY.MM.DD HH:mm"
        );
        data.naming.updatedAt = moment(data.naming.updatedAt).format(
          "YYYY.MM.DD HH:mm"
        );
        newRows = [...namings.rows, data.naming];
        let newNamings = Object.assign(
          {},
          { columns: namings.columns, rows: newRows }
        );
        setNamings(newNamings);
      } else {
        const namingsFromServer = await fetchNamings();
        setNamings(namingsFromServer);
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

  // Add Naming
  const updateNaming = async naming => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/namings/${naming.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(naming)
        }
      );

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      data.naming.createdAt = moment(data.naming.createdAt).format(
        "YYYY.MM.DD HH:mm"
      );
      data.naming.updatedAt = moment(data.naming.updatedAt).format(
        "YYYY.MM.DD HH:mm"
      );
      let newRows = [];
      data.naming.type = data.naming.type.name;
      if (namings.columns.length > 0) {
        newRows = namings.rows.map(loc =>
          loc.id === naming.id ? data.naming : loc
        );
        let newNamings = Object.assign(
          {},
          { columns: namings.columns, rows: newRows }
        );
        setNamings(newNamings);
      } else {
        const namingsFromServer = await fetchNamings();
        setNamings(namingsFromServer);
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

  // Delete Naming
  const deleteNaming = async parameters => {
    try {
      await fetch(`http://localhost:3001/api/v1/namings/${parameters.id}`, {
        method: "DELETE"
      });

      let newRows = namings.rows.filter(row => row.id !== parameters.id);
      let newNamings = Object.assign(
        {},
        { columns: namings.columns, rows: newRows }
      );
      setNamings(newNamings);
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
    <NamingTable
      namings={namings}
      deleteNaming={deleteNaming}
      addNaming={addNaming}
      updateNaming={updateNaming}
    ></NamingTable>
  );
};

export default Naming;
