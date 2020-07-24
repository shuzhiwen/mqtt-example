import React from "react";
import { observable, autorun, action } from "mobx";
import { observer } from "mobx-react";
import "./App.css";

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.person = observable({
      name: 'John',
      age: 42,
      showAge: false,

      //计算属性
      get labelText() {
        return this.showAge ? `${this.name} (age: ${this.age})` : this.name;
      },

      //动作
      setAge(age) {
        this.age = age;
      }
    }, {
      setAge: action
    });

    //对state改变作出响应
    autorun(() => console.log(this.person.labelText));

    //改变state
    this.person.setAge(50);
    setTimeout(() => this.person.name = 'Dave', 1000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Name: {this.person.name}</header>
      </div>
    );
  }
}

export default App;
