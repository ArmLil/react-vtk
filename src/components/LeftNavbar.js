import React from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import PinDrop from "@material-ui/icons/PinDrop";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import Toc from "@material-ui/icons/Toc";
import { Link } from "react-router-dom";

export default function LeftNavbar() {
  return (
    <List>
      <Link to={"/products"} style={{ textDecoration: "none", color: "black" }}>
        <ListItem button key="Изделия">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Изделия" />
        </ListItem>
      </Link>
      <Divider />
      <Link
        to={"/locations"}
        style={{ textDecoration: "none", color: "black" }}
      >
        <ListItem button key="Места производства">
          <ListItemIcon>
            <PinDrop />
          </ListItemIcon>
          <ListItemText primary="Места производства" />
        </ListItem>
      </Link>
      <Link to={"/namings"} style={{ textDecoration: "none", color: "black" }}>
        <ListItem button key="Наименования">
          <ListItemIcon>
            <Toc />
          </ListItemIcon>
          <ListItemText primary="Наименования" />
        </ListItem>
      </Link>
      <Link to={"/types"} style={{ textDecoration: "none", color: "black" }}>
        <ListItem button key="Типы изделий">
          <ListItemIcon>
            <MergeTypeIcon />
          </ListItemIcon>
          <ListItemText primary="Типы изделий" />
        </ListItem>
      </Link>
      <Link
        to={"/employees"}
        style={{ textDecoration: "none", color: "black" }}
      >
        <ListItem button key="Сотрудники">
          <ListItemIcon>
            <AssignmentIndIcon />
          </ListItemIcon>
          <ListItemText primary="Сотрудники" />
        </ListItem>
      </Link>
    </List>
  );
}
