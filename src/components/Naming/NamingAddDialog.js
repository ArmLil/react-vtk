import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";

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

export default function NamingAddDialog({
  handleCreate,
  handleClose,
  open,
  types
}) {
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const [decimalNumber, setDecimalNumber] = React.useState("");
  const [note, setNote] = React.useState("");
  const [type, setType] = React.useState("");

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeDecimalNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDecimalNumber(event.target.value);
  };
  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Наименование</DialogTitle>
      <DialogContent>
        <DialogContentText>Пожалуйста, заполните поля</DialogContentText>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="standard-multiline-name"
            required
            label="Название"
            multiline
            rowsMax={4}
            value={name}
            onChange={handleChangeName}
          />
          <TextField
            id="standard-select-type"
            select
            label="Тип"
            value={type}
            onChange={handleChangeType}
            onClick={e => {
              if (types.length === 0) {
                showNotification(
                  `Чтобы выбрать тип, необходимо заранее создавать их в соответствующем списке.`
                );
              }
            }}
            helperText="Выберите тип"
          >
            {types.map(option => {
              return (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            id="standard-multiline-decNumber"
            label="Децимальный номер"
            multiline
            rowsMax={4}
            value={decimalNumber}
            onChange={handleChangeDecimalNumber}
          />
          <TextField
            id="standard-multiline-note"
            label="Описание"
            multiline
            rowsMax={4}
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
          onClick={ev => handleCreate(ev, name, note, type)}
          color="primary"
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
