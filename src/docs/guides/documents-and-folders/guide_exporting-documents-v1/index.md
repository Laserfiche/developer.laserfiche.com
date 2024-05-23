---
layout: default
title: Exporting Documents (V1)
redirect_from:
  - guides/guide_exporting-documents.html
  - guide_exporting-documents.html
nav_exclude: true
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Export Documents
**Applies to**: Repository API v1.
<br/>
<sup>[See Repository API v2](../guide_exporting-documents/).</sup>

Retrieving a document from the repository is a multi-step process that can be achieved using the following APIs.

## Get Header Information

Before the export can begin, the client will need information about the file content and size. That information can be acquired through this HEAD request.

```
HEAD https://api.laserfiche.com/repository/v1/Repositories/*repoId*/Entries/*entryId*/Laserfiche.Repository.Document/edoc
```

- The `entryId` in the request URL represents the ID of the document to be exported
- There is no request body in this HEAD call.

If the request is successful, the API will return a 200 HTTP response status code. There is no JSON response body for this request, but the headers of the response will return vital information about the document.

```
HTTP 200 OK
Content-Length: 271407
Content-Type: application/pdf
```

- The `Content-Length` header represents the size of the document, in bytes.
- The `Content-Type` header represents the MIME type of the document.

## Export/Download the Document

Now that we have the length and type of the document, we can download the document with the following GET request. Note that this route is identical to the last request, except for the HTTP method.

```
GET https://api.laserfiche.com/repository/v1/Repositories/*repoId*/Entries/*entryId*/Laserfiche.Repository.Document/edoc
```

If the request is successful, it will return a 200 OK HTTP response status code. The request body will contain the contents of the document as a byte array using the appropriate MIME type.

If the document that you are exporting is very large, you may want to break up the export into multiple parts. The `Range` header can be used in the GET request to get a specific range of bytes.

```
GET https://api.laserfiche.com/repository/v1/Repositories/repoId/Entries/entryId/Laserfiche.Repository.Document/edoc
Range: bytes=0-1000
```

If the response is successful, it will return a 206 Partial Content HTTP response status code, with the requested byte range in the response body.

{: .note }
**Note:** If no `Range` header is specified in the request, then the API will attempt to return the entire document. If the document is larger than 50 MB, it is recommended that you use the `Range` header to split up the export of the document in 50 MB chunks. Requests with larger than 50 MB may run the risk of timing out.

{: .note }
**Note:** The `Range` header only supports a single range of bytes. It does not support multiple ranges at a time.

## Export Document With Audit Reason

**Preface**: A Laserfiche administrator may configure the document repository to have audit reasons that can be selected when performing various actions. These audit reasons include "Export" audit reasons, which give specific reasons on why a document may need to be exported.

One alternative to using the GET request above, is to send a POST request that is identical in response body, but instead allows for you to additionally specify an audit reason. Audit reasons can be retrieved through this GET request.

```
GET https://api.laserfiche.com/repository/v1/Repositories/*repoId*/AuditReasons
```

For this scenario, we'll export the document using the audit reason with ID 71, name "Public request". Once you've parsed the response of the AuditReasons request, you can send the audit reason ID and optionally add a comment as part of this request.

{: .note }
Note: The only difference between this route and the one mentioned in the previous example is the addition of the request body. All notes in the previous example also apply to the one mentioned in this section.

```
POST https://api.laserfiche.com/repository/v1/Repositories/repoId/Entries/entryId/Laserfiche.Repository.Document/GetEdocWithAuditReason
```
```json
{
  "auditReasonId": 71,
  "comment": "Request ID 26164"
}
```

The entry will now have an export audit event associated with the ID and comment sent in the request. The response will be and can be processed the same as the response described in the Export/Download the Document section.

![](./assets/images/audit-trail-01.png)
