import { query, response } from 'express'
import { ControlCommands, ControlKeys } from './constants'

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
    return { name, command: '00'+command }
}
export const functions: Record<string, hexFunction> = {
    Power: {
        name: 'Power',
        control: { [ControlCommands.POWER_ON]: getControl('Power On', 'PON'), [ControlCommands.POWER_OFF]: getControl('Power Off', 'POF') },
        query: '00QPW',
        response: {
            '00001': 'On',
            '00000': 'Off'
        }
    },
    Shutter: {
        name: 'Shutter',
        control: { [ControlCommands.SHUTTER_OPEN]: getControl('Shutter Open', 'OSH:0'), [ControlCommands.SHUTTER_CLOSED]: getControl('Shutter Closed', 'OSH:1') },
        query: '00QSH',
        response: {
            '000': 'Open',
            '001': 'Closed'
        }
    },
    Edge_Blending: {
        name: 'Edge Blending',
        control: { [ControlCommands.EDGE_BLENDING_OFF]: getControl('Off', 'VXX:EDBI0=+00000'), [ControlCommands.EDGE_BLENDING_ON]: getControl('On', 'VXX:EDBI0=+00001'), 'User': getControl('User', 'VXX:EDBI0=+00002') },
        query: '00QVX:EDBI0',
        response: {
            '00EDBI0=+00000': 'Off',
            '00EDBI0=+00001': 'On',
            '00EDBI0=+00002': 'User'
        }
    },
    Edge_Blending_Markers: {
        name: 'Edge Blending Markers',
        control: { [ControlCommands.EDGE_BLENDING_MARKERS_ON]: getControl('Marker On', 'VGM:1'), [ControlCommands.EDGE_BLENDING_MARKERS_OFF]: getControl('Marker Off', 'VGM:0') },
        query: '00QGM',
        response: {
            '000': 'Off',
            '001': 'On'
        }
    },
    Lamp_Control_Status: {
        name: 'Lamp Control Status',
        control: {},
        query: '00Q$S',
        response: {
            '000': 'Lamp Off',
            '001': 'In Turning On',
            '002': 'Lamp On',
            '003': 'Lamp Cooling'
        }
    },
    Test_Pattern: {
        name: 'Test Pattern',
        control: {
            [ControlCommands.TEST_PATTERN_OFF]: getControl('Off', 'OTS:00'),
            [ControlCommands.TEST_PATTERN_WHITE]: getControl('White', 'OTS:01'),
            [ControlCommands.TEST_PATTERN_BLACK]: getControl('Black', 'OTS:02'),
            [ControlCommands.TEST_PATTERN_FOCUS_RED]: getControl('Focus Red', 'OTS:70'),
            [ControlCommands.TEST_PATTERN_FOCUS_WHITE]: getControl('Focus White','OTS:59')
        },
        query: '00QTS',
        response: {
            '0000': 'Off',
            '0001': 'White',
            '0002': 'Black',

        }
    },
    Menu: {
        name: 'Menu',
        control: {
            [ControlCommands.MENU]: getControl('Menu', 'OMN'),
            [ControlCommands.MENU_ENTER_KEY]: getControl('Enter', 'OEN'),
            [ControlCommands.MENU_UP_KEY]: getControl('Up', 'OCU'),
            [ControlCommands.MENU_RIGHT_KEY]: getControl('Right', 'OCR'),
            [ControlCommands.MENU_DOWN_KEY]: getControl('Down', 'OCD'),
            [ControlCommands.MENU_LEFT_KEY]: getControl('Left', 'OCL'),
            [ControlCommands.MENU_DEFAULT_KEY]: getControl('Default', 'OST')

        },
        query: '',
        response: { 'None': '' }

    },
    NumericKey: {
        name: 'Numeric Key',
        control: {
            [ControlCommands.NUMBER_KEY_0]: getControl('0', 'ONK:0'),
            [ControlCommands.NUMBER_KEY_1]: getControl('1', 'ONK:1'),
            [ControlCommands.NUMBER_KEY_2]: getControl('2', 'ONK:2'),
            [ControlCommands.NUMBER_KEY_3]: getControl('3', 'ONK:3'),
            [ControlCommands.NUMBER_KEY_4]: getControl('4', 'ONK:4'),
            [ControlCommands.NUMBER_KEY_5]: getControl('5', 'ONK:5'),
            [ControlCommands.NUMBER_KEY_6]: getControl('6', 'ONK:6'),
            [ControlCommands.NUMBER_KEY_7]: getControl('7', 'ONK:7'),
            [ControlCommands.NUMBER_KEY_8]: getControl('8', 'ONK:8'),
            [ControlCommands.NUMBER_KEY_9]: getControl('9', 'ONK:9')
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
            [ControlCommands.LENS_SHIFT_V_SP]: getControl('Vertical Slow +', 'VXX:LNSI3=+00001'),
            [ControlCommands.LENS_SHIFT_V_SN]: getControl('Vertical Slow -', 'VXX:LNSI3=+00000'),
            [ControlCommands.LENS_SHIFT_V_NP]: getControl('Vertical Normal +', 'VXX:LNSI3=+00101'),
            [ControlCommands.LENS_SHIFT_V_NN]: getControl('Vertical Normal -', 'VXX:LNSI3=+00100'),
            [ControlCommands.LENS_SHIFT_V_FP]: getControl('Vertical Fast +', 'VXX:LNSI3=+00201'),
            [ControlCommands.LENS_SHIFT_V_FN]: getControl('Vertical Fast -', 'VXX:LNSI3=+00200'),
            [ControlCommands.LENS_SHIFT_H_SP]: getControl('Horizontal Slow +', 'VXX:LNSI2=+00000'),
            [ControlCommands.LENS_SHIFT_H_SN]: getControl('Horizontal Slow -', 'VXX:LNSI2=+00001'),
            [ControlCommands.LENS_SHIFT_H_NP]: getControl('Horizontal Normal +', 'VXX:LNSI2=+00100'),
            [ControlCommands.LENS_SHIFT_H_NN]: getControl('Horizontal Normal -', 'VXX:LNSI2=+00101'),
            [ControlCommands.LENS_SHIFT_H_FP]: getControl('Horizontal Fast +', 'VXX:LNSI2=+00200'),
            [ControlCommands.LENS_SHIFT_H_FN]: getControl('Horizontal Fast -', 'VXX:LNSI2=+00201'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensFocus: {
        name: 'Lens Focus',
        control: {
            [ControlCommands.LENS_FOCUS_SP]: getControl('Slow +', 'VXX:LNSI4=+00000'),
            [ControlCommands.LENS_FOCUS_SN]: getControl('Slow -', 'VXX:LNSI4=+00001'),
            [ControlCommands.LENS_FOCUS_NP]: getControl('Normal +', 'VXX:LNSI4=+00100'),
            [ControlCommands.LENS_FOCUS_NN]: getControl('Normal -', 'VXX:LNSI4=+00101'),
            [ControlCommands.LENS_FOCUS_FP]: getControl('Fast +', 'VXX:LNSI4=+00200'),
            [ControlCommands.LENS_FOCUS_FN]: getControl('Fast -', 'VXX:LNSI4=+00201'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensZoom: {
        name: 'Lens Zoom',
        control: {
            [ControlCommands.LENS_ZOOM_SP]: getControl('Slow +', 'VXX:LNSI5=+00000'),
            [ControlCommands.LENS_ZOOM_SN]: getControl('Slow -', 'VXX:LNSI5=+00001'),
            [ControlCommands.LENS_ZOOM_NP]: getControl('Normal +', 'VXX:LNSI5=+00100'),
            [ControlCommands.LENS_ZOOM_NN]: getControl('Normal -', 'VXX:LNSI5=+00101'),
            [ControlCommands.LENS_ZOOM_FP]: getControl('Fast +', 'VXX:LNSI5=+00200'),
            [ControlCommands.LENS_ZOOM_FN]: getControl('Fast -', 'VXX:LNSI5=+00201'),
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
            [ControlCommands.BACK_COLOR_BLUE]: getControl('Blue', 'OBC:0'),
            [ControlCommands.BACK_COLOR_BLACK]: getControl('Black', 'OBC:1'),
            [ControlCommands.BACK_COLOR_USER_LOGO]: getControl('User Logo', 'OBC:2'),
            [ControlCommands.BACK_COLOR_DEFAULT_LOGO]: getControl('Default Logo', 'OBC:3')
        },
        query: '00QBC',
        response: { '000': 'Blue', '001': 'Black', '002': 'User Logo', '003': 'Default Logo' }
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
            [ControlCommands.OSD_POSITION_UPPER_LEFT]: getControl('Upper Left', 'ODP:1'),
            [ControlCommands.OSD_POSITION_CENTER_LEFT]: getControl('Center Left', 'ODP:2'),
            [ControlCommands.OSD_POSITION_LOWER_LEFT]: getControl('Lower Left', 'ODP:3'),
            [ControlCommands.OSD_POSITION_TOP_CENTER]: getControl('Top Center', 'ODP:4'),
            [ControlCommands.OSD_POSITION_CENTER]: getControl('Center', 'ODP:5'),
            [ControlCommands.OSD_POSITION_LOWER_CENTER]: getControl('Lower Center', 'ODP:6'),
            [ControlCommands.OSD_POSITION_UPPER_RIGHT]: getControl('Upper Right', 'ODP:7'),
            [ControlCommands.OSD_POSITION_CENTER_RIGHT]: getControl('Center Right', 'ODP:8'),
            [ControlCommands.OSD_POSITION_LOWER_RIGHT]: getControl('Lower Right', 'ODP:9'),

        },
        query: '00QDP',
        response: {
            '001': 'Upper Left',
            '002': 'Center Left',
            '003': 'Lower Left',
            '004': 'Top Center',
            '005': 'Center',
            '006': 'Lower Center',
            '007': 'Upper Right',
            '008': 'Center Right',
            '009': 'Lower Right'
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
        query: '00QVX:NSGS1',
        response: {}
    },
    HDMI_In_Signal_Level: {
        name: 'HDMI In-Signal Level',
        control: {},
        query: '00QVX:HSLI0',
        response: {
            '00HSLI0=+00000': '0-1023',
            '00HSLI0=+00001': '64-940',
            '00HSLI0=+00002': 'Auto'
        }
    },
    HDMI_In_EDID_Resolution: {
        name: 'HDMI In-EDID Resolution',
        control: {},
        query: '00QVX:EDRS3',
        response: {
            '00EDRS3=1024:0768:p': '1024x768p',
            '00EDRS3=1280:0720:p': '1280x720p',
            '00EDRS3=1280:0768:p': '1280x768p',
            '00EDRS3=1280:0800:p': '1280x800p',
            '00EDRS3=1280:1024:p': '1280x1024p',
            '00EDRS3=1366:0768:p': '1366x768p',
            '00EDRS3=1400:1050:p': '1400x1050p',
            '00EDRS3=1440:0900:p': '1440x900p',
            '00EDRS3=1600:0900:p': '1600x900p',
            '00EDRS3=1600:1200:p': '1600x1200p',
            '00EDRS3=1680:1050:p': '1680x1050p',
            '00EDRS3=1920:1080:p': '1920x1080p',
            '00EDRS3=1920:1080:i': '1920x1080i',
            '00EDRS3=1920:1200:p': '1920x1200p',
            '00EDRS3=3840:2400:p': '3840x2400p'
        }
    },
    HDMI_In_EDID_Vertical_Scan:{
        name: 'HDMI In-EDID Vertical Scan Frequency',
        control: {},
        query: '00QVX:EDVI3',
        response:{
            '00EDVI3=+06000': '60Hz',
            '00EDVI3=+05000': '50Hz',
            '00EDVI3=+04800': '48Hz',
            '00EDVI3=+03000': '30Hz',
            '00EDVI3=+02500': '25Hz',
            '00EDVI3=+02400': '24Hz'
        }

    },
    Projector_Name: {
        name: 'Projector Name',
        control: { [ControlCommands.PROJECTOR_NAME]: getControl('Name', 'VXX:NCGS8') }, //Drops Return and Equal, Handled In Setter
        query: '00QVX:NCGS8',
        response: {}
    },
    Projector_ID: {
        name: 'Projector ID',
        control: { [ControlCommands.PROJECTOR_ID]: getControl('ID', 'QIS:') }, //Drops Return and Equal, Handled In Setter
        query: '',
        response: {}
    },
    Freeze:{
        name: 'Freeze',
        control:{
            [ControlCommands.FREEZE_OFF]: getControl('Off','OFZ:0'),
            [ControlCommands.FREEZE_ON]: getControl('On','OFZ:1')
        },
        query: '00QFZ',
        response: {'000': 'Off', '001': 'On'}
    }


}