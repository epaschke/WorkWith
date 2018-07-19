var React = require('react');
var { Link } = require('react-router-dom');
var axios = require('axios');


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
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

  login(e){
    //console.log('this.state: ', this.state);
    e.preventDefault();
    axios.post('/api/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then((response) => {
      if (response.data.success){
        console.log('this.props: ', this.props);
        this.props.history.push('/home');
      } else {
        this.setState({error: "Error logging in."});
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
        {<p>{this.state.error}</p>}
        <div className="row">
            <form className="col s12" id="form1">
                    <div className="input-field col s6">
                      <input placeholder="username" name="username" type="text" className="validate" onChange={(e) => this.usernameChange(e)} value={this.state.username}/>
                    </div>
                    <div className="input-field col s6">
                      <input name="password" placeholder="password" type="password" className="validate" onChange={(e) => this.passwordChange(e)} value={this.state.password}/>
                    </div>
                    <div className="input-field col s6">
                      <button onClick={(e) => this.login(e)} className="waves-effect waves-light btn">
                        <i className="material-icons right">near_me</i> Login
                        </button>
                    </div>
                </form>
        </div>
        <Link to="/register">Register</Link>
    </div>);
  }
}

module.exports = {Login};
