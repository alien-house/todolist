import React, { Component } from 'react';
import LoginComponent from './Login';
import TodoListComponent from './Todolist';
import './App.css';
import {firebaseAuth} from "./Config";
import { TweenLite } from "gsap";
import FontAwesome from "react-fontawesome";
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
      loading: false,
      isAuth: true,
      uid: null
    };
    const getIsLogin = uid => {
      this.setState({ uid: uid });
    };
    // const changeLoaderState = loadState => {
    //   this.setState({ loading: loadState });
    // };

    requireAuth(getIsLogin);
    this.handleLogout = this.handleLogout.bind(this);
    this.changeLoaderState = this.changeLoaderState.bind(this);
  }
  changeLoaderState(loadState) {
    var loadering = document.getElementById("loadering");
    this.setState({ loading: loadState });
    if (loadState) {
      TweenLite.to(loadering, 0.5, { autoAlpha: 1 });
    }else{
      TweenLite.to(loadering, 0.5, { autoAlpha: 0 });
    }
  }
  handleLogout() {
    firebaseAuth().signOut();
    history.push("/login/signin");
  }
  componentDidMount() {
    var loadering = document.getElementById("loadering");
    if (this.state.loading) {
      TweenLite.to(loadering, 1, { autoAlpha: 1 });
    } else {
      TweenLite.to(loadering, 1, { autoAlpha: 0 });
    }
  }

  render() {

    return (
      <Router>
        <div className="app">
          <h1 className="title">TODO LIST</h1>
          <div className="container">
            <div className="header">
              <div className="header-dec" />
              <button
                style={{ display: this.state.uid ? "" : "none" }}
                className="cRight btn-logout"
                onClick={this.handleLogout}
              >
                Logout
              </button>
              <Link
                style={{ display: this.state.uid ? "none" : "" }}
                className="cRight btn-signup"
                to="/login/signup"
              >
                Sign up
              </Link>
              <Link
                style={{ display: this.state.uid ? "none" : "" }}
                className="cRight btn-signup"
                to="/login/signin"
              >
                Sign in
              </Link>
            </div>

            <div id="loadering" className="loadering-wrap">
              <div className="loadering">
                <div className="loadering-inner">
                  <FontAwesome name="truck" className="loader-icon" />
                </div>
              </div>
            </div>
            
            <Route
              path="/login/"
              name="login"
              render={() => (
                <LoginComponent changeLoaderState={this.changeLoaderState} />
              )}
            />
            <PrivateRoute
              exact
              path="/"
              name="home"
              component={TodoListComponent}
              changeLoaderState={this.changeLoaderState}
            />
          </div>
        </div>
      </Router>
    );
  }
}
export default App;


// <Loader isActive={this.state.loading} />
// const Loader = props => ({
//   render: function() {
//     if (this.props.isActive) 
//     return (
//     <div className="loadering-wrap">
//       <div className="loadering">
//       <div className="loadering-inner">
//       <FontAwesome name="truck" className="loader-icon" />
//       </div> 
//       </div>
//     </div>
//     );
//     else return null;
//   }
// });

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated() ? (
      renderMergedProps(Component, props, rest)
    ) : (
        <Redirect to={{
          pathname: '/login/signin',
          state: { from: props.location }
        }} />
      )
  )} />
)

