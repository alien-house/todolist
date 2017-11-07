import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const todo = JSON.parse(localStorage.getItem('todo')) || [];
    this.state = {
      todoItems: todo,
      newItem: ''
    };
    // this.handleEdit = this.handleEdit.bind(this);
    // this.handleKey = this.handleKey.bind(this);
    // this.handleAdd = this.handleAdd.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
    // this.inputFocus = this.inputFocus.bind(this);
  }
  render() {
    const currentItems = this.state.todoItems.map((item, i) =>
      <li key={i}>
        {item.name}
        <button onClick={() => this.handleDelete(i)}>delete</button>
      </li>
    );
    return (
      <div>
        <input
          type="text"
          value={this.state.newItem}
          onChange={this.handleEdit}
          onKeyPress={this.handleKey}
        />
        <button onClick={this.handleAdd}>add</button>
        <ul>
          {currentItems}
        </ul>
      </div>
    );
  }
}

export default App;

// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <h1 className="App-title">Welcome to React</h1>
//   </header>
//   <p className="App-intro">
//     To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
// </div>