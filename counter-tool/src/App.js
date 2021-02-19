import React, {useEffect, useState} from 'react';
import {Button, Form, Row} from 'react-bootstrap';
import './App.css';

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(
    () => {
      const listener = ({key}) => {
        console.log(key);
        if (key === 'a' || key === 'A') {
          setCount1(count1 + 1);
        } else if (key === 's' || key === 'S') {
          setCount2(count2 + 1);
        } else if (key === 'z' || key === 'Z') {
          setCount1(count1 === 0 ? 0 : count1 - 1);
        } else if (key === 'x' || key === 'X') {
          setCount2(count2 === 0 ? 0 : count2 - 1);
        }
      };
      document.addEventListener('keypress', listener);
      return () => document.removeEventListener('keypress', listener);
    },
    [count1, count2]
  );

  return (
    <div className="App">
      <header className="App-header">
        <Form as={Row} className="form">
          <Form.Group className="group">
            <Form.Text className="text">{count1}</Form.Text>
            <Form.Control type="text" placeholder="数字1备注（A加Z减）" />
          </Form.Group>
          <Form.Group className="group">
            <Form.Text className="text">{count2}</Form.Text>
            <Form.Control type="text" placeholder="数字2备注（S加X减）" />
          </Form.Group>
          <Button className="button" onClick={() => setCount1(0) || setCount2(0)}>
            清零
          </Button>
        </Form>
      </header>
    </div>
  );
}

export default App;
