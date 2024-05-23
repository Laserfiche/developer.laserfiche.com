---
layout: default
title: Create OAuth Single-Page App
nav_order: 4
redirect_from:
  - guides/guide_oauth-spa.html
  - guide_oauth-spa.html
parent: Authentication
grand_parent: API
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Creating an OAuth Single-Page App for the Laserfiche API

{: .note }
**Note:** The following guide only applies to Laserfiche Cloud.

A single-page app (SPA) is a web application that runs entirely in the browser. The Laserfiche API supports SPAs using the OAuth authorization code flow with the Proof Key for Code Exchange (PKCE) extension.

## Register your Single-Page App in the Developer Console

1. Sign in to the [Developer Console](../../../getting-started/developer-console/)
1. Click **New** to display the **Create Application** dialog box. Select the option to create a new app and then select the **Single-page App** app type and give the app a name.
1. On the **App Configuration** page, specify a redirect URI. The redirect URI must be a valid endpoint in the integration application. The OAuth service will send an authorization code and access token to the Redirect URI in the OAuth flow. Only URIs with HTTPS or HTTP schemes are allowed. And HTTP is only supported for local hosts, e.g., http://localhost/callback or http://localhost:11111/callback. Each SPA can have a maximum of 10 Redirect URIs registered.
1. Take note of the generated Client ID, as it will be necessary when communicating with the OAuth service.
1. In the **OAuth 2.0 Scopes** section, select the needed scopes for your application to function properly. See [OAuth 2.0 Scopes for Laserfiche APIs](../guide_oauth_2.0_scopes/) for more details.

## Generating a PKCE Code Verifier and Code Challenge

SPAs run entirely in the browser and do not have the ability to store server-side secrets. They can be susceptible to authorization code interception attacks when using the authorization code flow, which is why we require SPAs to also use the PKCE extension with the regular authorization code flow. To use the PKCE extension, _code_verifier_ and _code_challenge_ values need to be generated as specified in [RFC 7636 section 4.1](https://datatracker.ietf.org/doc/html/rfc7636#section-4.1). See the following C# sample code for generating the _code_verifier_ and _code_challenge_.

   - ```js
       var rng = RandomNumberGenerator.Create();
       var bytes = new byte[32];
       rng.GetBytes(bytes);

       var code_verifier = Convert.ToBase64String(bytes)
           .TrimEnd('=')
           .Replace('+', '-')
           .Replace('/', '_');

       using var sha256 = SHA256.Create();
       var challengeBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(code_verifier));
       var code_challenge = Convert.ToBase64String(challengeBytes)
           .TrimEnd('=')
           .Replace('+', '-')
           .Replace('/', '_');
     ```

   - The **code_verifier** and **code_challenge** values should have a length between 43 and 128 characters and can only contain a-z, A-Z, 0-9, "-", ".", "\_", or "~" characters.
   - The **code_challenge** is generated from the **code_verifier** by generating a SHA256 hash of the **code_verifier** and then base64url encoding the SHA256 hash.

## OAuth Authorization Code Grant Flow with PKCE extension

1.  Start the OAuth authorization code flow to get an access token that can be used to authenticate with the Laserfiche API. Call the OAuth service authorization endpoint, including the _client_id_ and _redirect_uri_ query parameters for the registered app. The PKCE extension requires _code_challenge_ and _code_challenge_method_ query parameters. See the following example authorization request.

     ```
        GET https://signin.laserfiche.com/oauth/authorize?client_id=app1&response_type=code&state=someappstate&
            redirect_uri=https%3A%2F%2Fapp%2Eexample%2Ecom%2Fcallback&customerId=123456789&
            code_challenge=some_code_challenge_value&code_challenge_method=S256&scope=repository.Read+repository.Write
      ```
    - The **client_id** parameter is the Client ID generated during the application registration process. It can be found on the Developer Console.
    - The **redirect_uri** parameter determines where the OAuth service redirects to after the authorization part. The value must match one of the redirect URIs specified during the application registration process. If no matching value is found in the application registration, it will return an error in the user's browser and no redirect will happen.
    - The **response_type** parameter is used by the application to inform the authorization server of the desired grant type. The value must be **code** for authorization code grant flow.
    - The **state** query parameter is optional but recommended. It is used to maintain the web application state between the request and callback. The parameter should be used to prevent cross-site request forgery as specified in the OAuth specification found in [RFC 6749 section 4.1](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1).
    - The **customerId** parameter should be the same Laserfiche Cloud Account ID used during the web app registration process.
    - The **code_challenge** should be the value generated in the first step.
    - The **code_challenge_method** is used to inform the authorization server the type of code_challenge used. The value must be S256
    - The **scope** parameter determines the OAuth 2.0 scopes requested by the app. Scopes are case-sensitive and space-delimited. See [OAuth 2.0 Scopes for Laserfiche APIs](../guide_oauth_2.0_scopes/) for more details.

1.  After sending the authorization request, the user will be redirected to sign in to Laserfiche Cloud if they are not already signed in. The user must sign in using the same Account ID as the one used for registering the SPA. Otherwise, the OAuth service will return an error. If the user is already signed in to another Laserfiche Cloud service, the browser should already have the associated Laserfiche Cloud cookies. If the cookies exist, the process will skip the sign-in step and will show the consent page in next step directly.
1.  The consent page will then be shown to the user to decide whether to grant the SPA access to their credentials. The user will have 5 minutes to either confirm or deny the consent. After 5 minutes of inactivity, the OAuth service will return an error and they will need to start the authorization flow from the beginning.
    - If the user grants access, an authorization code will be generated and sent to the redirect_uri specified in the query parameter and the user's browser will be redirected to redirect_uri. If the state query parameter was used in the first step, it will be sent back with the authorization code. An example successful redirect request is shown below:
      ```
      https://app.example.com/callback?scope=repository.Read+repository.Write&code=some_auth_code_value&state=someappstate
      ```

1.  If the user denies access, an error will be sent to the redirect_uri specified in the query parameter and the user's browser will be redirected to redirect_uri. If the state query parameter was used in the first step, it will be sent back with the error. An example error redirect request is shown below:

      ```
      https://app.example.com/callback?error=access_denied&error_description=Consent+has+not+been+given.&state=someappstate
      ```

    - Errors include:
        - **invalid_request:** An invalid request may be due to missing required fields.
        - **access_denied:** The user did not give consent to use their credentials, or the consent form has already been completed or expired.
        - **unauthorized_client:** The application type is not a single-page app.
        - **server_error:** The authorization server encountered an unexpected error.


1.  After getting the authorization code, the application can exchange it for an access token by calling the token endpoint. The authorization code has a lifetime of 10 minutes. If not used within its lifetime, it will expire and the application must restart the authorization flow. 

**Example Access Token Request** 
  ```
    POST https://signin.laserfiche.com/oauth/token HTTP/1.1
    Content-Type: application/x-www-form-urlencoded
    grant_type=authorization_code&code=some_auth_code_value
        &redirect_uri=https%3A%2F%2Fapp%2Eexample%2Ecom%2Fcallback
        &client_id=app1&code_verifier=some_code_verifier_value
  ```
- The **grant_type** should be **authorization_code**.
- The **code** should be the authorization code returned in the previous authorization step.
- The **redirect_uri** should be identical to the one passed to the */authorize* endpoint in the previous authorization step.
- The **client_id** should be the Client ID generated when registering your SPA in the Developer Console.
- The **code_verifier** should be the code verifier generated in the first step.

**Example Successful Access Token Response**
  ```
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=UTF-8
  ``` 
  ```json
    {
    "access_token": "some_access_token_value",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "some_refresh_token_value",
    "scope": "repository.Read repository.Write"
    }
 ```
- The returned access token includes an expiration time in seconds. Upon expiration, the application can use the refresh token to get a new one. The refresh token has a lifetime of around 8 hours from the time it was issued. The refresh token can also be invalidated when the user signs out from Laserfiche Cloud.
- The returned scope is the granted scope by the OAuth Server.

**Example Error Response**
  ```
    HTTP/1.1 401 Unauthorized
    Content-Type: application/json; charset=UTF-8
  ```
  ```json
    {
    "error": "invalid_client",
    "error_description": "The client credentials are invalid or authentication failed.",
    "type": "invalid_client",
    "title": "The client credentials are invalid or authentication failed.",
    "status": 401,
    "instance": "/Token",
    "operationId": "07f50babe09746a4b62346c3e89c4839",
    "traceId": "00-55eea5e3876a0c42a06ad1c78922e247-53d1e1ec0b933944-00"
    }
  ```
Error types include:
- **unsupported_grant_type:** grant_type is not authorization_code.
- **invalid_request:** Required field is missing.
- **invalid_client:** The client authentication is missing or failed, or the client_id is invalid.
- **unauthorized_client:** The application type is not a single-page app.
- **invalid_grant:** redirect_uri does not match the one that started the authorization flow, or the authorization code is invalid or expired.

## Cross-Origin Resource Sharing (CORS) Policy Information

Current CORS policy is to allow an _origin_ only if its host (and port) is the same as that of the redirect URI that sent in the request to the _Authorize_ api.

## Use the Access Token to Access the Laserfiche API

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

## Refreshing an Access Token

When an access token expires, the SPA can use the refresh token grant type to get a new one.
**Example refresh token request**

```
POST https://signin.laserfiche.com/oauth/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=some_refresh_token_value&client_id=app1
```

- The **grant_type** in the request body should be **refresh_token**.
- The **refresh_token** value should be the one returned along with access token in the previous get access token step.
- The **client_id** should be the Client ID generated when registering your SPA in the Developer Console.

**Example Successful Refresh Token Response**

In a successful response, the OAuth service will return a new access token with a new refresh token in the response. The new access token will have the same scope as the previous access token.

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8
```
```json
{
   "access_token": "another_access_token_value",
   "token_type": "bearer",
   "expires_in": 3600,
   "refresh_token": "another_refresh_token_value",
   "scope": "repository.Read repository.Write"
}
```

The old refresh token will be invalidated after the call. If the new access token expires, you must use the new refresh token to get another access token.

For security reasons, if an old refresh token is reused, the OAuth service will invalidate the current, i.e. the most recent, refresh token and return an error similar to the one below.

**Example Error Response**

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=UTF-8
```
```json
{
   "error": "invalid_grant",
   "error_description": "The use of a previously used refresh token has been detected. As a security precaution, the refresh token has been invalidated.",
   "type": "invalid_grant",
   "title": "The use of a previously used refresh token has been detected. As a security precaution, the refresh token has been invalidated.",
   "status": 400,
   "instance": "/Token",
   "operationId": "e59562d544154c88a17d8b842dd51c97",
   "traceId": "00-5ec73ccfad5c6041b09001999b61aca4-87df063e7465a449-00"
}
```

{: .note }
For SPA, the new refresh token will have the same lifetime as the first refresh token, which is around 8 hours from the time it was issued. When the access token and the refresh token expires, the SPA will need to start the OAuth authorization code flow from the beginning to get a new access token.
