const fetchAPI = async (endpoint, method = 'GET', body = null) => {
    console.log('Fetching API:', endpoint, method, body);
    const options = {
        method,
        headers: {
        'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, options);
        return await response.json();
    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
};

export default fetchAPI;