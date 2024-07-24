// app/admin/page.tsx

"use client";

import Admin from "@/components/src/client/routes/admin/components/Admin";
import { db } from "@/lib/firebase/firebaseClient";
import { collection, getDocs } from "@firebase/firestore";
import React, { use } from "react";

const AdminPage: React.FC = () => <Admin />;

export default AdminPage;
