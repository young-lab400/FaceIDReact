import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Stack, IconButton, InputAdornment } from '@mui/material';
// @mui
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useState, useRef, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Snackbar from '@mui/material/Snackbar';
import Label from '../components/Label';

// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
// import { RegisterForm } from '../sections/auth/register';
// import AuthSocial from '../sections/auth/AuthSocial';
// form
// components
import Iconify from '../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../components/hook-form';
import MacContext from '../layouts/dashboard/createContext';

// ----------------------------------------------------------------------


const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------



export default function Register() {
  const [Mesageopen, setMOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const [MesageText, setMsg] = useState('新增成功');
  const { vertical, horizontal, open } = Mesageopen;

  const navigate = useNavigate();
  const ParentContext = useContext(MacContext);

  const RegisterSchema = Yup.object().shape({
    No: Yup.string().required('No required'),
    Name: Yup.string().required('Name required')
  });

  const defaultValues = {
    No: '',
    Name: '',
    Device1: false,
    Device2: false
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [selectedFile, setSelectedFile] = useState();
  // const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    // setIsFilePicked(true);
  };
  const handleClose = () => {
    setMOpen({open: false,vertical: 'bottom',
    horizontal: 'right'});
 };
  const onSubmit = async (data) => {
    console.log(data.No);
    console.log(data.Name);
    console.log(data.Device1);
    console.log(data.Device2);

    // 新建人員
    // const S = ParentContext.data.Serial;
    // const url = `/webapi/api/member/Cr?No=${S}`;
    const url = `/webapi/api/member/Cr`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ No: data.No, Name: data.Name }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((data) => {
        if (data.ok) {
          console.log("會員新增成功");
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      })
    // 照片  Tobase64
    // const formData = new FormData();
    // formData.append('File', selectedFile);
    let baseURL = "";
    if (selectedFile !== undefined) {
      // Make new FileReader
      const reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(selectedFile);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result.split(',')[1];
        console.log(baseURL);
        // 上傳照片
        // const S = ParentContext.data.Serial;
        const url2 = `/webapi/api/member/PicUp`;
        fetch(url2, {
          method: "POST",
          body: JSON.stringify({ No: data.No, PicNo: 1, strbase64: baseURL }),
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then((data) => {
            if (data.ok) {
              console.log("照片上傳成功");
            }
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          })

      }

    }

    // 機器同步
    const url3 = `/webapi/api/member/SyncCr`;
    fetch(url3, {
      method: "POST",
      body: JSON.stringify({ No: data.No,Name: data.Name, Active:data.Active,device1:data.Device1,device2:data.Device2}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((data) => {
        if (data.ok) {
          console.log("機器同步成功");
          setMsg("機器同步成功");
          // setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        setMsg("機器同步失敗");
        // setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
      })


    setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
    // navigate('/dashboard/user', { replace: true });
  };


  return (
    <Page title="UserEdit">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="No" label="工號" />
              <RHFTextField name="Name" label="姓名" />
            </Stack>
            <input type="file" name="file" onChange={changeHandler} />
            <RHFCheckbox name="Device1" label="前門" />
            <RHFCheckbox name="Device2" label="後門" />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
              註冊
            </LoadingButton>

          </Stack>
        </FormProvider>
  
        <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={MesageText}
        key={vertical + horizontal}
      />

      </RootStyle>
    </Page>
  );
}
