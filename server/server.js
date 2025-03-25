import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, getDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
dotenv.config();

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



// routes
app.post('/api/shorten', async (req, res) => {
    console.log(req.body);
    try {
        const { originalURL, emails = [], requireSign = false, expDate = null } = req.body;
        
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
            'require-sign': requireSign
        };
        
        const docRef = await addDoc(colRef, urlData);
        
        res.json({ 
            shortURL: `${req.protocol}://${req.get('host')}/${shortId}`,
        });

    } catch (error) {
        console.error('Error creating shortened URL:', error);
        res.status(500).json({ error: 'Failed to create shortened URL' });
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
            
            res.redirect(urlData.originalURL);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error redirecting to original URL:', error);
        res.status(500).json({ error: 'Failed to redirect to original URL' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
