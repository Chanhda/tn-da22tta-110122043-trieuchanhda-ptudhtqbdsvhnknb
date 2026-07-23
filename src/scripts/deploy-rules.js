/**
 * Deploy Firestore rules bằng Firebase Admin SDK (không cần firebase login)
 * Chạy: node scripts/deploy-rules.js
 */
const admin = require('firebase-admin');
const { GoogleAuth } = require('google-auth-library');
const https = require('https');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');
const rulesPath = path.resolve(__dirname, '../firestore.rules');
const projectId = 'khmerapp-9895c';

async function deployRules() {
  console.log('🔐 Đang xác thực với Firebase...');

  const auth = new GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;

  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  const body = JSON.stringify({
    source: {
      files: [
        {
          name: 'firestore.rules',
          content: rulesContent,
        },
      ],
    },
  });

  console.log('📤 Đang upload Firestore rules...');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firebaserules.googleapis.com',
      path: `/v1/projects/${projectId}/rulesets`,
      method: 'POST',
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
          const result = JSON.parse(data);
          const rulesetName = result.name;
          console.log(`✅ Đã tạo ruleset: ${rulesetName}`);

          // Activate the ruleset
          activateRuleset(accessToken, projectId, rulesetName)
            .then(resolve)
            .catch(reject);
        } else {
          console.error('❌ Lỗi tạo ruleset:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function activateRuleset(accessToken, projectId, rulesetName) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      name: `projects/${projectId}/releases/cloud.firestore`,
      rulesetName,
    });

    // First try to update existing release
    const patchOptions = {
      hostname: 'firebaserules.googleapis.com',
      path: `/v1/projects/${projectId}/releases/cloud.firestore`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    let data = '';
    const req = https.request(patchOptions, (res) => {
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Firestore rules đã được deploy thành công!');
          console.log('🎉 Bài viết trong Firestore giờ có thể đọc được từ ứng dụng!\n');
          resolve();
        } else {
          console.error('⚠️  Không thể kích hoạt ruleset tự động.');
          console.log('\n📋 Vui lòng làm thủ công:');
          console.log('1. Mở: https://console.firebase.google.com/project/khmerapp-9895c/firestore/rules');
          console.log('2. Copy nội dung file firestore.rules và paste vào editor');
          console.log('3. Nhấn "Publish"\n');
          resolve(); // don't reject - just inform user
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

deployRules().catch(err => {
  console.error('❌ Lỗi:', err.message);
  console.log('\n📋 Deploy rules thủ công:');
  console.log('1. Mở: https://console.firebase.google.com/project/khmerapp-9895c/firestore/rules');
  console.log('2. Copy nội dung file firestore.rules và paste vào editor');
  console.log('3. Nhấn "Publish"\n');
  process.exit(0);
});
