import React, { Component } from 'react';
import './App.css';
import { createBrowserHistory } from 'history';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

import Main from './Main/Home';
import Fof from './auth/Fof';
import Profile from './auth/Profile';
import Login from './auth/Login';
import Register from './auth/Register';
import Fpassword from './auth/Fpassword';

class App extends Component {
    constructor(props)
    {
        super(props)
    }
    render() {

        return (
            <Router history={createBrowserHistory} >
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/login" component={(props) => <Login {...props} authed={true} />}/>
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/forgotpassword" component={Fpassword} />
                    <Route path='*' exact={true} component={Fof} />
                </Switch>
            </Router>
        );
    };
}

export default App;


