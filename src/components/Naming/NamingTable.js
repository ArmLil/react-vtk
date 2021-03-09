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
import russian from "../../constants/localeTextConstants.js";
import Tooltip from "@material-ui/core/Tooltip";
import NamingAddDialog from "./NamingAddDialog";
import NamingUpdateDialog from "./NamingUpdateDialog";
import WorningDialog from "../WorningDialog";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  toolbarContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 0.5
  },
  tableContainer: {
    display: "flex",
    height: 900,
    width: "100%",
    justifyContent: "space-between",
    flexGrow: 0.5,
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
  }
});

export default function NamingTable({
  namings,
  deleteNaming,
  addNaming,
  updateNaming
}) {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [parameters, setParameters] = React.useState({});
  const [types, setTypes] = React.useState([]);
  const [openWorning, setOpenWorning] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const handleAddDialogOpen = async () => {
    const res = await fetch("http://localhost:3001/api/v1/types");
    const data = await res.json();
    setTypes(data.types.rows);
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = (event, name, note) => {
    setOpenAddDialog(false);
  };

  const handleUpdateDialogClose = (event, name, note) => {
    setOpenUpdateDialog(false);
  };
  const handleUpdateDialogOpen = async params => {
    const res = await fetch("http://localhost:3001/api/v1/types");
    const data = await res.json();
    setTypes(data.types.rows);
    setParameters(Object.assign({}, params.row));
    setOpenUpdateDialog(true);
  };

  const handleCreate = (event, name, note, type) => {
    if (!name) {
      enqueueSnackbar("Необходимо заполнить поле Название", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else if (!type) {
      enqueueSnackbar(
        "Необходимо создать тип в списке <<Типы изделий>>, далее выбрать при создании наименования.",
        {
          variant: "warning",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        }
      );
    } else {
      let naming = {};
      naming.name = name;
      if (!!note) naming.note = note;
      if (!!type) naming.type = type;
      addNaming(naming);
      setOpenAddDialog(false);
    }
  };

  const handleUpdate = (event, name, note, type, id) => {
    let naming = {};
    naming.id = id;
    if (!!name) naming.name = name;
    if (!!note) naming.note = note;
    if (!!note) naming.type = type;
    updateNaming(naming);
    setOpenUpdateDialog(false);
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteNaming(parameters);
  };

  const handleDeleteWorningOpen = params => {
    setOpenWorning(true);
    setParameters(Object.assign({}, params.row));
  };

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

  if (namings.columns && namings.columns.length > 0) {
    namings.columns.push(editColumn);
    namings.columns.push(deleteColumn);
  }

  const columns: ColDef[] = namings.columns ? namings.columns : [];
  const rows = namings.rows ? namings.rows : [];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Наименования
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
              onClick={() => handleAddDialogOpen()}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </div>
        <NamingAddDialog
          handleClose={handleAddDialogClose}
          handleCreate={handleCreate}
          open={openAddDialog}
          types={types}
        />
        <NamingUpdateDialog
          handleClose={handleUpdateDialogClose}
          handleUpdate={handleUpdate}
          open={openUpdateDialog}
          params={parameters}
          types={types}
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
