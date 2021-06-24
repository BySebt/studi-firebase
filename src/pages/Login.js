import React, {Component} from "react"
import {Link} from "react-router-dom"
import axios from "axios"
import {Button, Label, Input, HelperText} from "@windmill/react-ui"
import {authLogin, authMiddleWare} from "../utils/auth";
const {isEmail} = require("../utils/validate")

class login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            error: "",
            loading: false,
        }
    }

    setError(e) {
        this.setState({
            error: e,
        })
    }

    componentDidMount = () => {
        authLogin(this.props.history);
        // console.log("NO_TOKEN FOUND: " +this.props.history.location.pathname.includes("NO_TOKEN"))
        // if(this.props.history.location.pathname.includes("NO_TOKEN")){
        //     authLogin(this.props.history);
        // }
    };

    handleChange = (event) => {
        this.setState({
            error: "",
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        if(!isEmail(this.state.email)) {
            this.setError("INVALID_EMAIL");
            return;
        }

        if(this.state.password.length < 6) {
            this.setError("PASSWORD_TOO_SHORT")
            return
        }

        this.setState({loading: true})
        const userData = {
            email: this.state.email,
            password: this.state.password,
        }
        axios
            .post("/login", userData)
            .then((response) => {
                localStorage.setItem("AuthToken", `Bearer ${response.data.token}`)
                this.setState({
                    loading: false,
                })
                this.props.history.push("/app/dashboard")
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data.error,
                    loading: false,
                })
            })
    }

    render() {
        const {error, loading} = this.state
        return (

            <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">

                <div
                    className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
                    <div className="flex flex-col overflow-y-auto">
                        <main className="flex items-center justify-center p-6 sm:p-12 md:w-auto">
                            <div className="w-full">
                                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                                    Login to Studyi
                                </h1>

                                <Label>
                                    <span>Email</span>
                                    <Input
                                        className="mt-1"
                                        type="email"
                                        name="email"
                                        valid={error ? false : undefined}
                                        onChange={this.handleChange}/>
                                    {error && (<HelperText valid={false}>Login or password is invalid</HelperText>)}

                                </Label>

                                <Label className={"mt-4"}>
                                    <span>Password</span>
                                    <Input
                                        className="mt-1"
                                        type="password"
                                        name="password"
                                        valid={error ? false : undefined}
                                        onChange={this.handleChange}/>
                                    {error && (<HelperText valid={false}>Login or password is invalid</HelperText>)}

                                </Label>


                                <Button
                                    className="my-4"
                                    block
                                    onClick={this.handleSubmit}
                                    disabled={
                                        loading || !this.state.email || !this.state.password
                                    }>
                                    Log in
                                </Button>

                                <p className="mt-1">
                                    <Link
                                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                                        to="/create-account">
                                        No account? Signup here!
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

export default login
