async function graphqlQuery(query, variables = {}) {
    try {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log("JWT Token:", jwtToken);
        if (!jwtToken) {
            window.location.href = '/login';
            console.error('JWT token not found. Please login.');
            return null;
        }
        const response = await fetch('/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) throw new Error('GraphQL request failed');
        return await response.json();
    } catch (error) {
        console.error('GraphQL error:', error);
        return null;
    }
}

async function fetchProfileData() {
    const userQuery = `
        query {
            user {
                login
                auditRatio
                totalDown
                totalUp
            }
        }
    `;

    const xpQuery = `
        query {
            transaction_aggregate(
                where: {
                    event: { path: { _eq: "/bahrain/bh-module" } }
                    type: { _eq: "xp" }
                }
            ) {
                aggregate {
                    sum {
                        amount
                    }
                }
            }
        }
    `;

    const levelQuery = `
        query Event_user($userlogin: String) {
            event_user(
                where: {
                    userLogin: { _eq: $userlogin }
                    event: { path: { _eq: "/bahrain/bh-module" } }
                }
            ) {
                level
            }
        }
    `;

    const progressQuery = `
        query {
            progress(
                where: { isDone: { _eq: false }, object: { type: { _eq: "project" } } }
                limit: 1
            ) {
                object {
                    name
                }
            }
        }
    `;

    try {
        const [userRes, xpRes, progressRes] = await Promise.all([
            graphqlQuery(userQuery),
            graphqlQuery(xpQuery),
            graphqlQuery(progressQuery)
        ]);
        const userArr = userRes?.data?.user;
        const user = Array.isArray(userArr) && userArr.length > 0 ? userArr[0] : {};
        const xp = xpRes?.data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
        const nextProject = progressRes?.data?.progress?.[0]?.object?.name || 'No current project';

        let level = 0;
        if (user.login) {
            const levelRes = await graphqlQuery(levelQuery, {
                userlogin: user.login
            });
            level = levelRes?.data?.event_user?.[0]?.level || 0;
        }

        return { user, xp, level, nextProject };
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
    }
}

function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = `${width}%`;
    });
}

function updateProfileUI(data) {
    if (!data || !data.user || !data.user.login) {
        console.error('User data not found. Please login again.');
        return;
    }

    const { user, xp, level, nextProject } = data;

    document.getElementById('userName').textContent = user.login || 'Unknown';
    document.getElementById('userTitle').textContent = `Level ${level} Learner`;
    document.getElementById('userLocation').textContent = 'Bahrain';
    document.getElementById('userStatus').textContent = 'Active';
    document.getElementById('userStatus').className = 'status-badge active';

    document.getElementById('performanceScore').textContent = user.auditRatio?.toFixed(1) || '0';
    document.getElementById('projectsCompleted').textContent = nextProject;
    document.getElementById('totalPoints').textContent = xp;
    document.getElementById('teamRank').textContent = `#${level}`;

    document.querySelector('#performanceScore ~ .progress-bar .progress-fill').setAttribute('data-width', Math.min((user.auditRatio || 0) * 20, 100));
    document.querySelector('#projectsCompleted ~ .progress-bar .progress-fill').setAttribute('data-width', level * 10);
    document.querySelector('#totalPoints ~ .progress-bar .progress-fill').setAttribute('data-width', Math.min((xp || 0) / 100, 100));
    document.querySelector('#teamRank ~ .progress-bar .progress-fill').setAttribute('data-width', level * 5);

    updateProgressBars();
}

async function initProfile() {
    const data = await fetchProfileData();
    updateProfileUI(data);
    if (typeof initCharts === 'function') {
        initCharts();
    }
}

document.addEventListener('DOMContentLoaded', initProfile);
