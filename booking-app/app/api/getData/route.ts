import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";

export async function GET() {
  let data = [];

  try {
    const querySnapshot = await getDocs(collection(db, "adminUsers"));
    data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents:", error);
    return NextResponse.error();
  }

  return NextResponse.json(data);
}
