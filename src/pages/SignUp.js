import React, {Component} from "react"
import {Link} from "react-router-dom"
import axios from "axios"

import {Input, Label, Button, HelperText} from "@windmill/react-ui"

function validateEmail(email)
{
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function getMonday(d) {
    d = new Date(d);
    const day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const date = new Date(d.setDate(diff));
    date.setHours(0,0,0,0);
    return date;
}

class signup extends Component {


    constructor(props) {
        super(props)

        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            error: "",
            canSubmit: false,
        }
    }

    setError(e) {
        this.setState({
            error: e,
        })
    }

    handleChange = (event) => {
        this.setState({
            error: "",
            [event.target.name]: event.target.value,
        })

        if(this.state.name && this.state.email && this.state.password && this.state.confirmPassword){
            this.setState({canSubmit: true})
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()

        if(!this.state.canSubmit){
            return;
        }

        if(!validateEmail(this.state.email)){
            this.setError("INVALID_EMAIL")
            return;
        }

        if(this.state.password.length < 6){
            this.setError("INVALID_PASSWORD")
            return;
        }

        if (this.state.confirmPassword !== this.state.password) {
            this.setError("MISMATCH_PASSWORD")
            return;
        }

        this.setState({canSubmit: false})
        const newUserData = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            monday_ms: getMonday(new Date()).getTime(),
        }

        axios
            .post("/signup", newUserData)
            .then((response) => {
                localStorage.setItem("AuthToken", `${response.data.token}`)
                localStorage.setItem("userID", `${response.data.userID}`)
                this.setState({
                    canSubmit: false,
                })
                this.props.history.push("/app/dashboard")
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data.error,
                    canSubmit: true,
                })
            })
    }

    render() {
        const error = this.state.error
        return (
            <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
                    <div className="flex flex-col overflow-y-auto">
                        <main className="flex items-center justify-center p-6 sm:p-12 md:w-auto">
                            <div className="w-full">
                                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                                    Create account
                                </h1>
                                <Label>
                                    <span>Name</span>
                                    <Input
                                        className="mt-1"
                                        name="name"
                                        type="text"
                                        placeholder="Your name"
                                        onChange={this.handleChange}
                                    />
                                </Label>
                                <Label className="mt-4">
                                    <span>Email</span>
                                    <Input
                                        className="mt-1"
                                        name="email"
                                        type="email"
                                        placeholder="name@email.com"
                                        valid={error === "EMAIL_TAKEN" || error === "INVALID_EMAIL" ? false : undefined}
                                        onChange={this.handleChange}
                                    />
                                    {error === "EMAIL_TAKEN"  && (<HelperText valid={false}>This Email is being used by another user!</HelperText>)}
                                    {error === "INVALID_EMAIL"  && (<HelperText valid={false}>Invalid Email Address.</HelperText>)}

                                </Label>
                                <Label className="mt-4">
                                    <span>Password</span>
                                    <Input
                                        className="mt-1"
                                        name="password"
                                        placeholder="********"
                                        type="password"
                                        valid={error === "INVALID_PASSWORD" ? false : undefined}
                                        onChange={this.handleChange}
                                    />
                                    {error === "INVALID_PASSWORD" && (<HelperText valid={false}>Password must be atleast 6 characters long.</HelperText>)}

                                </Label>
                                <Label className="mt-4">
                                    <span>Confirm password</span>
                                    <Input
                                        className="mt-1 mb-6"
                                        name="confirmPassword"
                                        placeholder="********"
                                        type="password"
                                        valid={error === "MISMATCH_PASSWORD" ? false : undefined}
                                        onChange={this.handleChange}
                                    />
                                    {error === "MISMATCH_PASSWORD" && (<HelperText valid={false}>Mismatch with password!</HelperText>)}

                                </Label>


                                <Button
                                    block
                                    className="mt-4"
                                    disabled={!this.state.canSubmit}
                                    onClick={this.handleSubmit}>
                                    Create account
                                </Button>

                                <p className="mt-4">
                                    <Link
                                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                                        to="/login">
                                        Already have an account? Login
                                    </Link>
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default signup
