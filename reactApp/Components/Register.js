var React = require('react');
var { Link } = require('react-router-dom');
var axios = require('axios');

class Register extends React.Component {
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

  register(){
    console.log('this.state: ', this.state);
    axios.post('http://localhost:3000/register', {
      username: this.state.username,
      password: this.state.password
    })
    .then((response) => {
      if (response.data.success){
        this.props.history.push('/login');
      }
    })
    .catch(function(error){
        console.log('Error', error);
    });

  }
  render(){
    return (<div>
        <h2>Register Page</h2>
        <div className="row">
            <form className="col s12">
                    <div className="input-field col s6">
                      <input placeholder="username" name="username" type="text" className="validate" onChange={(e) => this.usernameChange(e)} value={this.state.username}/>
                    </div>
                    <div className="input-field col s6">
                      <input name="password" placeholder="password" type="password" onChange={(e) => this.passwordChange(e)} value={this.state.password} className="validate"/>
                    </div>
                    <div className="input-field col s6">
                      <input type="button" onClick={() => this.register()}/>
                    </div>
                </form>
        </div>
        <Link to="/login">Link to login</Link>
    </div>);
  }
}

module.exports = { Register };
