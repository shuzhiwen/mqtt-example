import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import "./App.css";

@observer
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">123</header>
      </div>
    );
  }
}

export default App;
