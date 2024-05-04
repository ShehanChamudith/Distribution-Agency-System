import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const actions = [
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <PrintIcon />, name: 'Print' },
];

export default function SpeedDialComponent() {
  
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Box sx={{ position: 'relative', mt: 3, height: 320 }}>
        <StyledSpeedDial
          ariaLabel="SpeedDial playground example"
          icon={<ArrowDropDownIcon />}
          direction="down" // Set direction to "down"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </StyledSpeedDial>
      </Box>
    </Box>
  );
}
