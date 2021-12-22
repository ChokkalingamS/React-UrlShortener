import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';

// Material UI
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { InputAdornment, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { InputGroup } from 'react-bootstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { forwardRef } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Files
import { context, URL,shortURL} from './App.js';
import './App.css';
import './Responsive.css'

 function Dashboard() {

  // Snackbar 
  const [Message, setMessage] = useState(''); // Server Message
  const [open, setOpen] = useState(false); // Snackbar Open/close status
  const Alert = forwardRef(function Alert(props, ref)
   {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snackbar Open
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // Username
  const { setName, token } = useContext(context);
  const [count, setCount] = useState(false); // Conditional rendering for Custom Url text field 
  const [responseData, setResponseData] = useState(null); // server Response
  const [shortUrl, setShortUrl] = useState(''); // Short Url

  // Validation
  let validation = yup.object({
    url: yup.string().required('Required Field'),
    customUrl: yup.string().matches(/^[A-Za-z0-9 ]+$/, 'Special Characters Not Allowed').min(5, 'Minimum 5 Characters Required')
  });
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } = useFormik({
    initialValues: { url: '', customUrl: '' },
    validationSchema: validation,
    onSubmit: (urlData) => callDB(urlData) // Arrow Function
  });
  
  // Tooltip
  const [text, setText] = useState('Copy'); // URL Copy
  const copy = () => {
    setTimeout(() => {
      setText('Copy');
    }, 1000);
  };

  const getToken = token;  // Using Token to get userdata
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }; // Check Box

  const getData = () => {
    axios({ // Getting data from server by send token in header
      url: `${URL}/getdata`,
      method: 'GET',
      headers: { 'x-auth-token': getToken }
    }).then((responsebody) => setResponseData(responsebody.data));
  };

  // eslint-disable-next-line
  useEffect(getData, []);

  // To create Short URL
  const getUrl = (userData) => {
    axios({
      url: `${shortURL}/url`,
      method: 'POST',
      data: userData
    }).then((response) => response.data).then((x) => { setShortUrl(x.shortUrl); setMessage({ msg: x.Msg, result: 'success' }); })
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'error' }))
      .then(handleClick);
  };
  // Both Success & Error messages are passed to snack bar for user notification
 
  // On create this function is called
  const callDB = (urlData) => {
    if (responseData) {
      // After getting response Mailid destructured from getdata api request
      const { Mailid } = responseData;
      const { url, customUrl } = urlData;
      getUrl({ Mailid, url, customUrl });
    }
  };

  // Username in App bar
  setName(() => (responseData) ? responseData.Username : '');

  return <div className="dashboard">

    <form onSubmit={handleSubmit}>
      {/* Long URL & Create Button */}
      <InputGroup className="mb-3">
        <TextField type='text' variant="outlined" label='Paste The URL' name='url' id='url' onChange={handleChange} onBlur={handleBlur}
          error={errors.url && touched.url} value={values.url} className='urlbox1' placeholder="Paste the URL"
          helperText={errors.url && touched.url && errors.url} />

        <Button type='submit' variant="contained" style={{ height: '3.5rem' }} color='primary'>Create</Button>

      </InputGroup>
    </form><br />
      {/* Conditional Rendering On Custom URL text field  */}
    {(count) && <>
      <TextField type='text' label='Custom URL' className='urlbox2' placeholder='Custom URL' name='customUrl' id='customUrl'
        onChange={handleChange} onBlur={handleBlur} error={errors.customUrl && touched.customUrl} value={values.customUrl}
        helperText={errors.customUrl && touched.customUrl && errors.customUrl} />
      <br /><br /></>}
        {/* Short URL */}
    <TextField variant="outlined" label='Short Url' color='warning' className='urlbox2' type='text' value={shortUrl} readOnly placeholder='Short Url'
      InputProps={{
        endAdornment: (
        <InputAdornment>
        <Tooltip title={text}>
          <IconButton onClick={() => { navigator.clipboard.writeText(shortUrl); setText((text) => (text === 'Copy') && 'Copied'); copy(); }}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
        </InputAdornment>),
      }} /><br />
      
    <Button type='submit' onClick={() => { setShortUrl(''); }}>Clear Data</Button>  {/* To Clear Short URL Data */}
  
    <Checkbox {...label} onChange={() => setCount((count) => !count)} className='customcheckbox' />  {/* Checkbox */}
    <label className='checkboxtext'>Create Custom URL </label>

    {/* Snack Bar */}
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>

  </div>;

}
 function Userdatas() {
  const { themeChange, history, token } = useContext(context);

  const [Message, setMessage] = useState(''); // Server Message
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // const getToken=localStorage.getItem('token')
  const getToken = token;  // Token to get userdata
  const [userData, setUserData] = useState([]); // To get server data
  const linkstyle = { color: (themeChange === 'light') && '#1976d2' }; // URL Styles

  const getData = () => {
    axios({
      url: `${URL}/userdata`,
      method: 'GET',
      headers: { 'x-auth-token': getToken }
    }).then((response) => response).then(({ data }) => setUserData(data)); // To get url data
  };
  useEffect(getData, [getToken]);

  // URL Delete
  const remove = (_id) => {
    axios({
      url: `${shortURL}/deleteurl/${_id}`,
      method: 'DELETE'
    }).then((response) => response).then(({ data }) => setMessage({ msg: data.Msg, result: 'success' }))
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'error' }))
      .then(() => getData()).then(handleClick);
      // Delete Status is passed to snackbar to get user notification
  };
  return (<div>
    <div className='urlcount'><p>URLS : {(userData.length)}</p></div> {/* URL Count */}
    <div className="urlpage">
    {(userData.length === 0) ? <div>
    <CircularProgress id='dataprogress'></CircularProgress></div>
    : userData.map(({ longUrl, shortUrl, _id, createdAt, usedCount, shortString, lastUpdated, lastVisited }) => {
    return (<Card sx={{ maxWidth: 345 }} className='indurl' key={_id}>
    <CardActionArea>

              <CardContent>
                {/* Heading */}
                <Typography gutterBottom component="div">
                  <h6>{shortString}</h6>
                </Typography>
                {/* Body */}
                <Typography variant="body2" color="text.secondary">
                  <label><b>URL</b></label><br /><br />
                  <p><a style={linkstyle} href={longUrl} target="_blank" rel="noreferrer">{longUrl}</a></p><br /> {/* Long URL */}
                 
                  <label><b>Short URL</b></label><br /><br />  {/* Short URL */}
                  <p><a href={shortUrl} onClick={() => getData()} style={linkstyle} target="_blank" rel="noreferrer">{shortUrl}</a></p>
                  
                  <Info createdAt={createdAt} usedCount={usedCount}
                 deleteUrl={
                   <Tooltip title='Delete'>
                   <IconButton onClick={() => remove(_id)}><DeleteIcon color='error' /></IconButton>
                   </Tooltip>
                   }
                editUrl={
                <Tooltip title='Edit'>
                <IconButton onClick={() => history.push(`/updatedata/${_id}`)}><EditIcon color='success' /></IconButton>
                </Tooltip>
                }
                    shortUrl={shortUrl} lastUpdated={lastUpdated} lastVisited={lastVisited} />
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>);
        })}

      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: '100%' }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  </div>);
}

// URL Details
function Info({ createdAt, lastUpdated, usedCount, deleteUrl, shortUrl, editUrl, lastVisited })
 {
  //  Accordian
  const [showinfo, setShowinfo] = useState('hide');
  const icon = (showinfo === 'hide') ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />;

  // Tooltip 
  const [text, setText] = useState('Copy Short URL');
  const copy = () => {
    setTimeout(() => {
      setText('Copy Short URL');
    }, 1000);
  };
  return (
  <div>
   <IconButton className='info' onClick={() => setShowinfo((showinfo) => (showinfo === 'hide') ? 'show' : 'hide')}>{icon}</IconButton>
    {deleteUrl}{editUrl} {/* Show/Hide Button,Delete Button,Edit Button */}
   
    <IconButton onClick={() =>{ navigator.clipboard.writeText(shortUrl); setText(() => (text === 'Copy Short URL') && 'Copied'); copy(); }}>
      <Tooltip title={text}><ContentCopyIcon /></Tooltip>
    </IconButton> {/* URL Copy Button */}

    {/* Condional Rendering */}
    {(showinfo === 'show') && <div className='urldetails'>
      <label>CreatedAt</label>
      <p>{createdAt}</p>
      <label>Last Visited</label>
      <p>{lastVisited}</p>
      <label>last Updated</label>
      <p>{lastUpdated}</p>
      <p>Clicks: {usedCount}</p>
    </div>}
  </div>
  );
}

// Update URL
  function Update() {
  const { id } = useParams(); // ObjectId of individual URL
  // To store individual URL
  const [data, setData] = useState(null);

  const getData = () => {     // Getting URL by ID
    axios({
      url: `${shortURL}/geturl/${id}`,
      method: 'GET',
    }).then((response) => setData(response.data));
  };
  useEffect(getData, [id]);

// Loading Status on condional rendering
// renders if the data is empty
  return ((data === null) ? <CircularProgress id='editprogress'></CircularProgress> : <div><UpdateURL data={data} /></div>);
}

// Component rendered based on condition if the data is not empty

function UpdateURL({ data })
{
  const { history } = useContext(context);
  
  const { longUrl, shortString, _id, lastUpdated } = data; // Destructuring 

// Snackbar
  const [Message, setMessage] = useState('');   // Server Message
  const [open, setOpen] = useState(false);   // Snackbar open/close status
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snackbar open/close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const Update = (url) => {
    axios({
      url: `${shortURL}/editurl`,
      method: 'PUT',
      data: url
    }).then((response) => response).then(({ data }) => { setMessage({ msg: data.Msg, result: 'success' }); })
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'error' }))
      .then(handleClick);
  };

  // URL update status- if url is successfully update the page will be redirected to url page after 2 Seconds
  if (Message.result === 'success') {
    setTimeout(() => {

      history.push('/userdata');
    }, 2000);
  }

  // Validation
  let validation = yup.object({
    customUrl: yup
      .string()
      .matches(/^[A-Za-z0-9 ]+$/, "Special Characters Not Allowed")
      .min(5, "Minimum 5 Characters Required")
      .required("Required Field"),
  });

  const { handleBlur, handleSubmit, handleChange, touched, errors, values } = useFormik({
    initialValues: { customUrl: shortString, _id, lastUpdated },
    validationSchema: validation,
    onSubmit: (url) => Update(url)
  });

  return (<div className='editdashboard'>
    <form onSubmit={handleSubmit}>
        {/* Long URL Read Only */}
      <TextField type='text' variant="outlined" label='Update URL' name='url' id='url' readOnly className='editlongurl'
        value={longUrl} placeholder="Update URL" /><br /><br />

      {/* Custom URL */}
      <TextField type='text' label='Custom URL' className='editcustomurl' placeholder='Custom URL' name='customUrl' id='customUrl'
        onChange={handleChange} onBlur={handleBlur} error={errors.customUrl && touched.customUrl} value={values.customUrl}
        helperText={errors.customUrl && touched.customUrl && errors.customUrl} /><br /><br />

      {/* Save Button */}
      <Button type='submit' variant='contained' className='savebutton'>Save</Button><br /><br />
    </form>

    {/* Cancel */}
    <Button type='submit' variant='contained' color='warning' className='cancel' onClick={() => history.push('/userdata')}>Cancel</Button>

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

export { Dashboard, Userdatas, Update } 