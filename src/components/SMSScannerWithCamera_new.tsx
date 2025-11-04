// This is a helper file to show the updated startCamera function
// Copy this function to replace the startCamera function in SMSScannerWithCamera.tsx

const startCamera = async () => {
  try {
    setCameraError(null); // Clear any previous errors
    
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = language === 'hi' 
        ? 'कैमरा इस ब्राउज़र में समर्थित नहीं है। कृपया एक आधुनिक ब्राउज़र का उपयोग करें।'
        : 'Camera is not supported in this browser. Please use a modern browser.';
      setCameraError(errorMsg);
      toast.error(errorMsg, { duration: 5000 });
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
      toast.success(language === 'hi' ? 'कैमरा शुरू हो गया' : 'Camera started', { duration: 2000 });
    }
  } catch (error: any) {
    console.error('Camera error:', error);
    
    let errorMsg = '';
    let errorTitle = '';
    
    // Handle different error types
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorTitle = language === 'hi' ? '📷 कैमरा अनुमति अस्वीकृत' : '📷 Camera Permission Denied';
      errorMsg = language === 'hi' 
        ? 'कैमरा एक्सेस अस्वीकृत। "छवि अपलोड करें" बटन का उपयोग करें।'
        : 'Camera access denied. Please use the "Upload Image" button instead.';
      
      setCameraError(errorMsg);
      
      // Automatically trigger file upload as fallback
      toast.error(errorTitle, {
        description: errorMsg + '\n\n' + (language === 'hi' ? '💡 फ़ाइल चयनकर्ता खोला जा रहा है...' : '💡 Opening file picker...'),
        duration: 5000,
      });
      
      // Open file picker after a short delay
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 500);
      
      return; // Exit early to prevent showing additional error messages
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorTitle = language === 'hi' ? '📷 कैमरा नहीं मिला' : '📷 Camera Not Found';
      errorMsg = language === 'hi'
        ? 'कोई कैमरा डिवाइस नहीं मिला। कृपया "छवि अपलोड करें" बटन का उपयोग करें।'
        : 'No camera device found. Please use the "Upload Image" button instead.';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorTitle = language === 'hi' ? '📷 कैमरा उपयोग में है' : '📷 Camera In Use';
      errorMsg = language === 'hi'
        ? 'कैमरा किसी अन्य ऐप द्वारा उपयोग में है। कृपया अन्य ऐप्स बंद करें और पुनः प्रयास करें।'
        : 'Camera is being used by another app. Please close other apps and try again.';
    } else if (error.name === 'OverconstrainedError') {
      errorTitle = language === 'hi' ? '📷 कैमरा समर्थित नहीं' : '📷 Camera Not Supported';
      errorMsg = language === 'hi'
        ? 'आपका कैमरा आवश्यकताओं को पूरा नहीं करता। "छवि अपलोड करें" का उपयोग करें।'
        : 'Your camera does not meet requirements. Use "Upload Image" instead.';
    } else {
      errorTitle = language === 'hi' ? '📷 कैमरा त्रुटि' : '📷 Camera Error';
      errorMsg = language === 'hi'
        ? 'कैमरा एक्सेस करने में त्रुटि। "छवि अपलोड करें" बटन का उपयोग करें।'
        : 'Error accessing camera. Use "Upload Image" button instead.';
    }
    
    setCameraError(errorMsg);
    toast.error(errorTitle, {
      description: errorMsg,
      duration: 8000,
    });
  }
};
