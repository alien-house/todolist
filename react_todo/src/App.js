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
    this.state = {
      todoItems: todo,
      newItem: ''
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
  }
  handleEdit(e) {
    this.setState({ newItem: e.target.value });
  }
  handleKey(e) {
    if (e.key === 'Enter') {
      this.handleAdd();
    }
  }
  handleAdd() {
    if (this.state.newItem) {
      const item = { name: this.state.newItem };
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
            
            <Route exact path="/" name="all" render={() => <ListComponent items={this.state.todoItems} />} />
            <Route path="/active" name="active" render={() => <ListComponent todoStatus={0} items={this.state.todoItems} />} />
            <Route path="/completed" name="completed" render={() => <ListComponent todoStatus={1} items={this.state.todoItems} />} />

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
    console.log(props);
  }

  render() {
    // console.log(this.props.items);
    const currentItems = this.props.items.map((item, i) =>
      <li key={i}>
        <input type="checkbox" name="chk" />
        {item.name}
        <button onClick={() => this.handleDelete(i)}>delete</button>
      </li>
    );

    // const { query } = this.props.location;
    // const { params } = this.props.match;
    // const { article } = params;
    // const { date, filter } = query;
    // this.state.isAuthenticated? (
    //    <Route children={this.props.children} />
    //  ) : (
    // 		<Redirect to={'/mypage'} />
    //  )
      //    {currentItems}
    // {
    //   this.props.route.items.map(fruit =>
    //     <li key={fruit}>{fruit}</li>
    //   )
    // }
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