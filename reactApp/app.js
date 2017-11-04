var React = require('react');
var ReactDOM = require('react-dom');
var { DocContainer } = require('./Components/Document');
var { Home } = require('./Components/Home');
var { Login } = require('./Components/Login');
var { Register }= require('./Components/Register');
var { RevisionHistory }= require('./Components/RevisionHistory');
var { BrowserRouter, Switch, Route, Link } = require('react-router-dom');

class App extends React.Component {
  render(){
    return (
        <BrowserRouter>
            <div>
                <Route path="/:any" render={() => <Link to="/register">To Register</Link>}/>
                <Switch>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                    <Route path="/document/:docId" component={DocContainer} />
                    <Route path="/history/:docId" component={RevisionHistory} />
                </Switch>
            </div>
        </BrowserRouter>
    );
  }
}

ReactDOM.render(
        <App />,
    document.getElementById('root'));
