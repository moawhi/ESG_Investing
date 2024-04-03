import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

<TextField
  variant="outlined"
  placeholder="Search..."
  size="small" 
  sx={{ backgroundColor: '#fff', borderRadius: 1, mr: 2, ml: 2 }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>