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
import EmployeeAddDialog from "./EmployeeAddDialog";
import EmployeeUpdateDialog from "./EmployeeUpdateDialog";
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

export default function EmployeeTable({
  employees,
  deleteEmployee,
  addEmployee,
  updateEmployee
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

  const handleAddDialogClose = (event, name, note) => {
    setOpenAddDialog(false);
  };

  const handleUpdateDialogClose = (event, name, note) => {
    setOpenUpdateDialog(false);
  };
  const handleUpdateDialogOpen = params => {
    setParameters(Object.assign({}, params.row));
    setOpenUpdateDialog(true);
  };

  const handleCreate = (event, name, note, id) => {
    if (!name) {
      enqueueSnackbar("Нобходимо заполнить поле Название", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else {
      let employee = {};
      employee.name = name;
      if (!!note) employee.note = note;
      try {
        addEmployee(employee);
        setOpenAddDialog(false);
      } catch (err) {
        console.log({ err });
      }
    }
  };
  const handleUpdate = (event, name, note, id) => {
    let employee = {};
    employee.id = id;
    if (!!name) employee.name = name;
    if (!!note) employee.note = note;
    updateEmployee(employee);
    setOpenUpdateDialog(false);
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteEmployee(parameters);
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

  if (employees.columns && employees.columns.length > 0) {
    employees.columns.push(editColumn);
    employees.columns.push(deleteColumn);
  }

  const columns: ColDef[] = employees.columns ? employees.columns : [];
  const rows = employees.rows ? employees.rows : [];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Сотрудники
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
        <EmployeeAddDialog
          handleClose={handleAddDialogClose}
          handleCreate={handleCreate}
          open={openAddDialog}
        />
        <EmployeeUpdateDialog
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
