import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

import { Label, Input, Button } from '@windmill/react-ui'

class login extends Component {
  constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          errors: [],
          loading: false
      };
  }

  componentDidUpdate(nextProps) {
      if(nextProps.UI != null){
          if("errors" in nextProps.UI){
              if (nextProps.UI.errors) {
                  this.setState({
                      errors: nextProps.UI.errors
                  });
              }
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
      console.log(this.state.email)
      console.log(this.state.password)
      const userData = {
          email: this.state.email,
          password: this.state.password
      };
      axios
          .post('/login', userData)
          .then((response) => {
              localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
              this.setState({
                  loading: false
              });
              this.props.history.push('/app/dashboard');
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
      return (
        <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto">
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-auto">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login to Studyi</h1>
                <Label>
                  <span>Email</span>
                  <Input className="mt-1" type="email" name="email" onChange={this.handleChange}/>
                </Label>
  
                <Label className="mt-4">
                  <span>Password</span>
                  <Input className="mt-1" type="password" name="password" onChange={this.handleChange}/>
                </Label>
  
                <Button className="mt-4" block tag={Link} onClick={this.handleSubmit} disabled={loading || !this.state.email || !this.state.password}>
                  Log in
                </Button>
  
                <p className="mt-1">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/create-account"
                  >
                    No account? Signup here!
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
      );
  }
}

export default login
