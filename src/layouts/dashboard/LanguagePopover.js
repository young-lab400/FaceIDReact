import { useContext, useRef, useState } from 'react';
// material
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';

 import MacContext from './createContext';
// ----------------------------------------------------------------------

const LANGS = [
  {
    value: '192.168.3.10',
    label: '前門',
  },
  {
    value: '192.168.3.11',
    label: '後門',
  }
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
 
  const Id = useContext(MacContext);
  console.log("MacContext1");
  console.log(Id);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [MacTemp, setMacTemp] = useState("前門");
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const LANGSClick = (arg) => {
    
    // console.log("arg");
    // console.log(arg);
    setMacTemp(arg);
    setOpen(false); 
    <MacContext.Consumer>
    {MacContext.Id = arg}
   </MacContext.Consumer>
    console.log("MacContext2");
    console.log(MacContext.Id);
    
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <img src="/static/icons/server.jpg" alt={LANGS[0].label} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {LANGS.map((option) => (
            <MenuItem key={option.value} selected={option.value === LANGS[0].value} onClick={() => LANGSClick(option.value)}>
              <Box component="img" alt={option.label} src="/static/icons/server2.jpg"  sx={{ width: 28, mr: 2 }} />

              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
