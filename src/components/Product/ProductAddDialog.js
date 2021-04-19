import * as React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSnackbar } from "notistack";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "55ch"
      }
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginRight: 35
    }
  })
);

export default function NamingAddDialog({
  handleCreate,
  handleClose,
  open,
  namings,
  locations,
  employees
}) {
  const classes = useStyles();
  const [product, setProduct] = React.useState({});
  const [number, setNumber] = React.useState("");
  const [naming, setNaming] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [employee, setEmployee] = React.useState("");
  const [count, setCount] = React.useState(1);
  const [bookingDate, setBookingDate] = React.useState("");
  const [note, setNote] = React.useState("");
  const [inputNaming, setInputNaming] = React.useState("");
  const [inputLocation, setInputLocation] = React.useState("");
  const [inputEmployee, setInputEmployee] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();
  const showNotification = text => {
    enqueueSnackbar(text, {
      variant: "warning",
      anchorOrigin: {
        vertical: "top",
        horizontal: "center"
      }
    });
  };

  const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(Object.assign(event.target.value));
    setProduct(Object.assign(product, { number: event.target.value }));
  };

  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
    setProduct(Object.assign(product, { note: event.target.value }));
  };

  const handleChangeCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(event.target.value);
    setProduct(Object.assign(product, { count: event.target.value }));
  };

  const handleChangeBookingDate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBookingDate(event.target.value);
    setProduct(Object.assign(product, { bookingDate: event.target.value }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <div className={classes.header}>
        <DialogTitle id="form-dialog-title">Изделие</DialogTitle>
        <TextField
          style={{ width: 150, marginTop: 20 }}
          InputProps={{ inputProps: { min: 1, max: 50 } }}
          id="standard-count"
          type="number"
          helperText="Количество создаваемых элементов"
          value={count}
          onChange={handleChangeCount}
        />
      </div>

      <DialogContent>
        <DialogContentText>Пожалуйста, заполните поля!</DialogContentText>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="standard-multiline-number"
            label="№п.п."
            value={number}
            onChange={handleChangeNumber}
          />
          <Autocomplete
            options={[...namings, ""]}
            inputValue={inputNaming}
            value={naming}
            onChange={(event, newValue) => {
              if (newValue && newValue.id)
                setProduct(Object.assign(product, { namingId: newValue.id }));
              else setProduct(Object.assign(product, { namingId: null }));
              setNaming(newValue);
            }}
            onOpen={() => {
              if (namings.length === 0) {
                showNotification(
                  `Чтобы выбрать Наименование, необходимо заранее создавать их в соответствующем списке.`
                );
              }
            }}
            onInputChange={(event, newInputNaming) => {
              setInputNaming(newInputNaming);
            }}
            getOptionLabel={option => {
              let showValue = "";
              if (option.name)
                showValue = `${option.name}, ${option.decimalNumber}(дец.ном), ${option.type.name}(тип)`;
              return showValue;
            }}
            id="controllable-states-demo"
            style={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} label="Наименование" multiline></TextField>
            )}
          />
          <TextField
            id="standard-multiline-booking"
            label="Дата бронирования"
            value={bookingDate}
            onChange={handleChangeBookingDate}
            placeholder="ДД.ММ.ГГ"
          />
          <Autocomplete
            options={[...locations, ""]}
            inputValue={inputLocation}
            value={location}
            onChange={(event, newValue) => {
              if (newValue && newValue.id)
                setProduct(Object.assign(product, { locationId: newValue.id }));
              else setProduct(Object.assign(product, { locationId: null }));
              setLocation(newValue);
            }}
            onOpen={() => {
              if (locations.length === 0) {
                showNotification(
                  `Чтобы выбрать Место, необходимо заранее создавать их в соответствующем списке.`
                );
              }
            }}
            onInputChange={(event, newInputLocation) => {
              setInputLocation(newInputLocation);
            }}
            getOptionLabel={option => {
              let showValue = "";
              if (option.name) showValue = `${option.name}, ${option.number}`;
              return showValue;
            }}
            id="controllable-states-loc"
            style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                label="Место производства"
                multiline
              ></TextField>
            )}
          />
          <Autocomplete
            options={[...employees, ""]}
            inputValue={inputEmployee}
            value={employee}
            onChange={(event, newValue) => {
              if (newValue && newValue.id)
                setProduct(Object.assign(product, { employeeId: newValue.id }));
              else setProduct(Object.assign(product, { employeeId: null }));
              setEmployee(newValue);
            }}
            onOpen={() => {
              if (employees.length === 0) {
                showNotification(
                  `Чтобы выбрать Сотрудников, необходимо заранее создавать их в соответствующем списке.`
                );
              }
            }}
            onInputChange={(event, newInputEmployee) => {
              setInputEmployee(newInputEmployee);
            }}
            getOptionLabel={option => {
              let showValue = "";
              if (option.name) showValue = `${option.name}`;
              return showValue;
            }}
            id="controllable-states-employee"
            style={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} label="Сотрудники"></TextField>
            )}
          />
          <TextField
            id="standard-multiline-description"
            label="Примечание"
            value={note}
            onChange={handleChangeNote}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Отменить
        </Button>
        <Button
          onClick={ev =>
            handleCreate(ev, Object.assign(product, { count: count }))
          }
          color="primary"
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
