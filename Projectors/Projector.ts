import { cmdPackage, PROJECTOR_MAKES, AttributeKeys, PROJECTOR_MAKE } from "../constants"
import { blockKey } from "./Library"


interface projector {
    ip_address: string,
    port: number,
    auth: string,
    make: keyof typeof PROJECTOR_MAKES,
    id: number,
    power: string,
    name: string,
    shutter: string,
    online: string,
    lastSeen: number,
    lampStatus: string,
    edgeBlending: string,
    edgeBlendingMarker: string,
    edgeBlendingLeft: string,
    edgeBlendingLower: string,
    edgeBlendingRight: string,
    edgeBlendingUpper: string,
    testPattren: string,
    backColor: string,
    hdmiResolution: string,
    hdmiSignalLevel: string,
    hdmiVerticalFrequency: string,
    osdPostion: string,
    inputSignalName_Main: string,
    error: string,
    isLocked: boolean,
    cmdQueue: cmdPackage[]
}
export default class Projector implements projector {
   
    ip_address: string
    port: number
    auth: string
    make: "PANASONIC" | "BARCO"
    id: number
    power: string
    name: string
    shutter: string
    online: string
    lastSeen: number
    lampStatus: string
    edgeBlending: string
    edgeBlendingMarker: string
    edgeBlendingLeft: string
    edgeBlendingLower: string
    edgeBlendingRight: string
    edgeBlendingUpper: string
    testPattren: string
    backColor: string
    hdmiResolution: string
    hdmiSignalLevel: string
    hdmiVerticalFrequency: string
    osdPostion: string
    inputSignalName_Main: string
    error: string

    isLocked: boolean
    cmdQueue: cmdPackage[]
    lockOwner: string | undefined
    

    constructor(info: projector) {
        this.auth = info.auth
        this.port= info. port
        this.make = info.make
        this.id = info.id
        this.ip_address = info.ip_address
        this.power = 'Unknown'
        this.shutter = 'Unknown'
        this.cmdQueue = []
        this.lockOwner = undefined
        this.isLocked = false
    }
    get IP_Address(){
        return this.ip_address
    }
    setAttribute(attribute: AttributeKeys, value: any){
        switch (attribute) {
            case AttributeKeys.power:
                this.power = value;
                break;
            case AttributeKeys.shutter:
                this.shutter = value;
                break;
        
            default:
                break;
        }
    }
    set IP_Address(address: string) {
        address.trim()
        let good = true
        let sections = address.split('.')
        if (sections.length === 4) {

            for (let i = 0; i < 4; i++) {
                let a = parseInt(sections[i])
                if (isNaN(a) || a < -1 || a > 254) {
                    good = false
                }
            }
            if (good) {
                
                this.ip_address = address
            }
        }
    }
    get Port() {
        return this.port
    }
    set Port(port: number) {
        this.port= port
    }
    get Auth() {
        return this.auth
    }
    set Auth(auth: string) {
        this.auth = auth
    }
    get Make(): PROJECTOR_MAKE {
        return this.auth as PROJECTOR_MAKE
    }
    set Make(make: PROJECTOR_MAKE) {
        this.make = make
    }
    
}