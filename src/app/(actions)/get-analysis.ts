'use server';

import { getAllAnalysis, getAnalysisById, getLatestAnalysis } from "../lib/models/analysis";

export async function fetchAllAnalysis() {
    return await getAllAnalysis();
}

export async function fetchAnalysisById(id: number) {
    return await getAnalysisById(id);
}

export async function fetchLatestAnalysis() {
    return await getLatestAnalysis();
}

