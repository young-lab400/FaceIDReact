import { useNavigate, useParams, } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Box, Stack, Checkbox } from '@mui/material';
// @mui
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
// import { RegisterForm } from '../sections/auth/register';
// import AuthSocial from '../sections/auth/AuthSocial';
// form
// components
import { FormProvider, RHFTextField, RHFCheckbox } from '../components/hook-form';
import MacContext from '../layouts/dashboard/createContext';
// import { reject } from 'lodash';



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
  const [MesageText, setMsg] = useState('修改成功');
  const { vertical, horizontal, open } = Mesageopen;
  // const [checked, setChecked] = useState(true);
  // const handleChange = () => {
  // setChecked(current => !current);
  // };


  const navigate = useNavigate();
  const { paras } = useParams();
  let no = '';
  let name = '';
  let active = false;
  let front = false;
  let after = false;

  // console.log(paras);
  if (paras !== undefined) {
    const st = paras.split('&');
    no = st[0].split('=')[1];
    name = st[1].split('=')[1];
    active = st[2].split('=')[1] === "true";
    front = st[3].split('=')[1] === "245DFC6BDEF6";
    after = st[4].split('=')[1] === "245DFC6BDEF7";
  }

  const [lists, setLists] = useState([])
  try {
    const url = '/webapi/api/member/getNo';
    useEffect(() => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ No: no, Name: "" }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(json => {
          setLists(json);

        })

    }, [])

  }
  catch (err) {
    console.error(err);
  }

  const ParentContext = useContext(MacContext);

  const RegisterSchema = Yup.object().shape({
    No: Yup.string().required('No required'),
    Name: Yup.string().required('Name required')
  });

  const defaultValues = {
    No: no,
    Name: name,
    Active: active,
    Device1: front,
    Device2: after
  };
  // console.log(lists);
  // console.log(defaultValues);

  // defaultValues.Active = {lists.active>0 ? true:false};

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
    setMOpen({
      open: false, vertical: 'bottom',
      horizontal: 'right'
    });
  };
  async function MemberUpAndPicUp(data) {
    const memberUp = () => {

      // 修改人員
      console.log(data);
      // const S = ParentContext.data.Serial;
      // const url = `/webapi/api/member/Up?No=${S}`;
      const url = `/webapi/api/member/Up`;
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ No: data.No, Name: data.Name, Active: data.Active, device1: data.Device1, device2: data.Device2 }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => {
          if (res.OK)
            res.json().then(json => {
              if (json.success === "true")
                setMsg("人員新增成功");
              else
                setMsg("人員新增失敗");
              // resolve(new Error("操作成功"));
            })

        })

        .catch((error) => {
          console.log(error);
          setMsg("人員修改失敗");
          // reject(new Error("something bad happened"));
          // setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
        })
    };
    const PicUp = () => {
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
          // console.log("Called", reader);
          baseURL = reader.result.split(',')[1];
          // console.log(baseURL);
          // 上傳照片
          // const S = ParentContext.data.Serial;
          // const url2 = `/webapi/api/member/PicUp?DeviceNo=${S}`;
          const url2 = `/webapi/api/member/PicUp`;
          fetch(url2, {
            method: "POST",
            body: JSON.stringify({ No: data.No, PicNo: 1, strbase64: baseURL }),
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(res => {
              if (res.OK)
                res.json().then(json => {
                  if (json.success === "true")
                    setMsg("照片上傳成功");
                  else
                    setMsg("照片上傳失敗");
                  // resolve("操作成功");
                })

            })

            .catch((error) => {
              // console.log(error);
              setMsg("照片上傳失敗");
              // reject(new Error("something bad happened"));
              // setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
            })
        }
        
      }
      // resolve("操作成功");
    };

    await memberUp();
    await PicUp();
  // 機器同步
  const url3 = `/webapi/api/member/Sync`;
  // console.log(data.Active);
  fetch(url3, {
    method: "POST",
    body: JSON.stringify({ No: no, Name: name, Active: active, device1: front, device2: after }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((data) => {
      if (data.ok) {
        console.log("機器同步成功");
        setMsg("機器同步成功");
         setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
      }
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      setMsg("機器同步失敗");
       setMOpen({open: true,vertical: 'bottom', horizontal: 'right'});
    })
    // Promise.all([memberUp(data), PicUp(data)])
  };

  const onSubmit = (data) => {
    MemberUpAndPicUp(data).then(
      (result) => {
      
      })
    setMOpen({ open: true, vertical: 'bottom', horizontal: 'right' });
    // navigate('/dashboard/User', { replace: true });
  };
  const sync = () => {
   
  };
  // const isItemSelected = lists.active;
  // <input
  //             type="checkbox"
  //             defaultChecked={false}
  //             value={lists.active}
  //             onChange={handleChange}
  //             id="subscribe"
  //             name="subscribe"
  //           />
  return (
    <Page title="UserEdit">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="No" label="工號" disabled />
              <RHFTextField name="Name" label="姓名" />
            </Stack>
            <input type="file" name="file" onChange={changeHandler} />
            <RHFCheckbox name="Active" label="帳號是否啟用" value={active} />
            <RHFCheckbox name="Device1" label="前門" value={front} />
            <RHFCheckbox name="Device2" label="後門" value={after} />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
              修改
            </LoadingButton>
            
            <input type="button" value="同步" onClick={sync} />
            <Stack spacing={0.75}>
              <Box component="img" alt="照片" src={`data:image/jpeg;base64,${lists.pic1}`} sx={{ width: 280, mr: 2 }} />
            </Stack>
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
