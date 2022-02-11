import http from 'k6/http';

import { sleep, check } from 'k6';
import { stressConfig } from './config.js'

// Just a quick random string generator
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const functionFile = open('./function.tar.gz', 'b');

export default function () {
    // Create a new function document
    let createFuncResponse = http.post(stressConfig.URL + '/functions', JSON.stringify({
        "name": makeid(10),
        "execute": ["role:all"],
        "runtime": "node-17.0",
        "vars": {},
        "schedule": "",
        "timeout": 400,
        "functionId": "unique()"
    }), { headers: {
        'X-Appwrite-Project': stressConfig.ProjectID,
        'X-Appwrite-Key': stressConfig.APISecret,
        'Content-Type': 'application/json'
    }});

    check(createFuncResponse, {
        'Create Function': (r) => r.status >= 200 && r.status < 400,
        'Got Function ID': (r) => JSON.parse(r.body)['$id'] != null
    });

    let functionId = JSON.parse(createFuncResponse.body)['$id'];

    sleep(3);

    // Deploy a new tag
    let createTagResponse = http.post(stressConfig.URL + '/functions/' + functionId + '/tags', {
        entrypoint: 'index.js',
        code: http.file(functionFile, 'function.tar.gz'),
        automaticDeploy: true
    }, { headers: {
        'X-Appwrite-Project': stressConfig.ProjectID,
        'X-Appwrite-Key': stressConfig.APISecret
    }});

    check(createTagResponse, {
        'Create Tag': (r) => r.status >= 200 && r.status < 400,
    });

    let tagId = JSON.parse(createTagResponse.body)['$id'];

    sleep(15);

    // Execute the function
    let executeResponse = http.post(stressConfig.URL + '/functions/' + functionId + '/executions', JSON.stringify({
        "data": "",
        "async": true
    }), { headers: {
        'X-Appwrite-Project': stressConfig.ProjectID,
        'X-Appwrite-Key': stressConfig.APISecret,
        'Content-Type': 'application/json'
    }});

    check(executeResponse, {
        'Execute Function': (r) => r.status >= 200 && r.status < 400,
    });

    sleep(5);

    // Get results
    let getResultsResponse = http.get(stressConfig.URL + '/functions/' + functionId + '/executions/' + JSON.parse(executeResponse.body)['$id'], {
        headers: {
            'X-Appwrite-Project': stressConfig.ProjectID,
            'X-Appwrite-Key': stressConfig.APISecret
        }
    });

    check(getResultsResponse, {
        'Get Execution Results': (r) => r.status >= 200 && r.status < 400,
    });

    check(getResultsResponse, {
        'Execution Successful?': (r) => JSON.parse(r.body)['status'] === 'completed',
        'Execution Response Correct?': (r) => JSON.parse(r.body)['stdout'] === '{\"hello\":\"world!\"}'
    });
}