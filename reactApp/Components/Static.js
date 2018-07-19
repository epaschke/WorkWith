var React = require('react');
var { Link } = require('react-router-dom');

class Static extends React.Component {
  render(){
    return (
            <div style={{display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <Link onClick={this.props.leaveDoc} to="/home" className="btn-floating btn-large waves-effect waves-light red">
                  <i className="material-icons">keyboard_return</i>
                </Link>
                <div><h3>{!this.props.loading && <b>{this.props.title}</b>}</h3>
                <p>ID: {this.props.docId}</p></div>
                <a className="btn-floating btn-large waves-effect waves-light blue"
                   onClick={this.props.saveFn}>
                  <i className="material-icons">save</i>
                </a>
            </div>
    );
  }
}

module.exports = { Static };
