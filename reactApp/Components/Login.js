var React = require('react');
var { Link } = require('react-router-dom');
var axios = require('axios');
class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
        }
    }
  passwordChange(e){
    console.log('e password', e.target.value);
    this.setState({
      password: e.target.value
    });
  }

  usernameChange(e){
    this.setState({
      username: e.target.value
    });
  }

  login(){
    //console.log('this.state: ', this.state);
    axios.post('http://localhost:3000/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then((response) => {
      if (response.data.success){
        this.props.history.push('/home');
      }
    })
    .catch(function(error){
        console.log('Error', error);
    });
  }

  render(){
    return (<div>
        <h2>Login Page</h2>
        {/* <p>path: {this.props.location.pathname}</p> */}
        <div className="row">
            <form className="col s12" action="http://localhost:3000/login" method="POST" id="form1">
                    <div className="input-field col s6">
                      <input placeholder="username" name="username" type="text" className="validate" onChange={(e) => this.usernameChange(e)} value={this.state.username}/>
                    </div>
                    <div className="input-field col s6">
                      <input name="password" placeholder="password" type="password" className="validate" onChange={(e) => this.passwordChange(e)} value={this.state.password}/>
                    </div>
                    <div className="input-field col s6">
                      <input type="button" onClick={() => this.login()}/>
                    </div>
                </form>
        </div>
        <Link to="/register">Register</Link>
    </div>);
  }
}

module.exports = {Login};
