document.addEventListener('DOMContentLoaded', () => {
    const allowedPaths = ['/', '/index', '/main'];
    const currentPath = window.location.pathname;
    console.log('Current Path:', currentPath);

    // Send current path to the network
    fetch('/log-path', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: currentPath })
    }).catch(err => console.error('Network error:', err));

    if (!allowedPaths.includes(currentPath)) {
        document.body.innerHTML = `
            <h1>404 - Page Not Found</h1>
            <button id="return-index">Return to Index</button>
        `;
        document.getElementById('return-index').addEventListener('click', () => {
            window.location.href = '/index';
        });
    }
});