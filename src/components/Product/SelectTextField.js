import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

export default function SelectTextField({ items, getItem, title, needId }) {
  const [item, setItem] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem(event.target.value);
    getItem(event.target.value);
  };

  return (
    <TextField
      id="standard-select-currency"
      select
      label={title}
      value={item}
      onChange={handleChange}
    >
      {items.map(option => (
        <MenuItem key={option.id} value={needId ? option.id : option.name}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
