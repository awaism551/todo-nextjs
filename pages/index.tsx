import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from "@material-ui/core";
import { Add, ArrowUpward, Delete } from "@material-ui/icons";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MaterialTable, { MTableToolbar } from "material-table";
import type { NextPage } from "next";
import { forwardRef, useState } from "react";
import styles from "../styles/Home.module.css";

interface Todo {
  id: number;
  title: string;
}

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [UpdateTitle, setUpdateTitle] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setUpdateTitle(selectedTodos[0]?.title)
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleUpdateAndClose = () => {
    let idToupdate: number = selectedTodos[0]?.id;
    todos.forEach((todo: Todo) => {
      if (todo.id === idToupdate) {
        todo.title = UpdateTitle;
      }
    })
    // setSelectedTodos([])
    setOpenDialog(false);
  }

  const handleUpdateFieldChange = (event: any) => {
    setUpdateTitle(event.target.value)
  }

  const components = {
    Toolbar: (props: any) => (
      <div className={styles.firstRow}>
        <Box className={styles.width100}>
          <MTableToolbar {...props} />
        </Box>
        <Box className={styles.icons}>
          <IconButton disabled={selectedTodos.length !== 1} onClick={handleClickOpen}>
            <Edit />
          </IconButton>
          <IconButton disabled={!selectedTodos.length} onClick={deleteTodo}>
            <Delete />
          </IconButton>
        </Box>
      </div>
    ),
  };

  const addTodo = (event: any) => {
    event.preventDefault();
    console.log("add todo::input value", input);
    if (input) {
      const id = (todos[todos.length - 1]?.id ?? 0) + 1;
      console.log(id);
      let newTodo: Todo = {
        id,
        title: input,
      };
      let copyArr: Todo[] = JSON.parse(JSON.stringify(todos));
      copyArr.push(newTodo);
      setTodos(copyArr);
      setInput("");
    }
  };

  const deleteTodo = (event: any) => {
    const ids = selectedTodos.map(todo => todo.id)
    let newTodos = todos.filter(todo => {
      if (!ids.includes(todo.id)) {
        return true;
      }
    })
    setTodos(newTodos)
  };

  const onInputChange = (event: any) => {
    console.log("value::", event.target.value);
    setInput(event.target.value);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={addTodo}>
        <div className={styles.firstRow}>
          <TextField
            autoComplete="off"
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            value={input}
            onChange={onInputChange}
          />
          <Button variant="contained" color="primary" type="submit">
            Add
          </Button>
        </div>
      </form>
      <br></br>
      <MaterialTable
        icons={{
          Add: forwardRef((props, ref) => <Add {...props} ref={ref} />),
          Check: forwardRef((props, ref) => (
            <Check aria-label="Check" {...props} ref={ref} />
          )),
          Clear: forwardRef((props, ref) => (
            <Clear aria-label="Clear" {...props} ref={ref} />
          )),
          //Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
          DetailPanel: forwardRef((props, ref) => (
            <ChevronRight aria-label="Details" {...props} ref={ref} />
          )),
          Edit: forwardRef((props, ref) => (
            <Edit aria-label="Edit" {...props} ref={ref} />
          )),
          Export: forwardRef((props, ref) => (
            <SaveAlt aria-label="Export" {...props} ref={ref} />
          )),
          Filter: forwardRef((props, ref) => (
            <FilterList aria-label="Filter List" {...props} ref={ref} />
          )),
          FirstPage: forwardRef((props, ref) => (
            <FirstPage aria-label="First Page" {...props} ref={ref} />
          )),
          LastPage: forwardRef((props, ref) => (
            <LastPage aria-label="Last Page" {...props} ref={ref} />
          )),
          NextPage: forwardRef((props, ref) => (
            <ChevronRight aria-label="Next Page" {...props} ref={ref} />
          )),
          PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft aria-label="Previous Page" {...props} ref={ref} />
          )),
          ResetSearch: forwardRef((props, ref) => (
            <Clear aria-label="Clear" {...props} ref={ref} />
          )),
          Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
          SortArrow: forwardRef((props, ref) => (
            <ArrowUpward aria-label="Sort List" {...props} ref={ref} />
          )),
          ThirdStateCheck: forwardRef((props, ref) => (
            <Remove aria-label="Remove" {...props} ref={ref} />
          )),
          ViewColumn: forwardRef((props, ref) => (
            <ViewColumn aria-label="View Column" {...props} ref={ref} />
          )),
        }}
        columns={[
          { title: "ID", field: "id" },
          { title: "Title", field: "title" },
          { title: "Details", field: "details" },
        ]}
        data={todos}
        title="Todos"
        components={components}
        options={{
          selection: true,
        }}
        onSelectionChange={(rows: Todo[]) => {
          setSelectedTodos([...rows])
        }}
      />
      <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={UpdateTitle}
            onChange={handleUpdateFieldChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAndClose} color="primary" disabled={!UpdateTitle}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
