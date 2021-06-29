import { functions, hexFunction } from "./ControlCommands"
import { ControlCommands, ControlKeys, PJ_OBJ } from './constants'
import { netConnect } from "./telnet"
import Projector from "./Projector"



export default class PJ extends Projector implements PJ_OBJ  {
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
    hdmiResolution: string
    hmdiSignalLevel: string
    osdPostion: string
    inputSignalName_Main: string
    error: string
    constructor(projectorInfo: Projector) {
        super(projectorInfo)
        this.power = 'Unknown'
        this.name = 'Unknown'
        this.shutter = 'Unknown'
        this.online = 'Unknown'
        this.lastSeen = -1
        this.error = ''
        this.lampStatus = 'Unknown'
        this.edgeBlending = 'Unknown'
        this.testPattren = 'Unknown'
        this.edgeBlendingMarker = 'Unknown'
        this.edgeBlendingLeft = 'Unknown'
        this.edgeBlendingLower = 'Unknown'
        this.edgeBlendingRight = 'Unknown'
        this.edgeBlendingUpper = 'Unknown'
        this.hdmiResolution = 'Unknown'
        this.hmdiSignalLevel = 'Unknown'
        this.osdPostion = 'Unknonw'
    }
    private async poll(hexFunction: hexFunction) {
        if (!hexFunction) { return 'Unknown' }
        try {
            let res = await netConnect(this, hexFunction.query)
            this.lastSeen = Date.now()
            this.online = 'true'
            if( hexFunction.name === 'Projector Name' || hexFunction.name === 'Input Signal Name - Main'){
                return res.slice(8,-1)
            }
            if( hexFunction.name ===''){
                return res.slice(8,-1)
            }
            if (hexFunction.response[res]) {
                return hexFunction.response[res]
            } else {
                if (res === '00ER401\r') {

                    let error: string = 'Can not executed: ' + hexFunction.query
                    //  console.log(error)
                    throw new Error(error)

                }
                if (res === '00ER402\r') {
                    throw new Error(hexFunction.query + ' Invalid parameter')
                }
                throw new Error(hexFunction.query + ' Unknown Responce: ' + res)
            }

        } catch (e) {
          //  console.log(this.id, 'Error:', e.message)
           
            this.error = this.error+e.message
            this.online = 'false'
            return 'Unknown'
        }
    }
    private async setter(hexFunction: hexFunction, command: ControlKeys, vartiable?: string  ) {
        try {
           // console.log('Setting: ', this.id, hexFunction)
           // console.log(vartiable)
            let responce = await netConnect(this, hexFunction.control[command].command+(vartiable?'='+vartiable+'\r':''))
           // console.log('TCP Responce:', responce)
            return (responce === hexFunction.control[command].command)

        } catch (e) {

            console.log(this.id, 'Setting Error:', e.message)
            return false
        }
    }
    async pollPower() {
        this.power = await this.poll(functions.Power)
    }
    async pollShutter() {
        this.shutter = await this.poll(functions.Shutter)

    }
    async pollLampStatus() {
        this.lampStatus = await this.poll(functions.Lamp_Control_Status)
    }
    async pollEdgeBlending() {
        this.edgeBlending = await this.poll(functions.Edge_Blending)
        this.edgeBlendingUpper = await this.poll(functions.Edge_Blending_Upper)
        this.edgeBlendingLower = await this.poll(functions.Edge_Blending_Lower)
        this.edgeBlendingRight = await this.poll(functions.Edge_Blending_Right)
        this.edgeBlendingLeft = await this.poll(functions.Edge_Blending_Left)
    }
    async pollEdgeBlendingMarkers() {
        this.edgeBlendingMarker = await this.poll(functions.Edge_Blending_Markers)
    }
    async pollTestPattren() {
        this.testPattren = await this.poll(functions.Test_Pattern)
    }
    async pollHDMI() {
        this.hmdiSignalLevel = await this.poll(functions.HDMI_In_Signal_Level)
        this.hdmiResolution = await this.poll(functions.HDMI_In_EDID_Resolution)
        this.inputSignalName_Main = await this.poll(functions.Input_Signal_Name_Main)
    }
    async pollOSD(){
        this.osdPostion = await this.poll(functions.OSD)
    }
    async pollName(){
        this.name = await this.poll(functions.Projector_Name)
    }

    printTimeDif(now: number) {
        // console.log(this.id, Date.now()-now)
        return Date.now()
    }
    async pollStatus() {

       // console.log('Polling',this.ID)
        this.error = ''
        try {

            await this.pollPower()
            await this.pollShutter()
            await this.pollLampStatus()
            await this.pollEdgeBlending()
            await this.pollEdgeBlendingMarkers()
            await this.pollTestPattren()
            await this.pollHDMI()
            await this.pollName()

        } catch (e) {
            console.log(this.id, ' PollStatus Error', e)
        }

    }
    async Control(command: ControlKeys, vartiable: undefined | string) {
        switch (command) {
            case ControlCommands.POWER_OFF:
            case ControlCommands.POWER_ON:
                await this.setter(functions.Power, command)
                await this.pollPower()
                return true

            case ControlCommands.SHUTTER_OPEN:
            case ControlCommands.SHUTTER_CLOSED:
                await this.setter(functions.Shutter, command)
                await this.pollShutter()
                return true

            case ControlCommands.TEST_PATTERN_OFF:
            case ControlCommands.TEST_PATTERN_WHITE:
            case ControlCommands.TEST_PATTERN_FOCUS_RED:
            case ControlCommands.TEST_PATTERN_BLACK:
                await this.setter(functions.Test_Pattern, command)
                await this.pollTestPattren()
                return true

            case ControlCommands.MENU:
            case ControlCommands.MENU_DEFAULT_KEY:
            case ControlCommands.MENU_ENTER_KEY:
            case ControlCommands.MENU_UP_KEY:
            case ControlCommands.MENU_RIGHT_KEY:
            case ControlCommands.MENU_DOWN_KEY:
            case ControlCommands.MENU_LEFT_KEY:
                return await this.setter(functions.Menu, command)

            case ControlCommands.EDGE_BLENDING_MARKERS_OFF:
            case ControlCommands.EDGE_BLENDING_MARKERS_ON:
                await this.setter(functions.Edge_Blending_Markers,command)
                await this.pollEdgeBlendingMarkers()
                return true
            
            case ControlCommands.EDGE_BLENDING_OFF: 
            case ControlCommands.EDGE_BLENDING_ON:
                await this.setter(functions.edgeBlending,command)
                await this.pollEdgeBlending()
                return true
            case ControlCommands.EDGE_BLENDING_UPPER_OFF:
            case ControlCommands.EDGE_BLENDING_UPPER_ON:
                await this.setter(functions.Edge_Blending_Upper, command)
                await this.pollEdgeBlending()
                return true

            case ControlCommands.EDGE_BLENDING_RIGHT_ON:
            case ControlCommands.EDGE_BLENDING_RIGHT_OFF:
                await this.setter(functions.Edge_Blending_Right, command)
                await this.pollEdgeBlending()
                return true

            case ControlCommands.EDGE_BLENDING_LOWER_OFF:
            case ControlCommands.EDGE_BLENDING_LOWER_ON:
                await this.setter(functions.Edge_Blending_Lower, command)
                await this.pollEdgeBlending()
                return true;
            case ControlCommands.EDGE_BLENDING_LEFT_OFF:
            case ControlCommands.EDGE_BLENDING_LEFT_ON:
                await this.setter(functions.Edge_Blending_Left, command)
                await this.pollEdgeBlending()
                return true;
            case ControlCommands.OSD_POSITION_UPPER_LEFT:
            case ControlCommands.OSD_POSITION_CENTER_LEFT:
            case ControlCommands.OSD_POSITION_LOWER_LEFT:
            case ControlCommands.OSD_POSITION_TOP_CENTER:
            case ControlCommands.OSD_POSITION_CENTER:
            case ControlCommands.OSD_POSITION_LOWER_CENTER:
            case ControlCommands.OSD_POSITION_UPPER_RIGHT:
            case ControlCommands.OSD_POSITION_CENTER_RIGHT:
            case ControlCommands.OSD_POSITION_LOWER_RIGHT:
                await this.setter(functions.OSD, command)
                await this.pollOSD()
                return true
            
            case ControlCommands.PROJECTOR_NAME:
                await this.setter(functions.Projector_Name,command, vartiable)
                await this.pollName()
                return true


            default:
                return false

        }

    }

}