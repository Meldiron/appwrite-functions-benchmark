import http from 'k6/http';

import { sleep, check } from 'k6';
import { stressConfig } from './config.js'

export default function () {
    // Execute the function
    let executeResponse = http.post(stressConfig.URL + '/functions/' + stressConfig.functionID + '/executions', JSON.stringify({
        "data": "",
        "async": true
    }), { headers: {
        'X-Appwrite-Project': stressConfig.ProjectID,
        'X-Appwrite-Key': stressConfig.APISecret,
        'Content-Type': 'application/json'
    }});

    console.log(executeResponse.body);

    sleep(1);

    let executionCheck = http.get(stressConfig.URL + '/functions/'+ stressConfig.functionID +'/executions/' + JSON.parse(executeResponse.body)['$id'], 
    {headers: {
        'X-Appwrite-Project': stressConfig.ProjectID,
        'X-Appwrite-Key': stressConfig.APISecret,
        'Content-Type': 'application/json'
    }});

    check(executionCheck, {
        'Execute Function': (r) => r.status >= 200 && r.status < 400,
        'Execution Successful?': (r) => JSON.parse(r.body)['status'] === 'completed',
        'Execution Response Correct?': (r) => JSON.parse(r.body)['response'] === 'Hello World!'
    });
}