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
    return { name, command }
}
export const functions: Record<string, hexFunction> = {
    Power: {
        name: 'Power',
        control: { [ControlCommands.POWER_ON]: getControl('Power On', '00PON'), [ControlCommands.POWER_OFF]: getControl('Power Off', '00POF') },
        query: '00QPW',
        response: {
            '00001': 'On',
            '00000': 'Off'
        }
    },
    Shutter: {
        name: 'Shutter',
        control: { [ControlCommands.SHUTTER_OPEN]: getControl('Shutter Open', '00OSH:0'), [ControlCommands.SHUTTER_CLOSED]: getControl('Shutter Closed', '00OSH:1') },
        query: '00QSH',
        response: {
            '000': 'Open',
            '001': 'Closed'
        }
    },
    Edge_Blending: {
        name: 'Edge Blending',
        control: { [ControlCommands.EDGE_BLENDING_OFF]: getControl('Off', '00VXX:EDBI0=+00000'), [ControlCommands.EDGE_BLENDING_ON]: getControl('On', 'VXX:EDBI0=+00001'), 'User': getControl('User', 'VXX:EDBI0=+00002') },
        query: '00QVX:EDBI0',
        response: {
            '00EDBI0=+00000': 'Off',
            '00EDBI0=+00001': 'On',
            '00EDBI0=+00002': 'User'
        }
    },
    Edge_Blending_Markers: {
        name: 'Edge Blending Markers',
        control: { [ControlCommands.EDGE_BLENDING_MARKERS_ON]: getControl('Marker On', '00VGM:1'), [ControlCommands.EDGE_BLENDING_MARKERS_OFF]: getControl('Marker Off', '00VGM:0') },
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
            [ControlCommands.TEST_PATTERN_OFF]: getControl('Off', '00OTS:00'),
            [ControlCommands.TEST_PATTERN_WHITE]: getControl('White', '00OTS:01'),
            [ControlCommands.TEST_PATTERN_BLACK]: getControl('Black', '00OTS:02'),
            [ControlCommands.TEST_PATTERN_FOCUS_RED]: getControl('Focus Red', '00OTS:70')
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
            [ControlCommands.MENU]: getControl('Menu', '00OMN'),
            [ControlCommands.MENU_ENTER_KEY]: getControl('Enter', '00OEN'),
            [ControlCommands.MENU_UP_KEY]: getControl('Up', '00OCU'),
            [ControlCommands.MENU_RIGHT_KEY]: getControl('Right', '00OCR'),
            [ControlCommands.MENU_DOWN_KEY]: getControl('Down', '00OCD'),
            [ControlCommands.MENU_LEFT_KEY]: getControl('Left', '00OCL'),
            [ControlCommands.MENU_DEFAULT_KEY]: getControl('Default', '00OST')

        },
        query: '',
        response: { 'None': '' }

    },
    NumericKey: {
        name: 'Numeric Key',
        control: {
            [ControlCommands.NUMBER_KEY_0]: getControl('0', '00ONK:0'),
            [ControlCommands.NUMBER_KEY_1]: getControl('1', '00ONK:1'),
            [ControlCommands.NUMBER_KEY_2]: getControl('2', '00ONK:2'),
            [ControlCommands.NUMBER_KEY_3]: getControl('3', '00ONK:3'),
            [ControlCommands.NUMBER_KEY_4]: getControl('4', '00ONK:4'),
            [ControlCommands.NUMBER_KEY_5]: getControl('5', '00ONK:5'),
            [ControlCommands.NUMBER_KEY_6]: getControl('6', '00ONK:6'),
            [ControlCommands.NUMBER_KEY_7]: getControl('7', '00ONK:7'),
            [ControlCommands.NUMBER_KEY_8]: getControl('8', '00ONK:8'),
            [ControlCommands.NUMBER_KEY_9]: getControl('9', '00ONK:9')
        },
        query: '',
        response: { 'None': '' }
    },
    LensPositionHome: {
        name: 'Lens Position Home',
        control: {
            [ControlCommands.LENS_POSTION_HOME]: getControl('Home', '00VXX:LNSI1=+00001')
        },
        query: '',
        response: { 'None': '' }
    },
    LensShift: {
        name: 'Lens Shift',
        control: {
            [ControlCommands.LENS_SHIFT_V_SP]: getControl('Vertical Slow +', '00VXX:LNSI3=+00000'),
            [ControlCommands.LENS_SHIFT_V_SN]: getControl('Vertical Slow -', '00VXX:LNSI3=+00001'),
            [ControlCommands.LENS_SHIFT_V_NP]: getControl('Vertical Normal +', '00VXX:LNSI3=+00100'),
            [ControlCommands.LENS_SHIFT_V_NN]: getControl('Vertical Normal -', '00VXX:LNSI3=+00101'),
            [ControlCommands.LENS_SHIFT_V_FP]: getControl('Vertical Fast +', '00VXX:LNSI3=+00200'),
            [ControlCommands.LENS_SHIFT_V_FN]: getControl('Vertical Fast -', '00VXX:LNSI3=+00201'),
            [ControlCommands.LENS_SHIFT_H_SP]: getControl('Horizontal Slow +', '00VXX:LNSI2=+00000'),
            [ControlCommands.LENS_SHIFT_H_SN]: getControl('Horizontal Slow -', '00VXX:LNSI2=+00001'),
            [ControlCommands.LENS_SHIFT_H_NP]: getControl('Horizontal Normal +', '00VXX:LNSI2=+00100'),
            [ControlCommands.LENS_SHIFT_H_NN]: getControl('Horizontal Normal -', '00VXX:LNSI2=+00101'),
            [ControlCommands.LENS_SHIFT_H_FP]: getControl('Horizontal Fast +', '00VXX:LNSI2=+00200'),
            [ControlCommands.LENS_SHIFT_H_FN]: getControl('Horizontal Fast -', '00VXX:LNSI2=+00201'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensFocus: {
        name: 'Lens Focus',
        control: {
            [ControlCommands.LENS_FOCUS_SP]: getControl('Slow +', '00VXX:LNSI4=+00000'),
            [ControlCommands.LENS_FOCUS_SN]: getControl('Slow -', '00VXX:LNSI4=+00001'),
            [ControlCommands.LENS_FOCUS_NP]: getControl('Normal +', '00VXX:LNSI4=+00100'),
            [ControlCommands.LENS_FOCUS_NN]: getControl('Normal -', '00VXX:LNSI4=+00101'),
            [ControlCommands.LENS_FOCUS_FP]: getControl('Fast +', '00VXX:LNSI4=+00200'),
            [ControlCommands.LENS_FOCUS_FN]: getControl('Fast -', '00VXX:LNSI4=+00201'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensZoom: {
        name: 'Lens Zoom',
        control: {
            [ControlCommands.LENS_ZOOM_SP]: getControl('Slow +', '00VXX:LNSI5=+00000'),
            [ControlCommands.LENS_ZOOM_SN]: getControl('Slow -', '00VXX:LNSI5=+00001'),
            [ControlCommands.LENS_ZOOM_NP]: getControl('Normal +', '00VXX:LNSI5=+00100'),
            [ControlCommands.LENS_ZOOM_NN]: getControl('Normal -', '00VXX:LNSI5=+00101'),
            [ControlCommands.LENS_ZOOM_FP]: getControl('Fast +', '00VXX:LNSI5=+00200'),
            [ControlCommands.LENS_ZOOM_FN]: getControl('Fast -', '00VXX:LNSI5=+00201'),
        },
        query: '',
        response: { 'None': '' }
    },
    LensCalibration: {
        name: 'Lens Calibration',
        control: {
            [ControlCommands.LENS_CALIBRATION]: getControl('Lens Cal', '00VXX:LNSI0=+00000')
        },
        query: '',
        response: { 'None': '' }
    },
    BackColor: {
        name: 'Back Color',
        control: {
            [ControlCommands.BACK_COLOR_BLUE]: getControl('Blue', '00OBC:0'),
            [ControlCommands.BACK_COLOR_BLACK]: getControl('Black', '00OBC:1'),
            [ControlCommands.BACK_COLOR_USER_LOGO]: getControl('User Logo', '00OBC:2'),
            [ControlCommands.BACK_COLOR_DEFAULT_LOGO]: getControl('Default Logo', '00OBC:3')
        },
        query: '00QBC',
        response: { '000': 'Blue', '001': 'Black', '002': 'User Logo', '003': 'Default Logo' }
    },
    OSD: {
        name: 'OSD',
        control: {
            [ControlCommands.OSD_POSITION_UPPER_LEFT]: getControl('Upper Left', '00ODP:1'),
            [ControlCommands.OSD_POSITION_CENTER_LEFT]: getControl('Center Left', '00ODP:2'),
            [ControlCommands.OSD_POSITION_LOWER_LEFT]: getControl('Lower Left', '00ODP:3'),
            [ControlCommands.OSD_POSITION_TOP_CENTER]: getControl('Top Center', '00ODP:4'),
            [ControlCommands.OSD_POSITION_CENTER]: getControl('Center', '00ODP:5'),
            [ControlCommands.OSD_POSITION_LOWER_CENTER]: getControl('Lower Center', '00ODP:6'),
            [ControlCommands.OSD_POSITION_UPPER_RIGHT]: getControl('Upper Right', '00ODP:7'),
            [ControlCommands.OSD_POSITION_CENTER_RIGHT]: getControl('Center Right', '00ODP:8'),
            [ControlCommands.OSD_POSITION_LOWER_RIGHT]: getControl('Lower Right', '00ODP:9'),

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
            [ControlCommands.EDGE_BLENDING_UPPER_ON]: getControl('On', '00VGU:1'),
            [ControlCommands.EDGE_BLENDING_UPPER_OFF]: getControl('Off', '00VGU:0')

        },
        query: '00QGU',
        response: { '001': 'On', '000': 'Off' }
    },
    Edge_Blending_Lower: {
        name: 'Edge Blending Lower',
        control: {
            [ControlCommands.EDGE_BLENDING_LOWER_ON]: getControl('On', '00VGB:1'),
            [ControlCommands.EDGE_BLENDING_LOWER_OFF]: getControl('Off', '00VGB:0')

        },
        query: '00QGB',
        response: { '001': 'On', '000': 'Off' }
    },
    Edge_Blending_Right: {
        name: 'Edge Blending Right',
        control: {
            [ControlCommands.EDGE_BLENDING_RIGHT_ON]: getControl('On', '00VGR:1'),
            [ControlCommands.EDGE_BLENDING_RIGHT_OFF]: getControl('Off', '00VGR:0')

        },
        query: '00QGR',
        response: { '001': 'On', '000': 'Off' }
    },
    Edge_Blending_Left: {
        name: 'Edge Blending Left',
        control: {
            [ControlCommands.EDGE_BLENDING_LEFT_ON]: getControl('On', '00VGL:1'),
            [ControlCommands.EDGE_BLENDING_LEFT_OFF]: getControl('Off', '00VGL:0')

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
            '00EDRS3=1920:1200:p': '1920x1200p'
        }
    },
    Projector_Name: {
        name: 'Projector Name',
        control: { [ControlCommands.PROJECTOR_NAME]: getControl('Name', '00VXX:NCGS8') }, //Drops Return and Equal, Handled In Setter
        query: '00QVX:NCGS8',
        response: {}
    }


}