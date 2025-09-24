import {
    fetchUserAttrs,
    fetchUserInfo,
    fetchXP,
    fetchLevel,
    fetchPendingProject,
    fetchSkills
} from './query.js';

function formatBytes(bytes) {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
    return `${bytes} B`;
}

function testLevel(level) {
    if (level >= 0 && level <= 9) return 'Aspiring developer';
    if (level <= 19) return 'Beginner developer';
    if (level <= 29) return 'Apprentice developer';
    if (level <= 39) return 'Assistant developer';
    if (level <= 49) return 'Basic developer';
    if (level <= 54) return 'Junior developer';
    if (level <= 59) return 'Confirmed developer';
    if (level === 60) return 'Full-Stack developer';
    return 'Unknown rank';
}

async function FetchProfileData() {
    try {
        const [userAttrs, user, xp, pendingProjects, skil] = await Promise.all([
            fetchUserAttrs(),
            fetchUserInfo(),
            fetchXP(),
            fetchPendingProject(),
            fetchSkills()
        ]);

        const level = user?.login ? await fetchLevel(user.login) : 0;

        return { userAttrs, user, xp, level, pendingProjects, skil };
    } catch (err) {
        console.error('Error in FetchProfileData:', err);
        return null;
    }
}

function updateProfileUI(data) {
    if (!data || !data.user) {
        console.error('User data not found. Please login again.');
        return;
    }
    console.log('Profile data:', data);
    const { userAttrs, user, xp, level, pendingProjects, skil } = data;
    console.log('skil:', skil);
    document.getElementById('userName').textContent = user.login || 'Unknown';
    document.getElementById('userLocation').textContent = userAttrs?.country || 'Unknown Location';
    document.getElementById('userEmail').textContent = userAttrs?.email || 'Not specified';
    document.getElementById('phoneNumber').textContent = userAttrs?.PhoneNumber || 'Not specified';
    document.getElementById('Degree').textContent = userAttrs?.Degree || 'Not specified';
    document.getElementById('userStatus').textContent = userAttrs?.status || 'Active';

    document.getElementById('AuditScore').textContent =
        typeof user.auditRatio === 'number' ? user.auditRatio.toFixed(1) : '0';

    document.getElementById('recived').textContent = formatBytes(user.totalDown || 0);
    document.getElementById('Done').textContent = formatBytes(user.totalUp || 0);
    console.log('Pending Projects:', pendingProjects);
    const projects = pendingProjects.map(p => p || 'Unknown Project');
    const colors = ['blue', 'orange', 'red', 'yellow'];

    const container = document.getElementById('projectListContainer');
    container.innerHTML = `
        <ul class="project-list">
            ${projects.map((name, index) => `
                <li><span class="dot ${colors[index % colors.length]}"></span> ${name}</li>
            `).join('')}
        </ul>
    `;

    document.getElementById('pendingProjects').textContent = projects.length;


    document.getElementById('totalPoints').textContent = formatBytes(xp || 0);
    document.getElementById('Level').textContent = `#${level}`;
    document.getElementById('rank').textContent = testLevel(level);

    const progressFills = document.querySelectorAll('.progress-fill');
    if (progressFills.length >= 4) {
        progressFills[0].setAttribute('data-width', Math.min((user.auditRatio || 0) * 20, 100));
        progressFills[1].setAttribute('data-width', level * 10);
        progressFills[2].setAttribute('data-width', Math.min((xp || 0) / 1_000_000, 100));
        progressFills[3].setAttribute('data-width', level * 5);
    }
}

async function initProfile() {
    const data = await FetchProfileData();
    updateProfileUI(data);

    if (typeof initCharts === 'function') {
        initCharts();
    }
}

document.addEventListener('DOMContentLoaded', initProfile);
window.initProfile = initProfile;
document.addEventListener('DOMContentLoaded', () => {
    const logoutForm = document.getElementById('logoutForm');
    

    if (logoutForm) {
        logoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            localStorage.removeItem('jwtToken');
            window.location.href = './index';
        });
    }
});
