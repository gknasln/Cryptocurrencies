import path from 'path';
import express from 'express';
import mockData from './mockData';
import axios from 'axios';
const isDevMode = process.argv.includes('dev');

let _port = 80;

let content;
let orientation;
let user;

function update({URL}){
  if(isDevMode) return;
  process.send({type: 'update', path: URL});
}

function display({URL}){
  if(isDevMode) return;
  log({message: 'display sent back with path: ' + URL});
  process.send({type: 'display', path: URL});
}

function log({message}){
  if(isDevMode) return console.log(message);
  process.send({type: 'log', message});
}

function error({message}){
  if(isDevMode) return;
  process.send({type: 'error', message});
}

function ready(){
  if(isDevMode) return;
  process.send({type: 'isReady'});
}

/* Server Codes */

const app = express();
const staticPath = isDevMode 
  ? path.resolve(process.argv[1], '..', 'dist')
  : path.resolve(process.argv[1], '..', 'build');
app.set('public', staticPath);
app.use(express.static(app.get('public')));

function createServer({content, orientation, port, user}){
  app.get('/', (req, res) => {
    res.sendFile('index.html', {root: app.get('public')});
  });
  app.get('/info', (req, res) => {
    res.send(content);
  });
  app.get('/currencies', (req, res) => {
    res.send({eth: 10});
  });
  app.listen(port, () => {
    log({message: `Listening on port ${port}`});
    ready();
  });
}

async function devMode(){
  await init({content: mockData.content, orientation: mockData.orientation, port: _port, user: mockData.user});
  createServer({content: mockData.content, orientation: mockData.orientation, port: _port, user: mockData.user});
}

if(isDevMode){
  devMode();
} else {
  process.on('message', async (data) => {
    switch (data.type){
      case 'init':
        log({message: 'App received init'});
        _port = data.port;
        let {content, orientation, port, user} = data;
        await init({content, orientation, port, user});
        createServer({content, orientation, port, user});
        break;
      case 'display':
        log({message: 'App received display'});
        display({URL: `http://localhost:${_port}`});
        break;
    }
  });
}


// query param
async function RequestWithParam(apiKey){
  let path = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${apiKey}`;

  let res = await axios.get(path);
  if (res.status.toString().startsWith('2')) {
      return res.data;
  } else {
      return [];
  }
}

async function init({content, orientation, port, user}){
  getData(content);
  setInterval(function(){ getData(content)}, 10 * 60 * 1000);
}

async function getData(content){ 
  try{  
    console.log('gettingData');
    content.data = await RequestWithParam(content.apiKey);
  }catch(err){
    console.log(err);
  }
}