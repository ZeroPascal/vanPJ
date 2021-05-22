export type pj={
    id: number,
    power: boolean,
    shutter: boolean,
    online: boolean,
    lastSeen: number,
    error: string
}


export default class PJ implements pj{
    id: number
    power: boolean
    shutter: boolean
    online: boolean
    lastSeen: number
    error: string
    constructor(id:number){
        this.id = id
        this.power= false
        this.shutter = false
        this.online = false
        this.lastSeen = -1
        this.error = ''

    }
}