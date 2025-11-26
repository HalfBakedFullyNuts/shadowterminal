import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createInitialCharacter } from '../lib/sr4/characterModel';

/**
 * Custom hook to fetch and manage the list of characters for a user.
 */
export function useCharacterList(currentUser) {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);
        // Fetch ALL characters to support GM mode and Public NPCs
        const q = query(collection(db, 'characters'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chars = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCharacters(chars);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching characters:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const createCharacter = async () => {
        if (!currentUser) return null;
        try {
            const newChar = createInitialCharacter(currentUser.uid);
            const docRef = await addDoc(collection(db, 'characters'), newChar);
            return docRef.id;
        } catch (error) {
            console.error("Error creating character:", error);
            return null;
        }
    };

    const deleteCharacter = async (id) => {
        if (window.confirm('Delete this character permanently?')) {
            try {
                await deleteDoc(doc(db, 'characters', id));
                // State update handled by onSnapshot
            } catch (error) {
                console.error("Error deleting character:", error);
            }
        }
    };

    return { characters, loading, error, createCharacter, deleteCharacter };
}
