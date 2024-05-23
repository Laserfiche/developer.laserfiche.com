---
layout: default
title: Create OAuth Service App
nav_order: 3
redirect_from:
  - guides/guide_oauth-service.html
  - guide_oauth-service.html
parent: Authentication
grand_parent: API
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Creating an OAuth Service App for the Laserfiche API

{: .note }
**Note:** The following guide only applies to Laserfiche Cloud.

Create an OAuth Service App when you want to write a service application that makes API requests using a service principal. The application does not involve users granting access to their accounts.

{: .note }
**Note:** Access to the Developer Console requires the _Developer Console Administrator_ role. Creating or modifying an OAuth Service App requires the _Trustee Administration_ role. Set roles from the Laserfiche Cloud Account Administration site.

## Create a Laserfiche Cloud Service Principal

1. Go to the Laserfiche Account Administration page
1. Get an existing service principal account and its service principal key or create a new one if necessary. See the [Service Principals guide](../guide_service-principals/) for more details.

## Register your Service App in the Developer Console

1. Sign in to the [Developer Console](../../../getting-started/developer-console/).
1. Click **New** to display the **Create Application** dialog box. Select the option to create a new app and then select the **Service** app type and give the app a name.
1. On the **App Configuration** page, in the Service Account field, select the appropriate service principal that the application will use and **save** the changes.
1. Take note of the auto-generated Client ID.
1. On the **Authentication** tab in the **OAuth 2.0 Scopes** section, select the allowed scopes for your application. These are the scopes that you will be able to request when obtaining an access token. See [OAuth 2.0 Scopes for Laserfiche APIs](../guide_oauth_2.0_scopes/) for more details.
1. Use the Authentication tab to generate the access key most suitable to your use case. Service applications support the following options:

   - Option 1: Using a **Public 'Access Key' and 'Service Principal Key'** to obtain an API Access Token.
     - Choose this option if the service app uses the [Laserfiche API client libraries](../../libraries/) or is capable of generating an HMAC client credential.
     - You will generate a **Public 'Access Key'** which you can then use with a **Service Principal Key** to generate an HMAC credential.
     - Once generated, continue to the [OAuth Client Credentials Grant Flow](#oauth-client-credentials-grant-flow) section to generate an HMAC client credential and request an access token.
   - Option 2: Using a long-lasting **Authorization Key** to obtain an API Access Token.

     - Choose this option if the service app does not have the capabilities of generating an HMAC client credential. This option is intended for [low-code tools](../../../getting-started/guide_low-code-tools/) that require a static secret to connect to Laserfiche APIs.
     - Creating an **Authorization Key** requires entering a valid service principal key for the selected service principal

       {: .note }
       **Note:** The Authorization Key will be invalidated when the service principal key expires or is rotated. A new Authorization Key will need to be created using a valid service principal key.

     - Once generated, continue to the [Request an Access Token](#request-an-access-token) section to obtain your token.

   - Option 3: Using a **username** and **password** to directly access the API.

     - Choose this option if the service app does not have the ability to use the OAuth credentials flow. You can use the generated credentials directly with the Laserfiche API.
     - Creating a **username** and **password** requires a valid service principal key for the selected service principal

       {: .note }
       **Note:** The credentials will be invalidated when the service principal key expires or is rotated. New credentials will need to be created using a valid service principal key.

     - To create a **username** and **password** you must specify requested scopes. This is required since you do not have the additional step of specifying scopes when requesting an access token using this option. These should fall within the allowed scopes of your application, the scopes your application will have access to will be the intersection of the allowed and requested scopes.
     - Once generated, you can skip the next step for the OAuth credentials flow and go directly to the [Use the credentials to access Laserfiche APIs](#use-the-credentials-to-access-laserfiche-apis) section.

1. When generating an access key, please **copy** or **download** the key as it will only be shown once. Each service app can have a maximum of 2 access keys.

   {: .note }
   **Note:** Access keys should be securely stored.

## OAuth Client Credentials Grant Flow

**Note:** This section can be skipped if you are using Basic Authentication with a **username and password**. You can proceed directly to the [Use the credentials to Laserfiche APIs](#use-the-credentials-to-access-laserfiche-apis) section.

### Generate an HMAC Client Credential

**Note:** This step can be skipped if a long-lasting **Authorization Key** was created, the Authorization Key can be used as the HMAC client credential. Continue to the [request an access token](#request-an-access-token) step.

If a public **access key** was created, an HMAC client credential will need to be generated. The HMAC client credential is a JWT and should contain the following claims.

| Claim Key     | Claim Value                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| client_id     | The service app's Client ID.                                                                                                                   |
| client_secret | The service principal key for the service principal associated with the app.                                                                   |
| aud           | The audience claim should be set to "laserfiche.com"                                                                                           |
| exp           | The expiration time claim for the JWT, formatted as seconds since Unix epoch. Recommended value is between 1 to 60 mins from the current time. |

The JWT will also need to be signed by the **access key**. See the links below for how to create a signed JWT using the [Laserfiche Client Core API client libraries](../../libraries/).

- [JavaScript/TypeScript](https://github.com/Laserfiche/lf-api-client-core-js/blob/2ebf041d89d7a656a409052f3b2efe191a5c8cc0/lib/OAuth/AccessKey.ts#L60)
- [.NET](https://github.com/Laserfiche/lf-api-client-core-dotnet/blob/b6a696a93169a1f7cca16774db0fb888bb2163b0/src/Utils/JwtUtils.cs#L22)
- [Java](https://github.com/Laserfiche/lf-api-client-core-java/blob/601f693e7d167f7dd5dcd85a628fb43a9b1c0a7d/src/main/java/com/laserfiche/api/client/tokenclients/TokenClientUtils.java#L44)

### Request an Access Token

1.  The service application can then issue a POST request with the generated HMAC client credential JWT or Authorization Key in the Bearer Authorization header to request an access token.

    - ```
        POST https://signin.laserfiche.com/oauth/token HTTP/1.1
        Authorization: Bearer jwt-containing-client_id-and-client_secret-here
        Content-Type: application/x-www-form-urlencoded

        grant_type=client_credentials&scope=repository.Read repository.Write
      ```

    - The **grant_type** should be **client_credentials**.
    - The **scope** parameter determines the OAuth 2.0 scopes requested by the app. Scopes are case-sensitive and space-delimited. See [OAuth 2.0 Scopes for Laserfiche APIs](../guide_oauth_2.0_scopes/) for more details.

1.  The OAuth service will attempt to authenticate the client credentials.

    - On success, the OAuth service will return an access token in the response.

      - ```
          HTTP/1.1 200 OK
          Content-Type: application/json; charset=UTF-8
        ```
        ```json
          {
          "access_token": "some_access_token_value",
          "token_type": "bearer",
          "expires_in": 43200,
          "scope": "repository.Read repository.Write"
          }
        ```

    {: .note }
    For service applications, no refresh token will be returned. When the access token expires, the service application will need to start the client credentials flow again to get a new access token.

    - On failure, the OAuth service will return an error response.

      - ```
          HTTP/1.1 401 Unauthorized
          Content-Type: application/json; charset=UTF-8
        ```
        ```json
          {
          "error": "invalid_client",
          "error_description": "The client_id is invalid or authentication failed.",
          "type": "invalid_client",
          "title": "The client_id is invalid or authentication failed.",
          "status": 401,
          "instance": "/token",
          "operationId": "07f50babe09746a4b62346c3e89c4839",
          "traceId": "00-55eea5e3876a0c42a06ad1c78922e247-53d1e1ec0b933944-00"
          }
        ```

Error types include:

- **unsupported_grant_type:** grant_type is not supported.
- **invalid_request:** Required field is missing or credentials are malformed.
- **invalid_client:** The client authentication is missing or the client_id is invalid.
- **unauthorized_client:** The application type is not Service. Or the application does not have a valid service principal.

## Use the credentials to access Laserfiche APIs

- Using an OAuth Access Token (generated from OAuth Credentials Flow)

  Include the access token in the Bearer Authorization header when accessing the Laserfiche API.

  Use the **Repositories** route to get a list of repositories current user have access to.

  ```
  GET https://api.laserfiche.com/repository/v1/Repositories
  Authorization: Bearer some_access_token_value
  ```

  {: .note }
  The OAuth access token is supported for repository v1 and later APIs.

  You can make repository API calls like so:

  ```
  GET https://api.laserfiche.com/repository/v1/Repositories/{repoId}/Entries/{entryId}
  Authorization: Bearer some_access_token_value
  ```

- Using a username and password

  Include the username and password in the Basic Authorization header when accessing the Laserfiche API. This should follow the Basic Authentication standard of _username:password_, base64-encoded

  {: .note }
  Basic Authentication is supported for Table APIs.

  You can make Table API calls like so:

  ```
  GET https://api.laserfiche.com/odata4/table
  Authorization: Basic base64_encoded_username:password
  ```
