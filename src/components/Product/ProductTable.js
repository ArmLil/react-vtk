import * as React from "react";
// import ReactPDF from "@react-pdf/renderer";
// import { PDFViewer } from "@react-pdf/renderer";
import "jspdf-autotable";
import jsPDF from "jspdf";
// import Pdf from "react-to-pdf";
import { XGrid } from "@material-ui/x-grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { GridToolbarContainer, GridToolbar } from "@material-ui/x-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import russian from "../../constants/localeTextConstants.js";
import Tooltip from "@material-ui/core/Tooltip";
import ProductAddDialog from "./ProductAddDialog";
import ProductUpdateDialog from "./ProductUpdateDialog";
// import { Link } from "react-router-dom";
// import DownloadDialog from "./Download";
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
  const [selection, setSelection] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [openWorning, setOpenWorning] = React.useState(false);
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

  const handleDeleteWorningOpen = params => {
    setOpenWorning(true);
    setParameters(Object.assign({}, params.row));
  };

  const exportPDF = () => {
    console.log({ selection, model });
    if (selection.length === 0) {
      showNotification("Необходимо выбрать строки.");
      return;
    }
    let _columns = Object.entries(model.columns.lookup);
    console.log({ _columns });
    let _headers = [];
    _columns.forEach((col, i) => {
      if (
        col[1].hide === false &&
        col[0] !== "edit" &&
        col[0] !== "delete" &&
        col[0] !== "__check__"
      ) {
        _headers.push({
          header: col[1].headerName,
          dataKey: col[1].field
        });
      }
    });
    console.log({ _headers });
    let expRows = [];
    if (model.rows && Object.keys(model.rows.idRowsLookup).length > 0) {
      selection.forEach((select, i) => {
        let _row = Object.assign({}, model.rows.idRowsLookup[select]);
        _columns.forEach((col, i) => {
          if (
            col[1].hide === false &&
            col[0] !== "edit" &&
            col[0] !== "delete" &&
            col[0] !== "__check__"
          ) {
            delete _row[col[0]];
          }
        });
        expRows.push(model.rows.idRowsLookup[select]);
      });
    }
    console.log({ expRows });

    // var font = "undefined";
    // var callAddFont = function() {
    //   this.addFileToVFS("roboto-normal.ttf", font);
    //   this.addFont("roboto-normal.ttf", "roboto", "normal");
    // };
    // jsPDF.API.events.push(["addFonts", callAddFont]);

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFont("UTF-8", "normal");
    doc.setFontSize(15);
    // console.log(doc.getFontList());
    const title = "Изделия";

    let content = {
      startY: 50,
      columns: _headers,
      body: expRows,
      styles: { halign: "center" },
      theme: "grid",
      headStyles: { halign: "center" }
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf");
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
            <GridToolbar />
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
      </GridToolbarContainer>
    );
    // onStateChange={params => {
    //   handleState(params);
    // }}
    // onFilterModelChange={onFilter => {
    //   handleFilter(onFilter);
    // }}
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
        disableColumnMenu={true}
        disableSelectionOnClick={true}
        showColumnRightBorder={true}
        showCellRightBorder={true}
        disableExtendRowFullWidth={true}
        onStateChange={params => {
          // console.log(params);
        }}
        onSelectionModelChange={params => {
          setSelection(params.selectionModel);
        }}
        onSortModelChange={params => {
          // console.log(params);
        }}
        onColumnHeaderClick={params => {
          setModel(params.api.state);
        }}
        onRowSelected={params => {
          setModel(params.api.current.state);
        }}
        components={{
          Toolbar: CustomToolbar
        }}
        sortModel={[
          {
            field: "number",
            sort: "asc"
          }
        ]}
      />
    </div>
  );
}
