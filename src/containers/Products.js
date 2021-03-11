import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import Tooltip from "@material-ui/core/Tooltip";
import ProductTable from "../components/Product/ProductTable";
import Button from "@material-ui/core/Button";
var moment = require("moment");

const Product = () => {
  const [products, setProducts] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getProducts = async () => {
      const productsFromServer = await fetchProducts();
      setProducts(productsFromServer);
    };
    getProducts();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3001/api/v1/products");
    const data = await res.json();
    let columns = [];
    let rows = data.products.rows.slice(0);
    let products = {};

    products.rows = rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      row.typeNumber = row.type.number;
      row.type = row.type.name;
      if (row.naming) row.naming = row.naming.name;
      if (row.decimalNumber) row.decimalNumber = row.decimalNumber.name;
      row.locationNumber = row.location.number;
      if (row.location) row.location = row.location.name;
      if (row.note) row.note = row.note.name;
      if (row.employee) row.employee = row.employee.name;
      return row;
    });
    let locColumns = [];
    if (data.products.count > 0)
      locColumns = Object.keys(data.products.rows[0]);

    locColumns.forEach(item => {
      let obj = {};
      switch (item) {
        case "id":
          obj.hide = true;
          obj.headerName = "ID";
          obj.field = item;
          obj.flex = 0.2;
          break;
        case "naming":
          obj.headerName = "Наименование";
          obj.field = item;
          obj.flex = 0.6;
          break;
        case "number":
          obj.headerName = "Номер";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "decimalNumber":
          obj.headerName = "Децимальный номер";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "bookingDate":
          obj.headerName = "Дата бронирования";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "year":
          obj.headerName = "Год";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "location":
          obj.headerName = "Место производства";
          obj.field = item;
          obj.flex = 0.3;
          obj.renderCell = (params: CellParams) => (
            <Tooltip title={params.row.location} placement="bottom">
              <Button style={{ textTransform: "lowercase" }}>
                {params.row.locationNumber}
              </Button>
            </Tooltip>
          );
          break;
        case "type":
          obj.headerName = "Тип изделия ";
          obj.field = item;
          obj.flex = 0.3;
          obj.renderCell = (params: CellParams) => (
            <Tooltip title={params.row.type} placement="bottom">
              <Button style={{ textTransform: "lowercase" }}>
                {params.row.typeNumber}
              </Button>
            </Tooltip>
          );
          break;
        case "serialNumber":
          obj.headerName = "Порядковый номер";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "employee":
          obj.headerName = "Сотрудник";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "description":
          obj.headerName = "Описание";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "createdAt":
          obj.hide = true;
          obj.headerName = "Дата создания";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "updatedAt":
          obj.hide = true;
          obj.headerName = "Дата редактирования";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "note":
          obj.headerName = "Примечание";
          obj.field = item;
          obj.flex = 0.4;
          break;
        default:
          break;
      }
      if (
        data.products.count > 0 &&
        item !== "deletedAt" &&
        item !== "typeId" &&
        item !== "namingId" &&
        item !== "locationId" &&
        item !== "noteId" &&
        item !== "typeNumber" &&
        item !== "locationNumber" &&
        item !== "decimalNumberId" &&
        item !== "employeeId"
      ) {
        columns.push(obj);
      }
    });

    let _columns = [];

    columns.forEach((col, index) => {
      if (col.field === "id") _columns[0] = col;
      if (col.field === "number") _columns[1] = col;
      if (col.field === "naming") _columns[2] = col;
      if (col.field === "decimalNumber") _columns[3] = col;
      if (col.field === "bookingDate") _columns[4] = col;
      if (col.field === "year") _columns[5] = col;
      if (col.field === "location") _columns[6] = col;
      if (col.field === "type") _columns[7] = col;
      if (col.field === "serialNumber") _columns[8] = col;
      if (col.field === "note") _columns[9] = col;
      if (col.field === "employee") _columns[10] = col;
      if (col.field === "description") _columns[11] = col;
      if (col.field === "createdAt") _columns[12] = col;
      if (col.field === "updatedAt") _columns[13] = col;
    });

    products.columns = _columns;
    return products;
  };

  const addProduct = async product => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/products/", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [];
      console.log({ data });
      if (products.columns.length > 0) {
        data.product.createdAt = moment(data.product.createdAt).format(
          "YYYY.MM.DD HH:mm"
        );
        data.product.updatedAt = moment(data.product.updatedAt).format(
          "YYYY.MM.DD HH:mm"
        );

        newRows = [...products.rows, data.product];
        let newProducts = Object.assign(
          {},
          { columns: products.columns, rows: newRows }
        );
        setProducts(newProducts);
      } else {
        const productsFromServer = await fetchProducts();
        setProducts(productsFromServer);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  const updateProduct = async product => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(product)
        }
      );

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      data.product.createdAt = moment(data.product.createdAt).format(
        "YYYY.MM.DD HH:mm"
      );
      data.product.updatedAt = moment(data.product.updatedAt).format(
        "YYYY.MM.DD HH:mm"
      );
      let newRows = [];
      data.product.type = data.product.type.name;
      if (products.columns.length > 0) {
        newRows = products.rows.map(loc =>
          loc.id === product.id ? data.product : loc
        );
        let newProducts = Object.assign(
          {},
          { columns: products.columns, rows: newRows }
        );
        setProducts(newProducts);
      } else {
        const productsFromServer = await fetchProducts();
        setProducts(productsFromServer);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  // Delete Product
  const deleteProduct = async parameters => {
    try {
      await fetch(`http://localhost:3001/api/v1/products/${parameters.id}`, {
        method: "DELETE"
      });

      let newRows = products.rows.filter(row => row.id !== parameters.id);
      let newProducts = Object.assign(
        {},
        { columns: products.columns, rows: newRows }
      );
      setProducts(newProducts);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  return (
    <ProductTable
      products={products}
      deleteProduct={deleteProduct}
      addProduct={addProduct}
      updateProduct={updateProduct}
    ></ProductTable>
  );
};

export default Product;
