import { useRef, useState } from 'react';
import { Link as RouterLink} from 'react-router-dom';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
// import UserContext from '../../../pages/UserContext';

import Iconify from '../../../components/Iconify';


// ----------------------------------------------------------------------

export default function UserMoreMenu(para) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
// console.log(para);
/* <MenuItem sx={{ color: 'text.secondary' }} >
<ListItemIcon>
  <Iconify icon="eva:trash-2-outline" width={24} height={24} />
</ListItemIcon>
<ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
</MenuItem> */
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        

        <MenuItem component={RouterLink}  to={`/dashboard/UserEdit/id=${para.data.no}&no=${para.data.name}&active=${para.data.active}&device1=${para.data.device[0]}&device2=${para.data.device[1]}`} sx={{ color: 'text.secondary' }} >
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="編輯" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
