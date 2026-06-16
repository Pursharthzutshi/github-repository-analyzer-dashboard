'use server';

import { getAllAnalysis, getAnalysisById } from "../lib/models/analysis";

export async function fetchAllAnalysis() {
    return await getAllAnalysis();
}

export async function fetchAnalysisById(id: number) {
    return await getAnalysisById(id);
}
