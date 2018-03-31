require('normalize.css/normalize.css');
require('styles/index.scss');

import React from 'react';

class ControUnits extends React.Component {
  constructor(props){
    super(props);
  }

  handleClick(index){
    this.props.onReverse(index)
  }

  render(){
    let styleObj = this.props.imgInfo.isCenter ? 'controller-unit is-center': 'controller-unit'
    return (
        <span onClick={this.handleClick.bind(this,this.props.currentIndex)}  className={styleObj}/>
    )
  }
}

export default ControUnits
