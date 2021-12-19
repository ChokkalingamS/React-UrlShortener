import './App.css';
import{Switch,Link,Route,useHistory,useParams,Redirect} from "react-router-dom";
import axios from "axios";
import {useState,useContext,createContext,useEffect} from "react";
import {useFormik} from 'formik';
import * as yup from 'yup';



import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { InputAdornment,Tooltip} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { InputGroup} from 'react-bootstrap';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {forwardRef} from "react";

import { SnackbarProvider, useSnackbar } from 'notistack';


// Dark Mode
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import Paper from '@mui/material/Paper';


import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


export default function App()
{
 
  return (<div> <Container/>

  </div> )
        
}
const URL=`http://localhost:1000/users`
const context=createContext('')

function Container()
{
    const [Mailid,setMailid]=useState('');
    const [Password,setPassword]=useState('');
    const [token,setToken]=useState('')
    const [result,setResult]=useState(null)
    const [Statuscode,setStatuscode]=useState(null)
    const [Status,setStatus]=useState('Offline')
    
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

    let obj={history,token,setToken,result,setResult,Statuscode,setStatuscode,Status,setStatus,Name,setName}

    return (<div className="Body">
        <context.Provider value={obj}>
        <Switch>
            <Route exact path='/'><Login/></Route>
            <Route path='/signup'><SnackbarProvider maxSnack={3}><Signup/></SnackbarProvider></Route>
            <Route path='/forgotpassword'><Forgotpassword/></Route>
            <Route path='/changepassword/:id'><Changepassword/></Route>
            <Route path='/vermessage'><Message msg='Account Activated'/></Route>
            <Route path='/message'><Message msg='Mail Sent To The Registered Email'/></Route>
            
            
            <>
            <ThemeProvider theme={theme}>
                <Paper elevation={0} style={{borderStyle:"none",minHeight:"100vh"}}>
            <Navbar themeIcon={themeIcon}/>
            <Route exact path='/Dashboard'>{(Statuscode===200||Status==='Online')?<Dashboard/>:<Redirect to={'/'}/> }</Route>
            <Route path='/Dashboard/userdata'>{(Statuscode===200||Status==='Online')?<Userdatas/>:<Redirect to={'/'}/> }</Route>
            </Paper>
            </ThemeProvider>
            </>
           
        </Switch>
        </context.Provider>
    </div>)
}

function Navbar({themeIcon})
{
    const {Name,setName}=useContext(context)
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
        <AppBar position="static">
        <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
        <Button color="inherit"><Link className="link" to="/Dashboard">Home</Link></Button>
        <Button color="inherit"><Link className="link" to="/Dashboard/userdata">Url</Link></Button>

        <Tooltip title={(Name)?Name:''}><IconButton className='avatar' onClick={handleClick}><AccountCircleIcon style={{fill:'white'}} /></IconButton></Tooltip>
        
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button',}}>
          <MenuItem>My Profile</MenuItem>
          {/* {(Name)?<MenuItem>Status:{Name.Status}  <InsertEmoticonIcon style={{fill:'gold'}}/></MenuItem>:''} */}
        <MenuItem onClick={()=>{window.location.reload(false);handleClose()}}>Log Out</MenuItem>
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
      Username:yup.string().typeError(Message).required('Required Field'),
      Mailid:yup.string().typeError(Message).required('Required Field').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Must Be a Valid Email'),
      Password:yup.string().min(8,'Minimum 8 Characters Required').required('Required Field')
    })

    const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
      {
        initialValues:{Firstname:'',Lastname:'',Username:'',Mailid:'',Password:''},
        validationSchema:validation,
        onSubmit:(newUser)=>signUp(newUser)
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
    
    // SnackBar
    
    // const { enqueueSnackbar } = useSnackbar();
    // const handleClickVariant = (variant) => () => {
    //   enqueueSnackbar(Message, { variant });
    // };

 
  
    
    // API Request
    const signUp=(newUser)=>{
      setMessage(()=>'')
            axios({
                url:`${URL}/signup`,
                method:'POST',
                data:newUser,    
            }).then((x)=>{setMessage({msg:x.data,result:'success'})})
            .catch((error)=>(setMessage({msg:error.response.data,result:'error'}))).then(handleClick)
    }
  
    if(Message)
    {
      console.log(Message);
    }
    
    return (<div className="signup">
              
            <div  className='headingcontainer'>
                <p className='heading' >U R L S H O R T E N E R</p>
                <p className='subheading'>Simplify your links, customize & manage them</p>
                {/* <img src='https://free-url-shortener.rb.gy/open-graph.png' style={{height:'10rem',width:'10rem'}} alt='logo'></img> */}
                {/* <img src='https://i.gifer.com/YCZH.gif' style={{height:'20rem',width:'50rem'}} alt='logo'></img> */}
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

            <Stack spacing={2} sx={{ width: '100%' }} key={'bottom' +'right'}>
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
    const {history,token,setToken,result,setResult,Statuscode,setStatuscode,Status,setStatus}=useContext(context);

    const [Message,setMessage]=useState('')
    const [open, setOpen] = useState(false);
    const Alert = forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClick = () => {setOpen(true);};
    const handleClose = () => {setOpen(false);};
    
    

  let validation=yup.object({
    Mailid:yup.string().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Must Be a Valid Email').required('Required Field'),
    Password:yup.string().min(8,'Minimum 8 Characters Required').required('Required Field')
  })

  const {handleBlur,handleSubmit,handleChange,errors,touched,values}=useFormik({
    initialValues:{Mailid:'',Password:''},
    validationSchema:validation,
    onSubmit:(userData)=>login(userData)
  })

  // onClick={()=>login(userData)}


    // const [Mailid,setMailid]=useState('');
    // const [Password,setPassword]=useState('');
   
    // const userData={Mailid,Password};

    // Password
    const [text,setText]=useState('Show')
    const [visible,setVisible]=useState('password')
    const icon=(visible==='password')?<VisibilityIcon/>:<VisibilityOffIcon/>
    const visibility=()=>{
        setVisible((visible)=>(visible==='password')?'text':'password');
        setText((text)=>(text==='Show')?'Hide':'Show')
    }
    // const reload=()=> window.location.reload(true)
    // // reload()
    // useEffect(()=> reload,[true])
    
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
            
                localStorage.setItem('token',result.data.token) // token
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
                <p className='subheading'>Simplify your links, customize & manage them</p>
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


    const {history,result}=useContext(context);
    // const [Mailid,setMailid]=useState('');
    // const userData={Mailid}

  let validation=yup.object({
    Mailid:yup.string().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Must Be a Valid Email').required('Required Field')
  })
  const{handleSubmit,handleChange,handleBlur,values,errors,touched}=useFormik({
    initialValues:{Mailid:''},
    validationSchema:validation,
    onSubmit:(userData)=>forgotpassword(userData)
  })



    const forgotpassword=(userData)=>{
        axios({
            url:`${URL}/forgotpassword`,
            method:'POST',
            data:userData
        }).then((x)=>{setMessage({msg:x.data,result:'success'})}).then(()=>history.push('/message'))
        .catch((error)=>(setMessage({msg:error.response.data,result:'error'}))).then(handleClick)
    }
    
    
    // .then((response)=>console.log(response))
// console.log('forgotpassword',result);

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
    onSubmit:(userData)=>changepassword(userData)
  })


    // Password Functionality
    const [text,setText]=useState('Show')
    const [visible,setVisible]=useState('password')
    const icon=(visible==='password')?<VisibilityIcon/>:<VisibilityOffIcon/>
    const visibility=()=>{
        setVisible((visible)=>(visible==='password')?'text':'password');
        setText((text)=>(text==='Show')?'Hide':'Show')
    }

    // Popup
    // const [open, setOpen] = useState(false);
    // const handleClickOpen = () => {setOpen(true);};
    // console.log(token);

    // Change Password
    const changepassword=(userData)=>{
        axios({
            url:`${URL}/changepassword`,
            method:'POST',
            data:userData,
    }).then((x)=>{setMessage({msg:x.data,result:'success'})})
    .catch((error)=>(setMessage({msg:error.response.data,result:'error'}))).then(handleClick)
    .then(()=>(Message.result==='success')&&setTimeout(() => {history.push('/')}, 4000))
    }




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

          {/* Snack Bar */}
          <Stack spacing={2} sx={{ width: '100%' }} >
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} >
           <Alert severity={Message.result} sx={{ width: '100%' }}>
           {Message.msg}
           </Alert>
          </Snackbar>
          </Stack>

        {/* <Dialog open={open} keepMounted>
        <DialogTitle>Message <InfoIcon/></DialogTitle>
        <DialogContent>
        <DialogContentText>Password Changed Successfully</DialogContentText>
        </DialogContent>
        </Dialog> */}
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
    const {setName}=useContext(context);
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
      
      const [text,setText]=useState('Copy')// URL Copy
      const getToken=localStorage.getItem('token')  // Local Storage
      const label = { inputProps: { 'aria-label': 'Checkbox demo' } }; // Check Box
      
      
      const getData=()=>{// Using Token getting the userData 
          axios({
              url:`${URL}/getdata`,
              method:'GET',
              headers:{'x-auth-token':getToken}    
            }).then((responsebody)=>setResponseData(responsebody.data))
      }
      useEffect(getData,[])
    
    const getUrl=(userData)=>{ // After getting the data Long Url sent to the server & short url is sent back as response 
        axios({
            url:`http://localhost:1000/urlmaker/url`,
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
        const {Mailid,Status,Username}=responseData;
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
                    <IconButton onClick={()=>{navigator.clipboard.writeText(shortUrl);setText((text)=>(text==='Copy')?'Copied':'Copy')}}>
                      <ContentCopyIcon/>
                    </IconButton>
                    </Tooltip>
                    </InputAdornment>
                  ),
                }} /><br/>
              <Button type='submit' onClick={()=>{setShortUrl('')}}>Clear Data</Button>
              <Checkbox {...label } onChange={()=>setCount((count)=>!count)} className='customcheckbox' />
              <label>Create Custom URL </label>

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
    const getToken=localStorage.getItem('token')
    const [userData,setUserData]=useState([])
    
    const styles={marginLeft:'40rem',marginTop:'14rem'}
    const getData=()=>{
        axios({
            url:`${URL}/userdata`,
            method:'GET',
            headers:{'x-auth-token':getToken}    
          }).then((response)=>response).then(({data})=>setUserData(data))
    }
    useEffect(getData,[getToken])
  return (<div className="urlpage">
      {(userData.length===0)?<div><p>Currently No URL Available</p>
         <CircularProgress style={styles}></CircularProgress></div>:userData.map(({longUrl,shortUrl,_id})=>{
          return(<div key={_id}>
          <p>LongUrl:<a href={longUrl} target="_blank" rel="noreferrer">{longUrl}</a></p>
          <p>ShortUrl:<a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a></p>
          </div>)
      })}
  </div>)
}


function Message({msg})
{
//   const Transition = forwardRef(function Transition(props, ref)
//   {
//    return <Slide direction="up" ref={ref} {...props} />;
//  });
 
 const [open, setOpen] = useState(false);
 
   const handleClickOpen = () => {setOpen(true);};
 
   useEffect( handleClickOpen,[])
  return( <div>
    <Dialog open={open} keepMounted>
       <DialogTitle>Message <InfoIcon/></DialogTitle>
       <DialogContent>
         <DialogContentText>
         {msg}
         </DialogContentText>
       </DialogContent>
      
     </Dialog></div>)
}


















// Pending work=>{UserDatas page,Responsive,Signup:progress,Change password,Documentation }





// <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} className='signupfield' name='Firstname' id='Firstname' color='success' label='FirstName' type='text' onInput={(e)=>setFirstname(e.target.value)} placeholder="Enter the FirstName"/><br/><br/>
//             <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} className='signupfield' name='Lastname'  id='Lastname' color='success' label='LastName' type='text' onInput={(e)=>setLastname(e.target.value)}  placeholder="Enter the LastName"/><br/><br/>
//             <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} className='signupfield' name='Username'  id='Username' color='success' label='UserName' type='text' onInput={(e)=>setUsername(e.target.value)}  placeholder="Enter the UserName"/><br/><br/>
//             <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} className='signupfield' name='Mailid'    id='Mailid' color='success' label='Email' type='text' onInput={(e)=>setMailid(e.target.value)}    placeholder="Enter Email"/><br/><br/>
//             <TextField variant="outlined" onChange={handleChange} onBlur={handleBlur} className='signupfield' name='Password'  id='Password' color='success' label='Password' type={visible} onInput={(e)=>setPassword(e.target.value)}  placeholder="Enter the Password"
//              InputProps={{
//                 endAdornment: ( <InputAdornment>
//                 <Tooltip title={text}>
//                   <IconButton onClick={()=>visibility()}>
//                     {icon}
//                   </IconButton>
//                   </Tooltip>
//                   </InputAdornment>
//                 ),
//               }}/><br/><br/>




// <TextField label="Email" variant="outlined"  type='text' fullWidth onInput={(e)=>setMailid(e.target.value)}    placeholder="Enter Email"/><br/><br/>
//           <TextField label="Password" variant="outlined" type={visible} fullWidth onInput={(e)=>setPassword(e.target.value)}  placeholder="Enter the Password"





