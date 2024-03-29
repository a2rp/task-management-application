import React, { useEffect, useState } from 'react'
import styles from "./allTasks.styles.module.scss";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField } from '@mui/material';
import { TablePagination } from '@mui/material';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';

const AllTasks = (props) => {
    // console.log(props, "props");
    const [tasks, setTasks] = useState([]);
    const [updatingTask, setUpdatingTask] = useState({});
    useEffect(() => {
        setTasks(props.tasks);
    }, [props]);
    useEffect(() => {
        // console.log(tasks, "all tasks");
    }, [tasks]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUpdatingTask({});
    };

    const deleteTask = (task) => {
        Swal.fire({
            title: "Do you want to delete?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes delete",
            denyButtonText: `Don't delete`
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAPICall(task);
            }
        });
    };
    const deleteAPICall = async (task) => {
        try {
            const config = {
                url: `/task/${task.id}`,
                method: "DELETE"
            };
            const response = await axios(config);
            // console.log(response, "delete response");
            if ((response).data.success === true) {
                const filteredTasks = tasks.filter(item => item.id !== task.id);
                setTasks(filteredTasks);
            }
        } catch (error) {
            // console.log(error, "delete error");
            toast.error(error.message);
        }
    };

    const handleStatusChange = async (event) => {
        event.preventDefault();
        try {
            console.log(updatingTask, "updating task");
            const config = {
                url: `/task/${updatingTask.id}`,
                method: "PATCH",
                data: updatingTask
            };
            const response = await axios(config);
            // console.log(response, "response");
            if (response.data.success === true) {
                toast.success(response.data.message);
                const newValue = tasks.map(task => task.id === updatingTask.id ? { ...task, status: updatingTask.status } : task);
                // setTasks(newValue);
                // props.setTasks(newValue);
                props.getAllTasks();
            }
        } catch (error) {
            // console.log(error, "updtae status error");
            toast.error(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>All tasks</div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#000" }}>
                            <TableCell sx={{ color: "#fff" }}>Id</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Title</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Due date</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Description</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Created at</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Updated at</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks && tasks.map((row, index) => (
                            <TableRow key={index}>
                                {/* {JSON.stringify(row)} */}
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.due_date}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.created_at}</TableCell>
                                <TableCell>{row.updated_at}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', gap: "30px" }}>
                                        <Button fullWidth variant="contained" onClick={() => { setUpdatingTask(row); handleClickOpen(); }}>Update status</Button>
                                        <Button fullWidth sx={{ backgroundColor: "brown" }} variant="contained" onClick={() => deleteTask(row)}>Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleStatusChange,
                }}
            >
                <DialogTitle>Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To update your content, please change the status here.
                    </DialogContentText>
                    <div style={{ display: 'flex', gap: "30px" }}>
                        <TextField
                            margin="dense"
                            label="Id"
                            defaultValue={updatingTask.id}
                            fullWidth
                            sx={{ marginTop: "30px" }}
                            disabled
                        />
                        <TextField
                            margin="dense"
                            label="Title"
                            defaultValue={updatingTask.title}
                            fullWidth
                            sx={{ marginTop: "30px" }}
                            disabled
                        />
                    </div>
                    <div style={{ display: 'flex', gap: "30px" }}>
                        <TextField
                            margin="dense"
                            label="Due date"
                            defaultValue={updatingTask.due_date}
                            fullWidth
                            sx={{ marginTop: "30px" }}
                            disabled
                        />
                        <FormControl fullWidth sx={{ marginTop: "30px" }}>
                            <InputLabel id="status-select-label">Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                id="status-select"
                                defaultValue=""
                                value={updatingTask?.status}
                                label="Status"
                                onChange={(event) => setUpdatingTask({ ...updatingTask, status: event.target.value })}
                            >
                                <MenuItem value="Added">Added</MenuItem>
                                <MenuItem value="In progress">In progress</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ display: 'flex', gap: "30px" }}>
                        <TextField
                            margin="dense"
                            label="Created at"
                            defaultValue={updatingTask.created_at}
                            fullWidth
                            sx={{ marginTop: "30px" }}
                            disabled
                        />
                        <TextField
                            margin="dense"
                            label="DUpdated at"
                            defaultValue={updatingTask.updated_at}
                            fullWidth
                            sx={{ marginTop: "30px" }}
                            disabled
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">Update</Button>
                </DialogActions>
            </Dialog>

        </div >
    )
}

export default AllTasks

