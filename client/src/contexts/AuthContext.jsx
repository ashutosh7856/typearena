import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Create or update user profile in Firestore
            await createUserProfile(user);

            return user;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    // Create user profile in Firestore
    const createUserProfile = async (user) => {
        if (!user) return;

        try {
            console.log('Creating user profile for:', user.uid);
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Create new user profile
                const profileData = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    stats: {
                        totalMatches: 0,
                        avgWPM: 0,
                        avgAccuracy: 0,
                        bestWPM: 0,
                        totalTimeTyped: 0
                    },
                    achievements: []
                };

                console.log('Writing profile to Firestore...');
                await setDoc(userRef, profileData);
                console.log('✅ Profile created successfully!');
                setUserProfile(profileData);
            } else {
                console.log('Profile already exists, loading...');
                setUserProfile(userSnap.data());
            }
        } catch (error) {
            console.error('❌ ERROR creating user profile:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // Show user-friendly error
            if (error.code === 'permission-denied') {
                alert('Firestore database needs to be set up. Please check the Firebase setup guide.');
            } else {
                alert(`Error creating profile: ${error.message}`);
            }
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUserProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserProfile(userSnap.data());
                } else {
                    await createUserProfile(user);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
