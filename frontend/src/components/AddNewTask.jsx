import React, { useState } from 'react';
import styles from "./addNewTask.styles.module.scss";
import { toast } from 'react-toastify';
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';

const AddNewTask = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("Min: 3 Char, Max: 50  Char, A-Za-z0-9 ");

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("Min: 20 Chars required");

    const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);

    const [status, setStatus] = useState("Added");

    const handleTitleChange = (event) => {
        const regex = /[^a-zA-Z0-9 ]/ig;
        const value = event.target.value.replace(regex, "").slice(0, 50);
        setTitle(value);
        if (value.length < 3) {
            setTitleError("Min: 3 Char, Max: 50  Char, A-Za-z0-9 ");
        } else {
            setTitleError("");
        }
    };

    const handleDescriptionChange = (event) => {
        const value = event.target.value.substring(0, 255);
        setDescription(value);
        if (value.length < 20) {
            setDescriptionError("Min: 20 Chars required")
        } else {
            setDescriptionError("");
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (titleError.length > 0 || descriptionError.length > 0) {
            return toast.warn("Form containes errors");
        }

        try {
            const config = {
                url: "/task",
                method: "POST",
                data: { title, description, status, due_date: dueDate },
            };
            setIsLoading(true);
            const response = await axios(config);
            // console.log(response, "added new tasks");
            if (response.data.success === true) {
                toast.success(response.data.message);
                setTitle("");
                setDescription("");
                setTitleError("Can not be empty");
                setDescriptionError("Can not be empty");
                props.setIsAdded(true);
            }
        } catch (error) {
            // console.log(error, "add new task error");
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>Add new task</div>
            <form onSubmit={handleFormSubmit}>
                <div className={styles.section1}>
                    <TextField
                        required fullWidth label="Title" placeholder="Title" size="small"
                        value={title} onChange={handleTitleChange}
                        error={titleError.length > 0} helperText={titleError}
                    />

                    <TextField
                        fullWidth size="small"
                        type="date" label="Due date" required
                        inputProps={{ min: new Date().toISOString().split("T")[0], }}
                        value={dueDate} onChange={(event) => setDueDate(new Date(event.target.value).toISOString().split("T")[0])}
                    />

                    <FormControl fullWidth size="small">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select labelId="status-label" label="Status"
                            value={status} onChange={(event) => { setStatus(event.target.value); }}>
                            <MenuItem value="Added">Added</MenuItem>
                            <MenuItem value="In progress">In progress</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <TextField
                    className={styles.descriptionError}
                    fullWidth size="small" label="Description" placeholder="Description" required
                    value={description} onChange={handleDescriptionChange}
                    rows={5} multiline
                    error={descriptionError.length > 0} helperText={descriptionError}
                />

                <div className={styles.buttonsContainer}>
                    <Button
                        className={styles.clearButton}
                        size="small" variant="outlined"
                        onClick={() => { setTitle(""); setDescription(""); }}
                    >Clear form</Button>
                    <Button
                        className={styles.submitButton}
                        type="submit" size="small" variant="contained" disabled={isLoading}
                    >{isLoading ? <CircularProgress /> : ""}Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default AddNewTask

