import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { Add, ArrowUpward, Delete } from "@mui/icons-material";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";
import MaterialTable, { MTableToolbar } from '@material-table/core';
import type { NextPage } from "next";
import { forwardRef, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

interface Todo {
  id?: number;
  title: string;
}

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [UpdateTitle, setUpdateTitle] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const tableRef = useRef<any>();

  useEffect(() => {
    fetch('http://localhost:3001/all')
      .then(response => response.json())
      .then(data => {
        setTodos(data)
      }
      )
      .catch(err => console.log(err))
      .finally(() => setRefetch(false));

  }, [refetch])

  const handleClickOpen = () => {
    setUpdateTitle(selectedTodos[0]?.title)
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleUpdateAndClose = () => {
    let todoToUpdate: Todo = {
      id: selectedTodos[0]?.id,
      title: UpdateTitle
    }
    // todos.forEach((todo: Todo) => {
    //   if (todo.id === idToupdate) {
    //     todo.title = UpdateTitle;
    //   }
    // })

    createOrUpdate(todoToUpdate);
    tableRef.current.onAllSelected(false)
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
          <IconButton
            disabled={selectedTodos.length !== 1}
            onClick={handleClickOpen}
            size="large">
            <Edit />
          </IconButton>
          <IconButton disabled={selectedTodos.length < 1} onClick={deleteTodo} size="large">
            <Delete />
          </IconButton>
        </Box>
      </div>
    ),
  };

  const createOrUpdate = (todo: Todo) => {
    fetch('http://localhost:3001/creteOrUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    })
      .then(response => response.json())
      .then(data => {
        console.log("🚀 ~ file: index.tsx:106 ~ createOrUpdate ~ data:", data)
        setRefetch(true);
      }
      )
      .catch(err => console.log(err))
      .finally(() => setRefetch(false));
  }


  const addTodo = (event: any) => {
    event.preventDefault();
    console.log("add todo::input value", input);
    if (input) {
      // const id = (todos[todos.length - 1]?.id ?? 0) + 1;
      // console.log(id);
      let newTodo: Todo = {
        title: input,
      };

      createOrUpdate(newTodo);
      // let copyArr: Todo[] = JSON.parse(JSON.stringify(todos));
      // copyArr.push(newTodo);
      // setTodos(copyArr);
      setInput("");
    }
  };

  const deleteTodo = (event: any) => {
    let idsToDelete: number[] = selectedTodos.filter(todo => todo.id).map(todo => todo.id as number);
    fetch(`http://localhost:3001/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(idsToDelete)
    })
      .then(response => response.json())
      .then(data => {
        console.log("🚀 ~ file: index.tsx:106 ~ createOrUpdate ~ data:", data)
        setRefetch(true);
      }
      )
      .catch(err => console.log(err))
      .finally(() => setRefetch(false));
    // const ids = selectedTodos.map(todo => todo.id)
    // let newTodos = todos.filter(todo => {
    //   if (!ids.includes(todo.id)) {
    //     return true;
    //   }
    // })
    // setTodos(newTodos)
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
        tableRef={tableRef}
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
            variant="standard"
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={UpdateTitle}
            onChange={handleUpdateFieldChange} />
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
