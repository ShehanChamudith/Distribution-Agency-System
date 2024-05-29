import jwtDecode from 'jwt-decode';

  function decodeTokenFromLocalStorage () {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken);
        console.log(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

export default decodeTokenFromLocalStorage;
