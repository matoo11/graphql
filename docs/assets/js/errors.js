

export function validatePath() {
    const allowedPaths = ['/docs/index.html','/docs/login.html']
    const currentPath = window.location.pathname;
    console.log('Current Path:', currentPath);
    if (!allowedPaths.includes(currentPath)) {
      window.location.href = './login.html';
    }
  }
  

  