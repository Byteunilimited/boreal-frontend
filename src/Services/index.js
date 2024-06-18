const API = import.meta.env.REACT_APP_API_URL;

const endPoints = {
  autentication: {
    postLogin:`${API}/boreal/user/login`,
  },
  administrator:{
    getInventory:`${API}/boreal/spare/all`,
  }
};

export default endPoints;
