import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

const chameleoGreen = '#00AF55';
const navy = '#212B36';
const lightNavy = '#435361';
const blue = '#456EBD';
const green = '#00AF55';
const red = '#B72136';
const paleBlue = '#919EAB';
const darkGreen = '#0e803d';

const lightGrey = '#EDEDED';

const error = '#B72136';
const errorBg = 'rgb(255, 72, 66, 0.1)';

const themeObj = {
    palette: {
        primary: {
            main: '#000000',
            contrastText: '#ffffff'
        },
        success: {
            main: chameleoGreen,
        },
        secondary: {
            main: navy,
            contrastText: '#ffffff'
        },
        error: {
            main: error,
            light: errorBg
        },
        background: {
            default: '#ffffff',
            dark: '#000000',
            contrastText: '#000000',
            light: '#F8F9FB'
        },
        text: {
            primary: '#030027',
            secondary: '#666666'
        },
        grey: {
            A200: paleBlue,
            ['50']: '#F8F9FB',
            ['200']: '#E5E5E5',
            ['500']: '#666666'
        }
    },
    typography: {
        fontFamily: '"Lato", "Roboto"',
        fontWeightMedium: 600,
        fontWeightBold: 700,
        button: {
            fontWeight: 600
        },
        h1: {
            fontSize: '32px',
            fontWeight: 700
        },
        h3: {
            fontSize: '24px',
            fontWeight: 600,
        },
        h4: {
            fontSize: '22px',
            fontWeight: 600,
        },
        h5: {
            fontSize: '18px',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 600
        },
        subtitle2: {
            fontSize: '12px'
        },
        body2: {
            fontSize: '14px'
        }
    },
    shape: {
        borderRadius: 3
    },
}

// Create a theme instance.
const theme: any = createTheme(themeObj);

export default theme;