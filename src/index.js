import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {css, injectGlobal} from 'react-emotion';
import axios from 'axios';
import Futura from './fonts/Futura.ttc';
import {CryptoApp} from './components/crypto';

injectGlobal`
  html, body {
    height: 100vh;
    width: 100vw; 
    margin: 0;
  }
  #app {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  @font-face {
    font-family: 'Futura';
    src: url(${Futura}) format('truetype');
  }
  `;
  
function prepareData(content){
  console.log(content);
  return content.data.data.filter((data) => {
    const symbol = data.symbol.toLowerCase();
    return content.requestedCoins.includes(symbol);
  }).slice(0, 12);
}



class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      content: {}
    };
  }
  
  
  componentDidMount(){
    axios.get('/info')
    .then(res => {  
      console.log('@data', res.data);
      this.setState({content: res.data});
    });
    setInterval(() => {
      axios.get('/info')
      .then(res => {  
        this.setState({content: res.data});
      });
    }, 10 * 60 * 1000);
  }



  render(){ 
    let filteredData, syncTime;
    if(this.state.content.data){ 
      filteredData = prepareData(this.state.content);
      syncTime = new Date(this.state.content.data.status.timestamp);
    }else{
      return <div>no data</div>;
    }
    return(
      <CryptoApp data={filteredData} time={syncTime}/>
    )
  }
}


ReactDOM.render(
  <App/>,
  document.getElementById('app')
);