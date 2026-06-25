import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from '@react-native-documents/picker';
import { kycService } from '../services/kycService';
import { useAlert } from '../components/CustomAlert';

const API_BASE = 'https://newapi.earn24.in';

// ─── Document Picker Button Component ───────────────────────────────────────
const DocUploadButton = ({ label, icon, docKey, selectedDoc, existingUrl, onPress, isReadOnly }) => {
  const hasExisting = !!existingUrl;
  const hasNew = !!selectedDoc;

  const handlePress = () => {
    if (isReadOnly) {
      // In read-only mode: open the existing document for viewing if it exists
      if (existingUrl) {
        const fullUrl = existingUrl.startsWith('http')
          ? existingUrl
          : `${API_BASE}${existingUrl}`;
        Linking.openURL(fullUrl).catch(() =>
          Alert.alert('Cannot Open', 'Unable to open document. Please try again.')
        );
      }
      return;
    }
    onPress(docKey, label);
  };

  const isPdf =
    selectedDoc?.fileType === 'pdf' ||
    selectedDoc?.type === 'application/pdf' ||
    selectedDoc?.name?.toLowerCase().endsWith('.pdf') ||
    (existingUrl && existingUrl.toLowerCase().endsWith('.pdf') && !selectedDoc);

  const previewImageUri =
    hasNew && !isPdf
      ? selectedDoc.uri
      : hasExisting && !isPdf && !hasNew
      ? `${API_BASE}${existingUrl}`
      : null;

  return (
    <View style={docStyles.container}>
      <Text style={docStyles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          docStyles.uploadBox,
          hasNew && !isPdf && docStyles.uploadBoxUploaded,
          hasNew && isPdf && docStyles.uploadBoxPdf,
          hasExisting && !hasNew && docStyles.uploadBoxExisting,
          isReadOnly && docStyles.uploadBoxReadOnly,
        ]}
        onPress={handlePress}
        activeOpacity={isReadOnly && !existingUrl ? 1 : 0.8}
      >
        {/* PDF preview */}
        {isPdf && (hasNew || hasExisting) ? (
          <View style={docStyles.pdfPreview}>
            <Icon name="document-text" size={40} color={hasNew ? '#DC2626' : '#2563EB'} />
            <Text
              style={[docStyles.pdfFileName, hasNew ? docStyles.pdfFileNameNew : docStyles.pdfFileNameExisting]}
              numberOfLines={2}
            >
              {hasNew ? selectedDoc.name || 'document.pdf' : 'Uploaded PDF'}
            </Text>
            {!isReadOnly && <Text style={docStyles.pdfChangeHint}>Tap to replace</Text>}
            {isReadOnly && existingUrl && <Text style={[docStyles.pdfChangeHint, { color: '#2563EB' }]}>Tap to view ↗</Text>}
          </View>
        ) : previewImageUri ? (
          /* Image preview */
          <View style={docStyles.previewContainer}>
            <Image source={{ uri: previewImageUri }} style={docStyles.previewImage} resizeMode="cover" />
            {!isReadOnly && (
              <View style={docStyles.previewOverlay}>
                <Icon name="create-outline" size={20} color="white" />
                <Text style={docStyles.previewOverlayText}>Change</Text>
              </View>
            )}
            {/* FIX: Show "Tap to View" overlay in read-only mode */}
            {isReadOnly && (
              <View style={docStyles.previewOverlay}>
                <Icon name="eye-outline" size={20} color="white" />
                <Text style={docStyles.previewOverlayText}>Tap to View</Text>
              </View>
            )}
          </View>
        ) : (
          /* Empty state */
          <View style={docStyles.emptyState}>
            <View style={[docStyles.iconCircle, isReadOnly && docStyles.iconCircleReadOnly]}>
              <Icon name={icon} size={28} color={isReadOnly ? '#9CA3AF' : '#0CA201'} />
            </View>
            <Text style={[docStyles.uploadTitle, isReadOnly && docStyles.uploadTitleReadOnly]}>
              {isReadOnly ? 'Not Uploaded' : 'Tap to Upload'}
            </Text>
            <Text style={docStyles.uploadSubtitle}>
              {isReadOnly ? '—' : 'Photo (JPG/PNG) or PDF • Max 5MB'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Status pills */}
      {hasNew && !isPdf && (
        <View style={docStyles.statusPill}>
          <Icon name="image-outline" size={13} color="#065F46" />
          <Text style={docStyles.statusPillText}>Image selected ✓</Text>
        </View>
      )}
      {hasNew && isPdf && (
        <View style={[docStyles.statusPill, docStyles.statusPillPdf]}>
          <Icon name="document-text-outline" size={13} color="#7C3AED" />
          <Text style={[docStyles.statusPillText, docStyles.statusPillTextPdf]}>
            PDF selected — {selectedDoc?.name || 'document.pdf'}
          </Text>
        </View>
      )}
      {hasExisting && !hasNew && (
        <View style={[docStyles.statusPill, docStyles.statusPillExisting]}>
          <Icon name="cloud-done-outline" size={13} color="#1E40AF" />
          <Text style={[docStyles.statusPillText, docStyles.statusPillTextExisting]}>
            {isReadOnly
              ? `Uploaded (${isPdf ? 'PDF' : 'Image'})`
              : `Uploaded (${isPdf ? 'PDF' : 'Image'}) — tap to replace`}
          </Text>
        </View>
      )}
      {!hasNew && !hasExisting && !isReadOnly && (
        <View style={[docStyles.statusPill, docStyles.statusPillMissing]}>
          <Icon name="alert-circle-outline" size={13} color="#92400E" />
          <Text style={[docStyles.statusPillText, docStyles.statusPillTextMissing]}>Required</Text>
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
const KYCVerificationScreen = ({ navigation }) => {
  const [kycStatus, setKycStatus] = useState('NOT_SUBMITTED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [hasPendingWithdrawal, setHasPendingWithdrawal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { showAlert, AlertModal } = useAlert();

  // Text fields
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');

  // Existing document URLs (from server)
  const [existingDocs, setExistingDocs] = useState({ panCardDoc: null, aadhaarDoc: null, passkbookDoc: null });

  // Newly selected document files (from image picker)
  const [selectedDocs, setSelectedDocs] = useState({ panCardDoc: null, aadhaarDoc: null, passkbookDoc: null });

  // Active document being uploaded via bottom sheet modal
  const [activeUploadDoc, setActiveUploadDoc] = useState(null); // { docKey, label }

  const fetchKycStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await kycService.getMyKycStatus();
      if (res && res.status) {
        const kycData = res.data;
        const status = kycData?.status || 'NOT_SUBMITTED';
        setKycStatus(status);
        setHasPendingWithdrawal(res.hasPendingWithdrawal || false);

        if (status !== 'NOT_SUBMITTED') {
          setPanNumber(kycData.identity?.panNumber || '');
          setAadhaarNumber(kycData.identity?.aadhaarNumber || '');
          setAccountHolderName(kycData.bank?.accountHolderName || '');
          setAccountNumber(kycData.bank?.accountNumber || '');
          setConfirmAccountNumber(kycData.bank?.accountNumber || '');
          setIfscCode(kycData.bank?.ifscCode || '');
          setBankName(kycData.bank?.bankName || '');
          setRejectionReason(kycData.rejectionReason || '');
          setExistingDocs({
            panCardDoc: kycData.documents?.panCardDoc || null,
            aadhaarDoc: kycData.documents?.aadhaarDoc || null,
            passkbookDoc: kycData.documents?.passkbookDoc || null,
          });
        }
      }
    } catch (error) {
      showAlert('error', 'Load Failed', error.message || 'Failed to fetch KYC status.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchKycStatus(); }, [fetchKycStatus]);

  const handlePickDoc = (docKey, asset) => {
    setSelectedDocs(prev => ({ ...prev, [docKey]: asset }));
  };

  const validateForm = () => {
    if (!panNumber.trim() || !aadhaarNumber.trim() || !accountHolderName.trim() ||
        !accountNumber.trim() || !ifscCode.trim() || !bankName.trim()) {
      showAlert('error', 'Missing Fields', 'All text fields are required.');
      return false;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase().trim())) {
      showAlert('error', 'Invalid PAN', 'Please enter a valid PAN number (e.g. ABCDE1234F).');
      return false;
    }

    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(aadhaarNumber.trim())) {
      showAlert('error', 'Invalid Aadhaar', 'Aadhaar number must be exactly 12 digits.');
      return false;
    }

    if (accountNumber !== confirmAccountNumber) {
      showAlert('error', 'Account Mismatch', 'Bank Account numbers do not match.');
      return false;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase().trim())) {
      showAlert('error', 'Invalid IFSC', 'Please enter a valid IFSC code (e.g. SBIN0001234).');
      return false;
    }

    // Document validation — required for first submission
    const isFirstSubmission = kycStatus === 'NOT_SUBMITTED';
    if (isFirstSubmission) {
      if (!selectedDocs.panCardDoc) {
        showAlert('warning', 'Document Required', 'Please upload your PAN Card photo or PDF.');
        return false;
      }
      if (!selectedDocs.aadhaarDoc) {
        showAlert('warning', 'Document Required', 'Please upload your Aadhaar Card photo or PDF.');
        return false;
      }
      if (!selectedDocs.passkbookDoc) {
        showAlert('warning', 'Document Required', 'Please upload your Bank Passbook photo or PDF.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const fields = {
        panNumber: panNumber.toUpperCase().trim(),
        aadhaarNumber: aadhaarNumber.trim(),
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.toUpperCase().trim(),
        bankName: bankName.trim(),
      };

      const res = await kycService.submitKyc(fields, selectedDocs);
      if (res && res.status) {
        showAlert('success', 'Submitted! ✅', res.message || 'Your KYC details have been submitted for verification.');
        setIsEditMode(false);
        setSelectedDocs({ panCardDoc: null, aadhaarDoc: null, passkbookDoc: null });
        fetchKycStatus();
      } else {
        showAlert('error', 'Submission Failed', res.message || 'Failed to submit KYC details.');
      }
    } catch (error) {
      showAlert('error', 'Submission Error', error.message || 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRequest = () => {
    if (hasPendingWithdrawal) {
      showAlert('warning', 'Update Locked 🔒', 'You have a pending withdrawal request. Please wait for it to be processed before updating your bank details.');
      return;
    }
    showAlert('confirm', 'Update Bank Details?',
      'Updating will reset your KYC to "Pending" status and withdrawals will be suspended until admin re-approves.',
      {
        confirmText: 'Yes, Update',
        cancelText: 'Cancel',
        onConfirm: () => { setIsEditMode(true); setConfirmAccountNumber(''); setSelectedDocs({ panCardDoc: null, aadhaarDoc: null, passkbookDoc: null }); },
      }
    );
  };

  const handleCancelEdit = () => { fetchKycStatus(); setIsEditMode(false); setSelectedDocs({ panCardDoc: null, aadhaarDoc: null, passkbookDoc: null }); };

  const getStatusBanner = () => {
    switch (kycStatus) {
      case 'APPROVED': return (
        <View style={[styles.banner, styles.bannerApproved]}>
          <Icon name="checkmark-circle" size={26} color="#065F46" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitleApproved}>KYC Verified ✅</Text>
            <Text style={styles.bannerDescApproved}>Your identity and bank details are verified. You can request withdrawals and claim cash funds.</Text>
          </View>
        </View>
      );
      case 'PENDING': return (
        <View style={[styles.banner, styles.bannerPending]}>
          <Icon name="time" size={26} color="#92400E" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitlePending}>Verification Pending ⏳</Text>
            <Text style={styles.bannerDescPending}>Your documents are under review. Usually verified within 24–48 hours.</Text>
          </View>
        </View>
      );
      case 'REJECTED': return (
        <View style={[styles.banner, styles.bannerRejected]}>
          <Icon name="alert-circle" size={26} color="#991B1B" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitleRejected}>KYC Rejected ❌</Text>
            <Text style={styles.bannerDescRejected}>Reason: {rejectionReason || 'Documents mismatch.'}{'\n'}Please correct your details and re-submit.</Text>
          </View>
        </View>
      );
      default: return (
        <View style={[styles.banner, styles.bannerInfo]}>
          <Icon name="information-circle" size={26} color="#1E40AF" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitleInfo}>KYC Verification Required</Text>
            <Text style={styles.bannerDescInfo}>Fill in your details and upload your PAN Card, Aadhaar Card, and Bank Passbook photos. Admin will verify and approve within 24–48 hours.</Text>
          </View>
        </View>
      );
    }
  };

  if (isLoading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0CA201" />
      <Text style={styles.loadingText}>Loading KYC Status...</Text>
    </View>
  );

  const isApprovedView = kycStatus === 'APPROVED' && !isEditMode;
  const isPendingView = kycStatus === 'PENDING';
  const isReadOnly = isApprovedView || isPendingView;

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

          {getStatusBanner()}

          {hasPendingWithdrawal && kycStatus === 'APPROVED' && (
            <View style={styles.warningBox}>
              <Icon name="warning-outline" size={18} color="#92400E" />
              <Text style={styles.warningText}>You have a pending withdrawal request. Bank details cannot be updated until it is processed.</Text>
            </View>
          )}

          {isEditMode && (
            <View style={styles.editModeWarning}>
              <Icon name="create-outline" size={18} color="#1E40AF" />
              <Text style={styles.editModeWarningText}>Edit Mode: Submit will reset your KYC to "Pending". Withdrawals will be paused until re-approved by admin.</Text>
            </View>
          )}

          {/* ─── Identity Details ─── */}
          <View style={styles.formContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Identity Information</Text>
              {kycStatus !== 'NOT_SUBMITTED' && (
                <View style={[styles.sectionBadge,
                  kycStatus === 'APPROVED' ? styles.sectionBadgeGreen :
                  kycStatus === 'PENDING' ? styles.sectionBadgeYellow : styles.sectionBadgeRed]}>
                  <Text style={styles.sectionBadgeText}>{kycStatus}</Text>
                </View>
              )}
            </View>

            <InputField label="PAN Card Number" icon="card-outline" value={panNumber} onChangeText={setPanNumber}
              placeholder="ABCDE1234F" autoCapitalize="characters" maxLength={10} editable={!isReadOnly} />

            <InputField label="Aadhaar Card Number" icon="finger-print-outline" value={aadhaarNumber}
              onChangeText={setAadhaarNumber} placeholder="12-digit Aadhaar Number" keyboardType="numeric"
              maxLength={12} editable={!isReadOnly} />

            {/* ─── Bank Details ─── */}
            <Text style={[styles.sectionHeader, { marginTop: 20, marginBottom: 16 }]}>Bank Account Details</Text>

            <InputField label="Account Holder Name" icon="person-outline" value={accountHolderName}
              onChangeText={setAccountHolderName} placeholder="Name as on Bank Records" editable={!isReadOnly} />

            <InputField label="Bank Name" icon="business-outline" value={bankName} onChangeText={setBankName}
              placeholder="e.g. State Bank of India" editable={!isReadOnly} />

            <InputField label="Account Number" icon="wallet-outline" value={accountNumber}
              onChangeText={setAccountNumber} placeholder="Bank Account Number" keyboardType="numeric"
              secureTextEntry={isApprovedView} editable={!isReadOnly} />

            {!isReadOnly && (
              <InputField label="Confirm Account Number" icon="checkmark-circle-outline"
                value={confirmAccountNumber} onChangeText={setConfirmAccountNumber}
                placeholder="Re-enter Account Number" keyboardType="numeric" editable={true} />
            )}

            <InputField label="Bank IFSC Code" icon="code-working-outline" value={ifscCode}
              onChangeText={setIfscCode} placeholder="e.g. SBIN0001234" autoCapitalize="characters"
              maxLength={11} editable={!isReadOnly} />
          </View>

          {/* ─── Document Upload Section ─── */}
          <View style={[styles.formContainer, { marginTop: 16 }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Document Uploads</Text>
              {isReadOnly && (
                <View style={[styles.sectionBadge, kycStatus === 'APPROVED' ? styles.sectionBadgeGreen : styles.sectionBadgeYellow]}>
                  <Text style={styles.sectionBadgeText}>{kycStatus === 'APPROVED' ? '✓ Verified' : 'Under Review'}</Text>
                </View>
              )}
            </View>
            <Text style={styles.docSectionSubtitle}>
              {isReadOnly
                ? 'Documents submitted for verification. Tap a document to view it.'
                : '📋 Upload clear, readable photos of your original documents.\n📁 Accepted formats: JPG, PNG, PDF\n📦 Maximum file size: 5MB per document\n✅ All 3 documents are mandatory for first submission.'}
            </Text>

            <DocUploadButton
              label="PAN Card"
              icon="card-outline"
              docKey="panCardDoc"
              selectedDoc={selectedDocs.panCardDoc}
              existingUrl={existingDocs.panCardDoc}
              onPress={(docKey, label) => setActiveUploadDoc({ docKey, label })}
              isReadOnly={isReadOnly}
            />

            <DocUploadButton
              label="Aadhaar Card"
              icon="finger-print-outline"
              docKey="aadhaarDoc"
              selectedDoc={selectedDocs.aadhaarDoc}
              existingUrl={existingDocs.aadhaarDoc}
              onPress={(docKey, label) => setActiveUploadDoc({ docKey, label })}
              isReadOnly={isReadOnly}
            />

            <DocUploadButton
              label="Bank Passbook / Cheque"
              icon="document-text-outline"
              docKey="passkbookDoc"
              selectedDoc={selectedDocs.passkbookDoc}
              existingUrl={existingDocs.passkbookDoc}
              onPress={(docKey, label) => setActiveUploadDoc({ docKey, label })}
              isReadOnly={isReadOnly}
            />
          </View>

          {/* ─── Action Buttons ─── */}
          <View style={{ marginTop: 16, gap: 12 }}>
            {!isReadOnly && (
              <>
                <TouchableOpacity
                  style={[styles.submitBtn, isSubmitting && { opacity: 0.8 }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Icon name="cloud-upload-outline" size={20} color="white" />
                      <Text style={styles.submitBtnText}>
                        {isEditMode ? 'Submit Updated Details' : 'Submit for Verification'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {isEditMode && (
                  <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
                    <Icon name="close-circle-outline" size={20} color="#6B7280" />
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {isApprovedView && (
              <TouchableOpacity
                style={[styles.updateBankBtn, hasPendingWithdrawal && styles.updateBankBtnDisabled]}
                onPress={handleUpdateRequest}
                activeOpacity={hasPendingWithdrawal ? 1 : 0.8}
              >
                <Icon name={hasPendingWithdrawal ? 'lock-closed-outline' : 'create-outline'}
                  size={18} color={hasPendingWithdrawal ? '#9CA3AF' : '#1D4ED8'} />
                <Text style={[styles.updateBankBtnText, hasPendingWithdrawal && styles.updateBankBtnTextDisabled]}>
                  {hasPendingWithdrawal ? 'Pending Withdrawal — Update Locked' : 'Update Bank Details & Documents'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Upload Option Selection Modal */}
        <Modal
          visible={activeUploadDoc !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setActiveUploadDoc(null)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveUploadDoc(null)}>
            <Pressable onPress={() => {}} style={styles.modalContent}>
              <View style={styles.modalHandle} />
              
              <Text style={styles.modalTitle}>Upload {activeUploadDoc?.label}</Text>
              <Text style={styles.modalSubtitle}>
                Accepted formats: Photo (JPG/PNG) or PDF document. Maximum size is 5MB.
              </Text>

              <View style={styles.modalButtonsContainer}>
                {/* Option 1: Take Photo */}
                <TouchableOpacity
                  style={styles.modalOptionBtn}
                  onPress={() => {
                    const docKey = activeUploadDoc?.docKey;
                    setActiveUploadDoc(null);
                    setTimeout(() => {
                      launchCamera({ mediaType: 'photo', quality: 0.85 }, (response) => {
                        if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
                          handlePickDoc(docKey, { ...response.assets[0], fileType: 'image' });
                        }
                      });
                    }, 300);
                  }}
                >
                  <View style={[styles.modalOptionIconCircle, { backgroundColor: '#EFF6FF' }]}>
                    <Icon name="camera-outline" size={22} color="#2563EB" />
                  </View>
                  <View style={styles.modalOptionTextContainer}>
                    <Text style={styles.modalOptionTitle}>📷 Take Photo</Text>
                    <Text style={styles.modalOptionDesc}>Use camera to scan your document</Text>
                  </View>
                  <Icon name="chevron-forward-outline" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Option 2: Gallery */}
                <TouchableOpacity
                  style={styles.modalOptionBtn}
                  onPress={() => {
                    const docKey = activeUploadDoc?.docKey;
                    setActiveUploadDoc(null);
                    setTimeout(() => {
                      launchImageLibrary({ mediaType: 'photo', quality: 0.85 }, (response) => {
                        if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
                          handlePickDoc(docKey, { ...response.assets[0], fileType: 'image' });
                        }
                      });
                    }, 300);
                  }}
                >
                  <View style={[styles.modalOptionIconCircle, { backgroundColor: '#ECFDF5' }]}>
                    <Icon name="image-outline" size={22} color="#059669" />
                  </View>
                  <View style={styles.modalOptionTextContainer}>
                    <Text style={styles.modalOptionTitle}>🖼️ Choose from Gallery</Text>
                    <Text style={styles.modalOptionDesc}>Select an existing image photo</Text>
                  </View>
                  <Icon name="chevron-forward-outline" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Option 3: PDF Document */}
                <TouchableOpacity
                  style={styles.modalOptionBtn}
                  onPress={() => {
                    const docKey = activeUploadDoc?.docKey;
                    setActiveUploadDoc(null);
                    setTimeout(async () => {
                      try {
                        const [result] = await DocumentPicker.pick({
                          type: [DocumentPicker.types.pdf],
                          allowMultiSelection: false,
                        });
                        if (result.size && result.size > 5 * 1024 * 1024) {
                          Alert.alert('File Too Large', 'PDF file must be under 5MB. Please choose a smaller file.');
                          return;
                        }
                        handlePickDoc(docKey, {
                          uri: result.uri,
                          type: result.type || 'application/pdf',
                          fileName: result.name || 'document.pdf',
                          name: result.name || 'document.pdf',
                          size: result.size,
                          fileType: 'pdf',
                        });
                      } catch (err) {
                        if (!(DocumentPicker.isErrorWithCode(err) && err.code === DocumentPicker.errorCodes.OPERATION_CANCELED)) {
                          Alert.alert('Error', 'Could not open file picker. Please try again.');
                        }
                      }
                    }, 300);
                  }}
                >
                  <View style={[styles.modalOptionIconCircle, { backgroundColor: '#F5F3FF' }]}>
                    <Icon name="document-text-outline" size={22} color="#7C3AED" />
                  </View>
                  <View style={styles.modalOptionTextContainer}>
                    <Text style={styles.modalOptionTitle}>📄 Choose PDF File</Text>
                    <Text style={styles.modalOptionDesc}>Select a PDF document from storage</Text>
                  </View>
                  <Icon name="chevron-forward-outline" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setActiveUploadDoc(null)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>

      {/* AlertModal must be a sibling of KeyboardAvoidingView inside a Fragment */}
      <AlertModal />
    </>
  );
};

// ─── Small reusable input field ───────────────────────────────────────────────
const InputField = ({ label, icon, editable, secureTextEntry, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, !editable && styles.inputWrapperDisabled]}>
      <Icon name={icon} size={20} color={!editable ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
      <TextInput
        style={[styles.textInput, !editable && styles.textInputDisabled]}
        placeholderTextColor="#9CA3AF"
        editable={editable}
        secureTextEntry={secureTextEntry}
        {...props}
      />
    </View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', gap: 12 },
  loadingText: { color: '#6B7280', fontSize: 14 },

  banner: { flexDirection: 'row', padding: 16, borderRadius: 14, marginBottom: 16, borderWidth: 1, alignItems: 'flex-start', gap: 12 },
  bannerTextContainer: { flex: 1 },
  bannerApproved: { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' },
  bannerTitleApproved: { color: '#065F46', fontWeight: '800', fontSize: 15, marginBottom: 4 },
  bannerDescApproved: { color: '#047857', fontSize: 13, lineHeight: 19 },
  bannerPending: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  bannerTitlePending: { color: '#92400E', fontWeight: '800', fontSize: 15, marginBottom: 4 },
  bannerDescPending: { color: '#B45309', fontSize: 13, lineHeight: 19 },
  bannerRejected: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  bannerTitleRejected: { color: '#991B1B', fontWeight: '800', fontSize: 15, marginBottom: 4 },
  bannerDescRejected: { color: '#B91C1C', fontSize: 13, lineHeight: 19 },
  bannerInfo: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  bannerTitleInfo: { color: '#1E3A8A', fontWeight: '800', fontSize: 15, marginBottom: 4 },
  bannerDescInfo: { color: '#2563EB', fontSize: 13, lineHeight: 19 },

  warningBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FCD34D', borderRadius: 10, padding: 12, marginBottom: 14, alignItems: 'flex-start', gap: 8 },
  warningText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18 },
  editModeWarning: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#93C5FD', borderRadius: 10, padding: 12, marginBottom: 14, alignItems: 'flex-start', gap: 8 },
  editModeWarningText: { flex: 1, fontSize: 13, color: '#1E40AF', lineHeight: 18 },

  formContainer: { backgroundColor: 'white', borderRadius: 18, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#111827' },
  sectionBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  sectionBadgeGreen: { backgroundColor: '#D1FAE5' },
  sectionBadgeYellow: { backgroundColor: '#FEF3C7' },
  sectionBadgeRed: { backgroundColor: '#FEE2E2' },
  sectionBadgeText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  docSectionSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 18, lineHeight: 20 },

  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 10, backgroundColor: '#F9FAFB', paddingHorizontal: 12 },
  inputWrapperDisabled: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, height: 46, fontSize: 15, color: '#111827' },
  textInputDisabled: { color: '#6B7280' },

  submitBtn: { flexDirection: 'row', backgroundColor: '#0CA201', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2 },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  cancelBtn: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', gap: 8 },
  cancelBtnText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
  updateBankBtn: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', gap: 8 },
  updateBankBtnDisabled: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  updateBankBtnText: { color: '#1D4ED8', fontSize: 15, fontWeight: '600' },
  updateBankBtnTextDisabled: { color: '#9CA3AF' },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  modalOptionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionTextContainer: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  modalOptionDesc: {
    fontSize: 11,
    color: '#6B7280',
  },
  modalCancelBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '700',
  },
});

const docStyles = StyleSheet.create({
  container: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    height: 140,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  uploadBoxUploaded: { borderColor: '#6EE7B7', borderStyle: 'solid', backgroundColor: '#ECFDF5' },
  uploadBoxPdf:      { borderColor: '#DDD6FE', borderStyle: 'solid', backgroundColor: '#F5F3FF' },
  uploadBoxExisting: { borderColor: '#93C5FD', borderStyle: 'solid', backgroundColor: '#EFF6FF' },
  uploadBoxReadOnly: { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
  iconCircleReadOnly: { backgroundColor: '#F3F4F6' },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: '#0CA201' },
  uploadTitleReadOnly: { color: '#9CA3AF' },
  uploadSubtitle: { fontSize: 12, color: '#9CA3AF' },

  previewContainer: { flex: 1, position: 'relative' },
  previewImage: { width: '100%', height: '100%' },
  previewOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', paddingVertical: 8, gap: 6
  },
  previewOverlayText: { color: 'white', fontSize: 13, fontWeight: '600' },

  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
    backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start'
  },
  statusPillText: { fontSize: 11, fontWeight: '600', color: '#065F46' },
  statusPillPdf: { backgroundColor: '#F5F3FF' },
  statusPillTextPdf: { color: '#7C3AED' },
  statusPillExisting: { backgroundColor: '#EFF6FF' },
  statusPillTextExisting: { color: '#1E40AF' },
  statusPillMissing: { backgroundColor: '#FFFBEB' },
  statusPillTextMissing: { color: '#92400E' },

  // PDF preview inside upload box
  pdfPreview: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  pdfFileName: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  pdfFileNameNew: { color: '#DC2626' },
  pdfFileNameExisting: { color: '#2563EB' },
  pdfChangeHint: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
});

export default KYCVerificationScreen;
