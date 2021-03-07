import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import NoteTable from "../components/Note/NoteTable";
var moment = require("moment");

const Note = () => {
  const [notes, setNotes] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getNotes = async () => {
      const notesFromServer = await fetchNotes();
      setNotes(notesFromServer);
    };
    getNotes();
  }, []);

  // Fetch Notes
  const fetchNotes = async () => {
    const res = await fetch("http://localhost:3001/api/v1/notes");
    const data = await res.json();
    let columns = [];
    let rows = data.notes.rows;
    let locColumns = [];
    if (data.notes.count > 0) locColumns = Object.keys(data.notes.rows[0]);

    locColumns.forEach(item => {
      let obj = {};
      switch (item) {
        case "id":
          obj.headerName = "ID";
          obj.field = item;
          break;
        case "name":
          obj.headerName = "Название";
          obj.field = item;
          obj.flex = 0.4;
          break;
        case "createdAt":
          obj.headerName = "Дата создания";
          obj.field = item;
          obj.flex = 0.2;
          break;
        case "updatedAt":
          obj.headerName = "Дата редактирования";
          obj.field = item;
          obj.flex = 0.3;
          break;
        case "description":
          obj.headerName = "Описание";
          obj.field = item;
          obj.flex = 0.4;
          break;
        default:
          break;
      }
      if (data.notes.count > 0 && item !== "deletedAt") {
        columns.push(obj);
      }
    });

    let notes = {};
    notes.rows = rows.map(row => {
      row.createdAt = moment(row.createdAt).format("YYYY.MM.DD HH:mm");
      row.updatedAt = moment(row.updatedAt).format("YYYY.MM.DD HH:mm");
      return row;
    });
    notes.columns = columns;
    return notes;
  };

  // Add Note
  const addNote = async note => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/notes/", {
        method: "POST",
        body: JSON.stringify(note),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      let newRows = [];
      if (notes.columns.length > 0) {
        data.note[0].createdAt = moment(data.note.createdAt).format(
          "YYYY.MM.DD HH:mm"
        );
        data.note[0].updatedAt = moment(data.note.updatedAt).format(
          "YYYY.MM.DD HH:mm"
        );
        newRows = [...notes.rows, data.note[0]];
        let newNotes = Object.assign(
          {},
          { columns: notes.columns, rows: newRows }
        );
        setNotes(newNotes);
      } else {
        const notesFromServer = await fetchNotes();
        setNotes(notesFromServer);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  // Add Note
  const updateNote = async note => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(note)
      });

      const data = await res.json();
      if (data["Bad Request"]) throw new Error(data["Bad Request"]);
      if (data["errorMessage"]) throw new Error(data["errorMessage"]);
      data.note.createdAt = moment(data.note.createdAt).format(
        "YYYY.MM.DD HH:mm"
      );
      data.note.updatedAt = moment(data.note.updatedAt).format(
        "YYYY.MM.DD HH:mm"
      );
      let newRows = [];
      if (notes.columns.length > 0) {
        newRows = notes.rows.map(loc => (loc.id === note.id ? data.note : loc));
        let newNotes = Object.assign(
          {},
          { columns: notes.columns, rows: newRows }
        );
        setNotes(newNotes);
      } else {
        const notesFromServer = await fetchNotes();
        setNotes(notesFromServer);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  // Delete Note
  const deleteNote = async parameters => {
    try {
      await fetch(`http://localhost:3001/api/v1/notes/${parameters.id}`, {
        method: "DELETE"
      });

      let newRows = notes.rows.filter(row => row.id !== parameters.id);
      let newNotes = Object.assign(
        {},
        { columns: notes.columns, rows: newRows }
      );
      setNotes(newNotes);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }
  };

  return (
    <NoteTable
      notes={notes}
      deleteNote={deleteNote}
      addNote={addNote}
      updateNote={updateNote}
    ></NoteTable>
  );
};

export default Note;
