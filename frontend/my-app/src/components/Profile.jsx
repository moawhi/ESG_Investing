import React from 'react';
import Topbar from './Topbar';
import { Box, Container, Grid, Stack, Typography, Divider } from '@mui/material';
import ImgMediaCard from './ImgMediaCard';

const Profile = () => {
	return (
		<div>
			<Topbar />
			<Box component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}>
				<Container>
					<Grid
						container
						spacing={{
							xs: 3,
							lg: 4,
						}}
					>
						<Grid xs={12} sx={{ py: 2 }}>
							<Stack direction="row" justifyContent="space-between" spacing={4}>
								<Stack spacing={4}>
									<Typography variant="h4">
										Profile
									</Typography>
								</Stack>
							</Stack>
						</Grid>
						<Grid xs={12} md={4}>
							<ImgMediaCard></ImgMediaCard>
						</Grid>
						<Grid xs={12} md={8}>
							General Infor
						</Grid>
					</Grid>
				</Container>
			</Box>
		</div>
	)
}

export default Profile;