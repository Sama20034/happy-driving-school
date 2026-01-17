import { supabase } from "@/integrations/supabase/client";

export const uploadUserDocument = async (
  file: File,
  userId: string,
  documentType: 'id_card' | 'personal_photo'
): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('user-documents')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading document:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('user-documents')
    .getPublicUrl(fileName);

  return publicUrl;
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
