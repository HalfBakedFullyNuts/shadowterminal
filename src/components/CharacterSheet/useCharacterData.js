import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { createInitialCharacter, calculateDerivedStats } from '../../lib/sr4/characterModel';

/**
 * Custom hook to manage character data fetching and persistence.
 * Enforces defensive checks on inputs and handles async operations safely.
 */
export function useCharacterData(characterId, currentUser) {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const loadCharacter = async () => {
            try {
                if (characterId === 'new') {
                    setCharacter(createInitialCharacter(currentUser.uid));
                } else {
                    const docRef = doc(db, 'characters', characterId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCharacter(docSnap.data());
                    } else {
                        setError('Character not found');
                    }
                }
            } catch (err) {
                console.error("Failed to load character:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCharacter();
    }, [characterId, currentUser]);

    const saveCharacter = async () => {
        if (!character) return null;
        setSaving(true);
        try {
            const charToSave = calculateDerivedStats(character);
            const id = characterId === 'new' ? Date.now().toString() : characterId;
            await setDoc(doc(db, 'characters', id), { ...charToSave, id });
            return id;
        } catch (err) {
            console.error("Error saving character:", err);
            setError(err.message);
            return null;
        } finally {
            setSaving(false);
        }
    };

    return { character, setCharacter, loading, saving, error, saveCharacter };
}
