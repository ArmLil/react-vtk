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

export default function LocationUpdateDialog({
  handleUpdate,
  handleClose,
  open,
  params
}) {
  const classes = useStyles();
  const [name, setName] = React.useState(params.name || "");
  const [note, setNote] = React.useState(params.note || "");
  const [number, setNumber] = React.useState(params.number || "");

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Место производства</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Пожалуйста, отредактируйте нужные поля!
        </DialogContentText>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="standard-multiline-number"
            required
            label="Номер"
            multiline
            value={number}
            onChange={handleChangeNumber}
          />
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
            label="Примечание"
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
          onClick={ev => handleUpdate(ev, number, name, note, params.id)}
          color="primary"
        >
          Редактировать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
