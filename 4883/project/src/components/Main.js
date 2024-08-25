require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'реакт';
import { unregisterScrollListener } from 'react-virtualized/dist/es/WindowScroller/utils/onScroll';
import RoomComponent from './Room';

const frameImage = require('../images/frame.png');

class AppComponent extends React.Component {
  componentDidMount() {
    unregisterScrollListener(this, document.body);
  }

  render() {
    return (
      <div id="container" className="index">
        <img src={frameImage} />
        <p>Комната</p>
        <RoomComponent />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
