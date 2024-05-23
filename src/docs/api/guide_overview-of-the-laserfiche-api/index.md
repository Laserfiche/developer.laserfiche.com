---
layout: default
title: API
nav_order: 4
redirect_from:
  - guides/guide_overview-of-the-laserfiche-api.html
  - guide_overview-of-the-laserfiche-api.html
  - api/index.html
  - api.html
  - API.html
has_children: true
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Overview of the Laserfiche API

The Laserfiche API is a set of RESTful web APIs that allows you interact with Laserfiche Cloud services. This guide will provide an overview of how we've adapted Laserfiche services, resources, and concepts into the REST standard.

## Cloud vs Self-Hosted

We provide a REST API for Laserfiche Cloud and Self-Hosted systems. More information on how to download and install the Laserfiche API Server for your self-hosted system can be found [here](../../api/server/).

## API Requests

All Laserfiche API request URLs can be broken down in the following parts:

**{HTTP method} https://{host}/{API set}/{version}/{resource}?{query parameters}**

- [{HTTP method}](#http-method) — The HTTP method used for the request
- {host} — The host name of the Laserfiche Cloud API `api.laserfiche.com`, `api.laserfiche.ca`, `api.eu.laserfiche.com`, etc.
- [{API set}](#api-set) — The API set
- [{version}](#version) — The API version to use (for Repository API only)
- [{resource}](#resource) — The path to the Laserfiche resource that you're referencing
- [{query parameters}](#query-parameters) — Optional OData query options or REST method parameters that customize the response

### HTTP Method

The HTTP method is also known as an HTTP verb.

| Method | Description                                 | Idempotent | Semantic               |
| ------ | ------------------------------------------- | ---------- | ---------------------- |
| GET    | Read data from the specified resource       | X          | Read, Search           |
| POST   | Create a new resource, or perform an action |            | Create, Perform action |
| PATCH  | Update a resource with new values           | ---        | Update                 |
| PUT    | Replace a resource with a new one           | ---        | Replace                |
| DELETE | Remove a resource                           | X          | Delete                 |

- GET and DELETE calls will not contain an HTTP request body
- POST, PATCH, and PUT may require an HTTP request body, typically in JSON format.

### API Set

API sets are used to help organize the Laserfiche API and often correspond to distinct sub-services or applications in the Laserfiche suite. API set names are lowercase, follow the rules for DNS labels, and are usually singular nouns.
Currently the Laserfiche API supports two API sets:

- The `repository` API set allows you to interact with the Laserfiche Cloud repository.
- The `table` API set (Preview) allows you to interact with Laserfiche lookup tables using OData protocol version 4.

### Version

Every API for a service has an API version. The version component is of the form `v{version}-{alpha|beta}{revision}`. The `{revision}` portion is optional and may only appear if the alpha or beta suffixes are used. Examples:

- `v1` Version 1, stable API, no incompatible changes.
- `v1-beta` Version 1 beta, not a stable API, but expect only minor changes, typically kept for two releases.

The API versions of each service are independent of each other, and so a single client may be invoking v1 of the API for the account service, but the v2 and v3 API for the repository service, for example. A service does not necessarily have a stable API version. The interpretation of "alpha" and "beta" in the API shall follow the rules listed above and is separate from non-technical marketing language concerning related features or releases.

There is currently only one version of the Table API (Preview) and a version is not currently specified in the request.

**Stable API Versions**

A stable API is one that will not change in a potentially incompatible way, either in how requests are processed, or in the format of responses that are returned for an API call. Laserfiche will commit to supporting at least the latest and previous stable versions of an API, or all the versions released in the last year, whichever is greater. The revision suffix is only used with the alpha and beta tags, and denotes a revision number (minor version). Its use is optional but recommended, especially for beta versions.

**Alpha API Versions**

The alpha tag indicates that the API is undergoing heavy development and will probably be retired as soon as the next version of the API is released. APIs marked as alpha may:

- Be removed with or without notice
- Have odd quirks or use experimental patterns that deviate from standard practice

**Beta API Versions**

The beta tag indicates that the API is undergoing only minor revision and will generally be kept around for another revision so that users do not need to migrate immediately to the next stable API. APIs marked as beta are:

- May be subject to minor changes that would not break most applications, but prior warning is provided
- Possibly not well-documented
- Kept around until after the next stable version is published

### Resource

Resources in Laserfiche Cloud are represented in the URL of the API call. The naming convention for Laserfiche-defined resources are upper case, plural nouns that are typically followed by a unique identifier. Multiple resources are strung together to show the hierarchical relationship between them. For example:

Repository API: `GET https://api.laserfiche.com/repository/v1/Repositories/r-abc123/Entries/888`

After the `v1` version, the resource can be interpreted as "in the repository resource with id r-abc123, the entry resource with id 888."

For the Table API (Preview), the resources are user-defined. For example:

Table API: `GET https://api.laserfiche.com/odata4/table/MyTable('{1}')`

After the `table` segment, the resource can be interpreted as "in the MyTable resource with row key 1." _MyTable_ is the name of a Laserfiche lookup table.

### Query Parameters

Query parameters attached to the end of a request can alter the behavior of the API calls. Some calls support standard OData query parameters, and some API calls may have additional custom query parameters specific to the call. To learn more about specific OData query parameters, see [this example](../../guides/documents-and-folders/guide_get-folder-listing/#customizing-the-listing-response-with-query-parameters) on retrieving an entry listing from a folder.

## API Responses

After issuing a request to Laserfiche API endpoint, the response will include:

- HTTP response status code
- Response body

### HTTP Response Status Code

The code will indicate the outcome of the request.

### Response Body

The body of the response will typically be in JSON or XML format. It will contain the requested data of the resource or the result of the request.

Paging

In some cases, a response body can return a large amount of data that would be inconvenient to try and return in a single response. In these cases, an OData `NextLink` is generated at the end of the request of body. This link can be used to request the next set of results from the original request.

### Next Steps

- Learn how to [get a user access token](../../api/authentication/guide_authenticate-to-the-laserfiche-api/).
- Learn how to [import a document into your repository](../../guides/documents-and-folders/guide_importing-documents/).
- Learn how to [create folders in your repository](../../guides/documents-and-folders/guide_creating-folders/).
- Learn how to [assign values to Laserfiche fields](../../guides/metadata/guide_write-field-values/).
- Check out additional [Guides](../../guides/) for more walk-throughs and tutorials about the Laserfiche API.
