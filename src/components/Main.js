require('normalize.css/normalize.css');
require('styles/index.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { imgData } from '../mock/imgData.js';

import ImgFigures from './imgFigure';
import ControUnits from './controllterUnit'

class AppComponent extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      imgArrayPos: []
    }
    this.handleReverse = this.handleReverse.bind(this)
    this.Constant = {
      // 中心点的位置
      centerPos: {
        left: 0,
        top: 0
      },
      // 水平分区的位置
      hPosRange: {
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      // 垂直分区的位置
      vPosRange: {
        x: [0,0],
        topY: [0,0]
      }
    }
  }

  componentDidMount(){
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);

    let imgDom = ReactDOM.findDOMNode(this.refs.imgFigures0),
        imgW = imgDom.scrollWidth,
        imgH = imgDom.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    this.Constant.hPosRange = {
      leftSecX: [-halfImgW, halfStageW-3*halfImgW],
      rightSecX: [halfStageW+halfImgW, stageW-halfImgW],
      y: [-halfImgH, stageH-halfImgH]
    }

   this.Constant.vPosRange = {
     x: [halfStageW-imgW,halfImgW],
     topY: [-halfImgH, halfStageH-halfImgH*3]
   }

   this.layoutImg(0)

  }

  getRange(low,high){
    return Math.ceil(Math.random()*(high-low))+low
  }
  getRotate(){
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random()*30)
  }


  layoutImg(centerIndex){
    let imgArrayPos = this.state.imgArrayPos,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        // 中心图片
        imgArrayCenter = imgArrayPos.splice(centerIndex,1),
        // 布局上侧图片，一个或者0个
        topImgNum = Math.ceil(Math.random()*2),
        topIndex = Math.ceil(Math.random()*(imgArrayPos.length-topImgNum)),
        imgArrayTop = imgArrayPos.splice(topIndex,topImgNum);
        imgArrayCenter[0]={
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }
        imgArrayTop.forEach((item,index) => {
          imgArrayTop[index]= {
            pos: {
              top: this.getRange(vPosRangeTopY[0],vPosRangeTopY[1]),
              left: this.getRange(vPosRangeX[0],vPosRangeX[1])
            },
            rotate: this.getRotate(),
            isCenter: false
          }
        });
        for(let i = 0,j=imgArrayPos.length,k=j/2;i<j;++i){
          let hPosRangeX = i< k ? hPosRangeLeftSecX : hPosRangeRightSecX;
          imgArrayPos[i] = {
            pos: {
              top: this.getRange(hPosRangeY[0],hPosRangeY[1]),
              left: this.getRange(hPosRangeX[0],hPosRangeX[1])
            },
            rotate: this.getRotate(),
            isCenter: false
          }
        }

        if(imgArrayTop && imgArrayPos[0]){
          imgArrayPos.splice(topIndex,0,imgArrayTop[0])
        }
        imgArrayPos.splice(centerIndex,0,imgArrayCenter[0])

        this.setState({
          imgArrayPos: imgArrayPos
        })


  }

  handleReverse(index){
    console.log(index)
    if(this.state.imgArrayPos[index].isCenter){
      this.state.imgArrayPos[index].isInverse = !this.state.imgArrayPos[index].isInverse
      this.setState({
        imgArrayPos: this.state.imgArrayPos
      })
    }else {
      this.layoutImg(index)
    }
  }
  render() {
    let imgFigures= [],
        listItems = []
    imgData.map((item,index) => {
      if (!this.state.imgArrayPos[index]){
        this.state.imgArrayPos[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false

        }
      }
      item.imgUrl = require(`../images/${item.fileName}`)
      imgFigures.push(<ImgFigures imgInfo = {this.state.imgArrayPos[index]} value={item} currentIndex={index} key={index} ref={'imgFigures'+index} onReverse={this.handleReverse}/>)
      listItems.push(<ControUnits key={index} currentIndex={index} imgInfo={this.state.imgArrayPos[index]} onReverse={this.handleReverse}/>)
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {listItems}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
