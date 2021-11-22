import PromisePool from '@supercharge/promise-pool/dist'
import express from 'express'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import ConfigHandler from './ConfigHandler'
import { CommandPackage, Config, ControlCommands, ControlKeys, defaultConfig, Group, ioCommands, Macro, Patch } from './constants'
import MacroHandler from './MacroHandler'
import pjPoller from './pjPoller'

const https = require('https')
const app = express()
const path = require('path');

const port = 3002


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/test', (req, res) => {
  res.send('Hello World From Panasonic Server')

})

export let config = new ConfigHandler()
export let macroHandler = new MacroHandler()
const pjs = new pjPoller(config);
let time = Date.now()

console.log('Starting Poller')

pjs.start().then(() => {
  console.log('PJS Built!', (Date.now() - time) / 1000 + 's')
  //io.emit(ioCommands.EMITTING_PJS, pjs)
  config.PollingFunction = () => {
    console.log('Polling ', Date()) 
    let time = Date.now()
    pjs.pollAllPJs().then(() => {
      console.log('PJs Rereshed', (Date.now() - time) / 1000 + 's')
      io.emit(ioCommands.EMITTING_PJS, pjs.pjs)
    })
  }
})


app.get('/api/config*', (req, res) => {
  if (req.query) {
    config.processUpdate(req.query)
  }
  io.emit(ioCommands.REQUEST_CONFIG)
  res.status(200).json({})
})





//getStatus(101)

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

app.get('/stop',(req,res)=>{
  process.exit(0)
})
app.get('/api/set/*', async (req, res) => {

  let q = req.query
  console.log('Set:', q)
  if (q.pj) {

    let pjID = parseInt(q.pj.toString())
    if (!pjs || isNaN(pjID) || !pjs.getPJ(pjID)) {
      res.status(404).json('PJ NOT FOUND')
      return
    } else if (q.command) {
      let pj = pjs.getPJ(pjID)
      let cmd = q.command.toString() as ControlKeys

      if (Object.keys(ControlCommands).includes(cmd)) {
        res.status(200).json('Good Command')
        let vartiable = q.vartiable ? q.vartiable.toString() : undefined;
        pj.Control({cmd, vartiable},'API').then((res: any) => {
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

app.get('/api/config*', (req, res) => {
  let q = req.query
  if (req.query) {

  }
})

app.get('/rigStatus', (req, res) => {
  console.log('Rig Status')
  res.status(200).json(pjs.getStatus())

})

const server = require('http').createServer(app);
let clients  = 0
const io = new Server(server);
pjs.io = io
config.io = io
macroHandler.io = io
io.on('connection', (socket: Socket) => {
  socket.emit(ioCommands.EMITTING_PJS, pjs.pjs)
  socket.emit(ioCommands.EMITTING_STATUS, pjs.getStatus())
  socket.emit(ioCommands.EMITTING_CONFIG, config.config)
  macroHandler.emitMacros()
  //socket.emit(ioCommands.REQUEST_UPDATE)
  //socket.emit(ioCommands.REQUEST_CONFIG)
  clients++
  console.log('Socket Conencted',clients)
  socket.on('disconnect',()=>{
    
    clients--
    console.log('Socket Disconnected',clients)
  })
  socket.on(ioCommands.REQUESTING_UPDATE, () => {
    console.log('Requested Update')
    //socket.emit(ioCommands.EMITTING_PJS, pjs.pjs)
    //socket.emit(ioCommands.EMITTING_STATUS, pjs.getStatus())
  })
  socket.on(ioCommands.REQUESTING_CONFIG, () => {
     console.log('Sending Current Config')
    //socket.emit(ioCommands.EMITTING_CONFIG, config.config)
  })

  socket.on(ioCommands.NEW_MACRO,(payload: Macro )=>{
    console.log('Adding Macro', payload)
    macroHandler.addMacro(payload)
  })
  socket.on(ioCommands.UPDATE_MACRO,(payload: Macro)=>{
    macroHandler.setMacro(payload)
  })
  socket.on(ioCommands.DELETE_MACRO,(payload: string)=>{
    console.log('Deleting')
    macroHandler.removeMacro(payload)
  })

  socket.on(ioCommands.EMITTING_PATCH, (patch) => {

    config.Patch = patch as Patch
    socket.emit(ioCommands.REQUEST_CONFIG)
    pjs.buildAllPJS()
  })
  socket.on(ioCommands.FIRE_MACRO,(payload: Macro)=>{
    console.log('Firing Macro',payload)
    
  })
  socket.on(ioCommands.STORE_GROUP, (payload: {key: number, group: number[], name: string})=>{
    console.log('Store Group Payload',payload)
    config.storeGroup(payload)
  })
  socket.on(ioCommands.UPDATE_GROUP, (payload: {groupID: number, group: number[]})=>{
    console.log('Update Group',payload)
    if(payload.groupID !==0)
      config.updateGroup(payload.groupID, payload.group)
  })
  socket.on(ioCommands.LABEL_GROUP,(payload:{groupID: number, name: string})=>{
    console.log('Label Group', payload)
    if(payload.groupID !==0)
      config.labelGroup(payload.groupID, payload.name)
  })
  socket.on(ioCommands.DELETE_GROUP, (payload:{groupID: number})=>{
    if(payload.groupID !==0)
    config.deleteGroup(payload.groupID)
  })
  //let newPJs = false
  socket.on(ioCommands.EMITTING_CMD, async (CommandPackage: CommandPackage)=>{
    console.group('Got CMD',CommandPackage.cmd,CommandPackage.pjIDs?.length, CommandPackage.vartiable)
    if(!CommandPackage.pjIDs) return
    console.log('Running CMD',CommandPackage.cmd)
    let activePJs = CommandPackage.pjIDs.map(pjID=>{
      return pjs.getPJ(pjID)
    })
   
    if(activePJs.length>1){
    const { results, errors } = await PromisePool
    .for(activePJs)
    .withConcurrency(activePJs.length)
    .process(async pj => {
      await pj.Control({cmd:CommandPackage.cmd,vartiable: CommandPackage.vartiable},socket.id)
    
    })
 } else {
    
    const { results, errors } = await PromisePool
    .for(activePJs)
    .process(async pj => {
      await pj.Control({cmd: CommandPackage.cmd,vartiable: CommandPackage.vartiable},socket.id)
    
    })
  } 
      pjs.updateStatus()
    //  newPJs = true
     // io.emit(ioCommands.EMITTING_PJS, pjs)
     // io.emit(ioCommands.EMITTING_STATUS, pjs.getStatus())
      console.log('CMD Done',CommandPackage.cmd)
      console.groupEnd()
  })
/*
  while(newPJs){
    socket.emit(ioCommands.EMITTING_PJS,pjs)
    newPJs= false
  }
  */
  

});

server.listen(port);
/*
const server = https.createServer({ key: key, cert: cert }, app);
server.listen(port, () => `Server running on port ${port}`)
*/




