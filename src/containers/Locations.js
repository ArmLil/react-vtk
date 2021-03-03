import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import LocationTable from "../components/LocationTable";
var moment = require("moment");

const Location = () => {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [locations, setLocations] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const getLocations = async () => {
      const locationsFromServer = await fetchLocations();
      setLocations(locationsFromServer);
    };
    getLocations();
  }, []);

  // Fetch Locations
  const fetchLocations = async () => {
    const res = await fetch("http://localhost:3001/api/v1/locations");
    const data = await res.json();
    console.log({ data });
    let columns = [];
    let rows = data.locations.rows;
    let locColumns = [];
    if (data.locations.count > 0)
      locColumns = Object.keys(data.locations.rows[0]);

    locColumns.map(item => {
      let obj = {};
      switch (item) {
        case "id":
          obj.headerName = "ID";
          obj.field = item;
          break;
        case "number":
          obj.headerName = "Номер";
          obj.field = item;
          break;
        case "name":
          obj.headerName = "Название";
          obj.field = item;
          obj.flex = 0.3;
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
          obj.flex = 0.3;
          break;
      }
      if (data.locations.count > 0 && item !== "deletedAt") {
        columns.push(obj);
      }
    });

    let locations = {};
    locations.rows = rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      return row;
    });
    locations.columns = columns;
    return locations;
  };

  // // Fetch Location
  // const fetchLocation = async id => {
  //   const res = await fetch(`http://localhost:3001/api/v1/locations/${id}`);
  //   const data = await res.json();
  //
  //   return data;
  // };

  // Add Location
  const addLocation = async location => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/locations/", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(location)
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [...locations.rows, data.location[0]];
      let newLocations = Object.assign(
        {},
        { columns: locations.columns, rows: newRows }
      );
      setLocations(newLocations);
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
  const deleteLocation = async id => {
    console.log("deleteLocation", id);
  };

  // // Delete Location
  // const deleteLocation = async id => {
  //   const res = await fetch(`http://localhost:3001/api/v1/locations/${id}`, {
  //     method: "DELETE"
  //   });
  //   //We should control the response status to decide if we will change the state or not.
  //   res.status === 200
  //     ? setLocations(locations.filter(location => location.id !== id))
  //     : alert("Error Deleting This Location");
  // };

  // // Toggle Reminder
  // const toggleReminder = async id => {
  //   const locationToToggle = await fetchLocation(id);
  //   const updLocation = {
  //     ...locationToToggle,
  //     reminder: !locationToToggle.reminder
  //   };
  //
  //   const res = await fetch(`http://localhost:3001/api/v1/locations/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-type": "application/json"
  //     },
  //     body: JSON.stringify(updLocation)
  //   });
  //
  //   const data = await res.json();
  //
  //   setLocations(
  //     locations.map(location =>
  //       location.id === id ? { ...location, reminder: data.reminder } : location
  //     )
  //   );
  // };
  return (
    <LocationTable
      locations={locations}
      handleDeleteRow={deleteLocation}
      addLocation={addLocation}
    />
  );
};

export default Location;
