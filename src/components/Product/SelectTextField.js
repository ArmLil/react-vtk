import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { useSnackbar } from "notistack";

export default function SelectTextField({
  items,
  getItem,
  title,
  needId,
  required
}) {
  const [item, setItem] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    getItem(event.target.value);
    setItem(event.target.value);
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
    <TextField
      id="standard-select-currency"
      select
      label={title}
      value={item}
      required={required}
      onChange={handleChange}
      onClick={e => {
        // e.preventDefault();
        // e.stopPropagation();
        if (items.length === 0) {
          showNotification(
            `Чтобы выбрать ${title}, необходимо заранее создавать их в соответствующем списке.`
          );
        }
      }}
    >
      {[...items, { id: 0, name: null }].map(option => (
        <MenuItem key={option.id} value={needId ? option.id : option.name}>
          {option.name ? option.name : "NONE"}
        </MenuItem>
      ))}
    </TextField>
  );
}
