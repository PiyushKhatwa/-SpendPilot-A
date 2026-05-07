import { FirebaseError, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getPublicFirebaseConfig } from "@/lib/env";
import type { AuditReport, LeadCaptureInput } from "@/types/audit";

const AUDITS_COLLECTION = "audits";
const LEADS_COLLECTION = "leads";

function getServerFirestore() {
  const app =
    getApps().find((candidate) => candidate.name === "spendpilot-server") ??
    initializeApp(getPublicFirebaseConfig(), "spendpilot-server");

  return getFirestore(app);
}

export async function saveAuditReport(report: AuditReport) {
  try {
    const db = getServerFirestore();
    const ref = await addDoc(collection(db, AUDITS_COLLECTION), {
      ...report,
      createdAt: report.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp(),
    });

    return ref.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`Firestore audit save failed: ${error.message}`);
    }

    throw error;
  }
}

export async function getAuditReport(id: string): Promise<AuditReport | null> {
  try {
    const db = getServerFirestore();
    const snapshot = await getDoc(doc(db, AUDITS_COLLECTION, id));

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as AuditReport;
    return {
      ...data,
      id: snapshot.id,
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`Firestore audit read failed: ${error.message}`);
    }

    throw error;
  }
}

export async function saveLead(input: LeadCaptureInput, userAgent: string | null) {
  try {
    const db = getServerFirestore();
    const ref = await addDoc(collection(db, LEADS_COLLECTION), {
      email: input.email,
      companyName: input.companyName,
      role: input.role,
      teamSize: input.teamSize,
      auditId: input.auditId ?? null,
      createdAt: new Date().toISOString(),
      userAgent,
      serverCreatedAt: serverTimestamp(),
    });

    return ref.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`Firestore lead save failed: ${error.message}`);
    }

    throw error;
  }
}
