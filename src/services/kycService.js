import api from '../components/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Submit KYC with text fields + document images as multipart/form-data
const submitKyc = async (fields, documents) => {
  try {
    const token = await AsyncStorage.getItem('user_token');

    const formData = new FormData();

    // Text fields
    formData.append('panNumber', fields.panNumber);
    formData.append('aadhaarNumber', fields.aadhaarNumber);
    formData.append('accountHolderName', fields.accountHolderName);
    formData.append('accountNumber', fields.accountNumber);
    formData.append('ifscCode', fields.ifscCode);
    formData.append('bankName', fields.bankName);

    // Document files (only append if new file selected)
    if (documents.panCardDoc) {
      formData.append('pan_card_doc', {
        uri: documents.panCardDoc.uri,
        type: documents.panCardDoc.type || (documents.panCardDoc.fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'),
        name: documents.panCardDoc.name || documents.panCardDoc.fileName || 'pan_card.jpg',
      });
    }
    if (documents.aadhaarDoc) {
      formData.append('aadhaar_card_doc', {
        uri: documents.aadhaarDoc.uri,
        type: documents.aadhaarDoc.type || (documents.aadhaarDoc.fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'),
        name: documents.aadhaarDoc.name || documents.aadhaarDoc.fileName || 'aadhaar_card.jpg',
      });
    }
    if (documents.passkbookDoc) {
      formData.append('bank_passbook_doc', {
        uri: documents.passkbookDoc.uri,
        type: documents.passkbookDoc.type || (documents.passkbookDoc.fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'),
        name: documents.passkbookDoc.name || documents.passkbookDoc.fileName || 'bank_passbook.jpg',
      });
    }

    const response = await api.post('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in submitKyc:', error.response?.data || error.message);
    if (error.response?.status === 413) {
      throw new Error('Uploaded documents are too large for the server. Please compress your photos/PDFs or ask admin to increase Nginx client_max_body_size.');
    }
    const errorData = error.response?.data;
    if (errorData && typeof errorData === 'object' && errorData.message) {
      throw new Error(errorData.message);
    }
    throw new Error(typeof errorData === 'string' && errorData.length < 150 ? errorData : 'Failed to submit KYC details. Please check connection and try again.');
  }
};

const getMyKycStatus = async () => {
  try {
    const response = await api.get('/kyc/my-status');
    return response.data;
  } catch (error) {
    console.error('Error in getMyKycStatus:', error.response?.data || error.message);
    const errorData = error.response?.data;
    if (errorData && typeof errorData === 'object' && errorData.message) {
      throw new Error(errorData.message);
    }
    throw new Error('Failed to fetch KYC status.');
  }
};

export const kycService = {
  submitKyc,
  getMyKycStatus,
};
