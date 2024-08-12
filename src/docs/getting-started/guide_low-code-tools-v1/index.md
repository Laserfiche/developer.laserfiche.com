---
layout: default
title: Low Code Tools (V1)
redirect_from:
  - guides/guide_low-code-tools.html
  - guide_low-code-tools.html
nav_exclude: true
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Using the Laserfiche API with Low-Code Tools
**Applies to**: Repository API v1.
<br/>
<sup>[See Repository API v2](../guide_low-code-tools/).</sup>

Use the Laserfiche API to access Laserfiche from low-code tools. This guide will demonstrate how to import a document into Laserfiche with Microsoft Power Automate. Other low-code tools may follow a similar model.

## Authentication

HTTP Requests to the Laserfiche API will require an Access Token for authentication.

### Laserfiche Cloud

{: .note }
**Note:** The following section only applies to Laserfiche Cloud. For Self-Hosted, see the [Self-Hosted Laserfiche](#self-hosted-laserfiche) section.

The Laserfiche Cloud APIs follows the [OAuth 2.0 authorization model](../../api/authentication/). A low-code solution must first be registered in the Developer Console as an OAuth Service App.

1. Follow this guide to [register an OAuth service app in the Developer Console with a long-lasting Authorization Key](../../api/authentication/guide_oauth-service/).
1. Create an HTTP action in your low-code solution to obtain an Access Token given a long-lasting `{authorizationKey}` obtained during the application registration.

   - ```
     POST https://signin.laserfiche.com/oauth/token
     Authorization: Bearer {authorizationKey}
     Content-Type: application/x-www-form-urlencoded
    grant_type=client_credentials&scope=repository.ReadWrite
    ```

1. The hostname in the request URI may need to be updated to `signin.laserfiche.ca`, `signin.eu.laserfiche.com`, etc., depending on the data center your Laserfiche Cloud repository resides in. For example in Microsoft Power Automate, the **Get Laserfiche Access Token** action will look like:
   - ![](./assets/images/low-code-authenticate-cloud.png)
1. A successful response will contain the Access Token needed to make Laserfiche API requests.
   - ```
     HTTP 200 OK
     ```
     ```json
     {
     "access_token": "...",
     "token_type": "bearer",
     "expires_in": 43200,
     "scope": "repository.Read repository.Write"
     }
     ```

       {: .note }
       **Note:** Authorization Keys and Access Tokens should be securely stored.
1. The Access Token obtained from the **Get Laserfiche Access Token** action can then be used by downstream HTTP actions that interact with the Laserfiche APIs. For example, [import a document using a low-code tool](#use-case-importing-a-document-from-microsoft-onedrive-into-laserfiche-using-microsoft-power-automate).

### Self-Hosted Laserfiche

{: .note }
**Note:** The following section only applies to Self-Hosted Laserfiche. For Cloud, see the [Laserfiche Cloud](#laserfiche-cloud) section.

HTTP requests to Laserfiche API Server require the Authorization header to contain an Access Token. See [Obtaining an Access Token using username/password authentication](../../api/server/#authenticating-with-the-self-hosted-laserfiche-api).

```
POST https://{APIServerHostName}/LFRepositoryAPI/v1/Repositories/{repositoryId}/Token
Content-Type: application/x-www-form-urlencoded

grant_type=password&username={username}&password={password}
```

For example in Microsoft Power Automate, the **Get Laserfiche Access Token** action will look like:

![](./assets/images/low-code-authenticate-selfhost.png)

A successful response will contain the Access Token needed to make Laserfiche API requests.

```
HTTP 200 OK
```
```json
{
  "access_token": "...",
  "expires_in": 900,
  "token_type": "bearer"
}
```

{: .note }
**Note:** Credentials and Access Tokens should be securely stored.

## Use Case: Importing a Document from Microsoft OneDrive into Laserfiche using Microsoft Power Automate

Prerequisite: obtain an Access Token. See [Authentication](#authentication).

See the [importing a document guide](../../guides/documents-and-folders/guide_importing-documents/) for more details on the import API.

1. In Microsoft Power Automate, create a OneDrive **Get file metadata** action and select a document to import into Laserfiche.
1. Link a OneDrive **Get file content using path** action and set the file path to the **Path** from the **Get file metadata** action.
   - ![](./assets/images/low-code-get-document.png)
1. Link an HTTP action to import the document into Laserfiche and assign a template and two fields.

   - ![](./assets/images/low-code-import-document.png)
   - The request **URI** is `https://api.laserfiche.com/repository/v1/Repositories/{repositoryId}/Entries/{parentFolderId}/{documentName}?autoRename=true`. The hostname may need to be updated to `api.laserfiche.ca`, `api.eu.laserfiche.com`, etc., depending on the data center your Laserfiche Cloud repository resides in. If using the Self-Hosted Laserfiche API Server, the request URL needs to be updated to `https://{APIServerHostName}/LFRepositoryAPI/v1/Repositories/{repositoryId}/Entries/{parentFolderId}/{documentName}?autoRename=true`. Where:

     - `{repositoryId}` is your Laserfiche repository ID.
     - `{parentFolderId}` is the Laserfiche entry ID of the folder the document will be imported to.
     - `{documentName}` is the name of the document when imported to the Laserfiche repository.

   - The Access Token from the **Get Laserfiche Access Token** [action](#authentication) must be added to the Authorization header. Format the Authorization header value as follows `Bearer @{body('Get_Laserfiche_Access_Token')['access_token']}`.
   - The request **body** is a multipart/form-data with two parts.
     - The first part contains the file content from the **Get file content using path** action.
     
        {: .note }
        **Note:** The `Content-Type` header or the extension in the filename in the `Content-Disposition` header is used to determine the file type for the document imported to Laserfiche.
        
     - As an example, the second part assigns the `Email` template and the `Sender` and `Recipients` fields to the imported file. The metadata may need to be updated if the template and field definitions do not exist in the Laserfiche repository.

1. Copy and paste the following request body.
   - ```json
       {
       "$content-type": "multipart/form-data",
       "$multipart": [
           {
           "headers": {
               "Content-Disposition": "form-data; name=\"electronicDocument\"; filename=@{outputs('Get_file_metadata')?['body/Name']}",
               "Content-Transfer-Encoding": "binary"
           },
           "body": @{body('Get_file_content_using_path')}
           },
           {
           "headers": {
               "Content-Disposition": "form-data; name=\"request\"",
               "Content-Transfer-Encoding": "binary"
           },
           "body": {
               "template": "Email",
               "metadata": {
               "fields": {
                   "Sender": {
                   "values": [
                       {
                       "value": "sender@laserfiche.com",
                       "position": 1
                       }
                   ]
                   },
                   "Recipients": {
                   "values": [
                       {
                       "value": "recipient@laserfiche.com",
                       "position": 1
                       }
                   ]
                   }
               }
               }
           }
           }
       ]
       }
     ```
1. A successful response will contain the entry ID of the imported document and an API link to get more document properties.
   - ```
       HTTP 201 Created
     ```
     ```json
       {
       "operations": {
           "entryCreate": {
           "entryId": {documentId},
           "exceptions": []
           },
           "setEdoc": {
           "exceptions": []
           },
           "setTemplate": {
           "template": "Email",
           "exceptions": []
           },
           "setFields": {
           "fieldCount": 2,
           "exceptions": []
           }
       },
       "documentLink": "https://api.laserfiche.com/repository/v1/Repositories/{repositoryId}/Entries/{documentId}"
       }
     ```

## Next Steps

Check out additional [Guides](../../guides) for more walk-throughs and tutorials about the Laserfiche API.
