---
layout: default
title: Long Operations
nav_order: 3
redirect_from:
  - /guides/v2/guide_long-operations-v2.html
parent: Getting Started
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Repository Long Operations
**Applies to**: Repository API v2.
<br/>
<sup>[See Repository API v1](../guide_long-operations-v1/).</sup>

Certain actions in the repository may require a variable amount of time to complete, for example, when deleting a folder that contains a large number of subfolders and documents. Rather than the API call immediately returning the result of the action, the Laserfiche API follows the [Asynchronous Request-Reply](https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply) pattern, where the call will return a _task ID_ representing the work of the request. Client applications can then use this task ID to retrieve the status of the operation and the completed result of the action.

The Copy, Delete, and the asynchronous versions of the Import, Export and Search APIs follow this pattern.

The flow of calls is summarized below:

1. The client application issues an API call.
1. When Laserfiche Cloud receives the request, it will start performing the operation, but the API call will immediately return a task ID back to the client.
1. While the long operation is being performed, the client can check the status of the operation using the task ID returned in step 2.
1. When the operation completes, the result of the operation can also be retrieved by using the same task ID returned in step 2.

Let's look at a specific example with the copy entry API call.

First we'll call the copy API to copy a folder and its content to another folder in the repository:

```
POST https://api.laserfiche.com/repository/v2/Repositories/{repositoryId}/Entries/{destinationEntryId}/Folder/CopyAsync
```
```json
{
    "sourceId": 9,
    "name": "CopiedEntry",
    "autoRename": true
}
```

The API call will return a task ID in the response:

```
HTTP 202 Accepted
```
```json
{
  "@odata.context": "https://api.laserfiche.com/repository/v2/$metadata#Laserfiche.Repository.StartTaskResponse",
  "taskId": "4a250850-41a4-4e31-8cef-0feb57a344ea"
}
```

Long operation APIs can be found under the Tasks resource. Using the task ID that we just received, we can check the status of the task. This call does not have a request body:

```
GET https://api.laserfiche.com/repository/v2/Repositories/{repositoryId}/Tasks?taskIds={taskId}
```

The API will return the status of the task, for example:

```
HTTP 200 OK
```
```json
{
  "@odata.context": "https://api.laserfiche.com/repository/v2/$metadata#Tasks",
  "value": [
    {
      "id": "4a250850-41a4-4e31-8cef-0feb57a344ea",
      "taskType": "CopyEntry",
      "percentComplete": 100,
      "status": "Completed",
      "startTime": "2023-09-06T13:53:20.5232733Z",
      "lastUpdateTime": "2023-09-06T13:53:48.7299708Z",
      "errors": [],
      "result": {
        "entryId": 2161935,
        "uri": "https://api.laserfiche.com/repository/v2/Repositories/r-abc123/Entries/2161935"
      }
    }
  ]
}
```

In the above example response, the operation has completed successfully.

If we make a GET request using the _uri_ received in the response:

```
GET https://api.laserfiche.com/repository/v2/Repositories/{repositoryId}/Entries/{newlyCreatedEntryId}
```

We will get back the newly created entry details. See the following sample response:

```
HTTP 200 Ok
```
```json
{
  "@odata.context": "https://api.laserfiche.com/repository/v2/$metadata#Repositories('r-abc123')/entries/Laserfiche.Repository.Folder/$entity",
  "@odata.type": "#Laserfiche.Repository.Folder",
  "id": 2161935,
  "isContainer": true,
  "isLeaf": false,
  "name": "CopiedEntry",
  "parentId": 2161934,
  "fullPath": "\\destination\\CopiedEntry",
  "folderPath": "\\destination",
  "creator": "Guide User",
  "creationTime": "2023-09-06T13:53:20Z",
  "lastModifiedTime": "2023-09-06T13:53:42Z",
  "entryType": "Folder",
  "templateName": "",
  "templateId": 0,
  "volumeName": "CLOUD",
  "isRecordFolder": false,
  "isUnderRecordSeries": false
}
```

{: .note }
**Note:** For Laserfiche Cloud, only a limited number of concurrent long operations can be run per user session, i.e. per valid OAuth access token. If you start an operation and then decide to cancel the operation, use the `DELETE https://api.laserfiche.com/repository/v2/Repositories/{repositoryId}/Tasks?taskIds={taskId}` API to stop the operation. Stopping an operation while it is in progress can yield partial results of the original operation. For example, when copying a folder, some entries may be created prior to the operation stopping.

{: .note }
**Note:** For more details about the API limits, see [this page](../guide_api-limits/).

{: .note }
**Note:** A task ID will expire 15 minutes after its corresponding operation has completed.
