import React from 'react';
import CrossGambling from './components/CrossGambling';

export default class App extends React.Component {
  render() {
    return (<div className="app">
      <h1>Complexity Gambling</h1>
      <CrossGambling />
    </div>);
  }
}
