import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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
    }
  })
);

export default function ProductUpdateDialog({
  params,
  handleUpdate,
  handleClose,
  open,
  namings,
  decimalNumbers,
  locations,
  notes,
  employees
}) {
  const classes = useStyles();
  const [product, setProduct] = React.useState(params);
  const [number, setNumber] = React.useState(params.number);
  const [description, setDescription] = React.useState(params.description);

  const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
    setProduct(Object.assign(product, { number: event.target.value }));
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
    setProduct(Object.assign(product, { description: event.target.value }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Изделия</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Пожалуйста, отредактируйте нужные поля!
        </DialogContentText>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="standard-number"
            label="Номер"
            value={number}
            onChange={handleChangeNumber}
          />
          <SelectTextField
            items={namings}
            required={true}
            needId={true}
            value={params.namingId}
            title="Наименование"
            getItem={item => {
              setProduct(Object.assign(product, { namingId: item }));
            }}
          />
          <SelectTextField
            items={decimalNumbers}
            needId={true}
            title="Децимальный номер"
            value={params.decimalNumberId}
            getItem={item => {
              setProduct(Object.assign(product, { decimalNumberId: item }));
            }}
          />
          <SelectTextField
            items={locations}
            needId={true}
            title="Место производства"
            value={params.locationId}
            getItem={item => {
              setProduct(Object.assign(product, { locationId: item }));
            }}
          />
          <SelectTextField
            items={notes}
            needId={true}
            title="Примечание"
            value={params.noteId}
            getItem={item => {
              setProduct(Object.assign(product, { noteId: item }));
            }}
          />
          <SelectTextField
            items={employees}
            needId={true}
            title="Сотрудники"
            value={params.employeeId}
            getItem={item => {
              setProduct(Object.assign(product, { employeeId: item }));
            }}
          />
          <TextField
            id="standard-multiline-description"
            label="Описание"
            value={description}
            onChange={handleChangeDescription}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Отменить
        </Button>
        <Button onClick={ev => handleUpdate(ev, product)} color="primary">
          Редактировать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
