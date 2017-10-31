var React = require('react');
var ReactDOM = require('react-dom');
var { DocContainer } = require('./Components/Document');
var { Home } = require('./Components/Home');
var { Login } = require('./Components/Login');
var { BrowserRouter, Switch, Route, Link } = require('react-router-dom');

class App extends React.Component {
    render(){
        return (
            <BrowserRouter>
                <div>
                    <Route path="/:any" render={() => <Link to="/">To Login</Link>}/>
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <Route path="/home" component={Home} />
                        <Route path="/document" component={DocContainer} />
                    </Switch>
                </div>
            </BrowserRouter>
            );
    }
}

ReactDOM.render(
        <App />,
    document.getElementById('root'));
