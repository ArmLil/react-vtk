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
import Tooltip from "@material-ui/core/Tooltip";
import LocationAddDialog from "./LocationAddDialog";
import { useSnackbar } from "notistack";

export default function LocationTable({
  locations,
  handleDeleteRow,
  addLocation
}) {
  console.log(locations);

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

  const editColumn = {
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
  };

  const deleteColumn = {
    field: "delete",
    headerName: "Удалить",
    sortable: false,
    renderCell: (params: CellParams) => (
      <IconButton
        aria-label="delete"
        color="secondary"
        className={classes.iconButton}
        onClick={() => handleDeleteRow(params.row.id)}
      >
        <DeleteForeverOutlinedIcon />
      </IconButton>
    )
  };

  if (locations.columns && locations.columns.length > 0) {
    locations.columns.push(editColumn);
    locations.columns.push(deleteColumn);
  }

  const columns: ColDef[] = locations.columns ? locations.columns : [];
  const rows = locations.rows ? locations.rows : [];

  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, number, name, note) => {
    setOpen(false);
  };

  const handleCreate = (event, number, name, note) => {
    console.log({ number }, { name }, { note });
    if (!number || !name) {
      console.log("number is undefined");
      enqueueSnackbar("Нобходимо заполнить поля Номер и Название", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else {
      let location = {};
      location.name = name;
      location.number = number;
      if (!!note) location.note = note;
      console.log(!!note, "location=", location);
      addLocation(location);
      setOpen(false);
    }
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
        <LocationAddDialog
          handleClose={handleClose}
          handleCreate={handleCreate}
          open={open}
        />
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
        flexGrow: 1,
        fontSize: "18px"
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
