import { useContext, useRef, useState, useEffect } from 'react';
// material
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';

import MacContext from './createContext';
// ----------------------------------------------------------------------

const Device = [
  {
    Serial: '245DFC6BDEF6',
    value: '192.168.13.10',
    label: '前門',
  },
  {
    Serial: '245DFC6BD',
    value: '192.168.13.11',
    label: '後門',
  }
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {

  const ParentContext = useContext(MacContext);
  const [strsrc, setstrsrc] = useState('/static/icons/imagesRed.jpg');

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [lists, setLists] = useState([])

  try {
    useEffect(() => {
      const url = `/webapi/API/Device/Call?No=245DFC6BDEF6`;
      fetch(url, {
        method: "POST",
      })

        .then(response => response.json())
        .then(json => {
          setLists(json);

          if (json.data !== undefined)
            setstrsrc('/static/icons/imagesGreen.jpg');
          else
            setstrsrc('/static/icons/imagesRed.jpg');
        })
    }, [])
    // console.log(lists);
  }
  catch (err) {
    console.error(err);
    setstrsrc('/static/icons/imagesRed.jpg');
  }

  const DeviceClick = (N, S) => {
    setOpen(false);
    // 對機器測試連線
    const url = `/webapi/API/Device/Call?No=${S}`;
    fetch(url, {
      method: "POST",
    })

      .then(response => response.json())
      .then(json => {
        setLists(json);
        if (json.data !== undefined)
          setstrsrc('/static/icons/imagesGreen.jpg');
        else
          setstrsrc('/static/icons/imagesRed.jpg');
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        setstrsrc('/static/icons/imagesRed.jpg');
      })

    ParentContext.updateF({ Serial: S, Name: N });

  };

  return (
    <>
      <Box component="img" alt="Yeah" src={strsrc} sx={{ width: 28, mr: 0 }} />
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
        <img src="/static/icons/server.jpg" alt={Device[0].label} />
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
          {Device.map((option) => (
            <MenuItem key={option.value} selected={option.value === Device[0].value} onClick={() => DeviceClick(option.label, option.Serial)}>
              <Box component="img" alt={option.label} src="/static/icons/server2.jpg" sx={{ width: 28, mr: 2 }} />

              {option.label}
            </MenuItem>
          ))}

        </Stack>
      </MenuPopover>
    </>
  );
}
