import { query, response } from 'express'
import { ControlCommands, ControlKeys } from '../constants'

interface responce {
    callbacks: Record<string, string | boolean>
}
interface control {
    name: string,
    command: string
}
export interface hexFunction {
    name: string
    control: Record<string, control>,
    query: string,
    response: Record<string, string>
}

const getControl = (name: string, command: string): control => {
    let header = 'PA..E..|-.S..E../@['
    return { name, command: header+command+']' }
}
const getQuery = (command: string)=>{
    return '.PA..E..|-.S..E../?['+command+'?]';
}
export const functions: Record<string, hexFunction> = {
    Power: {
        name: 'Power',
        control: { [ControlCommands.POWER_ON]: getControl('Power On', 'POWR1'), [ControlCommands.POWER_OFF]: getControl('Power Off', 'POWR0') },
        query: getQuery('POWR'),
        response: {
            '[POWR!1]': 'On',
            '[POWR!0]': 'Off'
        }
    },
    Shutter: {
        name: 'Shutter',
        control: { [ControlCommands.SHUTTER_OPEN]: getControl('Shutter Open', 'PMUT0'), [ControlCommands.SHUTTER_CLOSED]: getControl('Shutter Closed', 'PMUT1') },
        query: getQuery('PMUT'),
        response: {
            '[PMUT!00]': 'Open',
            '[PMUT!01]': 'Closed'
        }
    },
    Lamp_Control_Status: {
        name: 'Lamp Control Status',
        control: {},
        query: getQuery('POWR'),
        response: {
            '[POWR!1]': 'Lamp On',
            '[POWR!0]': 'Lamp Off'
        }
    },
    Test_Pattern: {
        name: 'Test Pattern',
        control: {
            [ControlCommands.TEST_PATTERN_OFF]: getControl('Off', 'TPRN0'),
            [ControlCommands.TEST_PATTERN_WHITE]: getControl('White', 'TPRN2'),
            [ControlCommands.TEST_PATTERN_BLACK]: getControl('Black', 'TPRN3'),
            [ControlCommands.TEST_PATTERN_FOCUS_RED]: getControl('Focus Red', 'OTS:70'),
            [ControlCommands.TEST_PATTERN_FOCUS_WHITE]: getControl('Focus White','TPRN1')
        },
        query: getQuery('TPRN'),
        response: {
            '[TPRN!00]': 'Off',
            '[TPRN!01]': 'Grid',
            '[TPRN!02]': 'White',
            '[TPRN!03]': 'Black',
            '[TPRN!04]': 'CheckerBoard',
            '[TPRN!05]': 'ColorBar'

        }
    },
    Menu: {
        name: 'Menu',
        control: {
            [ControlCommands.MENU]: getControl('Menu', 'KEYG20'),
            [ControlCommands.MENU_ENTER_KEY]: getControl('Enter', 'KEYG12'),
            [ControlCommands.MENU_UP_KEY]: getControl('Up', 'KEYG10'),
            [ControlCommands.MENU_RIGHT_KEY]: getControl('Right', 'KEYG13'),
            [ControlCommands.MENU_DOWN_KEY]: getControl('Down', 'KEYG14'),
            [ControlCommands.MENU_LEFT_KEY]: getControl('Left', 'KEYG11'),
            [ControlCommands.MENU_DEFAULT_KEY]: getControl('Default', 'KEYG72')

        },
        query: '',
        response: { 'None': '' }

    },
    NumericKey: {
        name: 'Numeric Key',
        control: {
            [ControlCommands.NUMBER_KEY_0]: getControl('0', 'KEYG60'),
            [ControlCommands.NUMBER_KEY_1]: getControl('1', 'KEYG51'),
            [ControlCommands.NUMBER_KEY_2]: getControl('2', 'KEYG52'),
            [ControlCommands.NUMBER_KEY_3]: getControl('3', 'KEYG53'),
            [ControlCommands.NUMBER_KEY_4]: getControl('4', 'KEYG54'),
            [ControlCommands.NUMBER_KEY_5]: getControl('5', 'KEYG55'),
            [ControlCommands.NUMBER_KEY_6]: getControl('6', 'KEYG56'),
            [ControlCommands.NUMBER_KEY_7]: getControl('7', 'KEYG57'),
            [ControlCommands.NUMBER_KEY_8]: getControl('8', 'KEYG58'),
            [ControlCommands.NUMBER_KEY_9]: getControl('9', 'KEYG59')
        },
        query: '',
        response: { 'None': '' }
    },
    LensPositionHome: {
        name: 'Lens Position Home',
        control: {
            [ControlCommands.LENS_POSTION_HOME]: getControl('Home', 'VXX:LNSI1=+00001')
        },
        query: '',
        response: { 'None': '' }
    },
    LensShift: {
        name: 'Lens Shift',
        control: {
            [ControlCommands.LENS_SHIFT_V_SP]: getControl('Vertical Slow +', 'LSVD1'),
            [ControlCommands.LENS_SHIFT_V_SN]: getControl('Vertical Slow -', 'LSVU1'),
            [ControlCommands.LENS_SHIFT_V_NP]: getControl('Vertical Normal +', 'LSVD2'),
            [ControlCommands.LENS_SHIFT_V_NN]: getControl('Vertical Normal -', 'LSVU2'),
            [ControlCommands.LENS_SHIFT_V_FP]: getControl('Vertical Fast +', 'LSVD2'),
            [ControlCommands.LENS_SHIFT_V_FN]: getControl('Vertical Fast -', 'LSVU2'),
            [ControlCommands.LENS_SHIFT_H_SP]: getControl('Horizontal Slow +', 'LSHR1'),
            [ControlCommands.LENS_SHIFT_H_SN]: getControl('Horizontal Slow -', 'LSHL1'),
            [ControlCommands.LENS_SHIFT_H_NP]: getControl('Horizontal Normal +', 'LSHR2'),
            [ControlCommands.LENS_SHIFT_H_NN]: getControl('Horizontal Normal -', 'LSHL2'),
            [ControlCommands.LENS_SHIFT_H_FP]: getControl('Horizontal Fast +', 'LSHR2'),
            [ControlCommands.LENS_SHIFT_H_FN]: getControl('Horizontal Fast -', 'LSHL2'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensFocus: {
        name: 'Lens Focus',
        control: {
            [ControlCommands.LENS_FOCUS_SP]: getControl('Slow +', 'FCSI1'),
            [ControlCommands.LENS_FOCUS_SN]: getControl('Slow -', 'FCSO1'),
            [ControlCommands.LENS_FOCUS_NP]: getControl('Normal +', 'FCSI2'),
            [ControlCommands.LENS_FOCUS_NN]: getControl('Normal -', 'FCSO2'),
            [ControlCommands.LENS_FOCUS_FP]: getControl('Fast +', 'FCSI2'),
            [ControlCommands.LENS_FOCUS_FN]: getControl('Fast -', 'FCSO2'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensZoom: {
        name: 'Lens Zoom',
        control: {
            [ControlCommands.LENS_ZOOM_SP]: getControl('Slow +', 'ZOMO1'),
            [ControlCommands.LENS_ZOOM_SN]: getControl('Slow -', 'ZOMI1'),
            [ControlCommands.LENS_ZOOM_NP]: getControl('Normal +', 'ZOMO2'),
            [ControlCommands.LENS_ZOOM_NN]: getControl('Normal -', 'ZOMI2'),
            [ControlCommands.LENS_ZOOM_FP]: getControl('Fast +', 'ZOMO2'),
            [ControlCommands.LENS_ZOOM_FN]: getControl('Fast -', 'ZOMI2'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensCalibration: {
        name: 'Lens Calibration',
        control: {
            [ControlCommands.LENS_CALIBRATION]: getControl('Lens Cal', 'VXX:LNSI0=+00000')
        },
        query: '',
        response: { 'None': '' }
    },

    BackColor: {
        name: 'Back Color',
        control: {
            [ControlCommands.BACK_COLOR_BLUE]: getControl('Blue', 'BGCL1'),
            [ControlCommands.BACK_COLOR_BLACK]: getControl('Black', 'BGCL2'),
            [ControlCommands.BACK_COLOR_USER_LOGO]: getControl('User Logo', 'BGCL3'),
            [ControlCommands.BACK_COLOR_DEFAULT_LOGO]: getControl('Default Logo', 'BGCL0')
        },
        query: getQuery('BGCL'),
        response: { '[BGCL!0]': 'Logo', '[BGCL!1]': 'Blue', '[BGCL!2]': 'Black', '[BGCL!3]': 'White' }
    },
    OSD:{
        name: 'OSD On/OFf',
        control:{
            [ControlCommands.OSD_OFF]: getControl('Off','OOS:0'),
            [ControlCommands.OSD_ON]: getControl('On','OOS:1')
        },
        query: '00QOS',
        response: {'000': 'Off', '001': 'On'}

    },
    OSDPostion: {
        name: 'OSD Postion',
        control: {
            [ControlCommands.OSD_POSITION_UPPER_LEFT]: getControl('Upper Left', 'MELG0'),
            [ControlCommands.OSD_POSITION_LOWER_LEFT]: getControl('Lower Left', 'MELG3'),
            [ControlCommands.OSD_POSITION_CENTER]: getControl('Center', 'MELG2'),
            [ControlCommands.OSD_POSITION_UPPER_RIGHT]: getControl('Upper Right', 'MELG1'),
            [ControlCommands.OSD_POSITION_LOWER_RIGHT]: getControl('Lower Right', 'MELG4'),

        },
        query: getQuery('MELG'),
        response: {
            '[MELG!0]': 'Left Top',
            '[MELG!1]': 'Right Top',
            '[MELG!2]': 'Left Bottom',
            '[MELG!3]': 'Right Bottom'
        }

    },

    Edge_Blending_Upper: {
        name: 'Edge Blending Upper',
        control: {
            [ControlCommands.EDGE_BLENDING_UPPER_ON]: getControl('On', 'VGU:1'),
            [ControlCommands.EDGE_BLENDING_UPPER_OFF]: getControl('Off', 'VGU:0')

        },
        query: '00QGU',
        response: { '001': 'On', '000': 'Off' }
    },
    Edge_Blending_Lower: {
        name: 'Edge Blending Lower',
        control: {
            [ControlCommands.EDGE_BLENDING_LOWER_ON]: getControl('On', 'VGB:1'),
            [ControlCommands.EDGE_BLENDING_LOWER_OFF]: getControl('Off', 'VGB:0')

        },
        query: '00QGB',
        response: { '001': 'On', '000': 'Off' }
    },
    Edge_Blending_Right: {
        name: 'Edge Blending Right',
        control: {
            [ControlCommands.EDGE_BLENDING_RIGHT_ON]: getControl('On', 'VGR:1'),
            [ControlCommands.EDGE_BLENDING_RIGHT_OFF]: getControl('Off', 'VGR:0')

        },
        query: '00QGR',
        response: { '001': 'On', '000': 'Off' }
    },
    Edge_Blending_Left: {
        name: 'Edge Blending Left',
        control: {
            [ControlCommands.EDGE_BLENDING_LEFT_ON]: getControl('On', 'VGL:1'),
            [ControlCommands.EDGE_BLENDING_LEFT_OFF]: getControl('Off', 'VGL:0')

        },
        query: '00QGL',
        response: { '001': 'On', '000': 'Off' }
    },
    Input_Signal_Name_Main: {
        name: 'Input Signal Name - Main',
        control: {},
        query: getQuery('MSCS'),
        response: {
            '[MSCS!YUV]' : 'HDMI-2'
        }
    },
    HDMI_In_Signal_Level: {
        name: 'HDMI In-Signal Level',
        control: {},
        query: getQuery('MSVR'),
        response: {
            '[MSVR!60Hz]': '60Hz',
            '00HSLI0=+00001': '64-940',
            '00HSLI0=+00002': 'Auto'
            
        }
    },
    HDMI_In_EDID_Resolution: {
        name: 'HDMI In-EDID Resolution',
        control: {},
        query: getQuery('MSRS'),
        response: {
            '[MSRS!1920x1200]': '1920x1200'
        }
    },
    HDMI_In_EDID_Vertical_Scan:{
        name: 'HDMI In-EDID Vertical Scan Frequency',
        control: {},
        query: getQuery('MSHR'),
        response:{
            '[MSHR!74.1kHz]': '74.1Hz',
            '00EDVI3=+05000': '50Hz',
            '00EDVI3=+04800': '48Hz',
            '00EDVI3=+03000': '30Hz',
            '00EDVI3=+02500': '25Hz',
            '00EDVI3=+02400': '24Hz'
        }

    },
    Projector_Name: {
        name: 'Projector Name',
        control: { [ControlCommands.PROJECTOR_NAME]: getControl('Name', 'NPJN') }, //Drops Return and Equal, Handled In Setter
        query: getQuery('NPJN'),
        response: {}
    },
    Projector_ID: {
        name: 'Projector ID',
        control: { [ControlCommands.PROJECTOR_ID]: getControl('ID', 'PJAD') }, //Drops Return and Equal, Handled In Setter
        query: getQuery('PJAD'),
        response: {}
    },
    Freeze:{
        name: 'Freeze',
        control:{
            [ControlCommands.FREEZE_OFF]: getControl('Off','FRZE0'),
            [ControlCommands.FREEZE_ON]: getControl('On','FRZE1')
        },
        query: getQuery('FRZE'),
        response: {'[FRZE!00]': 'Off', '[FRZE!01]': 'On'}
    },
    Ceiling_Mount:{
        name: 'Ceiling Mount',
        control:{
            [ControlCommands.CEILING_MOUNT_OFF]: getControl('Off', 'CEMO0'),
            [ControlCommands.CEILING_MOUNT_ON]: getControl('On','CEMO1'),
        },
            query: getQuery('CEMO'),
            response:{
                '[CEMO!0]' :'Off',
                '[CEMO!1]': 'On'
            }
        },
    Standby_Mode:{
        name: 'Standby Mode',
        control:{
            [ControlCommands.STANDBY_MODE_NETWORK]: getControl('Network','SBPM2') //2 is Communication mode, what we want. Name wrong
        },
            query: getQuery('SBPM'),
            response:{
                '[SBPM!0]': 'Standby',
                '[SPBM!1]': 'Network',
                '[SPBM!2]': 'Communication'
            }
    },
    Auto_Shutdown:{
        name: 'Auto Shutdown',
        control:{
            [ControlCommands.AUTO_SHUTDOWN_OFF]: getControl('Auto Off', 'APOF00')
        },
        query: getQuery('APOF'),
        response:{}
    }
    



}