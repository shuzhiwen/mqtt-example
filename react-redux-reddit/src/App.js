import React from 'react';
import AddTodo from './containers/AddTodo';
import VisibleTodoList from './containers/VisibleTodoList';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <AddTodo />
          <VisibleTodoList />
          <Footer />
        </div>
      </header>
    </div>
  );
}

export default App;
