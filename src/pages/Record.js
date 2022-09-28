import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useEffect,useState } from 'react';
import { Link as RouterLink  } from 'react-router-dom';

// material
import {
  Card,
  Table,
  Stack,
  // Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
// import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbarCustom, UserMoreMenu } from '../sections/@dashboard/user';
// import UserEdit from './UserEdit';
// import MacContext from '../layouts/dashboard/createContext';
// 人員選擇暫存
// import UserContext from './UserContext';

// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: '序號', alignRight: false },
  { id: 'no', label: '工號', alignRight: false },
  { id: 'name', label: '姓名', alignRight: false },
  { id: 'time', label: '刷卡時間', alignRight: false },
  { id: 'tempcen', label: '量測體溫', alignRight: false },
  
];

// ----------------------------------------------------------------------

 



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => ((_user.no.toLowerCase().indexOf(query.toLowerCase()) !== -1)||(_user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1))  );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Record() {

  const [lists, setLists] = useState([])
 
   try{
  useEffect(() => {
   fetch(`/webapi/api/DBTERMINAL`)
    .then(res => res.json())
     .then(json => {setLists(json);
      setfilteredUsers(applySortFilter(json, getComparator(order, orderBy), filterName));})
   }, [])
   // console.log(lists);
   }
   catch (err) {
     console.error(err);
   }


  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filteredUsers,setfilteredUsers ] = useState([]);

 


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = lists.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  
  const SearchClick = () => {

    try{
      const url = '/webapi/api/DBTERMINAL/No';
      
        fetch(url, {
          method: "POST",
          body: JSON.stringify({ id: filterName}),
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(res => res.json())
          .then(json => {setLists(json);
          setfilteredUsers(applySortFilter(json, getComparator(order, orderBy), filterName));}
          )
      }
      catch (err) {
        console.error(err);
      }
      
     
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - lists.length) : 0;

  // const filteredUsers = applySortFilter(lists, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  // const [User,updateId] = useState({No:"SP3060",Name:"廖健智",Active:true});
 
  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            刷卡紀錄
          </Typography>
          
        </Stack>

        <Card>
          <UserListToolbarCustom txtplaceholder='工號搜尋' numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          
          <Button fullWidth size="large" type='submit' variant="contained" onClick={SearchClick}>
            Search
          </Button>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={USERLIST.length}
                  rowCount={lists.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const { id, name, role, status, company, avatarUrl, isVerified } = row;
                    const { id, no, name,time,tempcen } = row;
                    
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell align="left">{id}</TableCell>
                        
                        <TableCell align="left">{no}</TableCell>
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">{time}</TableCell>
                        <TableCell align="left">{tempcen}</TableCell>
                        
                      </TableRow>
                      
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            // count={USERLIST.length}
            count={lists.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        
      </Container>
    </Page>
  );
}
