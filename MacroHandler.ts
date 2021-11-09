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
    setMacro(macro: Macro){
        
        this.macros[macro.key] = macro
        writeMacros(this.macros)
        this.emitMacros()
        
    }
    removeMacro(key: string){
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
