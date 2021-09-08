
import { ioCommands, PROJECTOR_MAKES, RigStatus, PJ } from "./constants";
import PromisePool, { } from '@supercharge/promise-pool'
import  {Server}  from "socket.io";
import ConfigHandler from "./ConfigHandler";
//import PJ from "./constants";
import pansonicPJ from "./Panasonic/pansonicPJ";
import barcoPJ from "./Barco/barcoPJ";


export default class pjPoller {
  pjs: Record<number, PJ>
  rigStatus : RigStatus
  io?: Server
  config: ConfigHandler
  constructor(config: ConfigHandler) {
    this.config = config
    this.pjs = {}
    this.rigStatus = {
      online: false,
      power: false,
      shutter: false,
      blend: false,
      blendMarker: false,
      testPattren: false,
      lampStatus: false,
      hdmiInput: false,
      signalName: false
    }
    
  }
  async start(){
  
    await this.buildAllPJS()
  }
 async buildAllPJS(){
  //console.log(this.config.Patch)
  Object.values(this.config.Patch).forEach(pj=>{
    //console.log('pjPoller making PJS', pj.make)
    switch(pj.make){
      case PROJECTOR_MAKES.PANASONIC:
      //  console.log('Panasonic Made')
        this.pjs[pj.id] = new pansonicPJ(pj)
        break;
      case PROJECTOR_MAKES.BARCO:
        this.pjs[pj.id] = new barcoPJ(pj)
        console.log('Barco Made', this.pjs)
        break;
    }
    
  })
  await this.pollAllPJs()
  /*
  return new Promise(res=>{
    let i = Object.values(this.pjs).length
   // console.log(this.pjs)
    Object.values(this.pjs).forEach(async pj => {
     
      await pj.pollStatus()
      i--
      if(i===0){
        this.updateStatus()
        this.io?.emit(ioCommands.REQUEST_UPDATE)
        res('Complete')
      }
   })
  
  }) */
 }
  set Io(IO: Server){
    this.io = IO
  }
  
  getPJs(){
    return this.pjs
  }
  async pollAllPJs() {
    let l = Object.values(this.pjs).length
    let p = 0
    this.io?.emit(ioCommands.EMITTING_POLLING_PROGRESS,0)
    const { results, errors } = await PromisePool
      .for(Object.values(this.pjs))
      .process(async pj => {
        this.io?.emit(ioCommands.EMITTING_POLLING_PROGRESS,(p/l*100))
        await pj.pollStatus()
        p++
       
        this.io?.emit(ioCommands.EMITTING_POLLING_PROGRESS,(p/l*100))
      
      })
      this.updateStatus()
     // this.io?.emit(ioCommands.REQUEST_UPDATE)
    //console.log(pjs)
  }
  async pollPJ(pjID: number){
   await  this.pjs[pjID]?.pollStatus()
   console.log('Polled',pjID)
   return this.getPJ(pjID)
  }
  getPJ(pjID: number) {
    return this.pjs[pjID]
  }
  getStatus():RigStatus{
    return this.rigStatus
  }
  updateStatus(){
    console.log('Updating Rig Status')
    let s:RigStatus = {
      online: true,
      power: true,
      shutter: true,
      blend: true,
      blendMarker: true,
      testPattren: true,
      lampStatus : true,
      hdmiInput: true,
      signalName: true
    }
    Object.values(this.pjs).forEach(pj=>{
      
      if(pj.online !=='true'){
        s.online = false
      }
      if(pj.power !=='On'){
        s.power = false
      }
      if(pj.shutter !=='Open'){
        s.shutter = false
      }
      if(pj.edgeBlending !=='On'){
        s.blend = false
      }
      if(pj.edgeBlendingMarker !=='Off'){
        s.blendMarker=false
      }
      if(pj.testPattren !=='Off'){
        s.testPattren = false
      }
      if(pj.lampStatus !=='Lamp On'){
        s.lampStatus = false
      }
      if(pj.hdmiResolution !== '1920x1200p' || pj.hdmiSignalLevel !=='Auto'){
        s.hdmiInput = false
      }
      if(pj.inputSignalName_Main !== '1920x1200/60RB'){
        s.signalName = false
      }
    })
    this.rigStatus = s
    this.io?.emit(ioCommands.EMITTING_STATUS, this.getStatus())
  }
}


