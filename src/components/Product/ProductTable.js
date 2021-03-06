import * as React from "react";
// import "./Roboto-Italic-italic.js";
// import "./Roboto-Regular-italic.js";
import "./FiraSans-Regular-normal.js";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { XGrid } from "@material-ui/x-grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
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
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ProductAddDialog from "./ProductAddDialog";
import ProductUpdateDialog from "./ProductUpdateDialog";
import WorningDialog from "../WorningDialog";
import Button from "@material-ui/core/Button";

import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  toolbarContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 0.5
  },
  titleLevel: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    justifyContent: "center"
  },
  buttonDownload: {
    marginTop: 20
  },
  title: {
    display: "flex",
    flex: 1,
    justifyContent: "center"
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
    },
    margin: 0,
    padding: 1
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
  const [model, setModel] = React.useState({});
  const [orientation, setOrientation] = React.useState("portrait");
  const [selection, setSelection] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [openWorning, setOpenWorning] = React.useState(false);
  const [openRowsWorning, setOpenRowsWorning] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  React.useEffect(() => {
    const setItemsStates = async () => {
      const resNamings = await fetch("http://localhost:3001/api/v1/namings");
      const dataNamings = await resNamings.json();
      let namings_ = dataNamings.namings.rows.map(naming => {
        return Object.assign({}, naming, {
          name: `${naming.name} ${naming.decimalNumber}`
        });
      });
      setNamings(namings_);

      const resLocations = await fetch(
        "http://localhost:3001/api/v1/locations"
      );
      const dataLocations = await resLocations.json();
      setLocations(dataLocations.locations.rows);
      const resEmployees = await fetch(
        "http://localhost:3001/api/v1/employees"
      );
      const dataEmployees = await resEmployees.json();
      let employees_ = dataEmployees.employees.rows.map(loc => {
        return Object.assign({}, loc, {
          name: `${loc.secondName} ${loc.name[0]}.${loc.fatherName[0]}.`
        });
      });
      setEmployees(employees_);
    };
    setItemsStates();
  }, []);

  const handleAddDialogOpen = async () => {
    setOpenAddDialog(true);
  };

  const handleUpdateDialogOpen = async params => {
    let _params = Object.assign({}, params.row);
    for (let param in _params) {
      if (_params[param] === null) _params[param] = "";
    }
    setParameters(Object.assign({}, _params));
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
    else if (!product.locationId)
      showNotification("Необходимо выбрать Место производства.");
    else if (
      product.bookingDate &&
      !product.bookingDate.match(
        /^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/
      )
    ) {
      showNotification("Неправильный фомат даты бронирования.");
    } else {
      addProduct(product);
      setOpenAddDialog(false);
    }
  };

  const handleUpdate = (event, product) => {
    if (
      product.bookingDate &&
      !product.bookingDate.match(
        /^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/
      )
    ) {
      showNotification("Неправильный фомат даты бронирования.");
    } else {
      updateProduct(product);
      setOpenUpdateDialog(false);
    }
  };

  const handleDeleteWorningClose = action => {
    setOpenWorning(false);
    if (action === "submit") deleteProduct(parameters);
  };

  const handleDeleteRowsWorningClose = action => {
    if (action === "submit") {
      if (model.rows && Object.keys(model.rows.idRowsLookup).length > 0) {
        selection.forEach((select, i) => {
          deleteProduct(model.rows.idRowsLookup[select], "group");
        });
      }
      setSelection([]);
      setOpenRowsWorning(false);
    }
  };

  const handleDeleteWorningOpen = params => {
    setOpenWorning(true);
    setParameters(Object.assign({}, params.row));
  };

  const exportPDF = () => {
    // console.log({ selection, model });
    if (selection.length === 0) {
      showNotification("Необходимо выбрать строки.");
      return;
    }
    let _columns = Object.entries(model.columns.lookup);
    let _headers = [];
    _columns.forEach((col, i) => {
      if (
        col[1].hide === false &&
        col[0] !== "edit" &&
        col[0] !== "delete" &&
        col[0] !== "__check__"
      ) {
        if (col[0] === "type") {
          _headers.push({
            header: col[1].headerName,
            dataKey: "typeNumber"
          });
        } else if (col[0] === "location") {
          _headers.push({
            header: col[1].headerName,
            dataKey: "locationNumber"
          });
        } else {
          _headers.push({
            header: col[1].headerName,
            dataKey: col[0]
          });
        }
      }
    });
    let expRows = [];
    if (model.rows && Object.keys(model.rows.idRowsLookup).length > 0) {
      selection.forEach((select, i) => {
        expRows.push(model.rows.idRowsLookup[select]);
      });
    }

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const _orientation = orientation; // portrait or landscape

    const doc = new jsPDF(_orientation, unit, size);
    doc.setFontSize(15);
    doc.setFont("FiraSans-Regular", "normal");
    const title = "ВТК - изделия";
    doc.setFillColor(0);
    let content = {
      startY: 70,
      columns: _headers,
      body: expRows,
      styles: {
        halign: "center",
        font: "FiraSans-Regular",
        lineColor: "black"
      },
      theme: "grid",
      headStyles: {
        halign: "center",
        fillColor: "#e8eaf6",
        textColor: "black",
        lineWidth: 0.5
      }
    };

    doc.text(title, 40, 40);
    doc.autoTable(content);
    doc.save("report_vtk.pdf");
  };

  const editColumn = {
    field: "edit",
    headerName: "Редактировать",
    sortable: false,
    flex: 0.2,
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
    flex: 0.2,
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
        <div className={classes.titleLevel}>
          <Typography variant="h5" gutterBottom className={classes.title}>
            Изделия
          </Typography>
          <div className={classes.buttonDownload}>
            <TextField
              style={{ width: 110, marginRight: 5 }}
              InputProps={{ style: { fontSize: 14 } }}
              id="filled-select-currency"
              select
              value={orientation}
              onChange={ev => {
                setOrientation(ev.target.value);
              }}
              helperText="Ориентация"
            >
              <MenuItem key="0" value="landscape" style={{ fontSize: 14 }}>
                Альбомная
              </MenuItem>
              <MenuItem key="1" value="portrait" style={{ fontSize: 14 }}>
                Книжная
              </MenuItem>
            </TextField>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => exportPDF()}
            >
              {" "}
              скачать
            </Button>
          </div>
        </div>

        <div className={classes.tools}>
          <div>
            <Tooltip title="Создать новый элемент">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleAddDialogOpen}
              >
                Создать
              </Button>
            </Tooltip>
            <Button
              color="secondary"
              size="small"
              style={{ marginLeft: 5 }}
              disabled={selection.length > 0 ? false : true}
              onClick={() => setOpenRowsWorning(true)}
              startIcon={
                <DeleteIcon
                  aria-label="delete"
                  className={classes.iconButton}
                  style={{ margin: 0 }}
                ></DeleteIcon>
              }
            >
              Удалить
            </Button>
          </div>
          <div>
            <GridFilterToolbarButton />
            <GridColumnsToolbarButton />
            <GridDensitySelector />
          </div>
        </div>
        <ProductAddDialog
          handleClose={() => setOpenAddDialog(false)}
          handleCreate={handleCreate}
          open={openAddDialog}
          namings={namings}
          locations={locations}
          employees={employees}
        />
        <ProductUpdateDialog
          handleClose={() => setOpenUpdateDialog(false)}
          handleUpdate={handleUpdate}
          open={openUpdateDialog}
          params={parameters}
          namings={namings}
          locations={locations}
          employees={employees}
        />
        <WorningDialog
          openWorning={openWorning}
          parameters={parameters}
          handleClose={handleDeleteWorningClose}
        />
        <WorningDialog
          openWorning={openRowsWorning}
          parameters={{ name: "отмеченные строки" }}
          handleClose={handleDeleteRowsWorningClose}
        />
      </GridToolbarContainer>
    );
  }

  const ref = React.createRef();

  return (
    <div className={classes.tableContainer}>
      <XGrid
        ref={ref}
        checkboxSelection={true}
        className={classes.root}
        localeText={russian}
        rowHeight={40}
        pageSize={20}
        headerHeight={60}
        columnBuffer={2}
        rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
        pagination
        density="standard"
        rows={rows}
        columns={columns}
        disableSelectionOnClick={true}
        showColumnRightBorder={true}
        showCellRightBorder={true}
        disableExtendRowFullWidth={true}
        onSelectionModelChange={params => {
          setSelection(params.selectionModel);
        }}
        onColumnHeaderClick={params => {
          setModel(Object.assign({}, params.api.state));
        }}
        onRowSelected={params => {
          setModel(Object.assign({}, params.api.current.state));
        }}
        components={{
          Toolbar: CustomToolbar
        }}
      />
    </div>
  );
}
