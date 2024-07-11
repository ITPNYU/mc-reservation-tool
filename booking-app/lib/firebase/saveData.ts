// saveData.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
} from "@firebase/firestore";
import { db } from "./firebaseClient";

export type AdminUserData = {
  email: string;
  createdAt: Timestamp;
};

export const deleteDataFromFirestore = async (
  collectionName: string,
  docId: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log("Document successfully deleted with ID:", docId);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

export const saveDataToFirestore = async (
  collectionName: string,
  data: object
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);

    console.log("Document successfully written with ID:", docRef.id);
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

export const fetchAllDataFromCollection = async (collectionName: string) => {
  const colRef = collection(db, collectionName);

  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};
