function validatePath() {
    allowedPaths = ['/public/home','/public/profile']
    const currentPath = window.location.pathname;
    console.log('Current Path:', currentPath);
    if (!allowedPaths.includes(currentPath)) {
      window.location.href = './login.html';
    }
  }
  

  