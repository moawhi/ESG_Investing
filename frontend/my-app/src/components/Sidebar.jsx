import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


function Sidebar() {
  const [open, setOpen] = useState({});

  const frameworks = {
    IFRS: ['metric', 'metric'],
    TCFD: ['metric', 'metric'],
    TNFD: ['metric', 'metric'],
    'APRA-CPG': ['metric', 'metric']
  };

  const handleClick = (framework) => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [framework]: !prevOpen[framework],
    }));
  };

  return (
    <Box sx={{ width: '250px', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List>
        {Object.keys(frameworks).map((framework) => (
          <React.Fragment key={framework}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleClick(framework)}>
                <ListItemText primary={framework} />
                {open[framework] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={open[framework]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {frameworks[framework].map((metric, index) => (
                  <ListItemButton key={index} sx={{ pl: 4 }}>
                    <ListItemText primary={metric} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;