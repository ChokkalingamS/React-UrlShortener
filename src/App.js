
import './App.css';
import './Responsive.css'
import{Switch,Link,Route,useHistory,useParams,Redirect} from "react-router-dom";
import axios from "axios";
import {useState,useContext,createContext,useEffect} from "react";
import {useFormik} from 'formik';
import * as yup from 'yup';

// Material UI

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';

// Card
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { InputAdornment,Tooltip} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { InputGroup} from 'react-bootstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Dialog Box
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {forwardRef} from "react";

// More Info
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Dark Mode
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import Paper from '@mui/material/Paper';

// Stack Bar
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


export default function App()
{
 
  return <div> <Container/></div> 
        
}

// Server
// const URL=`http://localhost:1000/users`
const URL=`https://url-shor-t-ner.herokuapp.com/users`
const context=createContext('')

function Container()
{
    const [token,setToken]=useState('')
    const [result,setResult]=useState(null)
    const [Statuscode,setStatuscode]=useState(null)
    const [Status,setStatus]=useState('Offline')
   
console.log(Status);
    const history=useHistory()
    // Profile UserName
    const [Name,setName]=useState(null)
    // Theme
    let [themeChange,setThemechange]=useState('dark')
    const lightMode=<Tooltip title='Light Mode'><LightModeIcon style={{fill:'gold'}}/></Tooltip>
    const darkMode=<Tooltip title='Dark Mode'><DarkModeIcon style={{fill:'white'}}/></Tooltip>
    const themeIcon=<IconButton onClick={()=>setThemechange((themeChange)=>(themeChange==='dark')?'light':'dark')}>{(themeChange==='light')?darkMode:lightMode}</IconButton>
    const theme = createTheme({
      palette: {mode:themeChange},
    });

    let obj={history,token,setToken,result,setResult,Statuscode,setStatuscode,Status,setStatus,Name,setName,themeChange}

    return (<div className="Body">
        <context.Provider value={obj}>
        <Switch>
            <Route exact path='/'><Login/></Route>
            <Route path='/signup'><Signup/></Route>
            <Route path='/forgotpassword'><Forgotpassword/></Route>
            <Route path='/changepassword/:id'><Changepassword/></Route>
            <Route path='/vermessage'><Message msg='Account Activated'/></Route>
            <Route path='/message'><Message msg='Mail Sent To The Registered Email'/></Route>
            
            
            <>
            <ThemeProvider theme={theme}>
                <Paper elevation={0} style={{borderStyle:"none",minHeight:"100vh"}}>
                  
            <Navbar themeIcon={themeIcon}/>
            <Route exact path='/Dashboard'>{(Statuscode===200&&Status==='Online')?<Dashboard/>:<Redirect to={'/'}/> }</Route>
            <Route path='/userdata'>{(Statuscode===200&&Status==='Online')?<Userdatas/>:<Redirect to={'/'}/> }</Route>
            <Route path='/updatedata/:id'>{(Statuscode===200&&Status==='Online')?<Update/>:<Redirect to={'/'}/> }</Route>
            {/* <div style={{backgroundColor:'black',height:'3rem',width:'100%',marginTop:'-2rem'}}><p>URL Shortener</p></div> */}
        
            </Paper>
            </ThemeProvider>
            </>
           
        </Switch>
        </context.Provider>
        
    </div>)
}

function Navbar({themeIcon})
{
    const {Name,setStatus}=useContext(context)
    // console.log(Name);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return( 
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" id='nav'>
        <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
        <Button color="inherit"><Link className="link" to="/Dashboard">Home</Link></Button>
        <Button color="inherit"><Link className="link" to="/userdata">Url</Link></Button>

        <Tooltip title={(Name)?Name:''}><IconButton className='avatar' onClick={handleClick}><AccountCircleIcon style={{fill:'white'}} /></IconButton></Tooltip>
        
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button',}}>
          <MenuItem>My Profile</MenuItem>
          {/* {(Name)?<MenuItem>Status:{Name.Status}  <InsertEmoticonIcon style={{fill:'gold'}}/></MenuItem>:''} */}
        <MenuItem onClick={()=>{window.location.reload(false);handleClose();localStorage.clear();setStatus('Offline')}}>Log Out</MenuItem>
        </Menu>
        {themeIcon}
        </Typography>
        </Toolbar>
        </AppBar>
        </Box> 
        )
}

function Signup()
{
    const {history}=useContext(context)
    const [progress,setProgress]=useState(0)
    
    // Server Error Message
    const [Message,setMessage]=useState('')
    const [open, setOpen] = useState(false);
    const Alert = forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClick = () => {setOpen(true);};
    const handleClose = () => {setOpen(false);};
    
    // Validation
    let validation=yup.object({
      Firstname:yup.string().required('Required Field'),
      Lastname:yup.string().required('Required Field'),
      Username:yup.string().required('Required Field'),
      Mailid:yup.string().required('Required Field').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Must Be a Valid Email'),// eslint-disable-line
      Password:yup.string().min(8,'Minimum 8 Characters Required').required('Required Field')
    })

    const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
      {
        initialValues:{Firstname:'',Lastname:'',Username:'',Mailid:'',Password:''},
        validationSchema:validation,
        onSubmit:(newUser)=>{signUp(newUser);setProgress(1)}
      }
    )

    // Password Functionality
    const [text,setText]=useState('Show')
    const [visible,setVisible]=useState('password')
    const icon=(visible==='password')?<VisibilityIcon/>:<VisibilityOffIcon/>
    const visibility=()=>{
        setVisible((visible)=>(visible==='password')?'text':'password');
        setText((text)=>(text==='Show')?'Hide':'Show')
    }
    
    // API Request
    const signUp=(newUser)=>{
      setMessage(()=>'')
            axios({
                url:`${URL}/signup`,
                method:'POST',
                data:newUser,    
            }).then((x)=>{setMessage({msg:x.data,result:'success'})})
            .catch((error)=>(setMessage({msg:error.response.data,result:'error'}))).then(handleClick).then(()=>setProgress(0))
    }
  
    
    // const loadingstyle={marginLeft:'47rem',marginBottom:'-32rem',marginTop:'0rem',position:"absolute",zindex:1} 

    return (<div className="signup">
              {(progress===1)&&<CircularProgress  id='signupprogress' color='success'></CircularProgress>}
            <div  className='headingcontainer'>
                <p className='heading' >U R L S H O R T E N E R</p>
                <p className='subheading'>Simplify your links, customize 	&amp; manage them</p>
            </div>

            

            <Card className='signupcontainer'>
            <form onSubmit={handleSubmit}>
            

            <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur}  error={errors.Firstname && touched.Firstname}    value={values.Firstname}
            helperText={errors.Firstname && touched.Firstname &&errors.Firstname}  className='signupfield' name='Firstname' id='Firstname' color='success' label='FirstName' type='text'    placeholder="Enter the FirstName"/><br/>
            
            <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur}  error={errors.Lastname && touched.Lastname}    value={values.Lastname}
            helperText={errors.Lastname && touched.Lastname &&errors.Lastname}  className='signupfield' name='Lastname'  id='Lastname'  color='success' label='LastName'  type='text'    placeholder="Enter the LastName"/><br/>
            
            <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur}  error={errors.Username && touched.Username}    value={values.Username}
            helperText={errors.Username && touched.Username &&errors.Username} className='signupfield' name='Username'  id='Username'  color='success' label='UserName'  type='text'    placeholder="Enter the UserName"/><br/>
            
            <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur}  error={errors.Mailid && touched.Mailid}    value={values.Mailid}
            helperText={errors.Mailid && touched.Mailid &&errors.Mailid} className='signupfield' name='Mailid'    id='Mailid'    color='success' label='Email'     type='text'    placeholder="Enter Email"/><br/>
            
            <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur}  error={errors.Password && touched.Password}    value={values.Password}
            helperText={errors.Password && touched.Password &&errors.Password}  className='signupfield' name='Password'  id='Password'  color='success' label='Password'  type={visible} placeholder="Enter the Password"
             InputProps={{
                endAdornment: ( <InputAdornment>
                <Tooltip title={text}>
                  <IconButton onClick={()=>visibility()}>
                    {icon}
                  </IconButton>
                  </Tooltip>
                  </InputAdornment>
                ),
              }}/><br/><br/>
            <Button type='submit' variant="contained"  className='signupfieldbutton' color='success' >Get Started</Button><br/><br/>
            </form>
            <div className='signuplogincontainer'>
            <label className='account'>Have An Account?</label>
            <Button type='submit' className='signuploginbutton' variant="contained"  color='primary' onClick={()=>history.push('/')}>Login</Button>
            </div>
            </Card>

            <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>
            
    </div>)

}


function Login()
{
    const {history,token,setToken,result,setResult,setStatuscode,setStatus}=useContext(context);
  // eslint-disable-next-line
    useEffect(()=>{setStatus('Offline');setResult('')},[])   
    console.log(result);

    // Server Message
    const [Message,setMessage]=useState('')
    const [open, setOpen] = useState(false);
    const Alert = forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClick = () => {setOpen(true);};
    const handleClose = () => {setOpen(false);};
    
    console.log(token);

  // Validation
  let validation=yup.object({
    Mailid:yup.string().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Must Be a Valid Email').required('Required Field'), // eslint-disable-line
    Password:yup.string().min(8,'Minimum 8 Characters Required').required('Required Field')
  })

  const {handleBlur,handleSubmit,handleChange,errors,touched,values}=useFormik({
    initialValues:{Mailid:'',Password:''},
    validationSchema:validation,
    onSubmit:(userData)=>login(userData)
  })

    // Password
    const [text,setText]=useState('Show')
    const [visible,setVisible]=useState('password')
    const icon=(visible==='password')?<VisibilityIcon/>:<VisibilityOffIcon/>
    const visibility=()=>{
        setVisible((visible)=>(visible==='password')?'text':'password');
        setText((text)=>(text==='Show')?'Hide':'Show')
    }

    
    // Login Request
    const login=(userData)=>{
        axios({
            url:`${URL}/login`,
            method:'POST',
            data:userData
        }).then((response)=>setResult(()=>response)).then(()=>history.push('/Dashboard'))
        .catch((error)=>(setMessage({msg:error.response.data,result:'error'}))).then(handleClick)
      }

            if(result)
            {
                setToken(()=>result.data.token)   //  token
            
                // localStorage.setItem('token',result.data.token) // token
                setStatuscode(()=>result.status) // (status===200)
                setStatus(()=>'Online') //  (status==='Online)

                // console.log('token',token);
                // console.log('Statuscode',Statuscode);
                // console.log('login result',result);
                // console.log('login status',result.status);
            }

    return(<div className='login'>
           
            <div  className='headingcontainer'>
                <p className='heading' >U R L S H O R T E N E R</p>
                <p className='subheading'>Simplify your links, customize 	&amp; manage them</p>
            </div>
            <Card className='logincontainer'>
              <form onSubmit={handleSubmit}>
           <TextField onChange={handleChange} onBlur={handleBlur} error={errors.Mailid && touched.Mailid}    value={values.Mailid}
            helperText={errors.Mailid && touched.Mailid &&errors.Mailid} name='Mailid'   id='Mailid'   label="Email" variant="outlined" 
             type='text' fullWidth className='loginfield'   placeholder="Enter Email"/><br/>
         
          <TextField onChange={handleChange} onBlur={handleBlur} error={errors.Password && touched.Password}    value={values.Password}
            helperText={errors.Password && touched.Password &&errors.Password} className='loginfield'  name='Password' id='Password' label="Password" variant="outlined" type={visible} fullWidth   placeholder="Enter the Password"
                  InputProps={{
                  endAdornment: ( <InputAdornment>
                  <Tooltip title={text}>
                    <IconButton onClick={()=>visibility()}>
                      {icon}
                    </IconButton>
                    </Tooltip>
                    </InputAdornment>
                  ),
                }}/><br/><br/>
          <Button type='submit' variant="contained" color='primary' className='loginbutton' fullWidth >Login</Button><br/><br/>
          </form>
          <div className='forgotsignupbutton'>
          <Button type='submit' color='error'  onClick={()=>history.push('/forgotpassword')}>Forgot Password?</Button>
          <Button type='submit' id='signup' color='success' variant="contained" onClick={()=>history.push('/signup')}>Sign Up</Button>
          </div>
          </Card>
          {/* Snack Bar */}
          <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>
         
    </div>)
}



function Forgotpassword()
{

  const [Message,setMessage]=useState('')
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};


  const {history}=useContext(context);
  const[progress,setProgress]=useState(0)

  let validation=yup.object({
    Mailid:yup.string().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Must Be a Valid Email').required('Required Field') // eslint-disable-line
  })
  const{handleSubmit,handleChange,handleBlur,values,errors,touched}=useFormik({
    initialValues:{Mailid:''},
    validationSchema:validation,
    onSubmit:(userData)=>{forgotpassword(userData);setProgress(1)}
  })



    const forgotpassword=(userData)=>{
        axios({
            url:`${URL}/forgotpassword`,
            method:'POST',
            data:userData
        }).then((x)=>{setMessage({msg:x.data,result:'success'})}).then(()=>{setProgress(0);history.push('/message')})
        .catch((error)=>{setProgress(0);setMessage({msg:error.response.data,result:'error'})}).then(handleClick)
    }

    // const loadingstyle={marginLeft:'41rem',marginBottom:'32rem',marginTop:'-13.5rem',position:"absolute",zindex:1} 

    return (<div className='forgotcontainer'>
           <Card className="forgotpassword">
            <h4>Forgot Password!!!</h4>
            <form onSubmit={handleSubmit}>
         <TextField type='text'  onChange={handleChange} onBlur={handleBlur} name='Mailid' id='Mailid' className='forgotfield'
         error={errors.Mailid && touched.Mailid}    value={values.Mailid} helperText={errors.Mailid && touched.Mailid &&errors.Mailid} 
         label="Email" fullWidth variant="outlined" placeholder="Enter Email"/><br/><br/>
         
         <Button type='submit'  variant="contained" className='forgotsubmitbutton' fullWidth color='primary'>Submit</Button><br/><br/>
         </form>
         <Button type='submit' onClick={()=>history.goBack()} className='forgotbackbutton' variant="contained" color='warning'>Back</Button>
    </Card>
    {(progress===1)&&<CircularProgress id='forgotprogress' color='primary'></CircularProgress>}
        {/* Snack Bar */}
        <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>
    </div>)
}


function Changepassword()
{

  const [progress,setProgress]=useState(0)
   
  const {id:token}=useParams()
  const {history}=useContext(context);

  // Server Message
  const [Message,setMessage]=useState('')
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};

  // Validation
  let validation=yup.object({
    Password:yup.string().min('8','Minimum 8 Characters Required').required('Required Field')
  })
  const{handleSubmit,handleChange,handleBlur,errors,values,touched}=useFormik({
    initialValues:{Password:'',token},
    validationSchema:validation,
    onSubmit:(userData)=>{changepassword(userData);setProgress(1)}
  })


    // Password Functionality
    const [text,setText]=useState('Show')
    const [visible,setVisible]=useState('password')
    const icon=(visible==='password')?<VisibilityIcon/>:<VisibilityOffIcon/>
    const visibility=()=>{
        setVisible((visible)=>(visible==='password')?'text':'password');
        setText((text)=>(text==='Show')?'Hide':'Show')
    }

    // Change Password
    const changepassword=(userData)=>{
        axios({
            url:`${URL}/changepassword`,
            method:'POST',
            data:userData,
    }).then((x)=>{setMessage({msg:x.data,result:'success'})})
    .catch((error)=>(setMessage({msg:error.response.data,result:'error'}))).then(handleClick)
    
    }

    if(Message.result==='success')
    {
      
      setTimeout(() => {
        history.push('/')
      }, 6000);
    }
    // const loadingstyle={marginLeft:'41rem',marginBottom:'32rem',marginTop:'-13.5rem',position:"absolute",zindex:1} 


    // .then(()=>handleClickOpen())
    return(
    <div className='changepasswordcontainer'>
        <Card className="changepassword">
        <h4>Change Password!!!</h4>
        <form onSubmit={handleSubmit}>
        <TextField type={visible} error={errors.Password && touched.Password}    value={values.Password}
            helperText={errors.Password && touched.Password &&errors.Password} onChange={handleChange} onBlur={handleBlur} 
             name="Password" id="Password"  label="Password" className='changepasswordfield' fullWidth variant="outlined" placeholder="Enter the Password"
           InputProps={{
            endAdornment: ( <InputAdornment>
            <Tooltip title={text}>
              <IconButton onClick={()=>visibility()}>
                {icon}
              </IconButton>
              </Tooltip>
              </InputAdornment>
            ),
          }}/><br/><br/>

        <Button type='submit'  variant="contained" fullWidth className='changepasswordbutton' color='warning'>Change Password</Button>
        </form>
        </Card>
        {(progress===1)&&<CircularProgress id='changepasswordprogress' color='warning'></CircularProgress>}
          {/* Snack Bar */}
          <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>
    </div>)
}




function Dashboard()
{
  // Server Message
  const [Message,setMessage]=useState('')
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};

    // Username
    const {setName,token}=useContext(context);
    const [count,setCount]=useState(false)  // Conditional rendering for Custom Url text field 
    const [responseData,setResponseData]=useState(null) // Response
    //  window.history.pushState({}, '',window.location);

      
      const[shortUrl,setShortUrl]=useState('')
    
      // Validation
      let validation=yup.object({
        url:yup.string().required('Required Field'),
        customUrl:yup.string().matches( /^[A-Za-z0-9 ]+$/,'Special Characters Not Allowed').min(5,'Minimum 5 Characters Required') 
      })
      const {handleChange,handleBlur,handleSubmit,values,errors,touched}=useFormik({
        initialValues:{url:'',customUrl:''},
        validationSchema:validation,
        onSubmit:(urlData)=>callDB(urlData)
      })
      
      // Tooltip
      const [text,setText]=useState('Copy')// URL Copy
      const copy=()=>{
        setTimeout(() => {
          setText('Copy')
        }, 1000);
      }

      // const getToken=localStorage.getItem('token')  // Local Storage
      const getToken=token  // Local Storage
      const label = { inputProps: { 'aria-label': 'Checkbox demo' } }; // Check Box
      
      
      const getData=()=>{// Using Token getting the userData 
          axios({
              url:`${URL}/getdata`,
              method:'GET',
              headers:{'x-auth-token':getToken}    
            }).then((responsebody)=>setResponseData(responsebody.data))
      }
      // eslint-disable-next-line
      useEffect(getData,[])
    
    const getUrl=(userData)=>{ // After getting the data Long Url sent to the server & short url is sent back as response 
        axios({
            // url:`http://localhost:1000/urlmaker/url`,
            url:`https://url-shor-t-ner.herokuapp.com/urlmaker/url`,
            method:'POST',
            data  :userData   
          }).then((response)=>response.data).then((x)=>{setShortUrl(x.shortUrl);setMessage({msg:x.Msg,result:'success'})})
          .catch((error)=>setMessage({msg:error.response.data.Msg,result:'error'}))
          .then(handleClick)
      }
      // console.log(Name);

      const callDB=(urlData)=>
      {
      if(responseData)
      {
        // After getting response Mailid destructured
        const {Mailid}=responseData;
        const {url,customUrl}=urlData
        getUrl({Mailid,url,customUrl})    
      }
    }
    
    // Username in App bar
    setName(()=>(responseData)?responseData.Username:'')
      return <div className="dashboard">

                <form onSubmit={handleSubmit}>

               <InputGroup className="mb-3">
               <TextField type='text' variant="outlined" label='Paste The URL' name='url' id='url' onChange={handleChange} onBlur={handleBlur}
               error={errors.url && touched.url}  value={values.url} className='urlbox1' placeholder="Paste the URL"
               helperText={errors.url && touched.url &&errors.url}  />
               
               <Button type='submit' variant="contained" style={{height:'3.5rem'}} color='primary' >Create</Button>
               
               </InputGroup>
               </form><br/>
               
               {(count)&&<>
               <TextField type='text' label='Custom URL' className='urlbox2'   placeholder='Custom URL' name='customUrl' id='customUrl'
                onChange={handleChange} onBlur={handleBlur}  error={errors.customUrl && touched.customUrl}  value={values.customUrl} 
               helperText={errors.customUrl && touched.customUrl &&errors.customUrl}/>
               <br/><br/></>}
               
               <TextField variant="outlined" label='Short Url' color='warning' className='urlbox2'   type='text' value={shortUrl} readOnly   placeholder='Short Url' 
               InputProps={{
                  endAdornment: ( <InputAdornment>
                  <Tooltip title={text}>
                    <IconButton onClick={()=>{navigator.clipboard.writeText(shortUrl);setText((text)=>(text==='Copy')&&'Copied');copy()}}>
                      <ContentCopyIcon/>
                    </IconButton>
                    </Tooltip>
                    </InputAdornment>
                  ),
                }} /><br/>
              <Button type='submit' onClick={()=>{setShortUrl('')}}>Clear Data</Button>
              <Checkbox {...label } onChange={()=>setCount((count)=>!count)} className='customcheckbox' />
              <label className='checkboxtext'>Create Custom URL </label>

                {/* Snack Bar */}
          <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>
          
      </div>    
    
}


function Userdatas()
{
  const{themeChange,history,token}=useContext(context)

  // Server Message
  const [Message,setMessage]=useState('')
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};


    // const getToken=localStorage.getItem('token')
    const getToken=token
    const [userData,setUserData]=useState([])
  
    
    const loadingstyle={marginLeft:'35rem',marginTop:'5rem'} //  Loading
    const linkstyle= {color:(themeChange==='light')&&'#1976d2'}

    const getData=()=>{
        axios({
            url:`${URL}/userdata`,
            method:'GET',
            headers:{'x-auth-token':getToken}    
          }).then((response)=>response).then(({data})=>setUserData(data))
    }
    useEffect(getData,[getToken])
  
    // URL Delete
    const remove=(_id)=>{
      axios({
        // url:`http://localhost:1000/urlmaker/deleteurl/${_id}`,
        url:`https://url-shor-t-ner.herokuapp.com/urlmaker/deleteurl/${_id}`,
        method:'DELETE'
    }).then((response)=>response).then(({data})=>setMessage({msg:data.Msg,result:'success'}))
    .catch((error)=>setMessage({msg:error.response.data.Msg,result:'error'}))
    .then(()=>getData()).then(handleClick)
    }


  return (<div>
         <div className='monthusage'><p>URLS : {(userData.length)}</p></div>
         <div className="urlpage">   
      {(userData.length===0)?<div><p>Loading...</p>
         <CircularProgress style={loadingstyle}></CircularProgress></div>:userData.map(({longUrl,shortUrl,_id,createdAt,usedCount,shortString,lastUpdated,lastVisited})=>{
          return(<Card sx={{ maxWidth: 345 }} className='indurl' key={_id} >
          <CardActionArea>
            
            <CardContent>
              <Typography gutterBottom  component="div">
                <h6>{shortString}</h6>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <label><b>URL</b></label><br/><br/>
              <p><a style={linkstyle} href={longUrl} target="_blank" rel="noreferrer">{longUrl}</a></p><br/>
              <label><b>Short URL</b></label><br/><br/>
              <p><a href={shortUrl} onClick={()=>getData()}  style={linkstyle} target="_blank" rel="noreferrer">{shortUrl}</a></p>
              
              <Info createdAt={createdAt} usedCount={usedCount} 
              deleteUrl={<Tooltip title='Delete'><IconButton onClick={()=>remove(_id)}><DeleteIcon color='error'/></IconButton></Tooltip>}
              editUrl={ <Tooltip title='Edit'><IconButton onClick={()=>history.push(`/updatedata/${_id}`)}><EditIcon color='success'/> </IconButton></Tooltip>}
              shortUrl={shortUrl} lastUpdated={lastUpdated} lastVisited={lastVisited} />

              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>)
      })}
         {/* Snack Bar */}
         <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>
  </div>
  </div>)
}

function Info({createdAt,lastUpdated,usedCount,deleteUrl,shortUrl,editUrl,lastVisited})
{
  const [showinfo,setShowinfo]=useState('hide')
  const icon=(showinfo==='hide')?<KeyboardArrowDownIcon/>:<KeyboardArrowUpIcon/>


  // Tooltip 
  const [text,setText]=useState('Copy Short URL')
  const copy=()=>{
    setTimeout(() => {
      setText('Copy Short URL')
    }, 1000);
  }

 

  return( <div>
   
      <IconButton className='info' onClick={()=>setShowinfo((showinfo)=>(showinfo==='hide')?'show':'hide')}>{icon}</IconButton>
    
    {deleteUrl}{editUrl}  
    <Tooltip title={text}>
    <IconButton onClick={()=> {navigator.clipboard.writeText(shortUrl);setText(()=>(text==='Copy Short URL')&&'Copied');copy()}}><ContentCopyIcon/></IconButton>
    </Tooltip>

     

    {(showinfo==='show')&&<div className='urldetails'>      
    <label>CreatedAt</label>
     <p>{createdAt}</p>
     <label>Last Visited</label>
    <p>{lastVisited}</p>
    <label>last Updated</label>
    <p>{lastUpdated}</p>
    <p>Clicks: {usedCount}</p>
    </div>}
    
  </div>

  )

}


function Update() 
{
  const {token}=useContext(context)
  const {id}=useParams()
  const [data,setData]=useState(null)
  console.log(token,'UPDATE');

const getData=()=>
{
  axios({
    // url:`http://localhost:1000/urlmaker/geturl/${id}`,
    url:`https://url-shor-t-ner.herokuapp.com/urlmaker/geturl/${id}`,
    method:'GET',
  }).then((response)=>setData(response.data))
}
console.log(data);
useEffect(getData,[])


    const loadingstyle={marginLeft:'40rem',marginTop:'15rem'} //  Loading
  return((data===null)?<CircularProgress style={loadingstyle}></CircularProgress>:<div><UpdateURL data={data}/></div>)  
}

function UpdateURL({data})
{
  const {history}=useContext(context);
  const {longUrl,shortString,_id,lastUpdated}=data
  // const [long,setLong]=useState(longUrl)

   // Server Message
   const [Message,setMessage]=useState('')
   const [open, setOpen] = useState(false);
   const Alert = forwardRef(function Alert(props, ref) {
     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
   });
   const handleClick = () => {setOpen(true);};
   const handleClose = () => {setOpen(false);};
 

  const Update=(url)=>{
    axios({
      // url:`http://localhost:1000/urlmaker/editurl`,
      url:`https://url-shor-t-ner.herokuapp.com/urlmaker/editurl`,
      method:'PUT',
      data:url
    }).then((response)=>response).then(({data})=>{setMessage({msg:data.Msg,result:'success'})})
    .catch((error)=>setMessage({msg:error.response.data.Msg,result:'error'}))
    .then(handleClick)
  }
  
  if(Message.result==='success')
  {
    setTimeout(() => {
      
      history.push('/userdata')
    }, 2000);
  }

  let validation = yup.object({
    customUrl: yup
      .string()
      .matches(/^[A-Za-z0-9 ]+$/, "Special Characters Not Allowed")
      .min(5, "Minimum 5 Characters Required")
      .required("Required Field"),
  });

  const {handleBlur,handleSubmit,handleChange,touched,errors,values}=useFormik({
    initialValues:{customUrl:shortString,_id,lastUpdated},
    validationSchema:validation,
    onSubmit:(url)=>Update(url)
  })

  return (<div className='editdashboard' >
              <form onSubmit={handleSubmit}>

              <TextField type='text' variant="outlined" label='Update URL' name='url' id='url' readOnly className='editlongurl'
                value={longUrl}  placeholder="Update URL"/><br/><br/>

      
               <TextField type='text' label='Custom URL' className='editcustomurl'   placeholder='Custom URL' name='customUrl' id='customUrl'
                onChange={handleChange} onBlur={handleBlur}  error={errors.customUrl && touched.customUrl}  value={values.customUrl} 
               helperText={errors.customUrl && touched.customUrl &&errors.customUrl}/><br/><br/>

               <Button type='submit' variant='contained' className='savebutton'>Save</Button><br/><br/>
               </form>
               <Button type='submit' variant='contained' color='warning' className='cancel' onClick={()=>history.push('/userdata')}>Cancel</Button>

                   {/* Snack Bar */}
            <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>

  </div>)
}



function Message({msg})
{ 
 const [open, setOpen] = useState(false);
 
   const handleClickOpen = () => {setOpen(true);};
 
   useEffect( handleClickOpen,[])
  return( <div id="message">
    <Dialog open={open} keepMounted>
       <DialogTitle>Message <InfoIcon/></DialogTitle>
       <DialogContent>
         <DialogContentText>
         {msg}
         </DialogContentText>
       </DialogContent>
      
     </Dialog></div>)
}


















// Pending work=>{Documentation}






