> React 总结

初学react，和以往不同的是，这次自己学习新语言，入门要比以往迅速许多，学习能力有提升，学习方法也比从前进步，所以，一个人能够收获多少，沉淀多少，都是拜他自己所赐。

## 学习前的思考
1. 我为什么要学React?
2. 我要花多长时间来学习，并且掌握？
3. 学完之后我要用它做什么？
4. 我该用什么途径来提高学习它的效率？

## 学习过程
1. 首先看[文档](https://doc.react-china.org/docs/hello-world.html)，官方的文档是英文的，要想快速的完成，英文阅读理解能力不强的话，就去找中文的，如果中途遇到晦涩难懂的中文翻译，自己去翻译英文可能会更容易理解。
2. 学习过程不能光看，最好是把示例代码自己敲一遍然后运行一遍。
3. 在慕课上找一些视频来看，不要看入门级的，找成品来看，一方面可以收获实现某种效果的思路，另一方面还能运用新学语言，看思路就好。
4. 去github上找一些star多的demo。
5. 多练习，多运行，多查。

## 语法总结
####  定义组件 && ES6 class
参考：[ES6 Class 继承](http://es6.ruanyifeng.com/#docs/class-extends)
```javascript
class ComponentName extends React.Component {
  constructor(props){
    super(props);
    // 类的方法默认是不会绑定this的
    this.handleClick = this.handleClick.bind(this);
    // 定义state
    this.state = {
      stateValue: ''
    }    
    // 定义class中所需的变量
    this.Constant = {
      info: {
        left: '' ,
        top: ''
      }
    }  
  }

  handleClick(e){
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target.value);
    console.log(e.target.nodeName);
  }

  handleChange(index,e){
    // 事件对象e要排在所传递参数的后面
    console.log(index)
    this.setState({
      stateValue: index
    })
  }

  componentDidMount(){
    // DOM渲染完成
  }

  render(){
    const propValue = this.props.value;
    const stateValue = this.state.stateValue;
    const listItems = propValue.map((item, index) => {
      // 列表渲染需要指定唯一的key值
      return <span key={index} onChange={this.handleChange.bind(this,index)}>{item.name}</span>
    })
    return (
      <div className="out-wrapper">
          <a onClick={this.handleClick}>{stateValue}</a>
          <div>{listItems}</div>
      </div>
    )
  }
}
```
1. super()表示父类的构造函数，用来新建父类的this对象，因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工，如果不调用super()方法，子类就得不到this对象。
2. 事件绑定this
3. 列表渲染，key值一定存在
4. state && props 区别：前者可以变，但是需要通过setState()的方式改变，后者不可在子组件中更改，数据为单向传递。

## 实现官方文档中的示例
#### UI效果如下：
![UI效果](https://doc.react-china.org/static/thinking-in-react-mock-1071fbcc9eed01fddc115b41e193ec11-4dd91.png)
#### 步骤：

1. 划分组件层级
2. 用React创建静态DOM结构
3. 抽离出组件
4. 确定state和props
5. 反响数据流

#### 实现：
##### 数据mock
最近新发现了一种非常方便的mock数据的方式，[Easy Mock](https://easy-mock.com/project/5aaf5c724208430f514c6e4c),在后端没有给你提供API 的时候，你可以自己去模拟数据，但是手动创建数据太麻烦了，使用这个可以自己定义接口，请求方式，然后会生成可以请求的url，mock规则的[语法规范](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)，熟悉了之后再去创建数据，非常方便。
```javascript
const resultList = [
{category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
{category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
{category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
{category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
{category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
{category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```
##### 创建第一个组件：最外层组件
&nbsp;&nbsp;组件的划分：最外层父组件、用户可操作部分（输入框和单选框）、渲染结果组件。子组件SearchBar接收用户操作，然后触发父组件的自定义事件onSearchChange，返回值再传递给渲染结果的列表组件Productable进行数据过滤。
```javascript
class FilterTable extends React.Component {
 constructor(props){
   super(props)
   this.handleChange = this.handleChange.bind(this)
   this.state = {
     searchValue: '',
     isCheck: false
   }
 }

 handleChange(name,targetValue){
   if(name === 'input'){
     this.setState({
       searchValue: targetValue
     })
   }else if (name === 'checkbox') {
     this.setState(prevState => ({
       isCheck: !prevState.isCheck
     }))
   }
 }

 render(){
   return (
     <div className="out-wrap">
       <SearchBar searchValue={this.state.searchValue} isCheck={this.state.isCheck} onSearchChange={this.handleChange}/>
       <Productable searchValue={this.state.searchValue} isCheck={this.state.isCheck} />
     </div>
   )
 }
}
```
##### 用户可操作部分组件SearchBar
&nbsp;&nbsp;由于无论是输入框还是复选框，触发的事件都是onChange事件，所以用name区分，用一个方法处理。
```javascript
class SearchBar extends React.Component {
 constructor(props){
   super(props)
   this.handleChange = this.handleChange.bind(this)
 }

 handleChange(e){
   if(e.target.name === 'input'){
     this.props.onSearchChange(e.target.name, e.target.value)
   }else if (e.target.name === 'checkbox') {
     this.props.onSearchChange(e.target.name, e.target.checked)
   }
 }

 render(){
   return (
     <div>
     <input type="text" value={this.props.searchValue} name="input" onChange={this.handleChange}/>
     <div>
     <input type="checkbox" name="checkbox" checked={this.props.isCheck} onChange={this.handleChange} /><label>only show products in stock</label>
     </div>
     </div>
   )
 }
}
```
##### 结果列表组件 Productable
&nbsp;&nbsp;筛选出商品名称匹配用户搜索关键字、并且是否有库存匹配用户对复选框的勾选，此处用到ES6的[字符串includes](http://es6.ruanyifeng.com/#docs/string#includes-startsWith-endsWith)和[数组的includes](http://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E5%AE%9E%E4%BE%8B%E7%9A%84-find-%E5%92%8C-findIndex)；由于类别不确定有多少，所以需要把类别也要存入数组。
```javascript
class Productable extends React.Component {
 constructor(props){
   super(props)
 }

 render() {
   const categoryArray = []
   const listItems = []
   const searchValue = this.props.searchValue,
         isCheck = this.props.isCheck;         
   resultList.forEach((item,index)=>{
     if((searchValue && item.name.includes(searchValue)) || (isCheck && item.stocked)){
       if(categoryArray.includes(item.category)){
         categoryArray.push(item.category)
         listItems.push(<CategoryRow category={item.category} key={item.category}/>)
       }
       listItems.push(<ProductRow name={item.name} price={item.price} key={index}/>)
     }
   })
   return (
     <div>
     <div className="column-line">
     <span>Name</span>
     <span>Price</span>
     </div>
     {listItems}
     </div>
   )
 }
}
```
##### 类别标题组件
```javascript
class CategoryRow extends React.Component {
 constructor(props) {
   super(props)
 }

 render(){
   return (
     <h3>{this.props.category}</h3>
   )
 }
}
```
##### 产品结果组件
```javascript
class ProductRow extends React.Component {
 constructor(props){
   super(props)
 }

render(){
  return (
    <div className="column-line">
    <span>{this.props.name}</span>
    <span>{this.props.price}</span>
    </div>
  )
}
}
```
##### 最后，渲染。
```javascript
const element = (
  <FilterTable/>
)
ReactDOM.render(element,document.getElementById('root'))
```
在React理念这一节中，构建应用可以选择自顶向下构建，也可以选择自顶向上构建，因为这个示例比较小，所以自顶向下很容易。

-------------
获取真实的DOM节点：ReactDOM.findDOMNode(this.refs.)
## 组件的生命周期
#### 组件实例被创建和插入DOM时调用
1. constructor()
2. componentWillMount()
3. render()
4. componentDidMount
#### 组件更新时使用
1. componentWillReceiveProps()
2. shouldComponentUpdate()
3. componentWillUpdate()
4. render()
5. componentDidUpdate()
#### 组件卸载
componentWillUnmount()
