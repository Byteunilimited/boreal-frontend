import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../Contexts';

export const Profile = () => {
  const { privateFetch } = useAxios();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 

        if (!token || !userId) {
          // Manejar el caso en que no haya token o ID de usuario (usuario no autenticado)
          console.error('No token or userId found. User not authenticated.');
          return;
        }

        // Hacer la solicitud GET para obtener el perfil del usuario actual
        const response = await privateFetch.get(`/user/id?id=${encodeURIComponent(userId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUser(response.data.result.user); // Asignar datos del usuario obtenidos
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [privateFetch]); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error('No token found. User not authenticated.');
        return;
      }


      const response = await privateFetch.put('/boreal/user/update', user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('User profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <label>Name:</label>
      <input type="text" name="name" value={user.name} onChange={handleChange} />
      
      <label>Last Name:</label>
      <input type="text" name="lastName" value={user.lastName} onChange={handleChange} />
      
      <label>Phone:</label>
      <input type="text" name="phone" value={user.phone} onChange={handleChange} />
      
      <label>Address:</label>
      <input type="text" name="address" value={user.address} onChange={handleChange} />
      
      <label>Email:</label>
      <input type="email" name="email" value={user.email} onChange={handleChange} />
      
      {/* Add more fields as needed */}

      <button type="submit">Update Profile</button>
    </form>
  );
};


