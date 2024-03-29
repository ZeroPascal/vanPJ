import { functions, hexFunction, range } from "./panasonicControlCommands"
import { ControlCommands, ControlKeys, PJ, PJ_OBJ, PROJECTOR_MAKE, PROJECTOR_MAKES } from '../constants'
import { netConnect } from "./panasoincTelnet"
import Projector from "../Projector"
import { times } from "lodash"



export default class panasonicPJ extends Projector implements PJ {

    constructor(projectorInfo: Projector) {
        super(projectorInfo)
    }
    private async poll(hexFunction: hexFunction) {
        if (!hexFunction) { return 'Unknown' }
        try {
            let res = await netConnect(this, hexFunction.query)
            this.lastSeen = Date.now()
            this.online = 'true'

            switch (hexFunction.name) {
                case functions.Projector_Name.name:
                case functions.Input_Signal_Name_Main.name:
                    return res.slice(8, -1)
                case '':
                    return res.slice(8, -1)

            }
            res = res.trim()
            if (hexFunction.response[res]) {
                // console.log('PJ Res',res, hexFunction.response[res])
                return hexFunction.response[res]
            } else {
                if (res === '00ER401') {

                    let error: string = 'Can not executed: ' + hexFunction.query
                    //  console.log(error)
                    throw new Error(error)

                }
                if (res === '00ER402') {
                    throw new Error(hexFunction.query + ' Invalid parameter')
                }
                throw new Error(hexFunction.query + ' Unknown Responce: ' + res)
            }

        } catch (e) {
            //  console.log(this.id, 'Error:', e.message)

            this.error = this.error + e.message
            this.online = 'false'
            return 'Unknown'
        }
    }
    private setFixedSize(vartiable: string, size: number){
        while(vartiable.length<size){
            vartiable=0+vartiable
        }
        return vartiable
    }
    private async setter(hexFunction: hexFunction, command: ControlKeys, vartiable?: string) {
        try {
            //console.log('Setting: ', this.id, hexFunction)
            let responce
            switch (command) {
               // case ControlCommands.PROJECTOR_ID:
               //     responce = await netConnect(this, hexFunction.control[command].command + vartiable + '\r')
               //     break;
                case ControlCommands.DIRECT_COMMAND:
                    vartiable='00'+vartiable+'\r'
                    await netConnect(this,vartiable)
                    break
                default:
                    let cmd = hexFunction.control[command].command
                    if (hexFunction.range) {
                        vartiable = this.checkRange(hexFunction.range, vartiable)
                        vartiable = this.setFixedSize(vartiable,hexFunction.fixedSize)
                    }
                    if(vartiable){
                        if(hexFunction.dropEqual){
                            cmd+='00'+vartiable
                        } else{
                            cmd+='='+vartiable
                        }
                    }
                    cmd+='\r'
                    console.log(this.id, hexFunction.control[command].name,cmd)
                    await netConnect(this,cmd)
                    break;
            }

            // console.log('TCP Responce:', responce)
            return (responce === hexFunction.control[command].command)

        } catch (e) {
            if(e.message)
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
        this.hdmiSignalLevel = await this.poll(functions.HDMI_In_Signal_Level)
        this.hdmiResolution = await this.poll(functions.HDMI_In_EDID_Resolution)
        this.inputSignalName_Main = await this.poll(functions.Input_Signal_Name_Main)
        this.hdmiVerticalFrequency = await this.poll(functions.HDMI_In_EDID_Vertical_Scan)
    }
    async pollOSD() {
        this.osdPostion = await this.poll(functions.OSD)
        // this.osdRotaion = await this.poll(functions.OSD_Rotation)
    }
    async pollName() {
        this.name = await this.poll(functions.Projector_Name)
    }

    async pollBackColor() {
        this.backColor = await this.poll(functions.BackColor)
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
            await this.pollBackColor()

        } catch (e) {
            console.log(this.id, ' PollStatus Error', e)
        }

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
    async Control(command: ControlKeys, vartiable: undefined | string) {
        // console.log('PJ Running CMD', this.ID, command)
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
            case ControlCommands.TEST_PATTERN_FOCUS_WHITE:
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
                await this.setter(functions.Edge_Blending_Markers, command)
                await this.pollEdgeBlendingMarkers()
                return true

            case ControlCommands.EDGE_BLENDING_OFF:
            case ControlCommands.EDGE_BLENDING_ON:
                await this.setter(functions.Edge_Blending, command)
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
                await this.setter(functions.OSDPostion, command)
                // await this.pollOSD()
                return true
            case ControlCommands.OSD_ON:
            case ControlCommands.OSD_OFF:
                await this.setter(functions.OSD, command)
                return true

            case ControlCommands.FREEZE_OFF:
            case ControlCommands.FREEZE_ON:
                await this.setter(functions.Freeze, command)
                return true

            case ControlCommands.PROJECTOR_NAME:
                await this.setter(functions.Projector_Name, command, vartiable)
                await this.pollName()
                return true

            case ControlCommands.NUMBER_KEY_0:
            case ControlCommands.NUMBER_KEY_1:
            case ControlCommands.NUMBER_KEY_2:
            case ControlCommands.NUMBER_KEY_3:
            case ControlCommands.NUMBER_KEY_4:
            case ControlCommands.NUMBER_KEY_5:
            case ControlCommands.NUMBER_KEY_6:
            case ControlCommands.NUMBER_KEY_7:
            case ControlCommands.NUMBER_KEY_8:
            case ControlCommands.NUMBER_KEY_9:
                await this.setter(functions.NumericKey, command)
                return true

            case ControlCommands.LENS_POSTION_HOME:
                await this.setter(functions.LensPositionHome, command)
                return true

            case ControlCommands.LENS_SHIFT_H_FN:
            case ControlCommands.LENS_SHIFT_H_FP:
            case ControlCommands.LENS_SHIFT_H_NN:
            case ControlCommands.LENS_SHIFT_H_NP:
            case ControlCommands.LENS_SHIFT_H_SN:
            case ControlCommands.LENS_SHIFT_H_SP:
            case ControlCommands.LENS_SHIFT_V_FN:
            case ControlCommands.LENS_SHIFT_V_FP:
            case ControlCommands.LENS_SHIFT_V_NN:
            case ControlCommands.LENS_SHIFT_V_NP:
            case ControlCommands.LENS_SHIFT_V_SN:
            case ControlCommands.LENS_SHIFT_V_SP:
                await this.setter(functions.LensShift, command)
                return true

            case ControlCommands.LENS_FOCUS_SP:
            case ControlCommands.LENS_FOCUS_SN:
            case ControlCommands.LENS_FOCUS_NP:
            case ControlCommands.LENS_FOCUS_NN:
            case ControlCommands.LENS_FOCUS_FP:
            case ControlCommands.LENS_FOCUS_FN:
                await this.setter(functions.LensFocus, command)
                return true

            case ControlCommands.LENS_ZOOM_SP:
            case ControlCommands.LENS_ZOOM_SN:
            case ControlCommands.LENS_ZOOM_NP:
            case ControlCommands.LENS_ZOOM_NN:
            case ControlCommands.LENS_ZOOM_FP:
            case ControlCommands.LENS_ZOOM_FN:
                await this.setter(functions.LensZoom, command)
                return true

            case ControlCommands.LENS_CALIBRATION:
                await this.setter(functions.LensCalibration, command)
                return true;

            case ControlCommands.BACK_COLOR_BLUE:
            case ControlCommands.BACK_COLOR_BLACK:
            case ControlCommands.BACK_COLOR_USER_LOGO:
            case ControlCommands.BACK_COLOR_DEFAULT_LOGO:
                await this.setter(functions.BackColor, command)
                await this.pollBackColor()
                return true
            case ControlCommands.PROJECTOR_ID:
                await this.setter(functions.Projector_ID, command, vartiable)

            case ControlCommands.PROJECTOR_INSTALL_METHOD_REAR_AUTO:
            case ControlCommands.PROJECTOR_INSTALL_METHOD_REAR_CEILING:
            case ControlCommands.PROJECTOR_INSTALL_METHOD_REAR_DESK:
            case ControlCommands.PROJECTOR_INSTALL_METHOD_FRONT_AUTO:
            case ControlCommands.PROJECTOR_INSTALL_METHOD_FRONT_CEILING:
            case ControlCommands.PROJECTOR_INSTALL_METHOD_FRONT_DESK:
                await this.setter(functions.Install_Postion, command)
                return true
            case ControlCommands.OSD_ROTATION_CLOCKWISE:
            case ControlCommands.OSD_ROTATION_COUNTERCLOCKWISE:
            case ControlCommands.OSD_ROTATION_OFF:
                await this.setter(functions.OSD_Rotation, command)
                return true
            case ControlCommands.INPUT_SELECT_DIGITALLINK:
            case ControlCommands.INPUT_SELECT_COMPUTER1:
            case ControlCommands.INPUT_SELECT_COMPUTER2:
            case ControlCommands.INPUT_SELECT_DVI:
            case ControlCommands.INPUT_SELECT_HDMI1:
            case ControlCommands.INPUT_SELECT_HDMI2:
            case ControlCommands.INPUT_SELECT_SDI1:
            case ControlCommands.INPUT_SELECT_VIDEO:
            case ControlCommands.INPUT_SELECT_YC:
                await this.setter(functions.Input, command)
                return true
            case ControlCommands.LIGHT_OUTPUT:
                await this.setter(functions.LightOutput, command, vartiable)
                return true
            case ControlCommands.DIRECT_COMMAND:
                await this.setter(functions.Direct_Command,command, vartiable)
                return true
            default:
                return false

        }

    }

}