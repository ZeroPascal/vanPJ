export type pj={
    id: number,
    power: boolean,
    shutter: boolean,
    online: boolean,
    lastSeen: number,
    lampStatus: string,
    error: string
}


export default class PJ implements pj{
    id: number
    power: boolean
    shutter: boolean
    online: boolean
    lastSeen: number
    lampStatus: string
    error: string
    constructor(id:number){
        this.id = id
        this.power= false
        this.shutter = false
        this.online = false
        this.lastSeen = -1
        this.error = ''
        this.lampStatus = 'Unknown'
    }

    pollPower(){
        
    }
    pollShutter(){

    }
    pollLampStatus(){

    }
    
}