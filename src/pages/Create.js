import React, {Component, useState} from 'react'
import firebase from 'firebase'
import PageTitle from '../components/Typography/PageTitle'
import {Input, Label, Textarea, Button} from '@windmill/react-ui'

import {Link} from "react-router-dom";
import axios from "axios";
import {Box, useToast} from "@chakra-ui/react";

import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from "@chakra-ui/react"


export default function Create(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [timeRequired, setTimeRequired] = useState(5);
    const toast = useToast();

    function handleSubmit(event) {
        event.preventDefault()

        if(!name || !description){
            return;
        }

        // Potential Risk to exploit with request intercepter
        const newTodoItem = {
            name: name,
            description: description,
            time_required: timeRequired,
            next_due_date: Date.now() + 8.64e+7,
            date_created: Date.now(),
            status: "FIRST_REVISION"
        }

        firebase.auth().currentUser.getIdToken()
            .then((token) => {
                axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
                axios
                    .post("/todo", newTodoItem)
                    .then(() => {
                        toast({
                            title: "Success!",
                            description: `${name} has been created. The first revision will be due in 24 hours!`,
                            status: "success",
                            duration: 5000,
                        })
                        setName("")
                        setDescription("")
                    })
                    .catch((error) => {
                        toast({
                            title: "Error!",
                            description: `Something went wrong. Try again later!`,
                            status: "error",
                            duration: 5000,
                        })
                        setName("")
                        setDescription("")
                    })
            })
    }

    return (
        <>
            <PageTitle>Create A New Task</PageTitle>

            <div className="px-4 py-4 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">

                <Label>
                    <span>Task</span>
                    <Input
                        name="name"
                        value={name}
                        className="mt-2"
                        placeholder="Do homework"
                        onChange={e => setName(e.target.value)} />
                </Label>

                <Label className="mt-4">
                    <span>Task Description</span>
                    <Textarea
                        className="mt-2"
                        name="description"
                        rows="3"
                        value={description}
                        placeholder="Enter description."
                        onChange={e => setDescription(e.target.value)} />
                </Label>

                <Label className="mt-4">
                    <span>Task Length: {timeRequired} minutes</span>

                    <Slider defaultValue={15} min={5} max={60} step={5} onChange={value => setTimeRequired(value)}>
                        <SliderTrack bg={"studyi.300"}>
                            <Box position="relative" right={10} />
                            <SliderFilledTrack  bg={"studyi.500"} />
                        </SliderTrack>
                        <SliderThumb boxSize={6} />
                    </Slider>
                </Label>

                <Button
                    className="mt-6"
                    block
                    tag={Link}
                    onClick={handleSubmit}
                    disabled={!name || !description}>
                    Create
                </Button>
            </div>
        </>
    )
}
