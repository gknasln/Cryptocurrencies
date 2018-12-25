import React from 'react';
import {css} from 'react-emotion'; 
import bgImage from './../images/background.png';
import {icons} from './../images';
import {formatPrice} from './../formatPrice';

const Arrow = ({value}) => {
    if(value > 0){
        return(
            <span id="current-percent" style={{color: 'rgb(16, 216, 16)'}}>{value}% ▲</span>
        )
    }else{
        return(
            <span id="current-percent" style={{color: 'red'}}>{value}% ▼</span>
        )
    }
}


const Block = ({currency, length}) => {

    let currentBlockStyle = block;
    if(length == 1){
        currentBlockStyle = singleBlock;
    }else if(length == 2){
        currentBlockStyle = doubleBlock;
    }
    
    return(
        <div className={currentBlockStyle}>
            <div id="top-side">
                <div>
                    <img id="icon-style" src={icons[currency.symbol.toLowerCase()]}/> 
                    <br/>
                    <span id="name">{currency.name}</span>
                </div>
                <div  >
                    <span id="current-value">$ {formatPrice(currency.quote.USD.price)}</span>
                    <br/>  
                    <Arrow value={formatPrice(currency.quote.USD.percent_change_24h)}/> 
                </div>
            </div>
            <hr/>
            <div className={blockBottom}>
                <div id="market-capacity">
                    <span>Market Cap</span>
                    <span>${formatPrice(currency.quote.USD.market_cap, 0)}</span>
                </div>
                <div id="circulating-supply">
                    <span>Circulating Supply</span>
                    <span>{formatPrice(currency.circulating_supply, 0)}</span>
                </div>
            </div>
        </div>
    );
};    
 
export class CryptoApp extends React.Component {
    render(){
      if (!this.props.data) return null;

        const d = this.props.time;
        
        const syncDate = new Date(
            d.getUTCFullYear(),
            d.getUTCMonth(), 
            d.getUTCDate(), 
            d.getUTCHours(), 
            d.getUTCMinutes(), 
            d.getUTCSeconds());


        let time = new Intl.DateTimeFormat('en-GB', {hour12: false, hour: '2-digit', minute: '2-digit'}).format(syncDate);
        let date = new Intl.DateTimeFormat('en-GB', {hour12: false, day: '2-digit', month: 'numeric', year: 'numeric'}).format(syncDate);
        let currentStyle= '';
        if(this.props.data.length > 4){
            currentStyle = blockStyles.get(5);
        }else{
            currentStyle = blockStyles.get(this.props.data.length);
        }
        return(
            <div className={container}>
                <div className={header}>
                    Cryptocurrencies
                    <div style={{display: 'inline-block'}}>
                        <span style={{fontSize: '18px'}}>Last sync date</span>
                        <span style={{fontSize: '18px', marginLeft: '15px'}}>GMT {time}</span> 
                        <span  style={{marginLeft: '30px'}}>{date}</span>
                    </div>
                </div>  
                <div className={currentStyle}> 
                    {this.props.data.map(currency => (
                        <Block key={currency.name} currency={currency} length={this.props.data.length}/>
                    ))} 
                </div>
            </div>    
        )
    }
}

const container = css`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: url(${bgImage});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    & * {
        box-sizing: border-box;
        font-family: Futura;
        color: white;
    }   
`;

const header = css`
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.8);
    padding: 0 30px;
    line-height: 65px;
    font-size: 25px;

    span{

    }
`;

const blockContainer = css`
        width: 100%;   
        height: calc(100% - 65px); 
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-template-rows: 31.5% 31.5% 31.5%;
        grid-column-gap: 45px;
        grid-row-gap: 30px;
        padding: 20px;
`;
    
const blockContainerSingle = css`
    width: 100%;   
    height: calc(100% - 65px); 
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 650px; 
    padding: 20px;
`;  
    
const blockContainerDouble = css`
    width: 100%;
    height: calc(100% - 65px); 
    display: grid;
    justify-content: center;
    align-content: center;
    grid-template-columns: 650px 650px;
    grid-template-rows: 31.5%;
    grid-column-gap: 10%;

`;
    
const blockBottomTriple = css`
    width: 100%;
    height: calc(100% - 65px); 
    display: grid;
    align-content: center;
    justify-content: center; 
    grid-template-columns: 450px 450px 450px;
    grid-template-rows: 30.5%; 
    grid-column-gap: 8%;
`;

const blockContainerFour = css`
    width: 100%;
    height: calc(100% - 65px); 
    display: grid;
    align-content: center;
    justify-content: center;
    grid-template-columns: 500px 500px;
    grid-template-rows: 30.5% 30.5%;
    grid-column-gap: 10%;
    grid-row-gap: 15%;
`;  
   
const blockStyles = new Map();
blockStyles.set(1, blockContainerSingle);
blockStyles.set(2, blockContainerDouble);
blockStyles.set(3, blockBottomTriple);
blockStyles.set(4, blockContainerFour);
blockStyles.set(5, blockContainer);



const block = css`
    border: 2px solid rgba(100, 100, 100, 0.7);
    border-radius: 5px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5);
    
    #top-side{
        display: flex;
        justify-content: space-between;
    }

    #icon-style{
        width: 64px;
        height: 64px;
    }

    #name{
        font-size: 25px;
    }

    #current-value{
        font-size: 50px;
    }

    #current-percent{
        font-size: 30px; 
        float: right;
        padding-top: 10px;
    }
    
    hr{
        opacity: 0.7;
    } 
`;

const singleBlock = css`
    border-radius: 5px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5);   
    height: 40%;  

    #top-side{
        display: flex;
        justify-content: space-between;
    }

    #icon-style{
        width: 64px;
        height: 64px;
        margin: 15px 0 20px 10px;
    }

    #name{
        font-size: 30px;
    }

    #current-value{
        font-size: 60px;
    }

    #current-percent{
        font-size: 40px;
        float: right;
        padding-top: 10px;
    }

    hr{
        opacity: 0.7;
    }

    #market-capacity{
        font-size: 30px; 
    }

    #circulating-supply{
        font-size: 30px; 
    }
`;

const doubleBlock = css`
    border-radius: 5px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5); 

    #top-side{
        display: flex;
        justify-content: space-between;
    }

    #icon-style{
        width: 64px;
        height: 64px;
        margin: 15px 0 20px 10px;
    }

    #name{
        font-size: 30px;
    }

    #current-value{
        font-size: 60px;
    }

    #current-percent{
        font-size: 40px;
        float: right;
        padding-top: 10px;
    }

    hr{
        opacity: 0.7;
    }

    #market-capacity{
        font-size: 30px; 
    }

    #circulating-supply{
        font-size: 30px; 
    }
`;

const blockBottom = css`
    width: 100%;
    height: 50%;
    display: flex; 
    flex-direction: column;  
    justify-content: space-around;
    font-size: 23px; 

    div{
        display: flex;
        justify-content: space-between;
    } 
`;