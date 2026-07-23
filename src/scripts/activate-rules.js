/**
 * Kích hoạt ruleset vừa tạo cho Firestore
 */
const { GoogleAuth } = require('google-auth-library');
const https = require('https');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');
const projectId = 'khmerapp-9895c';

// Ruleset name từ bước trước
const RULESET_NAME = 'projects/khmerapp-9895c/rulesets/0c6ece68-b10f-433b-984b-0fe99b269c12';

async function activateRuleset() {
  console.log('🔐 Đang xác thực...');
  const auth = new GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;

  // Tạo release mới trỏ đến ruleset
  const body = JSON.stringify({
    name: `projects/${projectId}/releases/cloud.firestore`,
    rulesetName: RULESET_NAME,
  });

  return new Promise((resolve, reject) => {
    // Thử PUT để tạo/update release
    const options = {
      hostname: 'firebaserules.googleapis.com',
      path: `/v1/projects/${projectId}/releases/cloud.firestore`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    let data = '';
    const req = https.request(options, (res) => {
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Firestore rules đã được KÍCH HOẠT thành công!');
          console.log('🎉 Bây giờ ứng dụng có thể đọc bài viết từ Firestore!\n');
          resolve();
        } else {
          console.error('Response:', res.statusCode, data);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

activateRuleset().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
