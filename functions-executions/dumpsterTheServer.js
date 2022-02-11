import http from 'k6/http';

import { sleep, check } from 'k6';
import { stressConfig } from './config.js'

export default function () {
    // Create the execution
    let executeResponse = http.post(stressConfig.URL + '/functions/' + stressConfig.functionID + '/executions', JSON.stringify({
        "data": "",
        "async": true
    }), { headers: {
        'X-Appwrite-Project': stressConfig.ProjectID,
        'X-Appwrite-Key': stressConfig.APISecret,
        'Content-Type': 'application/json'
    }});
}