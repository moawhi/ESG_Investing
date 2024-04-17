import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { useUser } from './UserContext'; // Adjust path as necessary

export default function ImgMediaCard() {
    const { user } = useUser();

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
                <Button size="small">Update Password</Button>
            </CardActions>
        </Card>
    );
}
