import { supabase } from "@/integrations/supabase/client";

// رفع المستندات إلى Hostinger
const UPLOAD_URL = 'https://captainmisr.com/upload.php';

export const uploadUserDocument = async (
  file: File,
  userId: string,
  documentType: 'id_card' | 'personal_photo'
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      return result.url;
    } else {
      console.error('Error uploading document:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};

export const updateProfileDocuments = async (
  userId: string,
  idCardUrl: string,
  personalPhotoUrl: string
) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      id_card_url: idCardUrl,
      personal_photo_url: personalPhotoUrl
    })
    .eq('user_id', userId);

  return { error };
};
