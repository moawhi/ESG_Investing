
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
							'Authorisation': 'Bearer ' + token,
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
