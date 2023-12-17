import React, {useCallback, useEffect, useMemo, useState} from "react";
//TODO Check can we import it 'properly'
import generator from 'generate-password-ts/dist/generate-password.bundle.js';
import {
    Button,
    Checkbox,
    createSvgIcon,
    createTheme,
    FormControlLabel, IconButton, makeStyles, Slider, styled,
    SvgIcon,
    ThemeProvider,
    Typography
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import '../App.css';

declare module '@mui/material/styles' {
    interface Theme {
        palette: {
            primary: string;
            secondary: string;
        },
        // overrides: {
        //     MuiFormControlLabel: {
        //         label: {
        //             color: "string"
        //         },
        //     },
        // }
    };

    // allow configuration using `createTheme`
    interface ThemeOptions {
        palette?: {
            primary?: string;
            secondary?: string;
        },

        overrides?: {
            MuiFormControlLabel?: {
                label?: {
                    color?: "string"
                },
            },
        }
    }
}
const ALMOST_WHITE = "#E6E5EA";
const theme = createTheme({
    typography: {
        fontFamily: [
            'JetBrains Mono',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    palette: {
        primary: {
            main: "#18171F"
        },

        secondary: {
            main: "#A4FFAF"
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'transparent',
                        color: "#A4FFAF",
                        border: "2px #A4FFAF solid",

                        // Disable the ripple effect
                        "& .MuiTouchRipple-root": {
                            display: 'none',
                        },
                    },
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: ALMOST_WHITE
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    color: ALMOST_WHITE,
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 700
                }
            }
        }
    }
});

//Custom styles can be done also via styled
const CustomSlider = styled(Slider)({
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: ALMOST_WHITE,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: 'inherit',
    },
      '&:hover': {
      border: '2px solid',

          backgroundColor: "#18171F"
    },
  },

  '& .MuiSlider-track': {
    height: 8,
    borderRadius: 0,
  },
  '& .MuiSlider-rail': {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#18171F"
  },
});
// const useStyles = makeStyles(theme => ({
//   customButton: {
//     '&:hover': {
//       backgroundColor: 'transparent',
//       // Disable the ripple effect
//       "& .MuiTouchRipple-root": {
//         display: 'none',
//       },
//     },
//   },
// }));
//Strength:
// 0 - too weak,
const STRENGTH_STRINGS = [
    "Too weak!",
    "Weak",
    "Medium",
    "Strong"
]
// const RightArrow = createSvgIcon(
//     <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path fill="#24232C" d="m5.106 12 6-6-6-6-1.265 1.265 3.841 3.84H.001v1.79h7.681l-3.841 3.84z"/></svg>
// );
const calcStrength = (pass: string): number => {

}
export const PassGen = () => {
    const [password, setPassword] = useState<string>("");
    const [charLength, setCharLength] = useState<number>(10);

    const [uppercase, setUppercase] = useState<boolean>(true);
    const [lowercase, setLowercase] = useState<boolean>(true);
    const [numbers, setNumbers] = useState<boolean>(true);
    const [symbols, setSymbols] = useState<boolean>(false);
    const [strength, setStrength] = useState<number>(0);

    const generatePassword = useCallback(() => {
        const options = {};
        options.uppercase = uppercase;
        options.lowercase = lowercase;
        options.numbers = numbers;
        options.symbols = symbols;
        //If all of the checkobxes are deselect
        if(!uppercase && !lowercase && !numbers && !symbols) {
            options.lowercase = true;
        }
        const p = generator.generate({
            ...options,
            length: charLength,
        });
        setPassword(p);
    }, [charLength, uppercase, lowercase, numbers, symbols]);
    useEffect(() => {
        generatePassword();
    }, []);
    const copyToClipboard = () => {
        console.log("Password is copied to clipboard");
    }
    const strengthUI = useMemo(() => {
        return STRENGTH_STRINGS[strength];
    }, [strength])
    return (
        <ThemeProvider theme={theme}>
            <div className="layout">
                <Typography color="#817D92" fontSize="24px" sx={{marginBottom: "32px"}}>
                    Password Generator
                </Typography>
                <div className="password-card main-card-item">
                    <Typography color={ALMOST_WHITE} fontSize="32px">
                        {password}
                    </Typography>
                    <IconButton color="secondary">
                        <ContentCopyIcon/>
                    </IconButton>
                </div>
                <div className="main-card-container">
                    <div className="main-card-item">
                        <Typography color={ALMOST_WHITE} fontSize="18px">
                            Character length
                        </Typography>

                        <Typography color="secondary" fontSize="32px">
                            {charLength}
                        </Typography>
                    </div>
                    <CustomSlider
                        defaultValue={charLength}
                        valueLabelDisplay="auto"
                        step={1}
                        min={5}
                        max={20}
                        onChange={
                            (event: Event, newValue: number | number[]) => {
                                setCharLength(newValue as number);
                            }
                        }
                        color="secondary"
                    />
                    <FormControlLabel control={
                        <Checkbox color="secondary" checked={uppercase} onChange={(event) => {
                            setUppercase(event.target.checked);
                        }}/>
                    } label="Include Uppercase Letters"/>

                    <FormControlLabel control={
                        <Checkbox color="secondary" checked={lowercase} onChange={(event) => {
                            setLowercase(event.target.checked);
                        }}/>
                    } label="Include Lowercase Letters"/>

                    <FormControlLabel control={
                        <Checkbox color="secondary" checked={numbers} onChange={(event) => {
                            setNumbers(event.target.checked);
                        }}/>
                    } label="Include Numbers"/>

                    <FormControlLabel control={
                        <Checkbox color="secondary" checked={symbols} onChange={(event) => {
                            console.log("SYMBOLS ARE SET TO", event.target.checked);
                            setSymbols(event.target.checked);
                        }}/>
                    } label="Include Symbols"/>
                    <div>
                        {strengthUI}
                    </div>

                    <Button onClick={generatePassword}
                            endIcon={<ArrowForwardIcon/>}
                            variant="contained"
                            color="secondary"
                            sx={{
                                width: "100%",
                                height: "65px",
                                flexShrink: 0,
                                fontSize: "18px",
                                fontWeight: 700,
                                fontStyle: "normal",
                                textTransform: "uppercase",
                            }}
                    >
                        Generate
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};