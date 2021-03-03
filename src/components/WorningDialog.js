import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function WorningDialog({
  openWorning,
  handleClose,
  parameters
}) {
  return (
    <Dialog
      open={openWorning}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title"></DialogTitle>
      <DialogContent>
        <DialogContentText>
          Вы действительно хотите удалить {parameters.name} ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Отменить
        </Button>
        <Button onClick={() => handleClose("submit")} color="primary">
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
