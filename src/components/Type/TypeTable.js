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
import TypeAddDialog from "./TypeAddDialog";
import TypeUpdateDialog from "./TypeUpdateDialog";
import WorningDialog from "../WorningDialog";
import { useSnackbar } from "notistack";

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

export default function TypeTable({ types, deleteType, addType, updateType }) {
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
    if (!number || !name) {
      enqueueSnackbar("Нобходимо заполнить поля Номер и Название", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else if (isNaN(Number(number))) {
      enqueueSnackbar('В поле "номер" необходимо ввести число!', {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else {
      let type = {};
      type.name = name;
      type.number = number;
      if (!!note) type.note = note;
      try {
        addType(type);
        setOpenAddDialog(false);
      } catch (err) {
        console.log({ err });
      }
    }
  };
  const handleUpdate = (event, number, name, note, id) => {
    let type = {};
    type.id = id;
    if (!!name) type.name = name;
    if (!!number) type.number = number;
    if (!!note) type.note = note;
    updateType(type);
    setOpenUpdateDialog(false);
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteType(parameters);
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
          console.log({ params });
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

  if (types.columns && types.columns.length > 0) {
    types.columns.push(editColumn);
    types.columns.push(deleteColumn);
  }

  const columns: ColDef[] = types.columns ? types.columns : [];
  const rows = types.rows ? types.rows : [];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Типы изделий
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
              onClick={handleAddDialogOpen}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </div>
        <TypeAddDialog
          handleClose={handleAddDialogClose}
          handleCreate={handleCreate}
          open={openAddDialog}
        />
        <TypeUpdateDialog
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