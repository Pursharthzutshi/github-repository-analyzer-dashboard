'use server';

import { getAllAnalyses, getAnalysisById } from "../lib/models/analysis";

export async function fetchAllAnalyses() {
    return await getAllAnalyses();
}

export async function fetchAnalysisById(id: number) {
    return await getAnalysisById(id);
}
