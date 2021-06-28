import { PROJECTOR_MAKES } from "./constants"

interface projector{
    ip_address: string,
    port: number,
    auth: string,
    make: keyof typeof PROJECTOR_MAKES,
    id: number
}
export default class Projector implements projector{
    ip_address: string
    port: number
    auth: string
    make: keyof typeof PROJECTOR_MAKES
    id: number
    constructor(projectorInfo: projector ){
        this.id = projectorInfo.id
        this.ip_address = projectorInfo.ip_address
        this.port = projectorInfo.port
        this.auth = projectorInfo.auth
        this.make = projectorInfo.make
    }
    get IP_Address(){
        return this.ip_address
    }
    set IP_Address(address: string){
        address.trim()
        let good = true
        let sections = address.split('.')
        if(sections.length === 4){

            for(let i = 0; i<4; i++){
                let a = parseInt(sections[i])
                if(isNaN(a) || a<-1 || a>254){
                    good = false
                }
            }
            if(good){
               
                this.ip_address = address
            }
        }
    }
    get Port(){
        return this.port
    }
    set Port(port: number){
        this.port = port
    }
    get Auth(){
        return this.auth
    }
    set Auth(auth:string){
        this.auth = auth
    }
    get Make(){
        return this.make
    }
    set Make(make){
        this.make = make
    }
    get ID(){
        return this.id
    }
    set ID(id){
        this.id = id
    }
}