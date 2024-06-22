import axios from 'axios';
import endPoints from './index';

const getInventory = async (body) => {
    const config = {
        headers: {
          accept: '*//*',
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.get(endPoints.administrator.getInventory, body, config);
      console.log(response);
      return response.data;

};

export { getInventory}; 
