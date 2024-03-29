import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./styles.module.scss";
import axios from 'axios';
import AddNewTask from './components/AddNewTask';
import AllTasks from './components/AllTasks';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198/api/v1";
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (isAdded === true) {
            getAllTasks();
            setIsAdded(false);
        }
    }, [isAdded]);
    const getAllTasks = async () => {
        try {
            const config = {
                url: "/task",
                method: "GET",
            };
            setIsLoading(true);
            const response = await axios(config);
            console.log(response, "fetched all tasks");
            if (response.data.success === true) {
                setTasks(response.data.tasks);
                // toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error, "fetch all tasks error");
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getAllTasks();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.main}>

                <h1 className={styles.title}>Task management application</h1>
                <h3 className={styles.techStack}>Tech stack: PERN [PostgreSQL, Express.js, React.js, Node.js]</h3>

                <AddNewTask
                    isAdded={isAdded}
                    setIsAdded={setIsAdded}
                />

                <AllTasks
                    tasks={tasks}
                    setTasks={setTasks}
                    getAllTasks={getAllTasks}
                />
            </div>

            <ToastContainer />
        </div>
    )
}

export default App

