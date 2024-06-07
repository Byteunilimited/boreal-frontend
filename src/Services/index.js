const API = import.meta.env.VITE_API_URL;

const endPoints = {
  autentication: {
    postLogin: `${API}/posts`,
  },
};

export default endPoints;
