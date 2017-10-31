var React = require('react');
var { Link } = require('react-router-dom');

class Login extends React.Component {
  render(){
    return (<div>
        <p>Login Page</p>
        <Link to="/document">Document</Link>
    </div>);
  }
}

module.exports = {Login};
