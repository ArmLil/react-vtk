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
import ProductAddDialog from "./ProductAddDialog";
import ProductUpdateDialog from "./ProductUpdateDialog";
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

export default function ProductTable({
  products,
  deleteProduct,
  addProduct,
  updateProduct
}) {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [parameters, setParameters] = React.useState({});
  const [namings, setNamings] = React.useState([]);
  const [decimalNumbers, setDecimalNumbers] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [openWorning, setOpenWorning] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const handleAddDialogOpen = async () => {
    if (namings.length === 0) {
      const resNamings = await fetch("http://localhost:3001/api/v1/namings");
      const dataNamings = await resNamings.json();
      setNamings(dataNamings.namings.rows);
    }
    if (decimalNumbers.length === 0) {
      const resDecimalNumbers = await fetch(
        "http://localhost:3001/api/v1/decimalNumbers"
      );
      const dataDecimalNumbers = await resDecimalNumbers.json();
      setDecimalNumbers(dataDecimalNumbers.decimalNumbers.rows);
    }
    if (locations.length === 0) {
      const resLocations = await fetch(
        "http://localhost:3001/api/v1/locations"
      );
      const dataLocations = await resLocations.json();
      setLocations(dataLocations.locations.rows);
    }
    if (notes.length === 0) {
      const resNotes = await fetch("http://localhost:3001/api/v1/notes");
      const dataNotes = await resNotes.json();
      setNotes(dataNotes.notes.rows);
    }
    if (employees.length === 0) {
      const resEmployees = await fetch(
        "http://localhost:3001/api/v1/employees"
      );
      const dataEmployees = await resEmployees.json();
      setEmployees(dataEmployees.employees.rows);
    }

    setOpenAddDialog(true);
  };

  const handleUpdateDialogClose = () => {
    setOpenUpdateDialog(false);
  };
  const handleUpdateDialogOpen = async params => {
    // const res = await fetch("http://localhost:3001/api/v1/types");
    // const data = await res.json();
    setParameters(Object.assign({}, params.row));
    setOpenUpdateDialog(true);
  };

  const showNotification = text => {
    enqueueSnackbar(text, {
      variant: "warning",
      anchorOrigin: {
        vertical: "top",
        horizontal: "center"
      }
    });
  };

  const handleCreate = (event, product) => {
    if (!product.namingId) showNotification("Необходимо выбрать Наименование.");
    // else if (!product.decimalNumberId)
    //   showNotification(
    //     "Необходимо выбрать Децимальный номер."
    //   );
    else if (!product.locationId)
      showNotification("Необходимо выбрать Место производства.");
    else {
      addProduct(product);
      setOpenAddDialog(false);
    }
  };

  const handleUpdate = (event, name, note, id) => {
    let product = {};
    product.id = id;
    if (!!name) product.name = name;
    if (!!note) product.note = note;
    // if (!!note) product.type = type;
    updateProduct(product);
    setOpenUpdateDialog(false);
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteProduct(parameters);
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

  if (products.columns && products.columns.length > 0) {
    products.columns.push(editColumn);
    products.columns.push(deleteColumn);
  }

  const columns: ColDef[] = products.columns ? products.columns : [];
  const rows = products.rows ? products.rows : [];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <div>
          <Typography variant="h5" gutterBottom>
            Изделия
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
        <ProductAddDialog
          handleClose={() => setOpenAddDialog(false)}
          handleCreate={handleCreate}
          open={openAddDialog}
          namings={namings}
          locations={locations}
          decimalNumbers={decimalNumbers}
          notes={notes}
          employees={employees}
        />
        <ProductUpdateDialog
          handleClose={handleUpdateDialogClose}
          handleUpdate={handleUpdate}
          open={openUpdateDialog}
          params={parameters}
          // types={types}
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
