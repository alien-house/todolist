import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { firebaseAuth, firebaseDB } from "./Config";
import {
  BrowserRouter as Router,
  NavLink,
  Route
} from 'react-router-dom'

class Todolist extends Component {
  constructor(props) {
    super(props);
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
    this.unsubscribe = '';
  }
  componentWillMount() {
    var that = this;
    this.unsubscribe = firebaseAuth().onAuthStateChanged(function (user) {
      if (user) {
        that.props.changeLoaderState(true);
        that.setState({
          userID: user.uid
        });
        let urlid = "users/" + user.uid;
        firebaseDB().ref(urlid).once('value').then(function (snapshot) {
          var objDate = snapshot.val();
          const todo = objDate.todoItems || [];
          that.setState({
            todoItems: todo
          });
          that.props.changeLoaderState(false);
        });
      }
    });
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
  }
  inputFocus() {
    document.querySelector('input[type="text"]').focus();
  }
  updateDatabase(dataObj) {
    let user = firebaseAuth().currentUser;
    if (!user) alert("There is no user account.");
    return firebaseDB().ref('users/' + user.uid).set(dataObj);
  }

  render() {
    return <Router>
        <div className="todo-wrap">
          <div className="todo">
            <div className="todo-box">
              <div className="todo-input-box">
                <input type="text" className="todo-input" placeholder="Add something to do..." value={this.state.newItem} onChange={this.handleEdit} onKeyPress={this.handleKey} />
              </div>
              <button className="btn-add" onClick={this.handleAdd}>
                Add
              </button>
            </div>

            <Route exact path="/" name="all" render={() => <ListComponent chkFunc={this.handleCheck} deleteFunc={this.handleDelete} items={this.state.todoItems} />} />
            <Route path="/active" name="active" render={() => <ListComponent chkFunc={this.handleCheck} deleteFunc={this.handleDelete} todoStatus={0} items={this.state.todoItems} />} />
            <Route path="/completed" name="completed" render={() => <ListComponent chkFunc={this.handleCheck} deleteFunc={this.handleDelete} todoStatus={1} items={this.state.todoItems} />} />
          </div>
          <ul className="filterNav">
            <li>
              <NavLink activeClassName="active" to="/">
                All
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/active">
                Active
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/completed">
                Completed
              </NavLink>
            </li>
          </ul>
        </div>
      </Router>;
  }
}
export default Todolist;



class ListComponent extends React.Component {
  render() {
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
      const checkedClass = item.status === 1 ? 'seleted' : '';
      return <li className={"list-item " + checkedClass} key={i}>
          <div className="list-item-txt">
            <label className="checkbox-container">
              <input type="checkbox" name="chk" checked={checked} onChange={this.props.chkFunc.bind(this, item)} />
              <span className="checkmark" />
              {item.name}
            </label>
          </div>
          <button className="btn-delete" onClick={() => this.props.deleteFunc(i)}>
            Delete
          </button>
        </li>;}
    );

    return (
      <div className="list-wrap">
        <ul className="list">
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






