import * as React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SelectTextField from "./SelectTextField";
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
  const [count, setCount] = React.useState("1");
  const [bookingDate, setBookingDate] = React.useState("");
  const [note, setNote] = React.useState("");

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
          <SelectTextField
            items={namings}
            required={true}
            needId={true}
            title="Наименование"
            value={""}
            getItem={item => {
              setProduct(Object.assign(product, { namingId: item }));
            }}
          />
          <TextField
            id="standard-multiline-booking"
            label="Дата бронирования"
            value={bookingDate}
            onChange={handleChangeBookingDate}
            placeholder="ДД.ММ.ГГ"
          />
          <SelectTextField
            items={locations}
            needId={true}
            title="Место производства"
            required={true}
            value={""}
            getItem={item => {
              setProduct(Object.assign(product, { locationId: item }));
            }}
          />
          <SelectTextField
            items={employees}
            needId={true}
            title="Сотрудники"
            value={""}
            getItem={item => {
              setProduct(Object.assign(product, { employeeId: item }));
            }}
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
        <Button onClick={ev => handleCreate(ev, product)} color="primary">
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
