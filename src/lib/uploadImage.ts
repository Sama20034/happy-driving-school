// رفع الصور إلى Hostinger
const UPLOAD_URL = 'https://dinaahmedacademy.com/upload.php';

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        url: result.url,
        filename: result.filename,
      };
    } else {
      return {
        success: false,
        error: result.error || 'فشل في رفع الصورة',
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء رفع الصورة',
    };
  }
};

export const deleteImage = async (filename: string): Promise<boolean> => {
  // يمكنك إضافة endpoint للحذف لاحقاً إذا أردت
  console.log('Delete image:', filename);
  return true;
};
