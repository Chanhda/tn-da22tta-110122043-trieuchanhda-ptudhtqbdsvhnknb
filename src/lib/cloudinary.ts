/**
 * Cloudinary Image Upload Utility
 * Cloud name: dijsvql6w | Preset: khmerapp_preset (unsigned)
 *
 * Lưu ý: React Native không hỗ trợ fetch → blob như trên web.
 * Dùng URI trực tiếp trong FormData là cách đúng cho mobile.
 */

import { Platform } from 'react-native';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dijsvql6w';
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'khmerapp_preset';

export type UploadFolder = 'articles' | 'heritages' | 'avatars' | 'festivals';

/**
 * Upload ảnh lên Cloudinary và trả về URL công khai.
 * Hỗ trợ cả React Native (mobile) và Web.
 */
export async function uploadImageToCloudinary(
  uri: string,
  folder: UploadFolder = 'articles'
): Promise<string> {
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  let body: FormData;

  if (Platform.OS === 'web') {
    // Web: fetch → blob → FormData
    const response = await fetch(uri);
    const blob = await response.blob();
    body = new FormData();
    body.append('file', blob, `upload_${Date.now()}.jpg`);
  } else {
    // React Native (iOS / Android): dùng URI trực tiếp
    body = new FormData();
    body.append('file', {
      uri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    } as any);
  }

  body.append('upload_preset', UPLOAD_PRESET);
  body.append('folder', `khmerapp/${folder}`);

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body,
    headers: {
      // KHÔNG đặt Content-Type — để fetch tự set multipart boundary
    },
  });

  if (!uploadResponse.ok) {
    const err = await uploadResponse.text();
    throw new Error(`Cloudinary upload thất bại (${uploadResponse.status}): ${err}`);
  }

  const data = await uploadResponse.json();
  return data.secure_url as string;
}
