import React, { Component } from 'react';
import LoginComponent from './Login';
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

class Todolist extends Component {
  constructor(props) {
    super(props);
    const todo = JSON.parse(localStorage.getItem('todo')) || [];
    this.state = {
      todoItems: todo,
      newItem: '',
      isAuth:true
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    // this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleEdit(e) {
    this.setState({ newItem: e.target.value });
  }
  handleKey(e) {
    if (e.key === 'Enter') {
      this.handleAdd();
    }
  }
  handleCheck(todoToToggle) {
    this.setState({
      todoItems: this.state.todoItems.map((x) => {
        if (x === todoToToggle) {
          const newTodo = {};
          x.status = x.status ? 0 : 1;
          Object.assign(newTodo, x, { status: x.status });
          return newTodo;
        }
        return x;
      })
    });
    localStorage.setItem('todo', JSON.stringify(this.state.todoItems));
  }
  handleAdd() {
    if (this.state.newItem) {
      const item = { name: this.state.newItem, status: 0 };
      const newItems = this.state.todoItems.concat(item);
      this.setState({ todoItems: newItems });
      this.setState({ newItem: '' });
      this.inputFocus();
      localStorage.setItem('todo', JSON.stringify(newItems));
    }
  }
  handleDelete(i) {
    const tempItems = this.state.todoItems;
    tempItems.splice(i, 1);
    this.setState({ todoItems: tempItems });
    this.inputFocus();
    localStorage.setItem('todo', JSON.stringify(this.state.todoItems));
  }
  inputFocus() {
    document.querySelector('input[type="text"]').focus();
  }
  handleLogout() {
    console.log("handleLogout");
    firebase.auth().signOut();
    console.dir(firebase.auth().currentUser);
    history.push('/login');

  }


  render() {
    if (!isAuthenticated())
      return (
        <Router>
          <Route exact path="/login" name="login" render={() => <LoginComponent isAuthenticatedFnc={this.isAuthenticated} />} />
        </Router> );

    return (
      <div>
        <Router>
          <div>
        <button className="btn-logout" onClick={this.handleLogout}>Logout</button>
        <input
          type="text"
          value={this.state.newItem}
          onChange={this.handleEdit}
          onKeyPress={this.handleKey}
        />
        <button onClick={this.handleAdd}>add</button>

            <Route exact path="/" name="all" render={() => <ListComponent chkFunc={this.handleCheck} deleteFunc={this.handleDelete} items={this.state.todoItems} />} />
            <Route path="/active" name="active" render={() => <ListComponent chkFunc={this.handleCheck} deleteFunc={this.handleDelete} todoStatus={0} items={this.state.todoItems} />} />
            <Route path="/completed" name="completed" render={() => <ListComponent chkFunc={this.handleCheck} deleteFunc={this.handleDelete} todoStatus={1} items={this.state.todoItems} />} />

            <ul>
              <li><Link to="/">All</Link></li>
              <li><Link to="/active">Active</Link></li>
              <li><Link to="/completed">Completed</Link></li>
            </ul>
          </div>
        </Router>

        </div>
    );
  }
}
export default Todolist;

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={props => (
//     isAuthenticated() ? (
//       <Component {...props} />
//     ) : (
//         <Redirect to={{
//           pathname: '/login/signin',
//           state: { from: props.location }
//         }} />
//       )
//   )} />
// )


class ListComponent extends React.Component {

  constructor(props) {
    super(props);
    // console.log(props);
  }

  render() {
    // console.log(this.props.items);
    const currentItems = this.props.items.filter((item, i) => {
      switch (this.props.todoStatus) {
        case 0:
          return item.status === 0;
        case 1:
          return item.status === 1;
        default:
          return true;
      }
    }).map((item, i) => {
      const checked = item.status === 1 ? 'checked' : '';
      return (
        <li key={i}>
        <input 
          type="checkbox" 
          name="chk"
          checked={checked}
          onChange={this.props.chkFunc.bind(this, item)} />
          {item.name}
          <button onClick={() => this.props.deleteFunc(i)}>delete</button>
        </li>
      )}
    );

    return (
      <div>
        <ul>
          {currentItems}
        </ul>
      </div>
    );
  }
}
ListComponent.propTypes = {
  todoStatus: PropTypes.number,
  items: PropTypes.array,
  chkFunc: PropTypes.func,
  deleteFunc: PropTypes.func,
};






