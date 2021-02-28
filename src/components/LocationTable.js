import * as React from "react";
import { XGrid } from "@material-ui/x-grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { GridToolbarContainer, GridToolbar } from "@material-ui/x-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import russian from "../constants/localeTextConstants.js";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

export default function LocationTable() {
  const useStyles = makeStyles({
    toolbarContainer: {
      display: "flex",
      flexDirection: "column"
    },
    tools: {
      width: "100%",
      paddingLeft: 20,
      paddingRight: 20,
      marginBottom: 30,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    iconButton: {
      "&:hover": {
        backgroundColor: "#bdbdbd"
      }
    }
  });

  const classes = useStyles();
  function updateRow(params) {
    console.log("updateRow", params);
  }
  function deleteRow(params) {
    console.log("deleteRow", params);
  }

  const columns: ColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "firstName", headerName: "First name", flex: 0.1 },
    { field: "lastName", headerName: "Last name", flex: 0.1 },
    {
      field: "age",
      headerName: "Age",
      type: "number"
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 0.5,

      valueGetter: (params: ValueGetterParams) =>
        `${params.getValue("firstName") || ""} ${params.getValue("lastName") ||
          ""}`
    },

    {
      field: "delete",
      headerName: "Удалить",
      sortable: false,
      renderCell: (params: CellParams) => (
        <IconButton
          aria-label="delete"
          color="secondary"
          className={classes.iconButton}
          onClick={() => deleteRow(params)}
        >
          <DeleteForeverOutlinedIcon />
        </IconButton>
      )
    },
    {
      field: "edit",
      headerName: "Редактировать",
      sortable: false,

      width: 135,
      renderCell: (params: CellParams) => (
        <IconButton
          aria-label="edit"
          color="primary"
          className={classes.iconButton}
          onClick={() => updateRow(params)}
        >
          <EditOutlinedIcon />
        </IconButton>
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <Tooltip title="Создать">
            <Fab
              size="medium"
              color="primary"
              aria-label="add"
              className={classes.add}
              onClick={handleClickOpen}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </GridToolbarContainer>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        height: 700,
        width: "100%",
        justifyContent: "space-between",
        flexGrow: 1
      }}
    >
      <XGrid
        localeText={russian}
        rowHeight={50}
        pageSize={20}
        headerHeight={80}
        columnBuffer={2}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        pagination
        density="standard"
        rows={rows}
        columns={columns}
        disableColumnMenu={true}
        showColumnRightBorder={true}
        showCellRightBorder={true}
        disableExtendRowFullWidth={true}
        components={{
          Toolbar: CustomToolbar
        }}
      />
    </div>
  );
}
