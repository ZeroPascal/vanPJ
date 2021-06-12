import express from 'express'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { ControlCommands, ControlKeys, ioCommands } from './constants'
import pjPoller from './pjPoller'

const https = require('https')
const fs = require('fs')
const key = fs.readFileSync('./certs/server.key')
const cert = fs.readFileSync('./certs/server.crt')
const path = require('path');
var btoa = require('btoa')
const app = express()
const port = 3002

const start = 101
const end = 192
const ipRange = '192.168.10.'


const polling = true //Sets the Interval Start
//app.set('trust proxy', 1) //trust first proxy




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

  if (polling)
    setInterval(f, 60000)
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
          pj.Control(cmd).then(res =>{
          pjs.updateStatus()
          io.emit(ioCommands.REQUEST_UPDATE)
         
          return
        })
        } else {
          res.status(404).json('Bad Command')
        }
    }

  }
  res.status(404).json('Bad Command')
})
app.get('/192.168.10.*', (req, res) => {
  console.log(req.url)
  let url = 'http:/' + req.url
  let pj = pjs.getPJ(parseInt(req.url.slice(-3)))
  if (pj) {
    console.log(pj)
    res.status(200).json(pj)
  } else {
    res.status(404).json('PJ NOT FOUND')

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

  console.log('Socket Conencted')
  socket.on(ioCommands.REQUESTING_UPDATE, () => {
    socket.emit(ioCommands.EMITTING_PJS, pjs.pjs)
    socket.emit(ioCommands.EMITTING_STATUS, pjs.getStatus())
  })

});

server.listen(port);
/*
const server = https.createServer({ key: key, cert: cert }, app);
server.listen(port, () => `Server running on port ${port}`)
*/




