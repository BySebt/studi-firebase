import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

import { Input, Label, Button } from '@windmill/react-ui'

class signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: [],
        loading: false
    };
}


componentDidUpdate(nextProps) {
    if(nextProps.UI != null){
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        }
    }

}

handleChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    });
};

handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const newUserData = {
        name: this.state.name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
    };
    axios
        .post('/signup', newUserData)
        .then((response) => {
            localStorage.setItem('AuthToken', `${response.data.token}`);
            this.setState({
                loading: false,
            });
            this.props.history.push('/');
        })
        .catch((error) => {
            this.setState({
                errors: error.response.data,
                loading: false
            });
        });
};

render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
    return (    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
    <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <div className="flex flex-col overflow-y-auto">
        <main className="flex items-center justify-center p-6 sm:p-12 md:w-auto">
          <div className="w-full">
            <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
              Create account
            </h1>
            <Label>
              <span>Name</span>
              <Input className="mt-1" type="text" placeholder="Your name" onChange={this.handleChange}/>
            </Label>
            <Label className="mt-4">
              <span>Email</span>
              <Input className="mt-1" type="email" placeholder="name@email.com" onChange={this.handleChange}/>
            </Label>
            <Label className="mt-4">
              <span>Password</span>
              <Input className="mt-1" placeholder="********" type="password" onChange={this.handleChange}/>
            </Label>
            <Label className="mt-4">
              <span>Confirm password</span>
              <Input className="mt-1" placeholder="********" type="password" onChange={this.handleChange}/>
            </Label>

            <Button tag={Link} block className="mt-4" onClick={this.handleSubmit} disabled={loading || !this.state.name || !this.state.email || !this.state.password || !this.state.confirmPassword}>
              Create account
            </Button>


            <p className="mt-4">
              <Link
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                to="/login"
              >
                Already have an account? Login
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>)
}
}

export default signup;
