import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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

export default function EmployeeAddDialog({ handleCreate, handleClose, open }) {
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const [note, setNote] = React.useState("");
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Сотрудник</DialogTitle>
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
        <Button onClick={ev => handleCreate(ev, name, note)} color="primary">
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
