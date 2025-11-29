import api from '../components/api'; // Import your central, configured Axios instance

// GET / - Fetches all of a user's addresses
const getAddresses = async () => {
  try {
    const response = await api.get('/addresses/');
    return response.data;
  } catch (error) {
    console.error('API Error in getAddresses:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch addresses');
  }
};

// POST /add - Adds a new address
const addAddress = async (addressData) => {
  try {
    const response = await api.post('/addresses/add', addressData);
    return response.data;
  } catch (error) {
    console.error('API Error in addAddress:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to add address');
  }
};

// PUT /update/:id - Updates an existing address
const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/addresses/update/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('API Error in updateAddress:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to update address');
  }
};

// DELETE /delete/:id - Deletes an address
const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/addresses/delete/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('API Error in deleteAddress:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to delete address');
  }
};

// PATCH /set-default/:id - Sets an address as the default
const setDefaultAddress = async (addressId) => {
  try {
    const response = await api.patch(`/addresses/set-default/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('API Error in setDefaultAddress:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to set default address');
  }
};

export const addressService = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};