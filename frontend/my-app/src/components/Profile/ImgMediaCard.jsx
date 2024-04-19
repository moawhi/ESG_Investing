import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { useUser } from './UserContext';
import UpdatePasswordDialog from './UpdatePasswordDialog';

export default function ImgMediaCard() {
    const { user } = useUser();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const handleOpenPasswordDialog = () => {
      setIsPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
      setIsPasswordDialogOpen(false);
  };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt="Avatar"
                height="200"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeAKvlSuCAVIu5B45Fgjsdrasym0LWbSzbVQ&usqp=CAU"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {user.firstName} {user.lastName}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleOpenPasswordDialog}>Update Password</Button>
            </CardActions>
            <UpdatePasswordDialog open={isPasswordDialogOpen} handleClose={handleClosePasswordDialog} />
        </Card>
    );
}