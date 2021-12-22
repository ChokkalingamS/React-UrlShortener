
import './App.css';
import './Responsive.css'
import{Switch,Link,Route,useHistory,Redirect} from "react-router-dom";
import {useState,useContext,createContext,useEffect} from "react";

// Material UI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Tooltip} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Dialog Box
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Dark Mode
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import Paper from '@mui/material/Paper';

// Stack Bar
import { Login, Signup, Forgotpassword, Changepassword } from './User.js';
import { Dashboard, Userdatas, Update } from './Url.js';


 export default function App()
{
 
  return <div> <Container/></div> 
        
}



// Server
 const URL=`https://url-shor-t-ner.herokuapp.com/users`
 const shortURL=`https://url-shor-t-ner.herokuapp.com`
 const context=createContext('')

function Container()
{
  
    const [token,setToken]=useState('')  // Log IN token
    
    const [result,setResult]=useState(null)  // To track login response
    
    const [Statuscode,setStatuscode]=useState(null) // Response code
    
    const [Status,setStatus]=useState('Offline')  // User Online/Offline Status
   
    const history=useHistory()
   
    const [Name,setName]=useState(null)  // Profile UserName

    // Theme
    let [themeChange,setThemechange]=useState('dark')
    const lightMode=<Tooltip title='Light Mode'><LightModeIcon style={{fill:'gold'}}/></Tooltip>
    const darkMode=<Tooltip title='Dark Mode'><DarkModeIcon style={{fill:'white'}}/></Tooltip>
    const themeIcon=<IconButton onClick={()=>setThemechange((themeChange)=>(themeChange==='dark')?'light':'dark')}>{(themeChange==='light')?darkMode:lightMode}</IconButton>
    const theme = createTheme({
      palette: {mode:themeChange},
    });

    // Over All Props
    let obj={history,token,setToken,result,setResult,Statuscode,setStatuscode,Status,setStatus,Name,setName,themeChange}

    return (<div className="Body">
        <context.Provider value={obj}>
        <Switch>
            {/* User Login & Signup Component */}
            <Route exact path='/'><Login/></Route>
            <Route path='/signup'><Signup/></Route>
            <Route path='/forgotpassword'><Forgotpassword/></Route>
            <Route path='/changepassword/:id'><Changepassword/></Route>
            <Route path='/vermessage'><Message msg='Account Activated'/></Route>
            <Route path='/message'><Message msg='Mail Sent To The Registered Email'/></Route>
            <Route path='/errmessage'><Message msg='Link Already Used'/></Route>
            
            {/* URL Part */}
            <>
            <ThemeProvider theme={theme}>
                <Paper elevation={0} style={{borderStyle:"none",minHeight:"100vh"}}>
            {/* works on condition */}
            <Navbar themeIcon={themeIcon}/>
            <Route exact path='/Dashboard'>{(Statuscode===200&&Status==='Online')?<Dashboard/>:<Redirect to={'/'}/> }</Route>
            <Route path='/userdata'>{(Statuscode===200&&Status==='Online')?<Userdatas/>:<Redirect to={'/'}/> }</Route>
            <Route path='/updatedata/:id'>{(Statuscode===200&&Status==='Online')?<Update/>:<Redirect to={'/'}/> }</Route>        
            </Paper>
            </ThemeProvider>
            </>
           
        </Switch>
        </context.Provider>
        
    </div>)
}

// Dashboard Nav Bar
function Navbar({themeIcon})
{
    const {Name,setStatus}=useContext(context)
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
          {/* Avatar */}
        <Tooltip title={(Name)?Name:''}><IconButton className='avatar' onClick={handleClick}><AccountCircleIcon style={{fill:'white'}} /></IconButton></Tooltip>
        {/* Popup Menu */}
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button',}}>
        <MenuItem onClick={()=>{window.location.reload(false);handleClose();setStatus('Offline')}}>Log Out</MenuItem>
        </Menu>
        {themeIcon}
        </Typography>
        </Toolbar>
        </AppBar>
        </Box> 
        )
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
         <DialogContentText>{msg}</DialogContentText>
       </DialogContent>
     </Dialog></div>)
}


export {URL,shortURL,context}



















