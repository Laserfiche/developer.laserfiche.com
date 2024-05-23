---
layout: default
title: OAuth 2.0 Scopes
nav_order: 6
redirect_from:
  - guides/guide_oauth_2.0_scopes.html
  - guide_oauth_2.0_scopes.html
parent: Authentication
grand_parent: API
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# OAuth 2.0 Scopes for Laserfiche APIs

{: .note }
**Note:** The following guide only applies to Laserfiche Cloud.

Laserfiche APIs use the [OAuth 2.0 protocol](https://www.rfc-editor.org/rfc/rfc6749) for authentication and authorization. Laserfiche supports common OAuth 2.0 scenarios such as those for web applications, services, and single-page applications.

OAuth access tokens authorize access to protected resources. Scopes further define the type of protected resources the app can access. A scope is a permission to access resources needed by an application to perform its functionality. An application is at most granted the administrator pre-approved scopes or more restrictive scopes depending on:

- User consented scopes (only applies to user facing applications).
- The application requested scopes, which can be more granular than the administrator pre-approved scopes.

An application should be designed to provide useful limited functionality when only a subset of the requested scopes is granted. As a best practice, request the least privileged scopes that your app needs in order to access data and function correctly. The effective permissions granted to your app may be further constrained by the privileges of the signed-in user.

## Using Scopes

### Configure Pre-Approved Scopes in the Developer Console

Before an app can request an access token with scopes, a Developer Console Administrator must first pre-approve the scopes that can be requested. This is to ensure the app cannot request unapproved scopes and be granted inappropriate access to Laserfiche resources.

1. Sign in to the [Developer Console](../../../getting-started/developer-console/).
1. In the Applications listing, select the app you want to configure.
1. On the **App Configuration** page, select the **Authentication** tab.
1. In the **OAuth 2.0 Scopes** section, select the needed scopes for your app to function properly.

### Requesting an Access Token with Scopes

When web applications and single-page applications request access tokens with scopes as part of the authorization flow, a user will be prompted with a consent form to grant or deny the requested scopes. For service applications, the pre-approved scopes are the scopes granted if requested by the app. See the below guides on how to request an access token with scopes for your app type.

- Learn how to [create a connection for your OAuth Service App](../guide_oauth-service/).
- Learn how to [create a connection for your OAuth Single-Page App](../guide_oauth-spa/).
- Learn how to [create a connection for your OAuth Web App](../guide_oauth-webapp/).

## Available Scopes

See the following lists of available OAuth 2.0 scopes.

### Repository API

| Scopes           | Description                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| repository.Read  | Allows the app to read the content of Laserfiche repositories on behalf of the signed-in user.   |
| repository.Write | Allows the app to modify the content of Laserfiche repositories on behalf of the signed-in user. |

{: .note }
**Note:** For backwards compatibility, access tokens without any scopes defined will have full access to v1 repository APIs. For v2 repository APIs, scopes are required.

### Repository API Granular Scopes

An application can request more granular scopes than the ones pre-approved in the Developer Console. Repository API granular scope strings follow this format: `repository[/&lt;resource path&gt;].&lt;access rights&gt;` where:

1. `repository` is a constant string representing any version of the Repository API (for example, `https://api.laserfiche.com/repository/v1`).
1. Optionally, a resource path can be appended to it. This resource path represents the REST API URI section that the client is allowed to access.
1. The string after the "." separator represents which access rights are allowed. Access rights must be concatenated with no space in between and start with an upper case letter, for example, _Read_, _Write_, or a combination such as _ReadWrite_. An app can only access the repository APIs with access rights that match the ones defined in the granted scope(s).

Examples of Repository API granular scopes

| Scopes                                          | Allowed Requests Examples                                                                                          | API Description                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
|                                                 | GET https://api.laserfiche.com/repository/v1/Repositories/r-abc123/Entries/1                                       | Get entry 1                     |
| repository/Repositories/r-abc123/Entries/1.Read | GET https://api.laserfiche.com/repository/v1/Repositories/r-abc123/Entries/1/fields                                | Get fields assigned to entry 1  |
|                                                 | GET https://api.laserfiche.com/repository/v1/Repositories/r-abc123/Entries/1/Laserfiche.Repository.Folder/children | Get children entries in entry 1 |

### Table API

| Scopes      | Description                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- |
| table.Read  | Allows the app to read the content of Laserfiche lookup tables on behalf of the signed-in user.   |
| table.Write | Allows the app to modify the content of Laserfiche lookup tables on behalf of the signed-in user. |

{: .note }
**Important:** When granted access, the Table API can access all lookup tables in a Laserfiche Cloud account.

### Table API Granular Scopes

An application can request more granular scopes than the ones pre-approved in the Developer Console. Table API granular scope strings follow this format: `odata4/table[/&lt;table name&gt;].&lt;access rights&gt;` where:

1. `odata4/table` is a constant string representing the Table API.
1. Optionally, a table name can be appended to it. This table name represents the table that the client is allowed to access.
1. The string after the "." separator represents which access rights are allowed. Access rights must be concatenated with no space in between and start with an upper case letter, for example, _Read_, _Write_, or a combination such as _ReadWrite_.
   - An app can only access the table APIs with access rights that match the ones defined in the granted scope(s).

Examples of Table API granular scopes

| Scopes                         | Allowed Requests Examples                                | API Description               |
| ------------------------------ | -------------------------------------------------------- | ----------------------------- |
| odata4/table/MyTable('1').Read | GET https://api.laserfiche.com/odata4/table/MyTable('1') | Get row with key 1 in MyTable |

The OAuth scope required to access each API is documented on the [Swagger Playground](../../playground/).

## Next Steps

- Learn how to [get a user access token](../guide_authenticate-to-the-laserfiche-api/).
- Learn how to [create a connection for your OAuth Service App](../guide_oauth-service).
- Learn how to [create a connection for your OAuth Single-Page App](../guide_oauth-spa/).
- Learn how to [create a connection for your OAuth Web App](../guide_oauth-webapp/).
- Check out additional [Guides](../../../guides/) for more walk-throughs and tutorials about the Laserfiche API.
