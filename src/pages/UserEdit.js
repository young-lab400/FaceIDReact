import { Link as RouterLink,useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography ,Stack, IconButton, InputAdornment} from '@mui/material';
// @mui
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useState,useRef,useContext  } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import { FormProvider, RHFTextField,RHFCheckbox } from '../components/hook-form';
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
  const ParentContext = useContext(MacContext);
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    navigate('/dashboard', { replace: true });
  };

  

  

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

  const [name, setName] = useState("");
  const nameChange = (event) => {
    setName(event.target.value);
  };
  const [no, setno] = useState("");
  const noChange = (event) => {
    setno(event.target.value);
  };
  const [checked1, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

 // const [Device1, setDevice1] = useState("");
  const Device1Change = (event) => {

    if (event.target.value === false)
      setChecked(true);
    else
      setChecked(false);
  };

  // const [Device2, setDevice2] = useState("");
  const Device2Change = (event) => {
 
    if (event.target.value === false)
    setChecked2(true);
  else
    setChecked2(false);
  };


	const handleSubmission = () => {
    // 新建人員
    const S = ParentContext.data.Serial;
    const url = `/webapi/api/member/Cr?No=${S}`;
    fetch(url,{
      method: "POST",
      body:JSON.stringify({No: no, Name: name}),
      headers: {
       'Content-Type': 'application/json',
      }
  })
  .then(async (data) => {
    if(data.ok)
    {
      console.log("會員新增成功");
    }
  } )
  .catch((error) => {
      console.log(`Error: ${error}`);
  })
  // 照片  Tobase64
  // const formData = new FormData();
  // formData.append('File', selectedFile);

  let baseURL = "";
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(selectedFile);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      console.log("Called", reader);
      baseURL = reader.result;
      console.log(baseURL);
      
    };

// 照片上傳
const url2 = `/webapi/API/member/PicUp?DeviceNo=${S}`;
fetch(url2,{
  method: "POST",
  body:JSON.stringify({No: no, PicNo:1,strbase64: baseURL}),
  headers: {
    'Content-Type': 'application/json',
   }
})
.then(async (data) => {
  if(data.ok)
  {
    console.log("照片上傳成功");
  }
} )
.catch((error) => {
    console.log(`Error: ${error}`);
})



  

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
          <RHFTextField name="No" label="工號" onChange={noChange}/>
          <RHFTextField name="Name" label="姓名" onChange={nameChange}/>
        </Stack>
        <Label>            
          第一張照片
        </Label>
        <input type="file"  name="file" onChange={changeHandler} />
        <RHFCheckbox name="Device1" label="前門" checked={checked1} value="123" onChange={Device1Change}/>
        <RHFCheckbox name="Device2" label="後門" checked={checked2} value="132" onChange={Device2Change}/>
        
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} onClick={handleSubmission}>
          註冊
        </LoadingButton>
      </Stack>
    </FormProvider>

      </RootStyle>
    </Page>
  );
}
