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
import DecimalNumberAddDialog from "./DecimalNumberAddDialog";
import DecimalNumberUpdateDialog from "./DecimalNumberUpdateDialog";
import WorningDialog from "../WorningDialog";
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

export default function DecimalNumberTable({
  decimalNumbers,
  deleteDecimalNumber,
  addDecimalNumber,
  updateDecimalNumber
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
      let decimalNumber = {};
      decimalNumber.name = name;
      if (!!note) decimalNumber.note = note;
      try {
        addDecimalNumber(decimalNumber);
        setOpenAddDialog(false);
      } catch (err) {
        console.log({ err });
      }
    }
  };
  const handleUpdate = (event, name, note, id) => {
    let decimalNumber = {};
    decimalNumber.id = id;
    if (!!name) decimalNumber.name = name;
    if (!!note) decimalNumber.note = note;
    updateDecimalNumber(decimalNumber);
    setOpenUpdateDialog(false);
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteDecimalNumber(parameters);
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

  if (decimalNumbers.columns && decimalNumbers.columns.length > 0) {
    decimalNumbers.columns.push(editColumn);
    decimalNumbers.columns.push(deleteColumn);
  }

  const columns: ColDef[] = decimalNumbers.columns
    ? decimalNumbers.columns
    : [];
  const rows = decimalNumbers.rows ? decimalNumbers.rows : [];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Децимальные номера
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
        <DecimalNumberAddDialog
          handleClose={handleAddDialogClose}
          handleCreate={handleCreate}
          open={openAddDialog}
        />
        <DecimalNumberUpdateDialog
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
