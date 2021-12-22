import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';

// Material UI
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { InputAdornment, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import { forwardRef } from "react";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Files
import { context, URL } from './App.js';
import './App.css';
import './Responsive.css'


// Sign Up Component
function Signup() {
  const { history } = useContext(context);
  const [progress, setProgress] = useState(0);  // Progress Bar

  // Snackbar 
  const [Message, setMessage] = useState(''); // Server Message
  // Snack bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
   // Snack bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // Validation
  let validation = yup.object({
    Firstname: yup.string().required('Required Field'),
    Lastname: yup.string().required('Required Field'),
    Username: yup.string().required('Required Field'), // eslint-disable-next-line
    Mailid: yup.string().required('Required Field').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must Be a Valid Email'),
    Password: yup.string().min(8, 'Minimum 8 Characters Required').required('Required Field')
  });

  const { handleChange, handleSubmit, handleBlur, errors, values, touched } = useFormik(
    {
      initialValues: { Firstname: '', Lastname: '', Username: '', Mailid: '', Password: '' },
      validationSchema: validation,
      onSubmit: (newUser) => { signUp(newUser); setProgress(1); }
    }
    // Onsubmit signup function called & progress bar is rendered 
  );

  // Password Icon Functionality
  const [text, setText] = useState('Show');
  const [visible, setVisible] = useState('password');
  const icon = (visible === 'password') ? <VisibilityIcon /> : <VisibilityOffIcon />;
  const visibility = () => {
    setVisible((visible) => (visible === 'password') ? 'text' : 'password');
    setText((text) => (text === 'Show') ? 'Hide' : 'Show');
  };

  // API Request to create new user
  const signUp = (newUser) => {
    setMessage(() => '');
    axios({
      url: `${URL}/signup`,
      method: 'POST',
      data: newUser,
    }).then((x) => { setMessage({ msg: x.data, result: 'success' }); }) // Snackbar opens with server msg 
      .catch((error) => (setMessage({ msg: error.response.data, result: 'error' }))).then(()=>handleClick()).then(() => setProgress(0));
  };
  
  return (<div className="signup">
    {/* Progress Bar rendered based on condition */}
    {(progress === 1) && <CircularProgress id='signupprogress' color='success'></CircularProgress>}
    {/* Heading */}
    <div className='headingcontainer'>
      <p className='heading'>U R L S H O R T E N E R</p>
      <p className='subheading'>Simplify your links, customize 	&amp; manage them</p>
    </div>
    {/* Signup card */}
    <Card className='signupcontainer'>
      <form onSubmit={handleSubmit}>


        <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} error={errors.Firstname && touched.Firstname} value={values.Firstname}
          helperText={errors.Firstname && touched.Firstname && errors.Firstname} className='signupfield' name='Firstname' id='Firstname' color='success' 
          label='FirstName' type='text' placeholder="Enter the FirstName" /><br />

        <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} error={errors.Lastname && touched.Lastname} value={values.Lastname}
          helperText={errors.Lastname && touched.Lastname && errors.Lastname} className='signupfield' name='Lastname' id='Lastname' color='success'
          label='LastName' type='text' placeholder="Enter the LastName" /><br />

        <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} error={errors.Username && touched.Username} value={values.Username}
          helperText={errors.Username && touched.Username && errors.Username} className='signupfield' name='Username' id='Username' color='success'
          label='UserName' type='text' placeholder="Enter the UserName" /><br />

        <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} error={errors.Mailid && touched.Mailid} value={values.Mailid}
          helperText={errors.Mailid && touched.Mailid && errors.Mailid} className='signupfield' name='Mailid' id='Mailid' color='success' 
          label='Email' type='text' placeholder="Enter Email" /><br />

        <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} error={errors.Password && touched.Password} value={values.Password}
          helperText={errors.Password && touched.Password && errors.Password} className='signupfield' name='Password' id='Password' color='success' 
          label='Password' type={visible} placeholder="Enter the Password"
          InputProps={{
            endAdornment: (<InputAdornment position="start">
              <Tooltip title={text}>
                <IconButton onClick={() => visibility()}>
                  {icon}
                </IconButton>
              </Tooltip>
            </InputAdornment>
            ),
          }} /><br /><br />
        <Button type='submit' variant="contained" className='signupfieldbutton' color='success'>Get Started</Button><br /><br />
      </form>

      <div className='signuplogincontainer'>
        <label className='account'>Have An Account?</label>
        <Button type='submit' className='signuploginbutton' variant="contained" color='primary' onClick={() => history.push('/')}>Login</Button>
      </div>

    </Card>
    {/* Snack Bar */}
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>

  </div>);

}



// Login
 function Login() 
 {
  const { history,setToken, result, setResult, setStatuscode, setStatus } = useContext(context);

  const [progress, setProgress] = useState(0);  // Progress Bar
  // eslint-disable-next-line
  useEffect(() => { setStatus('Offline'); setResult(''); }, []);  // To prevent back button by setting offline status
 
  const [Message, setMessage] = useState('');   // Server Message
  // Snack bar open/close status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
    // Snack bar open/close function
  const handleClick = () => { setOpen(true); setProgress(0) };
  const handleClose = () => { setOpen(false); };

  // Password functionality
  const [text, setText] = useState('Show');
  const [visible, setVisible] = useState('password');
  const icon = (visible === 'password') ? <VisibilityIcon /> : <VisibilityOffIcon />;
  const visibility = () => {
    setVisible((visible) => (visible === 'password') ? 'text' : 'password');
    setText((text) => (text === 'Show') ? 'Hide' : 'Show');
  };

  // Validation
  let validation = yup.object({ // eslint-disable-next-line
    Mailid: yup.string().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must Be a Valid Email').required('Required Field'),
    Password: yup.string().min(8, 'Minimum 8 Characters Required').required('Required Field')
  });

  const { handleBlur, handleSubmit, handleChange, errors, touched, values } = useFormik({
    initialValues: { Mailid: '', Password: '' },
    validationSchema: validation,
    onSubmit: (userData) => {login(userData);setProgress(1)}
  });

  // Login Request
  const login = (userData) => {
    axios({
      url: `${URL}/login`,
      method: 'POST',
      data: userData
    }).then((response) => setResult(() => response)).then(() => {history.push('/Dashboard');setProgress(0)})
      .catch((error) => (setMessage({ msg: error.response.data, result: 'error' }))).then(handleClick)
  };
// Only if the login status is successful,the page leads to dashboard or it shows error msg 
// The response consists of token,which is used to get user data

  if (result) 
  {
    // If login success
    setToken(() => result.data.token); //  token
    setStatuscode(() => result.status); // (status===200)
    setStatus(() => 'Online'); //  (status==='Online)
  }

  return (<div className='login'>

    <div className='headingcontainer'>
      <p className='heading'>U R L S H O R T E N E R</p>
      <p className='subheading'>Simplify your links, customize 	&amp; manage them</p>
    </div>

    <Card className='logincontainer'>
      <form onSubmit={handleSubmit}>

        <TextField onChange={handleChange} onBlur={handleBlur} error={errors.Mailid && touched.Mailid} value={values.Mailid}
          helperText={errors.Mailid && touched.Mailid && errors.Mailid} name='Mailid' id='Mailid' label="Email" variant="outlined"
          type='text' fullWidth className='loginfield' placeholder="Enter Email" /><br />

        <TextField onChange={handleChange} onBlur={handleBlur} error={errors.Password && touched.Password} value={values.Password}
          helperText={errors.Password && touched.Password && errors.Password} className='loginfield' name='Password' id='Password' 
          label="Password" variant="outlined" type={visible} fullWidth placeholder="Enter the Password"
          InputProps={{
            endAdornment: (<InputAdornment position="start">
              <Tooltip title={text}>
                <IconButton onClick={() => visibility()}>
                  {icon}
                </IconButton>
              </Tooltip>
            </InputAdornment>
            ),
          }} /><br /><br />
          
        <Button type='submit' variant="contained" color='primary' className='loginbutton' fullWidth>Login</Button><br /><br />
      </form>
                  
      <div className='forgotsignupbutton'> {/* forgot password button,Signup Button */}
        <Button type='submit' color='error' onClick={() => history.push('/forgotpassword')}>Forgot Password?</Button>
        <Button type='submit' id='signup' color='success' variant="contained" onClick={() => history.push('/signup')}>Sign Up</Button>
      </div>
    </Card>
    {(progress === 1) && <CircularProgress id='loginprogress' color='primary'></CircularProgress>}

    {/* Snack Bar */}
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>

  </div>);
}


// Forgot Password Page
 function Forgotpassword() {

  const { history } = useContext(context);
  // snack Bar
  const [Message, setMessage] = useState(''); // Server Message
  // Snack Bar Open/Close status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const [progress, setProgress] = useState(0); // Progress Bar

  // Validation
  let validation = yup.object({
    Mailid: yup
      .string()  // eslint-disable-next-line
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Must Be a Valid Email")
      .required("Required Field"), 
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } = useFormik({
    initialValues: { Mailid: '' },
    validationSchema: validation,
    onSubmit: (userData) => { forgotpassword(userData); setProgress(1); }
  });

  const forgotpassword = (userData) => {
    axios({
      url: `${URL}/forgotpassword`,
      method: 'POST',
      data: userData
    }).then((x) => { setMessage({ msg: x.data, result: 'success' }); }).then(() => { setProgress(0); history.push('/message'); })
      .catch((error) => { setProgress(0); setMessage({ msg: error.response.data, result: 'error' }); }).then(handleClick);
  };
  // If the user is verified it display success Message component
  // else the snackbar  displays error message

  return (
  <div className='forgotcontainer'>

    <Card className="forgotpassword">
      <h4>Forgot Password!!!</h4>

      <form onSubmit={handleSubmit}>

        <TextField type='text' onChange={handleChange} onBlur={handleBlur} name='Mailid' id='Mailid' className='forgotfield'
          error={errors.Mailid && touched.Mailid} value={values.Mailid} helperText={errors.Mailid && touched.Mailid && errors.Mailid}
          label="Email" fullWidth variant="outlined" placeholder="Enter Email" /><br /><br />

        <Button type='submit' variant="contained" className='forgotsubmitbutton' fullWidth color='primary'>Submit</Button><br /><br />
      </form>

      <Button type='submit' onClick={() => history.goBack()} className='forgotbackbutton' variant="contained" color='warning'>Back</Button>
    </Card>
    {/* Condional Rendering after submit */}
    {(progress === 1) && <CircularProgress id='forgotprogress' color='primary'></CircularProgress>}

    {/* Snack Bar */}
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>
  </div>);
}


// Change Password
function Changepassword() {

 
  const [progress, setProgress] = useState(0);  // Progress Bar
  // From the url
  const { id: token } = useParams();
  const { history } = useContext(context);

  // Snack bar
  const [Message, setMessage] = useState(''); // Server Message
  // Snackbar open/close status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snackbar open/close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // Password Functionality
  const [text, setText] = useState('Show');
  const [visible, setVisible] = useState('password');
  const icon = (visible === 'password') ? <VisibilityIcon /> : <VisibilityOffIcon />;
  const visibility = () => {
    setVisible((visible) => (visible === 'password') ? 'text' : 'password');
    setText((text) => (text === 'Show') ? 'Hide' : 'Show');
  };

  // Validation
  let validation = yup.object({
    Password: yup.string().min('8', 'Minimum 8 Characters Required').required('Required Field')
  });
  const { handleSubmit, handleChange, handleBlur, errors, values, touched } = useFormik({
    initialValues: { Password: '', token },
    validationSchema: validation,
    onSubmit: (userData) => { changepassword(userData); setProgress(1); }
  });

  // onsubmit change password function called,if any error happens snackbar shows error message else it redirects to login page
  // for both error or success progress bar will be rendered

  const changepassword = (userData) => { 
    // Change Password
    axios({
      url: `${URL}/changepassword`,
      method: 'POST',
      data: userData,
    }).then((x) => { setMessage({ msg: x.data, result: 'success' }); })
      .catch((error) => (setMessage({ msg: error.response.data, result: 'error' }))).then(handleClick);

  };

  if (Message.result === 'success') {
    // if Server message is success in 5 Seconds it redirects to Login page
    setTimeout(() => {
      history.push('/');
    }, 5000);
  }
  if (Message.result === 'error') {
    // if Server message is success in 3 Seconds it redirects to Message
    setTimeout(() => {
      history.push('/errmessage');
    }, 3000);
  }
 
  return (
    <div className='changepasswordcontainer'>

      <Card className="changepassword">
        <h4>Change Password!!!</h4>

        <form onSubmit={handleSubmit}>

          <TextField type={visible} error={errors.Password && touched.Password} value={values.Password}
            helperText={errors.Password && touched.Password && errors.Password} onChange={handleChange} onBlur={handleBlur}
            name="Password" id="Password" label="Password" className='changepasswordfield' fullWidth variant="outlined" placeholder="Enter the Password"
            InputProps={{
              endAdornment: (<InputAdornment>
                <Tooltip title={text}>
                  <IconButton onClick={() => visibility()}>
                    {icon}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
              ),
            }} /><br /><br />

          <Button type='submit' variant="contained" fullWidth className='changepasswordbutton' color='warning'>Change Password</Button>
        </form>

      </Card>
      {/* Progress bar rendered after clicking change password button */}
      {(progress === 1) && <CircularProgress id='changepasswordprogress' color='warning'></CircularProgress>}

      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: '100%' }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>

    </div>);
}


export  { Login, Signup, Forgotpassword, Changepassword } 