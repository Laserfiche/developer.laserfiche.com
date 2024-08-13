---
layout: default
title: Import Documents (V1)
nav_exclude: true
redirect_from:
  - guides/guide_importing-documents.html
  - guide_importing-documents.html
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Importing a Document using the Laserfiche API
**Applies to**: Repository API v1.
<br/>
<sup>[See Repository API v2](../guide_importing-documents/).</sup>

Documents, folders, and shortcuts are collectively referred to as entries in Laserfiche. Documents are the basic building block of a Laserfiche repository. Create a document with the Laserfiche API by using the following multipart/form POST request.`

**Request Overview**

```
POST https://api.laserfiche.com/repository/v1/Repositories/*repoId*/Entries/*parentfolderid*/*documentName*
```

The following multipart/form request creates a document named "LFAPI created document" in the folder with ID 1234 and assigns two field values and a tag to the document. Additionally, we will provide a file that corresponds to the .pdf file we want to associate with the entry. Place the file into the web requests "electronicDocument" portion of the form, and place the metadata setting portion of the request into the "request" part of the form.`

```
POST https://api.laserfiche.com/repository/v1/Repositories/r-abc123/Entries/1234/lfapi%20created%20doc?autoRename=true
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryWSIjerzIxTqZu0gW

------WebKitFormBoundaryWSIjerzIxTqZu0gW
Content-Disposition: form-data; name="electronicDocument"; filename="File.pdf"
Content-Type: application/pdf
&lt;File.pdf&gt;
------WebKitFormBoundaryWSIjerzIxTqZu0gW
Content-Disposition: form-data; name="request"
Content-Type: application/json
```
```json
{
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
    },
    "tags": [
      "Information tag 1"
    ]
  }
}
```
```
------WebKitFormBoundaryWSIjerzIxTqZu0gW--
```

If the document was created successfully, the API will return a 201 HTTP response status code. The response body will contain a list of the operations performed during the call and any exceptions if the specified metadata could not be assigned to the document, as well as a link to the document. Any errors with the assignment of the electronic document will be returned in the "setEdoc" operation portion of the response.`

```
HTTP 201 Created
```
```json
{
  "operations": {
    "entryCreate": {
      "entryId": 4321,
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
    },
    "setTags": {
      "assignedTags": [
        "Information tag 1"
      ],
      "exceptions": []
    }
  },
  "documentLink": "https://api.laserfiche.com/repository/v1/Repositories/r-abc123/Entries/4321"
}
```

## Import a Document using Postman

The Laserfiche API import can be made from the Postman tool.`

1. **Download** and **install** Postman.
1. **Open** Postman and select the option to **Import** a request.
1. Select the option to import **Raw Text** and paste the below curl command.

   - ```sh
     curl --location --request POST 'https://api.laserfiche.com/repository/v1/Repositories/{repositoryId}/Entries/{parentfolderid}/{documentName}?autoRename=true' \
     --header 'Authorization: Bearer {accessToken}' \
     --form 'electronicDocument=@"{filePath}"' \
     --form 'request="{
     \"template\": \"Email\",
     \"metadata\": {
         \"fields\": {
         \"Sender\": {
             \"values\": [
             {
                 \"value\": \"sender@laserfiche.com\",
                 \"position\": 1
             }
             ]
         },
         \"Recipients\": {
             \"values\": [
             {
                 \"value\": \"recipient@laserfiche.com\",
                 \"position\": 1
             }
             ]
         }
         }
     }
     }"'
     ```

1. After importing the request to Postman, the following request details will need to be updated:
   - The hostname in the request URL may need to be updated to `api.laserfiche.ca`, `api.eu.laserfiche.com`, etc, depending on the data center your Laserfiche Cloud repository resides in. If using a self-hosted Laserfiche API Server, the request URL needs to be updated to `https://{APIServerHostName}/LFRepositoryAPI/v1/Repositories/{repositoryId}/Entries/{parentFolderId}/{documentName}?autoRename=true`.
   - The `{repositoryId}` in the request URL is your **Laserfiche repository ID**.
   - The `{parentFolderId}` in the request URL is the **Laserfiche entry ID** of the folder the file will be imported to.
   - The `{documentName}` in the request URL is the **filename** when imported to the Laserfiche repository.
   - The `{accessToken}` in the Authorization request header is a valid [access token](../../../api/authentication/).
   - The `electronicDocument` in the request body can be **selected** using the file picker.
   - As an example, the `request` in the request body assigns the `Email` template and the `Sender` and `Recipients` fields to the imported file. The metadata may need to be updated if the template and field definitions do not exist in the Laserfiche repository.
1. **Send** the request to import a document. If an error occurs, verify that:
   - The user or service principal associated with the access token has access to the repository and has the right to import to the selected folder.
   - The template and field definitions being assigned to the entry exist in the repository. Alternatively, send a request without assigning any metadata by setting the `request` in the request body to `{}`.
   - If a 403 Forbidden HTTP response status code is returned, the access token may need the "repository.Write" scope. See [OAuth 2.0 Scopes for Laserfiche APIs](../../../api/authentication/guide_oauth_2.0_scopes/) for more details.

## Next Steps

- Check out how to [import a document with low-code tools](../../../getting-started/guide_low-code-tools-v1/).
