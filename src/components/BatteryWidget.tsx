import React from 'react';
import styled from 'styled-components';
import {Box, Stack, Typography} from "@mui/material";
import {ALMOST_WHITE, GRAY, VERY_DARK} from "./constants.ts";

interface BatteryWidgetProps {
    strength: number;
}

const Battery = styled.div`
  display: flex;
  //margin-left: 20px;
`;

const Rectangle = styled.div<{ filled: boolean; color: string }>`
  box-sizing: border-box;
  width: 10px;
  height: 28px;
  margin: 4px;
  border-width: ${(props) => (props.filled ? "0px" : '2px')};
  border-style: solid;
  border-color: ${ALMOST_WHITE};
  background-color: ${(props) => (props.filled ? props.color : 'transparent')};
`;

const BatteryWidget: React.FC<BatteryWidgetProps> = ({strength}) => {
    const value = Math.max(Math.min(4, strength), 1);
    const levels = [
        {label: 'too weak!', color: '#F64A4A'},
        {label: 'weak', color: '#FB7C58'},
        {label: 'medium', color: '#F8CD65'},
        {label: 'strong', color: '#A4FFAF'}
    ];
    const text = levels[value - 1].label;
    const color = levels[value - 1].color;
    return (
        <div className='battery-widget'>
            <div className='battery-widget-inside'>
                <Typography variant="subtitle1" text-align="right" textTransform="uppercase" color={GRAY} >
                    strength
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Typography variant="h6" textTransform="uppercase" color={ALMOST_WHITE}>
                        {text}
                    </Typography>
                    <Battery>
                        {levels.map((_, index) => (
                            <Rectangle
                                key={index}
                                filled={index < value}
                                color={color}
                            />
                        ))}
                    </Battery>
                </Stack>
                </div>
        </div>
    );
};

export default BatteryWidget;
