import React, {Component} from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {Input, Label, Textarea, Button} from '@windmill/react-ui'

import {Link} from "react-router-dom";
import {Slider, Snackbar} from "@material-ui/core"
import axios from "axios";
import {Alert} from "@material-ui/lab";

function valuetext(value) {
    return `${value} min`;
}

const marks = [
    {
        value: 10,
        label: valuetext(10),
    },
    {
        value: 20,
        label: valuetext(20),
    },
    {
        value: 30,
        label: valuetext(30),
    },
    {
        value: 40,
        label: valuetext(40),
    },
    {
        value: 50,
        label: valuetext(50),
    },
];

class Create extends Component {

    constructor(props) {
        super(props);

        this.state = {
            canSubmit: false,
            success: false,
            error: [],
            uiLoading: true,
            time_required: 5,
            name: "",
            description: ""
        };

        this.handleChangeAsync = this.handleChangeAsync.bind(this)
    }

    handleClose = () => {
        this.setState({
            success: false
        })
    }

    handleSliderChange = (event, value) => {
        console.log(value)
        this.setState({
            time_required: value
        })
    }

    async handleChangeAsync(event){
        await this.setState({
            [event.target.name]: event.target.value
        })

        if(this.state.name && this.state.description && this.state.time_required){
            this.setState({canSubmit: true})
        } else {
            this.setState({canSubmit: false})
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if(!this.state.canSubmit){
            return;
        }

        this.setState({canSubmit: false})

        const newTodoItem = {
            name: this.state.name,
            description: this.state.description,
            time_required: this.state.time_required,
            next_due_date: Date.now() + 8.64e+7,
            date_created: Date.now(),
            status: "FIRST_REVISION"
        }

        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .post("/todo", newTodoItem)
            .then((response) => {
                this.setState({
                    canSubmit: true,
                    success: true
                })
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data.error,
                    canSubmit: true,
                    success: true
                })
            })
    }

    render() {
        return (
            <>
                <PageTitle>Create A New Task</PageTitle>

                <div className="px-4 py-4 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">

                    <Label>
                        <span>Task</span>
                        <Input name="name" className="mt-2" placeholder="Do homework" onChange={this.handleChangeAsync} />
                    </Label>

                    <Label className="mt-4">
                        <span>Task Description</span>
                        <Textarea className="mt-2" name="description" rows="3" placeholder="Enter description." onChange={this.handleChangeAsync} />
                    </Label>

                    <Label className="mt-4">
                        <span>Task Length</span>
                        <Slider
                            className="mt-2"
                            name="time_required"
                            defaultValue={15}
                            onChangeCommitted={this.handleSliderChange}
                            getAriaValueText={valuetext}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={5}
                            marks={marks}
                            min={5}
                            max={60}
                        />
                    </Label>

                    <Button
                        className="mt-6"
                        block
                        tag={Link}
                        onClick={this.handleSubmit}
                        disabled={!this.state.canSubmit}>
                        Create
                    </Button>
                </div>

                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    open={this.state.success}
                    onClose={this.handleClose}
                    autoHideDuration={5000}
                    key={Math.random()}>

                    {this.state.error ? <Alert severity="error">Something went wrong!</Alert> :
                        <Alert severity="success">
                            Task created successfully!
                        </Alert>}
                </Snackbar>
            </>
        )
    }

}

export default Create
