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

    const message = observable({
      title: 'hello',
      likes: ['Nemo']
    });

    //autorun(() => console.log(message.title));
    message.title = 'hello world';

    autorun(() => console.log(message.likes.join(', ')));
    message.likes.push("Jennifer");
    message.likes[2] = 'Daming';
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
