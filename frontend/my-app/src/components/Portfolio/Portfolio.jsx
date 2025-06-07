import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Button, Tooltip, SvgIcon } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Topbar from '../Topbar/Topbar';
import CompanyCard from '../Dashboard/CompanyCard';
import EditDialog from './EditDialog';
import DeleteDialog from './DeleteDialog';
import InvestmentPieChart from './InvestmentPieChart';
import ESGScoresChart from './ESGScoreChart';
import { fetchPortfolioData, fetchWeightedAvgESGScore } from '../helper';

const Portfolio = () => {
  const [portfolioDetails, setPortfolioDetails] = useState([]);
  const [weightedAvgESGScore, setWeightedAvgESGScore] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  const fetchDataDetails = async () => {
    try {
      const details = await fetchPortfolioData();
      setPortfolioDetails(details);
    } catch (err) {
      console.error('Error fetching portfolio details:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setRerenderFlag(false);
    }
  }

  const GetweightedAvgESGScore = async () => {
    try {
      const details = await fetchWeightedAvgESGScore();
      setWeightedAvgESGScore(details.esg_score);
      setTotalInvestment(details.total_investment);  
    } catch (err) {
      console.error('Error fetching portfolio details:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setRerenderFlag(false);
    }
  }

  useEffect(() => {
    GetweightedAvgESGScore();
  }, [rerenderFlag])

  useEffect(() => {
    fetchDataDetails();
  }, [rerenderFlag])

  const handleAddCompanyClick = () => {
    navigate('/dashboard');
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedCompany(null);
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(selectedCompany && selectedCompany.company_id === company.company_id ? null : company);
  };

  const handleCompanyUpdate = (updatedCompany) => {
    const updatedDetails = portfolioDetails.map(item =>
      item.company_id === updatedCompany.company_id ? { ...item, ...updatedCompany } : item
    );
    setPortfolioDetails(updatedDetails);
    setSelectedCompany(null);
    setRerenderFlag(true);
  };

  const handleCompanyDelete = (deletedCompanyId) => {
    const updatedDetails = portfolioDetails.filter(item => item.company_id !== deletedCompanyId);
    setPortfolioDetails(updatedDetails);
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <div>
        <Topbar />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: "#28a745" }} />
        </Box>
      </div>
    );
  }

  if (portfolioDetails.length === 0) {
    return (
      <div>
        <Topbar />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          {/* Ensure Typography color is appropriate, Link will use global styles */}
          <Typography sx={{ color: '#6C757D' }}>
            Please <Link to="/dashboard">add a company</Link> to your portfolio
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Topbar />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Topbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, mr: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">My Portfolio</Typography>
          <Box>
            {!selectionMode && (
              <Box>
                <Button
                  variant="contained"
                  onClick={handleAddCompanyClick}
                  sx={{
                    marginRight: 1,
                    backgroundColor: '#28a745', // Primary Green Accent
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: '#218838'
                    }
                  }}>
                  Add Company
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleToggleSelectionMode}
                  sx={{
                    color: '#28a745', // Primary Green Accent
                    borderColor: '#28a745',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      borderColor: '#218838'
                    }
                  }}>
                  {selectionMode ? 'Exit Edit/Delete' : 'Edit/Delete'}
                </Button>
              </Box>
            )}
            {selectionMode && !selectedCompany && (
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: 'center', gap: 1 }}>
                <Typography sx={{color: 'red' }}> {/* Using Typography for consistency */}
                  Please select a company to edit/delete
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleToggleSelectionMode}
                  sx={{
                    color: '#28a745', // Primary Green Accent
                    borderColor: '#28a745',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      borderColor: '#218838'
                    }
                  }}>
                  Exit Edit/Delete
                </Button>
              </Box>
            )}
            {selectionMode && selectedCompany && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                }}>
                {/* EditDialog and DeleteDialog components will have their opener buttons styled internally */}
                <EditDialog
                  companyDetail={selectedCompany}
                  onCompanyUpdated={handleCompanyUpdate}
                />
                <DeleteDialog
                  companyDetail={selectedCompany}
                  onCompanyDeleted={handleCompanyDelete}
                />
                <Button
                  variant="outlined"
                  onClick={handleToggleSelectionMode}
                  sx={{
                    color: '#28a745', // Primary Green Accent
                    borderColor: '#28a745',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      borderColor: '#218838'
                    }
                  }}>
                  Exit Edit/Delete
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              mb: 3,
              borderRadius: '12px',
              bgcolor: '#FFFFFF',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
            }}>
              <CardContent>
                <InvestmentPieChart key={portfolioDetails.map(item => item.investment_amount)} portfolioDetails={portfolioDetails} totalInvestment={totalInvestment}/>
              </CardContent>
            </Card>
            <Card sx={{
              mb: 3,
              position: 'relative',
              borderRadius: '12px',
              bgcolor: '#FFFFFF',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
            }}>
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 2,
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#212529' }}>Average ESG Score</Typography>
                  </Box>
                  <Box sx={{
                    textAlign: 'center',
                    mt: 2
                  }}>
                    <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', color: '#212529' }}>{weightedAvgESGScore}</Typography>
                  </Box>
                </Box>

                <Tooltip title="The Average ESG Score is calculated by weighting each company's ESG score by its proportion of the total investment amount.">
                  <SvgIcon sx={{ position: 'absolute', top: 8, right: 8, color: '#6C757D' }}> {/* Secondary text color */}
                    <InfoOutlinedIcon />
                  </SvgIcon>
                </Tooltip>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{
              mb: 3,
              borderRadius: '12px',
              bgcolor: '#FFFFFF',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
            }}>
              <ESGScoresChart companyDetails={portfolioDetails} weightedAvgESGScore={weightedAvgESGScore} />
            </Card>
            <Grid container spacing={4}>
              {portfolioDetails.map(companyDetails => (
                <Grid item xs={12} sm={6} md={4} key={companyDetails.company_id}>
                  <CompanyCard
                    companyDetails={companyDetails}
                    investmentAmount={companyDetails.investment_amount}
                    impactStatement={companyDetails.comment}
                    selected={selectedCompany && selectedCompany.company_id === companyDetails.company_id}
                    onSelect={selectionMode ? () => handleSelectCompany(companyDetails) : null}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Portfolio;
