import { response } from "express";
import { cmdPackage, CommandCallback, PJ } from "../../constants";
import { CommandLibray, range} from "../Library";
import getLibary from "../LibraryDirector";
import Projector from "../Projector";
import { netConnect } from "./panasoincTelnet";


export default class pansonicProjector extends Projector implements PJ{
    commandLib: CommandLibray
    lockOwner: string
    constructor(projectorInfo: Projector){
        super(projectorInfo)
        this.commandLib = getLibary(this.make)
        this.lockOwner = ''
    }


    private checkRange(range: range, vartiable: string | undefined): string {
        let s = range.default
        if (vartiable) {
            let v = parseInt(vartiable)
            if (isFinite(v))
                s = v
            if (s > range.max)
                s = range.max
            if (s < range.min)
                s = range.min
        }
        return s + ''
    }

    private setFixedSize(size: number,vartiable: string, ){
        while(vartiable.length<size){
            vartiable=0+vartiable
        }
        return vartiable
    }
    private async setter(payload: cmdPackage, user: string):Promise<CommandCallback>{
        const cmd= payload.cmd
       
        let vartiable = payload.vartiable

        let command = this.commandLib[cmd]
        let cmdString =''
        let err: string | undefined = undefined
        let res = 'Unknown'
        try{
            if(!command){ throw new Error('Command Not in Library') }
            
            cmdString = command.hexCommand;

            if(command.range){
                vartiable = this.checkRange(command.range,vartiable)
            }
            if(command.fixedSize){
                vartiable = this.setFixedSize(command.fixedSize, vartiable)
            }
            if(vartiable){
                if(command.dropEqual){
                    cmdString+=vartiable
                }else{
                    cmdString+='='+vartiable
                }
            }
            cmdString+='\r'
           

            let pjResponse = await netConnect(this,cmdString)
            
            if(command.response[pjResponse]){
                res = command.response[pjResponse]
                
            }else{
                switch (pjResponse) {
                    case '00ER401':
                            err= '401: Can not executed command'
                        break;
                    case '00ER402':
                        err='402: Invalid Parameter'
                    default:
                        err = 'Unknown Response '+pjResponse
                        break;
                    throw new Error(err)
                }
            }
        }catch(e){
            err = e
        }
        this.setAttribute(command.attribute, res)
        return ({pjID: this.id, cmd: cmd+' ['+cmdString+']', res, err: err, user})
        
    }
    private async queue(payload: cmdPackage, user: string){
        this.cmdQueue.push(payload)
        console.log(this.id, 'CMD Queued',this.cmdQueue.length)
        while(this.cmdQueue){
            if(!this.isLocked || this.lockOwner === user){
                let c = this.cmdQueue[0]
                this.cmdQueue= this.cmdQueue.slice(1)
                return await this.setter(c, user)
            }
        }
    }
    lock(user:string){
       this.isLocked= true
       this.lockOwner=user
       console.log(this.id,'Locked',this.lockOwner)
    }
    unlock(){
        this.isLocked = false
        this.lockOwner = ''
        console.log(this.id,'Unlocked',this.lockOwner)
    }

    async Control(payload: cmdPackage, user: string):Promise<CommandCallback>{
        let r= await(this.queue(payload, user))
        console.log(r)
        return r
        
    }
}