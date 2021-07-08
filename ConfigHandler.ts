import { Config, ConfigHeaders, ConfigKeys, defaultConfig, ioCommands, Patch } from "./constants"
import {Server} from 'socket.io'
import * as _ from 'lodash'
const fs = require('fs')
const path =require('path')


const configFolder = path.join(__dirname, 'local')
const configFile = path.join(configFolder, 'ServerConfig.json')

function writeFile(config: Config){
   // console.log('Writing Config',Object.values(config.Patch).length)
    fs.writeFile(configFile, JSON.stringify(config), (err:any)=> {
        if(err) throw new Error('ServerConfig Write Error: '+err)
    })
}
function writeConfig(config: Config){
    try{
    if(!fs.existsSync(configFolder)){
        fs.mkdir(configFolder,(err: any)=>{
            if(err){
                throw new Error('ServerConfig MKDIR Error: '+err)
            } else{
                writeFile(config)
            }
        })
    }else{
        writeFile(config)
    }
   
    
    }catch(e){
        console.error(e)
    }
}
function getLocalConfig() {

    try {
        return JSON.parse(fs.readFileSync(configFile).toString())

    } catch (e) {
       // console.log('Could Not Read Config')
        
       writeConfig(defaultConfig)
           
        return defaultConfig
    }
}

export default class ConfigHandler {
    config: Config
    io?: Server
    pollingFunction: ()=>void
    pollingFunctionInt: NodeJS.Timeout
    constructor(io?: Server) {
        this.config = getLocalConfig()
        this.io = io
        this.pollingFunction = undefined
        this.pollingFunctionInt = undefined
    }
    set Sever(io: Server){
        this.io = io
    }
    set PollingFunction(f: ()=>void){
        console.log('Polling Function Set')
        this.pollingFunction = f
        this.startPolling()
    }
    update(){
        writeConfig(this.config)
       // this.io?.emit(ioCommands.REQUEST_CONFIG)
    }
    startPolling(){
      //  console.log('Setting Polling Interval')
        if(this.pollingFunctionInt){
            this.stopPolling()
        }
        if(this.config.Polling && this.pollingFunction){
            this.pollingFunctionInt = setInterval(this.pollingFunction,this.config.Polling_Interval)
            console.log('Polling Interval Set')
        }
    }

    stopPolling(){
        console.log('Stopping Polling Interval')
        clearInterval(this.pollingFunctionInt)
        this.pollingFunctionInt = undefined
    }
    processUpdate(update: {}){
        console.log('Config Update', update)
        Object.entries(update).forEach(item=>{
         //   console.log(item)
            if(item.length<2)return
            let target = item[0].toString().trim() as ConfigKeys
            let value  = item[1].toString()
           // console.log(Buffer.from(target), Buffer.from("IP_Top"))
            switch(target){
                case ConfigHeaders.LAST_UPDATED:
                    this.LastUpdated = value
                    break;
                case ConfigHeaders.LOCATION:
                    this.LastUpdated = Date()
                    this.Location = value
                    break;
                case ConfigHeaders.POLLING_INTERVAL:
                    this.LastUpdated = Date()
                    this.PollingInterval = parseInt(value)
                    break;
                case ConfigHeaders.POLLING:
                    this.LastUpdated = Date()
                    this.Polling = value ==='true'
                    break;
                case ConfigHeaders.PATCH:
                    this.Patch = JSON.parse(value) as Patch
                default:
                    console.log('Bad Config Request',target)
            }
        })
       // console.log(this.config)
        this.update()
    }
    get Polling(){
        return this.config.Polling
    }
    set Polling(polling){
        this.config.Polling  = polling
        this.startPolling()
        
    }
    get PollingInterval(){
        return this.config.Polling_Interval
    }
    set PollingInterval(interval: number){
        this.config.Polling_Interval = interval
        this.startPolling()
    }
    get LastUpdated(){
        return this.config.LastUpdated
    }
    set LastUpdated(date: string){
        this.config.LastUpdated = date
    }

    get Location(){
        return this.config.Location
    }
    set Location(location: string){
        this.config.Location = location
    }
    get Patch(){
        return this.config.Patch
    }
    set Patch(patch: Patch){
        
        this.config.Patch =patch

        this.setAllGroup()
        this.LastUpdated = Date()
        this.update()
        
        
       
    }
    setAllGroup(){
        let all = Object.values(this.Patch).map(pj=> { return pj.id})
        this.config.Groups[0] = {name: 'All', group: all}
        this.update()
    }
/*
    get World(){
        return this.config.PJ_World
    }
    set World(world: number[]){
        this.config.PJ_World = _.uniq(world)
    }
    
    get ProjectorPort(){
        return this.config.Projector_Port
    }
    get IPTop(){
        return this.config.IP_Top
    }
    set IPTop(ipTop: string){
        ipTop.trim()
        let good = true
        let sections = ipTop.split('.')
        if(sections.length === 4 && ipTop[ipTop.length-1]==='.'){

            for(let i = 0; i<3; i++){
              
                if(isNaN(parseInt(sections[i]))){
                    good = false
                }
            }
            if(good){
               
                this.config.IP_Top = ipTop
            }
        }
    }
    get TCPAuth(){
        return this.config.TCP_Auth
    }

*/
}