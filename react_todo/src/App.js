import React, { Component } from 'react';
import LoginComponent from './Login';
import TodoListComponent from './Todolist';
import PropTypes from 'prop-types';
import './App.css';
import { firebaseConfig } from "./Config";
import * as firebase from "firebase";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route
} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

firebase.initializeApp(firebaseConfig);
const ID_TOKEN_KEY = 'KEY_FOR_LOCAL_STORAGE';

function isAuthenticated(e) {
  return !!firebase.auth().currentUser || !!localStorage.getItem(ID_TOKEN_KEY);
}
function requireAuth(getIsLogin) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      localStorage.setItem(ID_TOKEN_KEY, user.uid);
      getIsLogin(user.uid);
    } else {
      localStorage.removeItem(ID_TOKEN_KEY);
      getIsLogin(null);
    }
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth:true,
      uid: null
    };
    const getIsLogin = (uid) => {
      this.setState({ uid: uid });
    }
    requireAuth(getIsLogin);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    console.log("handleLogout");
    console.dir(firebase.auth().currentUser);
    firebase.auth().signOut();
    history.push('/login/signin');
  }
  render() {
    console.log(this.state.uid);
    return (
        <Router>
          <div className="container">
            <div className="header">
              <div className="header-dec"></div>
              <button style={{ display: this.state.uid ? '' : 'none' }} className="cRight btn-logout" onClick={this.handleLogout}>Logout</button>
              <button style={{ display: this.state.uid ? 'none' : '' }} className="cRight btn-signup"><Link to="/">Sign up</Link></button>
            </div>

            <Route exact path="/login/signin" name="login" component={LoginComponent} />
            <PrivateRoute exact path="/" name="home" component={TodoListComponent} />
          </div>
        </Router>

    );
  }
}
export default App;

// <Route exact path="/" name="todo" render={() => <TodoListComponent />} />
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login/signin',
          state: { from: props.location }
        }} />
      )
  )} />
)

