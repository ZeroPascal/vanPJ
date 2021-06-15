import express from 'express'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { Config, ControlCommands, ControlKeys, defaultConfig, ioCommands } from './constants'
import pjPoller from './pjPoller'

const https = require('https')
const app = express()
const path = require('path');

const port = 3002
const fs = require('fs')
export let config: Config = defaultConfig
try{
  config = JSON.parse(fs.readFileSync('./ServerConfig.json').toString())
  //console.log(config)

}catch(e){
 console.log('Could Not read Config')
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/test', (req, res) => {
  res.send('Hello World From Panasonic Server')

})



const pjs = new pjPoller();
let time = Date.now()

console.log('Starting Poller')

pjs.start().then(() => {
  console.log('PJS Built!', (Date.now() - time) / 1000 + 's')

  if (config.Polling)
    setInterval(f, config.Polling_Interval)
})

//getStatus(101)
const f = () => {
  console.log('Polling ', Date())
  let time = Date.now()
  pjs.pollAllPJs().then(() => {
    console.log('PJs Rereshed', (Date.now() - time) / 1000 + 's')
    io.emit('pjs', pjs.pjs)
  })
}
app.get('/api/status/*', async (req, res, next) => {

  let q = req.query
  //console.log('Status:', q)

  if (q.rigstatus) {
    //console.log('Requested Rig Status')
    res.status(200).json(pjs.getStatus())
    return
  }
  if (q.pj) {

    let pj = q.pj

    if (pj == 'all') {
     // console.log('Requested All', Date())
      res.status(200).json(pjs.getPJs())
      return
    }
    let pjID = parseInt(q.pj.toString())

    if (!pjs || isNaN(pjID) || !pjs.getPJ(pjID)) {

      res.status(404).json('PJ NOT FOUND')
      return
    }

    // pj = pjs.getPJ(pjID)
    res.status(200).json(pjs.getPJ(pjID))
  }
  if (q.poll) {
    //console.log('Polling')
    let pjID = parseInt(q.poll.toString())

    if (!pjs || isNaN(pjID) || !pjs.getPJ(pjID)) {
      res.status(404).json('PJ NOT FOUNT')
      return
    }
    res.status(200).json(await pjs.pollPJ(pjID))
  }

})
app.get('/api/set/*', async (req, res) => {

  let q = req.query
  console.log('Set:', q)
  if (q.pj) {

    let pjID = parseInt(q.pj.toString())
    if (!pjs || isNaN(pjID) || !pjs.getPJ(pjID)) {
      res.status(404).json('PJ NOT FOUND')
      return
    } else if(q.command) {
        let pj = pjs.getPJ(pjID)
        let cmd = q.command.toString() as ControlKeys
     
        if (Object.keys(ControlCommands).includes(cmd)) {
          res.status(200).json('Good Command') 
          let vartiable = q.vartiable? q.vartiable.toString() : undefined;
          pj.Control(cmd, vartiable).then(res =>{
          pjs.updateStatus()
          io.emit(ioCommands.REQUEST_UPDATE)
        })
          return
        } else {
          res.status(404).json('Bad Command')
          return
        }
    }

  }
  res.status(404).json('Bad Command')
  return
})

app.get('/api/config*',(req,res)=>{
  let q = req.query
  if(req.query){
    
  }
})

app.get('/rigStatus', (req, res) => {
  console.log('Rig Status')
  res.status(200).json(pjs.getStatus())

})

const server = require('http').createServer(app);

const io = new Server(server);
pjs.io = io
io.on('connection', (socket: Socket) => {
  socket.emit(ioCommands.REQUEST_UPDATE)
  socket.emit(ioCommands.EMITTING_CONFIG, config)
  console.log('Socket Conencted')
  socket.on(ioCommands.REQUESTING_UPDATE, () => {
    socket.emit(ioCommands.EMITTING_PJS, pjs.pjs)
    socket.emit(ioCommands.EMITTING_STATUS, pjs.getStatus())
  })
  socket.on(ioCommands.REQUEST_CONFIG, ()=>{
    socket.emit(ioCommands.EMITTING_CONFIG,config)
  })
  

});

server.listen(port);
/*
const server = https.createServer({ key: key, cert: cert }, app);
server.listen(port, () => `Server running on port ${port}`)
*/




