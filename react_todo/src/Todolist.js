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

const ID_TOKEN_KEY = 'KEY_FOR_LOCAL_STORAGE';


class Todolist extends Component {
  constructor(props) {
    super(props);
    console.log("constructor===========");
    this.state = {
      todoItems: [],
      newItem: '',
      isAuth:true,
      userID:''
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.unsubscribe;
  }
  componentWillMount() {
    console.log("componentWillMount===========");
    var that = this;
    this.unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("user" + user);
        that.setState({
          userID: user.uid
        });
        let urlid = "users/" + user.uid;
        console.log("urlid:" + urlid);
        firebase.database().ref(urlid).once('value').then(function (snapshot) {
          var objDate = snapshot.val();
          console.log("==========getDatabase============");
          console.dir(objDate.todoItems);
          const todo = objDate.todoItems || [];
          console.log(todo);
          that.setState({
            todoItems: todo
          });
        });
      }
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.unsubscribe();
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
    let todoObj = {
      todoItems: this.state.todoItems
    };
    this.updateDatabase(todoObj);
    // localStorage.setItem('todo', JSON.stringify(this.state.todoItems));
  }
  handleAdd() {
    
    if (this.state.newItem) {
      const item = { name: this.state.newItem, status: 0 };
      const newItems = this.state.todoItems.concat(item);
      let todoObj = {
        todoItems: newItems
      };
      this.setState({ todoItems: newItems });
      this.setState({ newItem: '' });
      this.inputFocus();
      this.updateDatabase(todoObj);
      // localStorage.setItem('todo', JSON.stringify(newItems));
    }
  }
  handleDelete(i) {
    const tempItems = this.state.todoItems;
    tempItems.splice(i, 1);
    this.setState({ todoItems: tempItems });
    let todoObj = {
      todoItems: tempItems
    };
    this.inputFocus();
    this.updateDatabase(todoObj);
    // localStorage.setItem('todo', JSON.stringify(this.state.todoItems));
  }
  inputFocus() {
    document.querySelector('input[type="text"]').focus();
  }
  updateDatabase(dataObj) {
    let user = firebase.auth().currentUser;
    if (!user) alert("There is no user account.");
    return firebase.database().ref('users/' + user.uid).set(dataObj);
  }


  render() {
    return (
      <div>
        <Router>
          <div>
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






