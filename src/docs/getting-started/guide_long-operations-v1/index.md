---
layout: default
title: Long Operations (V1)
redirect_from:
  - guides/guide_long-operations.html
  - guide_long-operations.html
nav_exclude: true
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Long Operations

**Applies to**: Repository API v1.
<br/>
<sup>[See Repository API v2](../guide_long-operations/).</sup>

Certain actions in the repository may require a variable amount of time to complete, for example, when deleting a folder that contains a large number of subfolders and documents. Rather than the API call immediately returning the result of the action, the Laserfiche API uses a "long operation" pattern where the call will return a token representing the work of the request. Client applications can then use this token to retrieve the status of the operation and the completed result of the action.

The Copy and Delete APIs both follow this long operation pattern.

The flow of calls is summarized below:

1. The client application issues a copy or delete API call
1. When Laserfiche Cloud receives the request, it will start performing the operation, but the API call will immediately return a token back to the client
1. While the copy or delete operation is being performed, the client can check the status of the operation using the token returned in step 2.
1. When the operation completes, the result of the operation can also be retrieved by using the same token returned in step 2.

Let's look at a specific example with the copy entry API call.

First we'll call the copy API to copy a folder and its content to another folder in the repository:

```
POST https://api.laserfiche.com/repository/v1/Repositories/{repoId}/Entries/{destinationEntryId}/Laserfiche.Repository.Folder/children/CopyAsync
```
```json
{
    "sourceId": 9,
    "name": "MyCopiedFolder"
}
```

The API call will return a token in the response:

```
HTTP 202 Accepted
```
```json
{
    "token": "12345678-abcd-efgh-ijkl-123456789012"
}
```

Long operation APIs can be found under the Tasks resource. Using the token that we just received, we can check the status of the task. This call does not have a request body:

```
GET https://api.laserfiche.com/repository/v1/Repositories/{repoId}/Tasks/{operationToken}
```

The API will return the status of the operation, for example:

```
HTTP 202 Accepted
```
```json
{
    "operationToken": "12345678-abcd-efgh-ijkl-123456789012",
    "operationType": "CopyEntry",
    "percentComplete": 10,
    "status": "InProgress",
    "errors": []
}
```

In the above example response, the operation is still running. If we call the status API again and the operation has completed, we will receive a redirect to the following location:

```
HTTP 302 Found
Location: https://api.laserfiche.com/repository/v1/Repositories/{repoId}/Entries/{newlyCreatedEntryId}
```

If we make a GET request using the link

```
GET https://api.laserfiche.com/repository/v1/Repositories/{repoId}/Entries/{newlyCreatedEntryId}
```

We will get back the newly created entry details, see the following sample response:

```
HTTP 200 Ok
```
```json
{
    "id": 1234,
    "name": "MyCopiedFolder",
    "parentId": 1,
    "fullPath": "\\MyCopiedFolder ",
    "folderPath": "\\",
    "creator": "Guide User",
    "creationTime": "2020-12-12T12:00:00-00:00",
    "lastModifiedTime": "2020-12-12T12:00:00-00:00",
    "entryType": "Folder",
    "templateName": "",
    "templateId": 0,
    "templateFieldNames": [],
    "volumeName": "DEFAULTVOLUME",
    "rowNumber": 0,
    "isRecordFolder": false,
    "isUnderRecordSeries": false
}
```

{: .note }
**Note:** For Laserfiche Cloud, only 1 concurrent long operation can be run per user session. If you start an operation and then decide to cancel the operation, use the DELETE https://api.laserfiche.com/repository/v1/Repositories/{*repoId*}/Tasks/{*operationToken*} API to stop the operation. Stopping an operation while it is in progress can yield partial results of the original operation. For example, when copying a folder, some entries may be created prior to the operation stopping.

{: .note }
**Note:** Tokens will expire 15 minutes after its corresponding operation has completed.
