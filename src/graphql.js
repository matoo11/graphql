export async function graphqlQuery(query, variables = {}) {
    try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('JWT token not found. Redirecting to login...');
            window.location.href = './login';
            return null;
        }


        
        const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) throw new Error('GraphQL request failed');

        const result = await response.json();
        return result; // return full response including data and errors
    } catch (error) {
        console.error('GraphQL error:', error);
        return null;
    }
}
