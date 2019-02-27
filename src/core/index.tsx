import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Viewer } from 'resium';

class Trunk extends Component {
  render = () => {
    return <Viewer full />;
  };
}

export default hot(module)(Trunk);
