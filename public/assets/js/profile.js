async function graphqlQuery(query, variables = {}) {
    try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('JWT token not found. Redirecting to login...');
            window.location.href = '/login';
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
        console.log('GraphQL result:', result); // ✅ LOG: Raw GraphQL response
        return result;
    } catch (error) {
        console.error('GraphQL error:', error);
        return null;
    }
}

async function fetchProfileData() {
    const userDataquery = `
        query {
            user {
                attrs
            }
        }
    `;

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

    const pending = `
        query {
            progress(
                where: { isDone: { _eq: false }, object: { type: { _eq: "project" } } }
               
            ) {
                object {
                    name
                }
            }
        }
    `;

    try {
        const [userDataRes, userRes, xpRes, progressRes] = await Promise.all([
            graphqlQuery(userDataquery),
            graphqlQuery(userQuery),
            graphqlQuery(xpQuery),
            graphqlQuery(pending)
        ]);

        const userAttrs = userDataRes?.data?.user?.[0]?.attrs || {};
        console.log('User attributes:', userAttrs);
        const userData = userDataRes?.data?.user?.attrs ;
        const userArr = userRes?.data?.user;
        const user = Array.isArray(userArr) && userArr.length > 0 ? userArr[0] : {};
        const xp = xpRes?.data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
        const pendingProjects = progressRes?.data?.progress?.[0]?.object?.name || 'No current project';

        let level = 0;
        if (user.login) {
            const levelRes = await graphqlQuery(levelQuery, { userlogin: user.login });
            const levelArr = levelRes?.data?.event_user;
            level = Array.isArray(levelArr) && levelArr.length > 0 ? levelArr[0].level : 0;
        }

        console.log('Fetched profile data:', { user, xp, level, pendingProjects });
        return { userAttrs,user, xp, level, pendingProjects };
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
    }
}

function formatBytes(bytes) {
    if (bytes >= 1000000) {
        return `${(bytes / 1000000).toFixed(1)} MB`;
    } else if (bytes >= 1000) {
        return `${(bytes / 1000).toFixed(1)} KB`;
    }
    return `${bytes} B`;
}

function updateProfileUI(data) {
    if (!data || !data.user || (!data.user.login && !data.user.firstName)) {
        console.error('User data not found. Please login again.');
        return;
    }

    const { userAttrs, user, xp, level, pendingProjects } = data;
    console.log('Updating UI with:', { user, xp, level, pendingProjects });
    const displayName = user.login || 'Unknown';
    document.getElementById('userName').textContent = displayName;

    document.getElementById('userLocation').textContent = userAttrs?.country || 'Unknown Location';
    document.getElementById('userEmail').textContent = userAttrs?.email || 'Not specified';
    document.getElementById('phoneNumber').textContent = userAttrs?.PhoneNumber || 'Not specified';
    document.getElementById('Degree').textContent = userAttrs?.Degree || 'Not specified';
    document.getElementById('userStatus').textContent = data.userAttrs?.status || 'Active';

    const auditRatio = typeof user.auditRatio === 'number' ? user.auditRatio.toFixed(1) : '0';
    document.getElementById('AuditScore').textContent = auditRatio;
    document.getElementById('recived').textContent = formatBytes(user.totalDown || 0);
    document.getElementById('Done').textContent = formatBytes(user.totalUp || 0);

    document.getElementById('pendingProjects').textContent = pendingProjects;
    document.getElementById('totalPoints').textContent = formatBytes(xp || 0);
    document.getElementById('Level').textContent = `#${level}`;
    const rank = testLevel(level);
    document.getElementById('rank').textContent = rank;

    const progressFills = document.querySelectorAll('.progress-fill');
    if (progressFills.length >= 4) {
        progressFills[0].setAttribute('data-width', Math.min((user.auditRatio || 0) * 20, 100));
        progressFills[1].setAttribute('data-width', level * 10);
        progressFills[2].setAttribute('data-width', Math.min((xp || 0) / 1000000, 100)); // Scale for MB
        progressFills[3].setAttribute('data-width', level * 5);
    }
}
async function initProfile() {
    const data = await fetchProfileData();
    updateProfileUI(data);
    if (typeof initCharts === 'function') {
        initCharts();
    }
}
function testLevel(level) {
    if (level >= 0 && level <= 9) return 'Aspiring developer';
    if (level >= 10 && level <= 19) return 'Beginner developer';
    if (level >= 20 && level <= 29) return 'Apprentice developer';
    if (level >= 30 && level <= 39) return 'Assistant developer';
    if (level >= 40 && level <= 49) return 'Basic developer';
    if (level >= 50 && level <= 54) return 'Junior developer';
    if (level >= 55 && level <= 59) return 'Confirmed developer';
    if (level === 60) return 'Full-Stack developer';
    return 'Unknown rank'; // Fallback for levels outside defined ranges
}


document.addEventListener('DOMContentLoaded', initProfile);
