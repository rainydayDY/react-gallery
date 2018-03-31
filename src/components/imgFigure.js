require('normalize.css/normalize.css');
require('styles/index.scss');

import React from 'react';

class ImgFigures extends React.Component {
  constructor(props){
    super(props)
  }

  handleClick(index, e){
    e.stopPropagation();
    e.preventDefault();
    this.props.onReverse(index)
  }

  render(){
    let styleObj = {};
    if(this.props.imgInfo.pos){
      styleObj = this.props.imgInfo.pos
    }
    if(this.props.imgInfo.rotate){
      styleObj['transform'] = `rotate(${this.props.imgInfo.rotate}deg)`
    }
    let imgFigure = this.props.imgInfo.isInverse ? 'img-figure is-inverse' : 'img-figure';
    return (
      <figure className={imgFigure} style={styleObj} onClick={this.handleClick.bind(this,this.props.currentIndex)}>
        <img src={this.props.value.imgUrl} alt={this.props.value.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.value.title}</h2>
          <div className="img-back">
            <p>{this.props.value.desc}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}
ImgFigures.defaultProps = {
};
export default ImgFigures;
