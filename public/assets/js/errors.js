

export function validatePath() {
    const allowedPaths = ['/public/index.html','/public/login.html']
    const currentPath = window.location.pathname;
    console.log('Current Path:', currentPath);
    if (!allowedPaths.includes(currentPath)) {
      window.location.href = './login.html';
    }
  }
  

  