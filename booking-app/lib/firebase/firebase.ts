// saveData.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
} from "@firebase/firestore";
import { db } from "./firebaseClient";
import { TableNames } from "@/components/src/policy";

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

export const fetchAllDataFromCollection = async <T>(
  collectionName: TableNames,
  queryConstraints: QueryConstraint[] = []
): Promise<T[]> => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...queryConstraints);
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as unknown as T),
  }));
  return data;
};

export const fetchSingleDoc = async <T>(
  collectionName: TableNames,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as T;
      console.log("Document data:", data);
      return { id: docSnap.id, ...data };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    return null;
  }
};

export const updateDataInFirestore = async (
  collectionName: string,
  docId: string,
  updatedData: object
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log("Document successfully updated with ID:", docId);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
