import { v4 as uuidv4 } from 'uuid'
import { Server } from "socket.io"
import { ioCommands, Macro, Macros } from "./constants"

const fs = require('fs')
const path =require('path')


const configFolder = path.join(__dirname, 'local')
const configFile = path.join(configFolder, 'Macros.json')

function writeFile(macros: Macros){
   // console.log('Writing Config',Object.values(config.Patch).length)
    fs.writeFile(configFile, JSON.stringify(macros), (err:any)=> {
        if(err) throw new Error('ServerConfig Write Error: '+err)
    })
}
function writeMacros(macros: Macros){
    try{
    if(!fs.existsSync(configFolder)){
        fs.mkdir(configFolder,(err: any)=>{
            if(err){
                throw new Error('ServerConfig MKDIR Error: '+err)
            } else{
                writeFile(macros)
            }
        })
    }else{
        writeFile(macros)
    }
   
    
    }catch(e){
        console.error(e)
    }
}
function getLocalMacros() {

    try {
        
        return JSON.parse(fs.readFileSync(configFile).toString())

    } catch (e) {
       // console.log('Could Not Read Config')
        
       writeMacros({})
           
        return {}
    }
}

export default class MacroHandler{
    macros: Macros
    io?: Server
    constructor(io?: Server){
        this.macros = getLocalMacros()
        this.io = io
    }
    emitMacros(){
        this.io?.emit(ioCommands.EMITTING_MACROS, this.macros)
    }
    addMacro(macro: Macro){
        console.log(macro)
        macro.key = uuidv4()
        this.setMacro(macro)
    }
    setMacro(macro: Macro){
        try{
        this.macros[macro.key] = macro
        console.log(this.macros)
        writeMacros(this.macros)
        this.emitMacros()
        }catch(e){
            console.log(e)
        }
        
    }
    removeMacro(key: string){
        console.log('Deleteing Macro ',key, this.macros[key])
        delete this.macros[key]
        writeMacros(this.macros)
        this.emitMacros()
    }
    getMacros(){
        return this.macros
    }
    set Server(io: Server){
        this.io = io
    }


}
