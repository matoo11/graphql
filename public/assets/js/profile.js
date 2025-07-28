import {
    fetchUserAttrs,
    fetchUserInfo,
    fetchXP,
    fetchLevel,
    fetchPendingProject
} from './query.js';

// Format bytes into human-readable format
function formatBytes(bytes) {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
    return `${bytes} B`;
}

// Determine rank based on level
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

// Fetch all profile-related data
async function FetchProfileData() {
    try {
        const [userAttrs, user, xp, pendingProjects] = await Promise.all([
            fetchUserAttrs(),
            fetchUserInfo(),
            fetchXP(),
            fetchPendingProject()
        ]);

        const level = user?.login ? await fetchLevel(user.login) : 0;

        return { userAttrs, user, xp, level, pendingProjects };
    } catch (err) {
        console.error('Error in FetchProfileData:', err);
        return null;
    }
}

// Update the UI with profile data
function updateProfileUI(data) {
    if (!data || !data.user) {
        console.error('User data not found. Please login again.');
        return;
    }

    const { userAttrs, user, xp, level, pendingProjects } = data;

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
    document.getElementById('pendingProjects').textContent = pendingProjects;
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

// Init the profile and optionally the charts
async function initProfile() {
    const data = await FetchProfileData();
    updateProfileUI(data);

    // Let piechart.js attach this dynamically
    if (typeof initCharts === 'function') {
        initCharts();
    }
}

// Automatically run on DOM load
document.addEventListener('DOMContentLoaded', initProfile);

// Make it accessible globally in case piechart.js needs it
window.initProfile = initProfile;
