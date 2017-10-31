var React = require('react');
var { Link } = require('react-router-dom');

class Home extends React.Component {
  render(){
    return (<div>
        <p>Los documentos</p>
        <Link to="/document">Document</Link>
    </div>);
  }
}

module.exports = { Home };
