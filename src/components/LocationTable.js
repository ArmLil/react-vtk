import * as React from "react";
import { XGrid } from "@material-ui/x-grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { GridToolbarContainer, GridToolbar } from "@material-ui/x-grid";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import russian from "../constants/localeTextConstants.js";

export default function LocationTable() {
  const useStyles = makeStyles({
    toolbarContainer: {
      padding: 10,
      display: "flex",
      flexDirection: "column"
    },
    tools: {
      width: "100%",
      paddingLeft: 20,
      paddingRight: 20,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    reduct: {
      display: "flex",
      justifyContent: "flex-end"
    }
  });

  const classes = useStyles();

  const columns: ColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: ValueGetterParams) =>
        `${params.getValue("firstName") || ""} ${params.getValue("lastName") ||
          ""}`
    },
    {
      field: "delete",
      headerName: "Удалить",
      width: 150,
      renderCell: (params: CellParams) => (
        <DeleteForeverOutlinedIcon
          variant="contained"
          color="secondary"
        ></DeleteForeverOutlinedIcon>
      )
    },
    {
      field: "update",
      headerName: "Редактировать",
      width: 150,
      renderCell: (params: CellParams) => (
        <EditOutlinedIcon
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Open
        </EditOutlinedIcon>
      )
    }
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 }
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Места производства
          </Typography>
        </div>
        <div className={classes.tools}>
          <div>
            <GridToolbar />
          </div>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            className={classes.add}
          >
            <AddIcon />
          </Fab>
        </div>
      </GridToolbarContainer>
    );
  }
  return (
    <div style={{ display: "flex", height: 700, width: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <XGrid
          localeText={russian}
          rowHeight={38}
          pageSize={20}
          headerHeight={80}
          columnBuffer={2}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          pagination
          density="standard"
          rows={rows}
          columns={columns}
          components={{
            Toolbar: CustomToolbar
          }}
        />
      </div>
    </div>
  );
}
