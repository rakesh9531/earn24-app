import api from '../components/api'; // Make sure this path is correct for your project structure

/**
 * Fetches the entire category hierarchy in a nested tree structure.
 * This is used for building accordion menus, etc.
 * @returns {Promise<object>} A promise that resolves to an object with { status, data, message }.
 */
const getCategoryTree = async () => {
    try {
        // This endpoint MUST exist on your backend.
        // It should be a public route that returns the nested category JSON.
        const response = await api.get('/categories/tree');
        return response.data;
    } catch (error) {
        console.error('API Error in getCategoryTree:', error.response?.data || error.message);
        // Return a predictable error object to prevent app crashes
        return { 
            status: false, 
            data: [], // Return an empty array so the UI doesn't break
            message: error.response?.data?.message || 'Could not fetch categories.' 
        };
    }
};

/**
 * Fetches sub-categories for a given parent ID.
 * Useful for tabbed interfaces on the home screen.
 * @param {number} parentId - The ID of the parent category.
 * @returns {Promise<object>} A promise that resolves to an object with { status, data, message }.
 */
const getSubCategories = async (parentId) => {
    try {
        // This endpoint MUST exist on your backend.
        const response = await api.get(`/categories/${parentId}/subcategories`);
        return response.data;
    } catch (error) {
        console.error(`API Error fetching sub-categories for parent ${parentId}:`, error.response?.data || error.message);
        return { status: false, data: [], message: 'Could not fetch sub-categories.' };
    }
};


// Export the service object
export const categoryService = {
    getCategoryTree,
    getSubCategories,
};