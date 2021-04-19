import * as React from "react";
import { XGrid } from "@material-ui/x-grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  GridToolbarContainer,
  GridDensitySelector,
  GridFilterToolbarButton,
  GridColumnsToolbarButton
} from "@material-ui/x-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import russian from "../../constants/localeTextConstants.js";
import Tooltip from "@material-ui/core/Tooltip";
import LocationAddDialog from "./LocationAddDialog";
import LocationUpdateDialog from "./LocationUpdateDialog";
import WorningDialog from "../WorningDialog";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  toolbarContainer: {
    display: "flex",
    flexDirection: "column"
  },
  tableContainer: {
    display: "flex",
    height: "85vh",
    width: "100%",
    justifyContent: "space-between",
    flexGrow: 1,
    fontSize: "18px"
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
  },
  root: {
    "& .MuiDataGrid-columnsContainer": {
      backgroundColor: "#e8eaf6",
      border: "#bdbdbd solid 1px"
    },
    "& .MuiDataGrid-colCellTitle": {
      fontWeight: "bold"
    },
    "&.MuiDataGrid-row": {
      height: "auto",
      wrapText: true
    }
  }
});

export default function LocationTable({
  locations,
  deleteLocation,
  addLocation,
  updateLocation
}) {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [parameters, setParameters] = React.useState({});
  const [openWorning, setOpenWorning] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = (event, number, name, note) => {
    setOpenAddDialog(false);
  };

  const handleUpdateDialogClose = (event, number, name, note) => {
    setOpenUpdateDialog(false);
  };
  const handleUpdateDialogOpen = params => {
    setParameters(Object.assign({}, params.row));
    setOpenUpdateDialog(true);
  };

  const handleCreate = (event, number, name, note, id) => {
    if (!name) {
      enqueueSnackbar("Нобходимо заполнить поле Название", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else if (number && isNaN(Number(number))) {
      enqueueSnackbar('В поле "номер" необходимо ввести число!', {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else {
      let location = {};
      location.name = name;
      if (!!number) location.number = number;
      if (!!note) location.note = note;
      try {
        addLocation(location);
        setOpenAddDialog(false);
      } catch (err) {
        console.log({ err });
      }
    }
  };
  const handleUpdate = (event, number, name, note, id) => {
    let location = {};
    location.id = id;
    if (!!name) location.name = name;
    if (!!number) location.number = number;
    if (!!note) location.note = note;
    updateLocation(location);
    setOpenUpdateDialog(false);
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteLocation(parameters);
  };

  const handleDeleteWorningOpen = params => {
    setOpenWorning(true);
    setParameters(Object.assign({}, params.row));
  };

  const editColumn = {
    field: "edit",
    headerName: "Редактировать",
    sortable: false,
    flex: 0.15,
    width: 135,
    renderCell: (params: CellParams) => (
      <IconButton
        aria-label="edit"
        color="primary"
        className={classes.iconButton}
        onClick={() => {
          handleUpdateDialogOpen(params);
        }}
      >
        <EditOutlinedIcon />
      </IconButton>
    )
  };

  const deleteColumn = {
    field: "delete",
    headerName: "Удалить",
    sortable: false,
    flex: 0.15,
    renderCell: (params: CellParams) => (
      <IconButton
        aria-label="delete"
        color="secondary"
        className={classes.iconButton}
        onClick={() => handleDeleteWorningOpen(params)}
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

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Места производства
          </Typography>
        </div>
        <div className={classes.tools}>
          <Tooltip title="Создать новый элемент">
            <Button
              variant="contained"
              color="primary"
              className={classes.add}
              onClick={handleAddDialogOpen}
            >
              Создать
            </Button>
          </Tooltip>
          <div>
            <GridFilterToolbarButton />
            <GridColumnsToolbarButton />
            <GridDensitySelector />
          </div>
        </div>
        <LocationAddDialog
          handleClose={handleAddDialogClose}
          handleCreate={handleCreate}
          open={openAddDialog}
        />
        <LocationUpdateDialog
          handleClose={handleUpdateDialogClose}
          handleUpdate={handleUpdate}
          open={openUpdateDialog}
          params={parameters}
        />
        <WorningDialog
          openWorning={openWorning}
          parameters={parameters}
          handleClose={handleDeleteWorningClose}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <div className={classes.tableContainer}>
      <XGrid
        className={classes.root}
        localeText={russian}
        rowHeight={40}
        pageSize={20}
        headerHeight={60}
        columnBuffer={2}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        pagination
        density="standard"
        rows={rows}
        columns={columns}
        showColumnRightBorder={true}
        showCellRightBorder={true}
        disableExtendRowFullWidth={true}
        components={{
          Toolbar: CustomToolbar
        }}
        sortModel={[
          {
            field: "number",
            sort: "asc"
          }
        ]}
        checkboxSelection
      />
    </div>
  );
}
