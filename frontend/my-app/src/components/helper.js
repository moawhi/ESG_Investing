/**
 * Funciton geting company details
 * @param {*} companies 
 * @returns array of companyDetails object (company_id, company_name, industry_ranking)
 */
export const fetchCompanyDetails = async (companies) => {
	const token = localStorage.getItem('token');
	const companyDetails = await Promise.all(
		companies.map(async (company) => {
			try {
				const response = await fetch(
					`http://localhost:12345/company/${company.company_id}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorisation: 'Bearer ' + token,
						},
					}
				);

				if (response.ok) {
					const responseData = await response.json();
					return responseData;
				} else {
					const errorBody = await response.json();
					console.error(errorBody.message);
				}
			} catch (error) {
				console.error('Error fetching company details:', error);
				return [];
			}
		})
	);

	return companyDetails;
};

/**
 * Function to fetch portfolio data
 * @returns array of object including company details and its ESG rating
 */
export const fetchPortfolioData = async () => {
	const token = localStorage.getItem('token');
	try {
		const response = await fetch('http://localhost:12345/portfolio/list', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorisation: 'Bearer ' + token,
			},
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		return data.portfolio;
	} catch (err) {
		console.error('Error fetching portfolio details:', err);
		throw new Error('Failed to load portfolio data');
	}
};

/**
 * Function getting the weighted average ESG Score and total amount of investment
 * @returns portfolio's weighted ESG score and total amount
 */
export const fetchWeightedAvgESGScore = async () => {
	const token = localStorage.getItem('token');

	try {
		const response = await fetch(
			'http://localhost:12345/portfolio/calculate-esg-score',
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorisation: 'Bearer ' + token,
				},
			}
		);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Failed to fetch ESG score:', error);
		return null;
	}
};
