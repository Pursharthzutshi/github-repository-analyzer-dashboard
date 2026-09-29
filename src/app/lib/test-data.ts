import { getAllDetailedAnalysis } from './models/analysis';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function run() {
    const data = await getAllDetailedAnalysis();
    console.log("Total records:", data.length);
    if (data.length > 0) {
        console.log("Sample languages:", data[0].languages);
        console.log("Sample insights:", data[0].insights.substring(0, 100));
        console.log("Sample packageJson:", typeof data[0].packagejson || typeof data[0].packageJson);
    }
    process.exit(0);
}

run();
