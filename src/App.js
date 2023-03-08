import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from "react";
import { getDatabase, push, ref, set } from "firebase/database";
import { onValue } from "firebase/database"
import CloseIcon from '@mui/icons-material/Close';

import "firebase/database";


function App() {

    let [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        phoneNumber: "",
        message: ""
    })

    const { reset } = useForm(); 

    const clearForm = () => {
        reset();
    }

    const handleChange = para => {
        let { name, value } = para.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const checkValidation = () => {
        if (!data.name || !data.email || !data.profession || !data.phoneNumber || !data.message) {
            setError('Check Before you send Data.')
        }
    }

    const [error, setError] = useState()
    const [todo, setTodo] = useState([])


    const db = getDatabase();

    const handleClick = () => {
        if (!data.name || !data.email || !data.profession || !data.phoneNumber || !data.message) {
            checkValidation()
        } else {
            set(push(ref(db, "users")), {
                name: data.name,
                email: data.email,
                profession: data.profession,
                phone: data.phoneNumber,
                message: data.message
            }).then(() => {
                setData({
                    name: "",
                    email: "",
                    profession: "",
                    phoneNumber: "",
                    message: ""
                })
            })
        }
    }

    useEffect(() => {
        const starCountRef = ref(db, 'users');
        onValue(starCountRef, (snapshot) => {
            let array = [];
            snapshot.forEach((para) => {
                array.push(para.val())
            })
            setTodo(array)
        })
    })

    const removeData = e => {
        let ele = e.target.parentElement;
        ele.remove()
    }


    return (

        <React.Fragment>
            {/* http://192.168.1.109:3001 */}
            <Container fixed>
                <Grid container spacing={2} className="main-form" onSubmit={clearForm}>
                    <Grid item xs={3}>
                        <TextField
                            label="Email"
                            variant="filled"
                            type="email"
                            className="textFields"
                            onChange={handleChange}
                            name="email"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            label="Your Name"
                            variant="filled"
                            type="text"
                            className="textFields"
                            onChange={handleChange}
                            name="name"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Profession"
                            variant="filled"
                            type="text"
                            className="textFields"
                            onChange={handleChange}
                            name="profession"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
                            variant="filled"
                            type="number"
                            className="textFields"
                            fullWidth
                            onChange={handleChange}
                            name="phoneNumber"
                            margin="normal"
                        />
                        <TextField
                            label="Message"
                            margin="normal"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            name="message"
                        />
                        {error ? <p className="errorMessage">{error}</p> : ""}
                        <Button
                            className="button"
                            fullWidth
                            variant="outlined"
                            onClick={handleClick}
                        >
                            Send Info
                        </Button>
                    </Grid>
                </Grid>
                <div className="dataRead">
                    {todo.map((item) => (
                        <div className="dataBox">
                            <CloseIcon className="closeIcon" type='submit' onClick={removeData}></CloseIcon>
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                            <p>{item.profession}</p>
                            <p>{item.phone}</p>
                            <p>{item.message}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </React.Fragment>
    );
}

export default App;