import api from '../components/api';

/**
 * Fetches approved reviews, rating breakdown stats, and customer media gallery for a product.
 * @param {number|string} productId 
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('API Error in getProductReviews:', error.response?.data || error.message);
    return { status: false, data: null, message: error.response?.data?.message || 'Could not fetch reviews.' };
  }
};

/**
 * Submits a new customer review (supports multipart FormData with photos/videos).
 * @param {FormData} formData 
 */
export const postReview = async (formData) => {
  try {
    const response = await api.post('/reviews/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error in postReview:', error.response?.data || error.message);
    return { status: false, message: error.response?.data?.message || 'Could not submit review.' };
  }
};

/**
 * Updates an existing customer review.
 * @param {number|string} reviewId 
 * @param {FormData} formData 
 */
export const updateReview = async (reviewId, formData) => {
  try {
    const response = await api.put(`/reviews/update/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error in updateReview:', error.response?.data || error.message);
    return { status: false, message: error.response?.data?.message || 'Could not update review.' };
  }
};

/**
 * Deletes a customer review.
 * @param {number|string} reviewId 
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('API Error in deleteReview:', error.response?.data || error.message);
    return { status: false, message: error.response?.data?.message || 'Could not delete review.' };
  }
};

export default {
  getProductReviews,
  postReview,
  updateReview,
  deleteReview,
};
