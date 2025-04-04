import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, getDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { deleteDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import {sendVerificationEmail , sendNotificationEmail} from './email.js';
dotenv.config();

const expTime = 60 * 1* 1000; // verfication code expiration time in milliseconds
// intialize firebase & express app
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

initializeApp(firebaseConfig);

const db = getFirestore();
const colRef = collection(db, 'url');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware & config
app.use(cors({ origin: "*" }));
app.use(express.json());

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000);

// routes
app.post('/shorten', async (req, res) => {
    console.log(req.body);
    try {
        const { originalURL, emails = [], requireSign = false, expDate = null , sendNotification = false , ownerEmail , ownerName } = req.body;
        
        let expirationDate = null;
        if (expDate !== null) {
            expirationDate = new Date(expDate);
        }
        
        const shortId = nanoid(8); 
        const urlData = {
            createdAt: Timestamp.now(),
            'expire-date': expirationDate ? Timestamp.fromDate(expirationDate) : null,
            emails: emails,
            originalURL: originalURL,
            shortId: shortId,
            'require-sign': requireSign,
            'send-notification': sendNotification,
            ownerEmail : ownerEmail,
            ownerName :ownerName ,
        };
        

        const docRef = await addDoc(colRef, urlData);
        console.log('Document written with ID: ', docRef.id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log('Document data:', data);


        res.json({ 
            shortURL: `${req.protocol}://${req.get('host')}/${shortId}`,
        });

    } catch (error) {
        console.error('Error creating shortened URL:', error);
        res.status(500).json({ error: 'Failed to create shortened URL' });
    }
});

app.post('/auth/verify-email', async (req, res) => {
    try {
        const { email, shortId } = req.body;

        if (!email || !shortId) {
            return res.status(400).json({ error: 'Email and shortId are required' });
        }

        const verificationCode = generateVerificationCode();
        const expirationTime = Timestamp.fromDate(new Date(Date.now() + expTime));

        const q = query(colRef, where('shortId', '==', shortId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const docSnap = querySnapshot.docs[0];
        const urlData = docSnap.data();

        if (!urlData.emails.includes(email)) {
            return res.status(403).json({ error: 'Email not authorized for this URL' });
        }

        await addDoc(collection(db, 'verifications'), {
            email,
            shortId,
            code: verificationCode,
            expiresAt: expirationTime
        });
        //
        console.log(`Verification code being send to ${email}: ${verificationCode}`);
        await sendVerificationEmail(email, verificationCode);

        res.json({ success: true , exptime: expTime / 1000 });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ error: 'Failed to send verification email' });
    }
});

app.post('/auth/verify-code', async (req, res) => {
    try {
        const { email, shortId, code } = req.body;

        if (!email || !shortId || !code) {
            return res.status(400).json({ error: 'Email, shortId, and code are required' });
        }

        const q = query(
            collection(db, 'verifications'),
            where('email', '==', email),
            where('shortId', '==', shortId),
            where('code', '==', parseInt(code))
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        const verificationDoc = querySnapshot.docs[0];
        const verificationData = verificationDoc.data();

        if (verificationData.expiresAt.toDate() < new Date()) {
            return res.status(400).json({ error: 'Code has expired' });
        }

        // Delete the verification document after successful verification
        await deleteDoc(verificationDoc.ref);

        const urlQuery = query(colRef, where('shortId', '==', shortId));
        const urlSnapshot = await getDocs(urlQuery);

        if (urlSnapshot.empty) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const urlData = urlSnapshot.docs[0].data();

        res.json({ success: true, redirectUrl: urlData.originalURL });
        // replace with actual email service
        if (urlData['send-notification']) {
            console.log(`Notification being send to ${urlData.ownerEmail} ${urlData.ownerName} for URL: ${urlData.originalURL}`);
            await sendNotificationEmail(urlData.ownerEmail, email, urlData.ownerName, urlData.originalURL);
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
});


app.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const q = query(colRef, where('shortId', '==', shortId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const urlData = docSnap.data();
            
            if (urlData['expire-date'] && urlData['expire-date'].toDate() < new Date()) {
                return res.status(410).json({ error: 'URL has expired' });
            }


            if (urlData['require-sign']) {
                res.redirect(`${process.env.FRONTEND_URL}/auth?shortId=${shortId}`);
            }
            else
            {
                res.redirect(urlData.originalURL);
            }
            
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error redirecting to authentication page:', error);
        res.status(500).json({ error: 'Failed to redirect to authentication page' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
