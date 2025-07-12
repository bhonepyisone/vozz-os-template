// FILE: functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// This function now correctly adds the user's role to their login token
exports.getAuthToken = functions.https.onCall(async (data, context) => {
  const staffId = data.staffId;
  if (!staffId) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with a 'staffId'.");
  }

  try {
    const userDocRef = admin.firestore().collection("users").doc(staffId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", `No user found with Staff ID: ${staffId}`);
    }
    
    const userData = userDoc.data();
    const uid = userDoc.id;
    const userRole = userData.role || 'Staff'; // Default to 'Staff' if no role is set

    // Ensure the user exists in Firebase Auth
    await admin.auth().getUser(uid).catch(async (error) => {
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({ uid: uid, displayName: userData.name });
      }
      throw error;
    });

    // We set a "custom claim" on the user's token. This securely attaches their role to their login session.
    await admin.auth().setCustomUserClaims(uid, { role: userRole });

    // Now, create the token which will include the 'role' claim
    const customToken = await admin.auth().createCustomToken(uid);
    
    return { token: customToken };
  } catch (error) {
    console.error("Error in getAuthToken:", error);
    throw new functions.https.HttpsError("internal", "An internal error occurred creating the token.");
  }
});

// This function now correctly checks for the 'Admin' role claim.
exports.createUser = functions.https.onCall(async (data, context) => {
  // Security Check: Verify the user making the call is an Admin via their token claims.
  if (context.auth.token.role !== 'Admin') {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Permission denied. Only admins can create new users.'
    );
  }

  const { email, password, name, role, shopId } = data;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: name,
      email: email,
      role: role,
      shopId: shopId,
      joinDate: new Date(),
    });

    return { success: true, message: `User ${name} created successfully.` };
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new functions.https.HttpsError('internal', 'Failed to create user.', error.message);
  }
});
