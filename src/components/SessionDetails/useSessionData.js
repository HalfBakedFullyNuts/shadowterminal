import { useState, useEffect } from 'react';
import { doc, collection, onSnapshot, updateDoc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getISOWeek } from '../../lib/dateUtils';

/**
 * Manages session data, real-time availability updates, and consensus logic.
 * Enforces N-1 consensus rule with tie-breaking (Saturday > Earliest).
 * Now supports persistent GM role via 'campaigns' collection.
 */
export function useSessionData(sessionId, currentUser) {
    const [session, setSession] = useState(null);
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        if (!sessionId) return;
        const sessionRef = doc(db, 'sessions', sessionId);

        // Real-time listener for session document
        const unsubSession = onSnapshot(sessionRef, async (docSnap) => {
            if (docSnap.exists()) {
                const sessionData = { id: docSnap.id, ...docSnap.data() };
                setSession(sessionData);

                // Fetch associated campaign to get GM ID
                if (sessionData.campaignId) {
                    const campSnap = await getDoc(doc(db, 'campaigns', sessionData.campaignId));
                    if (campSnap.exists()) {
                        setCampaign({ id: campSnap.id, ...campSnap.data() });
                    }
                }
            }
        });

        // Real-time listener for availability sub-collection
        const unsubAvail = onSnapshot(collection(sessionRef, 'availability'), (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setAvailabilities(data);
            setLoading(false);
        });

        return () => {
            unsubSession();
            unsubAvail();
        };
    }, [sessionId]);

    /**
     * Toggles a date for the current user and checks for consensus.
     */
    const toggleDate = async (date) => {
        if (!currentUser || !session) return;

        const myAvail = availabilities.find(a => a.userId === currentUser.uid) || { availableDates: [] };
        const currentDates = new Set(myAvail.availableDates || []);

        if (currentDates.has(date)) currentDates.delete(date);
        else currentDates.add(date);

        const userRef = doc(db, 'sessions', sessionId, 'availability', currentUser.uid);
        await setDoc(userRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName || 'Unknown Agent',
            availableDates: Array.from(currentDates)
        }, { merge: true });

        // Check consensus after update
        // We pass the updated dates for the current user to avoid stale state issues
        checkConsensus(Array.from(currentDates));
    };

    /**
     * Checks if any date has reached N-1 votes and finalizes if so.
     * Requires GM to be one of the voters.
     */
    const checkConsensus = async (myNewDates) => {
        const totalParticipants = availabilities.length || 1;
        if (totalParticipants < 2) return; // Need at least 2 people

        const threshold = totalParticipants - 1;
        const gmId = campaign?.gmId || session?.creatorId; // Fallback to creator if no campaign

        // Tally votes
        const voteCounts = {};
        const votersPerDate = {};

        // Add existing votes (excluding mine)
        availabilities.forEach(a => {
            if (a.userId === currentUser.uid) return;
            a.availableDates?.forEach(d => {
                voteCounts[d] = (voteCounts[d] || 0) + 1;
                if (!votersPerDate[d]) votersPerDate[d] = new Set();
                votersPerDate[d].add(a.userId);
            });
        });

        // Add my new votes
        myNewDates.forEach(d => {
            voteCounts[d] = (voteCounts[d] || 0) + 1;
            if (!votersPerDate[d]) votersPerDate[d] = new Set();
            votersPerDate[d].add(currentUser.uid);
        });

        // Find candidates that meet threshold AND include GM
        const candidates = Object.entries(voteCounts)
            .filter(([date, count]) => {
                const hasGM = votersPerDate[date]?.has(gmId);
                return count >= threshold && hasGM;
            })
            .map(([date]) => date);

        if (candidates.length > 0) {
            const winner = pickWinner(candidates);
            if (winner) await finalizeSession(winner);
        }
    };

    const pickWinner = (candidates) => {
        // Group by ISO Week to enforce 1 per week constraint
        // For now, we just pick the best one overall, assuming the session is for a single event.
        // If we wanted to schedule multiple, we'd need to know which weeks are already booked.
        // Assuming this 'session' object represents a single game night to be scheduled.

        // Priority: Saturday > Friday > Earliest
        const sorted = candidates.sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            const dayA = dateA.getDay();
            const dayB = dateB.getDay();

            // Check for Saturday (6)
            const isSatA = dayA === 6;
            const isSatB = dayB === 6;
            if (isSatA && !isSatB) return -1;
            if (!isSatA && isSatB) return 1;

            // Check for Friday (5)
            const isFriA = dayA === 5;
            const isFriB = dayB === 5;
            if (isFriA && !isFriB) return -1;
            if (!isFriA && isFriB) return 1;

            // Default to earliest
            return dateA - dateB;
        });

        return sorted[0];
    };

    const finalizeSession = async (date) => {
        if (session.status === 'finalized') return;

        // Check for cross-session conflicts (One appointment per week)
        const targetWeek = getISOWeek(new Date(date));

        // Query all finalized sessions
        const q = query(collection(db, 'sessions'), where('status', '==', 'finalized'));
        const snapshot = await getDocs(q);

        const conflict = snapshot.docs.find(doc => {
            if (doc.id === sessionId) return false; // Ignore self
            const data = doc.data();
            if (!data.finalDate) return false;
            return getISOWeek(new Date(data.finalDate)) === targetWeek;
        });

        if (conflict) {
            alert(`Scheduling Conflict: Another operation "${conflict.data().title}" is already scheduled for this week (${targetWeek}). Protocol forbids multiple operations per week.`);
            return;
        }

        await updateDoc(doc(db, 'sessions', sessionId), {
            status: 'finalized',
            finalDate: date
        });
    };

    const addProposedDate = async (date) => {
        const newDates = Array.from(new Set([...session.proposedDates, date])).sort();
        await updateDoc(doc(db, 'sessions', sessionId), {
            proposedDates: newDates
        });
    };

    return { session, availabilities, loading, toggleDate, addProposedDate, campaign, finalizeSession };
}
