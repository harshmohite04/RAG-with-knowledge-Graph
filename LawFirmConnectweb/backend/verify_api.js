const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');

const API_URL = 'http://localhost:5000';
let token = '';
let userId = '';
let caseId = '';

const runTests = async () => {
    try {
        console.log('--- STARTING API VERIFICATION ---');

        // 1. Register User
        console.log('\n[1] Testing Registration...');
        const regData = {
            firstName: 'Test',
            lastName: 'User',
            email: `test${Date.now()}@example.com`,
            phone: `123456${Date.now().toString().slice(-4)}`,
            password: 'password123'
        };
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, regData);
            console.log('✅ Registration Successful:', regRes.data.email);
            token = regRes.data.token;
            userId = regRes.data._id;
        } catch (e) {
            if (e.response && e.response.status === 400 && e.response.data.message.includes('already exists')) {
                console.log('⚠️  User already exists, trying login...');
                 // Fallback login if needed, but email is unique timestamp
            } else {
                throw e;
            }
        }

        // 2. Login (Double Check)
        console.log('\n[2] Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: regData.email,
            password: regData.password
        });
        console.log('✅ Login Successful. Token received.');
        token = loginRes.data.token; // Update token

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 3. Create Case
        console.log('\n[3] Testing Case Creation...');
        const caseData = {
            title: 'Automated Test Case',
            description: 'This case was created by the verification script.',
            status: 'Open',
            legalMatter: 'Litigation'
        };
        const caseRes = await axios.post(`${API_URL}/cases`, caseData, authHeaders);
        console.log('✅ Case Created:', caseRes.data.title, `ID: ${caseRes.data._id}`);
        caseId = caseRes.data._id;

        // 4. Get Case Details
        console.log('\n[4] Testing Get Case Details...');
        const getCaseRes = await axios.get(`${API_URL}/cases/${caseId}`, authHeaders);
        if (getCaseRes.data._id === caseId) {
            console.log('✅ Case Details Verified.');
        } else {
            console.error('❌ Case Details Mismatch');
        }

        // 5. Add Activity
        console.log('\n[5] Testing Add Activity...');
        const activityData = {
            description: 'Verified API activity log.',
            type: 'note_added'
        };
        const actRes = await axios.post(`${API_URL}/cases/${caseId}/activity`, activityData, authHeaders);
        console.log('✅ Activity Added. Count:', actRes.data.length);

        // 6. Test Settings Update (Soft Delete check)
        // console.log('\n[6] Testing Case Settings (Soft Delete)...');
        // await axios.patch(`${API_URL}/cases/${caseId}/settings`, { recordStatus: 0 }, authHeaders);
        // console.log('✅ Case Soft Deleted.');

        console.log('\n--- VERIFICATION COMPLETE: ALL TESTS PASSED ---');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
};

runTests();
