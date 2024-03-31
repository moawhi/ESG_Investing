import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ImgMediaCard() {
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
          Full Name
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit Avatar</Button>
      </CardActions>
    </Card>
  );
}
