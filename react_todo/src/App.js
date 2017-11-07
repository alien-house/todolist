import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Link,
  Route
} from 'react-router-dom'


class App extends Component {
  constructor(props) {
    super(props);
    const todo = JSON.parse(localStorage.getItem('todo')) || [];
    console.dir(todo);
    this.state = {
      todoItems: todo,
      newItem: ''
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
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
          if (x.status){
            x.status = 0;
          }else{
            x.status = 1;
          }
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
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.newItem}
          onChange={this.handleEdit}
          onKeyPress={this.handleKey}
        />
        <button onClick={this.handleAdd}>add</button>

        <Router>
          <div>
            
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
export default App;



class ListComponent extends React.Component {

  constructor(props) {
    super(props);
    // console.log(props);
  }

  render() {
    // console.log(this.props.items);
    const currentItems = this.props.items.map((item, i) => {
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








// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <h1 className="App-title">Welcome to React</h1>
//   </header>
//   <p className="App-intro">
//     To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
// </div>