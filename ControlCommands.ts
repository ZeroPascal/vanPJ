import {ControlCommands,ControlKeys} from './constants'

interface responce{
    callbacks: Record<string, string |boolean>
}
interface control {
    name: string,
    command: string
}
export interface hexFunction{
    name: string
    control: Record<string,control>,
    query: string,
    response: Record<string,string> 
}

const getControl=(name:string, command: string):control=>{
    return {name, command}
}   
export const functions: Record<string,hexFunction>={
    Power: {
        name: 'Power',
        control: {[ControlCommands.POWER_ON]: getControl('Power On', '00PON\r'), [ControlCommands.POWER_OFF]:getControl('Power Off', '00POF\r')},
        query: '00QPW\r',
        response:{
            '00001\r' : 'On',
            '00000\r' : 'Off'
        }
    },
    Shutter:{
        name: 'Shutter',
        control: {[ControlCommands.SHUTTER_OPEN]: getControl('Shutter Open','00OSH:0\r'), [ControlCommands.SHUTTER_CLOSED]:getControl('Shutter Closed','00OSH:1\r')},
        query: '00QSH\r',
        response:{
             '000\r' : 'Open',
              '001\r' : 'Closed'
        }
    },
    Edge_Blending:{
        name: 'Edge Blending',
        control: {[ControlCommands.EDGE_BLENDING_OFF]:getControl('Off','00VXX:EDBI0=+00000\r'),[ControlCommands.EDGE_BLENDING_ON]:getControl('On','VXX:EDBI0=+00001\r'),'User':getControl('User','VXX:EDBI0=+00002\r')},
        query: '00QVX:EDBI0\r',
        response:{
            '00EDBI0=+00000\r' : 'Off',
            '00EDBI0=+00001\r' : 'On',
            '00EDBI0=+00002\r' : 'User'
        }
    },
    Edge_Blending_Markers:{
        name: 'Edge Blending Markers',
        control: {[ControlCommands.EDGE_BLENDING_MARKERS_ON]:getControl('Marker On', '00VGM:1\r'),[ControlCommands.EDGE_BLENDING_MARKERS_OFF]:getControl('Marker Off','00VGM:0\r')},
        query: '00QGM\r',
        response:{
            '000\r': 'Off',
            '001\r' : 'On'
        }
    },
    Lamp_Control_Status:{
        name: 'Lamp Control Status',
        control: {},
        query: '00Q$S\r',
        response:{
            '000\r': 'Lamp Off',
            '001\r': 'In Turning On',
            '002\r': 'Lamp On',
            '003\r': 'Lamp Cooling'
        }
    },
    Test_Pattern:{
        name: 'Test Pattern',
        control: {
           [ControlCommands.TEST_PATTERN_OFF]:getControl('Off', '00OTS:00\r'),
           [ControlCommands.TEST_PATTERN_WHITE]:getControl('White',  '00OTS:01\r'),
           [ControlCommands.TEST_PATTERN_BLACK]:getControl('Black','00OTS:02\r'),
           [ControlCommands.TEST_PATTERN_FOCUS_RED]:getControl('Focus Red','00OTS:70\r')
        },
        query: '00QTS\r',
        response: {
            '0000\r': 'Off',
            '0001\r': 'White',
            '0002\r': 'Black',

        }
    },
    Menu:{
        name: 'Menu',
        control: {
            [ControlCommands.MENU]:getControl('Menu','00OMN\r')
        },
        query: '',
        response: {'None': ''}

    }
}