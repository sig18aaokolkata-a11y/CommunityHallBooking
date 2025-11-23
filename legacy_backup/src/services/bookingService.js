import { db } from "../firebase-config";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    Timestamp
} from "firebase/firestore";

const COLLECTION_NAME = "bookings";

export const getBooking = async (dateStr) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dateStr);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting booking:", error);
        throw error;
    }
};

export const createBooking = async (dateStr, bookingData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dateStr);
        // Check if already booked to avoid race conditions (basic check)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            throw new Error("Date already booked");
        }

        await setDoc(docRef, {
            ...bookingData,
            date: dateStr,
            isPaid: false,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
};

export const updatePaymentStatus = async (dateStr, isPaid) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dateStr);
        await updateDoc(docRef, {
            isPaid: isPaid
        });
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
    }
};

export const deleteBooking = async (dateStr) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dateStr);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting booking:", error);
        throw error;
    }
};

export const getBookingsByDateRange = async (startDate, endDate) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("date", ">=", startDate),
            where("date", "<=", endDate)
        );
        const querySnapshot = await getDocs(q);
        const bookings = [];
        querySnapshot.forEach((doc) => {
            bookings.push(doc.data());
        });
        return bookings;
    } catch (error) {
        console.error("Error getting bookings by range:", error);
        throw error;
    }
};

export const getAllBookings = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const bookings = [];
        querySnapshot.forEach((doc) => {
            bookings.push(doc.data());
        });
        return bookings;
    } catch (error) {
        console.error("Error getting all bookings:", error);
        throw error;
    }
}
