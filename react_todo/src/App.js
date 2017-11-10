import React, { Component } from 'react';
import LoginComponent from './Login';
import TodoListComponent from './Todolist';
import './App.css';
import { firebaseAuth } from "./Config";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route
} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

const ID_TOKEN_KEY = 'KEY_FOR_LOCAL_STORAGE';

function isAuthenticated(e) {
  return !!firebaseAuth().currentUser || !!localStorage.getItem(ID_TOKEN_KEY);
}
function requireAuth(getIsLogin) {
  firebaseAuth().onAuthStateChanged(function (user) {
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
    firebaseAuth().signOut();
    history.push('/login/signin');
  }
  render() {
    return <Router>
        <div className="app">
          <h1 className="title">TODO LIST</h1>
          <div className="container">
            <div className="header">
              <div className="header-dec" />
              <button style={{ display: this.state.uid ? "" : "none" }} className="cRight btn-logout" onClick={this.handleLogout}>
                Logout
              </button>
                <Link style={{ display: this.state.uid ? "none" : "" }} className="cRight btn-signup" to="/login/signup">
                  Sign up
                </Link>
                <Link style={{ display: this.state.uid ? "none" : "" }} className="cRight btn-signup" to="/login/signin">
                  Sign in
                </Link>
            </div>

            <Route path="/login/" name="login" component={LoginComponent} />
            <PrivateRoute exact path="/" name="home" component={TodoListComponent} />
          </div>
        </div>
      </Router>;
  }
}
export default App;

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

