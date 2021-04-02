import * as React from "react";
import { XGrid } from "@material-ui/x-grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { GridToolbarContainer, GridToolbar } from "@material-ui/x-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import russian from "../../constants/localeTextConstants.js";
import Tooltip from "@material-ui/core/Tooltip";
import EmployeeAddDialog from "./EmployeeAddDialog";
import EmployeeUpdateDialog from "./EmployeeUpdateDialog";
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

  const handleCreate = (event, name, secondName, fatherName, note, id) => {
    if (!name || !secondName) {
      enqueueSnackbar("Нобходимо заполнить поля Имя, Фамилия", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    } else {
      let employee = {};
      employee.name = name;
      employee.secondName = secondName;
      if (!!fatherName) employee.fatherName = fatherName;
      if (!!note) employee.note = note;
      try {
        addEmployee(employee);
        setOpenAddDialog(false);
      } catch (err) {
        console.log({ err });
      }
    }
  };
  const handleUpdate = (event, name, secondName, fatherName, note, id) => {
    let employee = {};
    employee.id = id;
    if (!!name) employee.name = name;
    if (!!secondName) employee.secondName = secondName;
    if (!!fatherName) employee.fatherName = fatherName;
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
          <Tooltip title="Создать новый элемент">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDialogOpen}
            >
              Создать
            </Button>
          </Tooltip>
          <div>
            <GridToolbar />
          </div>
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
    <div className={classes.tableContainer}>
      <XGrid
        className={classes.root}
        localeText={russian}
        rowHeight={50}
        pageSize={20}
        headerHeight={60}
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
        sortModel={[
          {
            field: "createdAt",
            sort: "asc"
          }
        ]}
        checkboxSelection
      />
    </div>
  );
}
