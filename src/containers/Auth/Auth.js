import { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import axios from '../../axios-instance';

class Auth extends Component {
  state = {
    isSignUp: false,
    error: false,
    username: "",
    email: "",
    password: ""
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmitHander = (event) => {
    event.preventDefault();
    
    

    if(this.state.isSignUp) {
      //all the names are mixed up to make backend work, sorry
      const body = {
        fullName: this.state.username,
        username: this.state.email,
        password: this.state.password,
        active: false
      };
      this.sendSignupRequest(body);
    } else {
      const body = {
        username: this.state.email,
        password: this.state.password
      };
      this.sendLoginRequest(body);
    }
  }

  sendSignupRequest = (body) => {
    const url = '/users/sign-up';
    axios.post(url, body)
      .then(response => {
        console.log(response);
        console.log("User created")
        this.sendLoginRequest(body)
      })
  }

  sendLoginRequest = (body) => {
    const url = 'http://localhost:8080/login';
    console.log(body)
    axios.post(url, body)
      .then(response => {
        console.log(response);
        const jwt = response.headers.authorization.split(" ")[1];
        //get user details from response data, definitely easier way to do this
        let responseData = response.data;
        responseData = responseData.substr(1).slice(0, -1);
        let properties = responseData.split(", ")
        const id = parseInt(properties[0].split("=")[1], 10);
        const email = properties[1].split("=")[1].substr(1).slice(0, -1);
        const name = properties[2].split("=")[1].substr(1).slice(0, -1);
        const active = properties[3].split("=")[1] === "false" ? false : true;
        const user = {
          id: id,
          email: email,
          name: name,
          active: active
        }
        console.log(user)
        this.props.saveCredentials(jwt, user);
      })
  }

  toggleAuthMode = () => {
    let currentAuthMode = this.state.isSignUp;
    this.setState({
      isSignUp: !currentAuthMode
    })
  }

  render() {
    let form = <form onSubmit={this.onSubmitHander}> 
    <input 
      type="text" 
      placeholder="Username" 
      name="email" 
      onChange={(event) => this.onChangeHandler(event)}/>
    <input 
      type="password" 
      placeholder="Password" 
      name="password" 
      onChange={(event) => this.onChangeHandler(event)} />
    <Button btnType="Success">
      {this.state.isSignUp ? "Create Account" : "Log In"}
    </Button><br/>
  </form>

  if (this.state.isSignUp) {
    form = <form onSubmit={this.onSubmitHander}> 
          <input 
            type="text" 
            placeholder="Email" 
            name="email" 
            onChange={(event) => this.onChangeHandler(event)}/>
            <input 
            type="text" 
            placeholder="Username" 
            name="username" 
            onChange={(event) => this.onChangeHandler(event)}/>
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={(event) => this.onChangeHandler(event)} />
          <Button btnType="Success">
            {this.state.isSignUp ? "Create Account" : "Log In"}
          </Button><br/>
        </form>
  }
    return(
      <div className={classes.Auth}>
        {form}
        <Button 
          btnType="Neutral" 
          clicked={this.toggleAuthMode}>
          {this.state.isSignUp ? 'Already Signed Up?' : 'Sign Up Now'}
        </Button>
      </div>
    )
  }
}

export default Auth;