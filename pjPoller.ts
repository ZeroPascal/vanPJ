
import { ioCommands, RigStatus } from "./constants";
import PromisePool, { } from '@supercharge/promise-pool'
import  {Server}  from "socket.io";
import ConfigHandler from "./ConfigHandler";
import PJ from "./PJ";


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
    Object.values(this.config.Patch).forEach(pj=>{
      this.pjs[pj.ID] = new PJ(pj)
    })
    await this.buildAllPJS()
  }
 async buildAllPJS(){
  return new Promise(res=>{
    let i = Object.values(this.pjs).length
    Object.values(this.pjs).forEach(async pj => {
      await pj.pollStatus()
      i--
      if(i===0){
        this.updateStatus()
        this.io?.emit(ioCommands.REQUEST_UPDATE)
        res('Complete')
      }
   })
  
  })
 }
  set Io(IO: Server){
    this.io = IO
  }
  
  getPJs(){
    return this.pjs
  }
  async pollAllPJs() {
    const { results, errors } = await PromisePool
      .for(Object.values(this.pjs))
      .process(async pj => {
        await pj.pollStatus()
      })
      this.updateStatus()
     this.io?.emit(ioCommands.REQUEST_UPDATE)
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
      if(pj.hdmiResolution !== '1920x1200p' || pj.hmdiSignalLevel !=='Auto'){
        s.hdmiInput = false
      }
      if(pj.inputSignalName_Main !== '1920x1200/60RB'){
        s.signalName = false
      }
    })
    this.rigStatus = s
  }
}


