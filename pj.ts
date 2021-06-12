import { functions, hexFunction } from "./ControlCommands"
import {ControlCommands, ControlKeys} from './constants'
import { netConnect } from "./telnet"

export type pj={
    id: number,
    power: string,
    shutter: string,
    online: string,
    lastSeen: number,
    lampStatus: string,
    edgeBlending: string,
    testPattren: string,
    edgeBlendingMarker: string,
    error: string
}


export default class PJ implements pj{
    id: number
    power: string
    shutter: string
    online: string
    lastSeen: number
    lampStatus: string
    edgeBlending: string
    testPattren: string
    edgeBlendingMarker: string
    error: string
    constructor(id:number){
        this.id = id
        this.power= 'Unknown'
        this.shutter = 'Unknown'
        this.online = 'Unknown'
        this.lastSeen = -1
        this.error = ''
        this.lampStatus = 'Unknown'
        this.edgeBlending = 'Unknown'
        this.testPattren = 'Unknown'
        this.edgeBlendingMarker = 'Unknown'
    }
    private async poll(hexFunction: hexFunction){
        try{
            let res = await netConnect(this.id,hexFunction.query)
            this.lastSeen = Date.now()
            this.online = 'true'
            if(hexFunction.response[res]){
                return hexFunction.response[res]
            }else{
                if(res === '00ER401\r'){
                    
                    let error:string = 'Can not executed: '+hexFunction.query
                  //  console.log(error)
                    throw new Error(error)
                   
                } 
                if(res ==='00ER402\r'){
                    throw new Error(hexFunction.query+' Invalid parameter')
                }
                throw new Error(hexFunction.query+' Unknown Responce: '+res)
            }
            
        }catch(e){
            console.log(this.id,'Error:',e.message)
            this.error = e.message
            this.online = 'false'
            return 'Unknown'
        }
    }
    private async setter(hexFunction: string){
        try{
            console.log('Setting: ',this.id,hexFunction)
            let responce = await netConnect(this.id,hexFunction)
                console.log('TCP Responce:',responce)
                return (responce === hexFunction)
            
        }catch(e){
          
            console.log(this.id , 'Setting Error:',e.message)
            return false
        }
    }
    async pollPower(){
        this.power = await this.poll(functions.Power)
    }
    async pollShutter(){
        this.shutter = await this.poll(functions.Shutter) 
      
    }
    async pollLampStatus(){
        this.lampStatus =await this.poll(functions.Lamp_Control_Status)
    }
    async pollEdgeBlending(){
        this.edgeBlending = await  this.poll(functions.Edge_Blending)
    }
    async pollEdgeBlendingMarkers(){
        this.edgeBlendingMarker =await this.poll(functions.Edge_Blending_Markers)
    }
    async pollTestPattren(){
        this.testPattren = await this.poll(functions.Test_Pattern)
    }
    printTimeDif(now: number){
       // console.log(this.id, Date.now()-now)
        return Date.now()
    }
    async pollStatus(){
        try{
           
        await this.pollPower()
        await this.pollShutter()
        await this.pollLampStatus()
        await this.pollEdgeBlending()
        await this.pollEdgeBlendingMarkers()
        await this.pollTestPattren()
            
        }catch(e){
            console.log(this.id,' PollStatus Error',e)
        }
        
    }
    async Control(command: ControlKeys){
        switch(command){
            case ControlCommands.POWER_OFF:
            case ControlCommands.POWER_ON:
                await this.setter(functions.Power.control[command].command)
                    await this.pollPower()
                    return true
 
            case ControlCommands.SHUTTER_OPEN:
            case ControlCommands.SHUTTER_CLOSED:
                await this.setter(functions.Shutter.control[command].command)
                    await this.pollShutter()
                    console.log(this.id, 'Shutter' ,this.shutter)
                    return true
             
            case ControlCommands.TEST_PATTERN_OFF:
            case ControlCommands.TEST_PATTERN_WHITE:
            case ControlCommands.TEST_PATTERN_FOCUS_RED:
            case ControlCommands.TEST_PATTERN_BLACK:
                await this.setter(functions.Test_Pattern.control[command].command)
                    await this.pollTestPattren()
                    return true
            
            case ControlCommands.MENU:
                return await this.setter(functions.Menu.control[command].command)
              
            default:
                return false
                   
        }
      
    }
    
}