const API = import.meta.env.REACT_APP_API_URL;

const endPoints = {
  autentication: {
    postLogin:`${API}/user/login`,
  },
  administrator:{
    getInventory:`${API}/inventory/all`,
    getUserAndRoles:`${API}`,
    postAddElementInventory:` ${API}/inventory/create`,
  }
};

export default endPoints;
