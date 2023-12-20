import { useCallback, useEffect, useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Button,
    Checkbox,
    createTheme,
    FormControlLabel,
    IconButton,
    Slider,
    Stack,
    styled,
    ThemeProvider,
    Typography
} from "@mui/material";
//@ts-ignore
import generator from 'generate-password-ts/dist/generate-password.bundle.js';
import type {Options} from 'generate-password-ts/dist/Options';
import '../App.css';
import BatteryWidget from "./BatteryWidget.tsx";
import { ALMOST_WHITE } from "./constants.ts";

declare module '@mui/material/styles' {
    interface Theme {
        palette: {
            primary: string;
            secondary: string;
        },
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        overrides?: {
            MuiFormControlLabel?: {
                label?: {
                    color?: "string"
                },
            },
        }
    }
}
const theme = createTheme({
    typography: {
        fontFamily: [
            'JetBrains Mono',
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
                        fontSize: "18px",
                        fontWeight: 700,
                        fontStyle: "normal",
                        textTransform: "uppercase",
                        // Disable the ripple effect
                        "& .MuiTouchRipple-root": {
                            display: 'none',
                        },
                        '@media (max-width: 600px)': { // 600px is a common breakpoint for mobile devices
                            fontSize: '16px',
                        },
                    },
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: ALMOST_WHITE,
                    fontSize: "24px",
                    '@media (max-width: 600px)': {
                        fontSize: '16px',
                    },
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    color: ALMOST_WHITE,
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    '@media (max-width: 600px)': {
                        fontSize: '16px',
                    },
                }
            }
        }
    }
});

//Custom styles can be done also via styled
const CustomSlider = styled(Slider)({
    '& .MuiSlider-thumb': {
        height: 28,
        width: 28,
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

const calcStrength = (pass: string): number => {
  if (pass.length < 8) return 1;

  let _strength = pass.length;

  // Check for capital letters
  if (/[A-Z]/.test(pass)) _strength += 2;

  // Check for numbers
  if (/\d/.test(pass)) _strength += 3;

  // Check for non-alphanumeric symbols
  if (/\W/.test(pass)) _strength += 4;

  // Calculate final score
  if (_strength >= 8 && _strength < 13) return 2;
  else if (_strength < 16) return 3;
  else  return 4
}

export const PassGen = () => {
    const [password, setPassword] = useState<string>("");
    const [charLength, setCharLength] = useState<number>(10);

    const [uppercase, setUppercase] = useState<boolean>(true);
    const [lowercase, setLowercase] = useState<boolean>(true);
    const [numbers, setNumbers] = useState<boolean>(false);
    const [symbols, setSymbols] = useState<boolean>(true);
    const [strength, setStrength] = useState<number>(0);
    const [isCopied, setIsCopied] = useState(false);

    const generatePassword = useCallback(() => {
        const options = {} as Options;
        options.uppercase = uppercase;
        options.lowercase = lowercase;
        options.numbers = numbers;
        options.symbols = symbols;
        //If all of the checkobxes are deselect
        if (!uppercase && !lowercase && !numbers && !symbols) {
            options.lowercase = true;
        }
        const p = generator.generate({
            ...options,
            length: charLength,
        });
        setPassword(p);
    }, [charLength, uppercase, lowercase, numbers, symbols]);
    useEffect(()=>{
        setStrength(calcStrength(password));
    }, [password]);
    useEffect(() => {
        generatePassword();
    }, []);
    const copyToClipboard = async () => {
        try {
            setIsCopied(true);
            await navigator.clipboard.writeText(password);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };
    useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    }, [isCopied]);

    return (
        <ThemeProvider theme={theme}>
            <div className="main">
                <Typography color="#817D92" fontSize="24px" >
                    Password Generator
                </Typography>
                <div className="password-card main-card-item">
                    <Typography color={ALMOST_WHITE} fontSize="32px">
                        {password}
                    </Typography>

                    <Stack direction="row" alignItems="center">
                        {isCopied &&
                            <Typography className="fade-out" textTransform="uppercase" color="secondary"
                                        fontSize="18px">
                                copied
                            </Typography>
                        }
                        <IconButton color="secondary" onClick={copyToClipboard}>
                            <ContentCopyIcon/>
                        </IconButton>
                    </Stack>
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
                        min={0}
                        max={20}
                        onChange={
                            (_: Event, newValue: number | number[]) => {
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
                            setSymbols(event.target.checked);
                        }}/>
                    } label="Include Symbols"/>
                    <BatteryWidget strength={strength}></BatteryWidget>

                    <Button onClick={generatePassword}
                            endIcon={<ArrowForwardIcon/>}
                            variant="contained"
                            color="secondary"
                            sx={{
                                width: "100%",
                                height: "65px",
                            }}
                    >
                        Generate
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};