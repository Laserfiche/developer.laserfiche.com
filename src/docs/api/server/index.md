---
layout: default
title: Self-Hosted API Server
nav_order: 4
redirect_from:
  - api/server/index.html
parent: Laserfiche APIs
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Self-Hosted Laserfiche API Server

The Laserfiche API Server provides programmatic access to Laserfiche for self-hosted systems.

The self-hosted Laserfiche API Server can be installed to connect with your self-hosted Laserfiche Server. The APIs available are almost the same as the APIs available for Cloud. We also provide [client libraries](../libraries/) you can use to speed up the development process when integrating with Laserfiche using the Laserfiche APIs. The same client libraries can be used for both Cloud and Self-Hosted.

### Differences between Cloud and Self-Hosted Laserfiche API

- Authentication: The Cloud Laserfiche API follows the [OAuth 2.0 authorization model](../authentication/) whereas the Laserfiche API Server for self-hosted systems supports [username/password authentication](#authenticating-with-the-self-hosted-laserfiche-api).
- APIs: The deprecated Cloud ServerSession APIs are not available in the Laserfiche API Server for self-hosted systems.
- Volume Support: The Laserfiche API Server supports choosing volumes when creating new entries while the Laserfiche API in Cloud does not.

## How to download and install Laserfiche API Server

### Installation prerequisites

- Operating System: 64-bit Windows Server 2012 R2 or later, Windows 10 or later.
- Internet Information Services (IIS)
- .NET 6
- The Laserfiche API Server supports connecting to Laserfiche Server 11 repositories.

### Installation steps

1. Download the [self-hosted Laserfiche API Server installer](https://support.laserfiche.com/download/4180).
1. Run the Laserfiche API Server installer and follow the steps to install.

### Installation configuration

1. In IIS Manager, **configure** HTTPS bindings (required) for the website containing the "LFRepositoryAPI" web application.
1. Navigate to the directory `%ProgramData%\Laserfiche\API Server\LFRepositoryAPI` and **open** `appsettings.json` using a text editor as an administrator.
1. In `appsettings.json`, set the value of **"LaserficheServerName"** to the fully qualified domain name of your Laserfiche Server in your network. If your Laserfiche Server is using a non-default port, append the port to the fully qualified domain name (e.g., "myLaserficheServer.myOrganization.com:123").
1. Optional configuration settings
   - (Optional) In `appsettings.json`, set the value of **"EnableLaserficheServerSSL"** to false if the connection to the Laserfiche Server is **NOT** secured using TLS/SSL.
   - (Optional) In `appsettings.json`, set the value of **"EnableGetRepositoryListApi"** to true if you would like to enable the GET /Repositories API that returns the list of repositories. **Note that using this API does not require an access token.**
   - (Optional) In `appsettings.json`, set the value of **"KeyedConcurrentLicense"** to your "Keyed Concurrent License".
   - (Optional) In `appsettings.json`, set the value of **"LaserficheWebClientHostUrl"** to your "Laserfiche Web Client Host URL" (e.g., "https://_{LaserficheWebClientHostName}_/laserfiche").
   - (Optional) To modify the file upload (document import) size limit:
     1. Navigate to the Laserfiche API Server installation directory (by default, "C:\Program Files\Laserfiche\API Server\LFRepositoryAPI") and **open** "web.config" using a text editor as an administrator. Change the value of **"maxAllowedContentLength"** in "&lt;requestLimits maxAllowedContentLength="104857600" /&gt;" to the desired value in **bytes**.
     1. Do one of the following depending on the version of the Laserfiche API Server
        - **Laserfiche API Server 1.1:** Navigate to the Laserfiche API Server installation directory (by default, "C:\Program Files\Laserfiche\API Server\LFRepositoryAPI") and **open** "microservice.json" using a text editor as an administrator. Change the value of **"UploadFileSizeLimitBytes"** under the "Operation" section to the desired value in **bytes**.
        - **Laserfiche API Server 1.0:** Navigate to the directory "%ProgramData%\Laserfiche\API Server\LFRepositoryAPI" and **open** `appsettings.json` using a text editor as an administrator. Set the value of **"UploadFileSizeLimitMb"** to the desired value in **MB**.
   - (Optional) To override the default log settings, navigate to the installation directory (e.g., "C:\Program Files\Laserfiche\API Server\LFRepositoryAPI") and open "nlog.config" using a text editor as an administrator. For example, the last logging rule's "minLevel" can be increased to reduce trace logging.
1. **Save** `appsettings.json` and **restart** IIS Server.

### Verify your Installation

To verify the Laserfiche API Server is running, navigate to the API Server Swagger page by opening IIS Manager and navigating to the website containing "LFRepositoryAPI" and click browse application. This should open the following page https://_{APIServerName}_/LFRepositoryAPI/swagger/index.html.

### Troubleshooting the Installation

- Verify the [ASP.NET Core Runtime (v6.0.0 or later) - Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) is installed correctly. If not, manually install the runtime again.
- Verify the value of "LaserficheServerName" is set correctly in `appsettings.json` and the configuration settings printed to the logs are correct. The logs can be found in the directory "%ProgramData%\Laserfiche\API Server\LFRepositoryAPI\Logs".
- If the installation fails, please verify that in IIS Manager, a website with ID "1" is present.

## Authenticating with the Self-Hosted Laserfiche API

- To start using the self-hosted Laserfiche APIs, you will need an access token to send with each request. The request to get an access token requires the repository ID associated with your Laserfiche Server and a username and password to log in. Grant_type is always set to "password".
- The username and password key-value pair can be a Laserfiche repository user, a Laserfiche Directory Server user, or a Windows domain user. When using a "Keyed Integration License", the password grant type is still used in association with a user account, but the allowed concurrent sessions will match those in the license.

{: .note }
**Note:** When authenticating with a Windows domain account, the API expects the username to be in either UPN format (**username@domain**) or down-level logon name format (**domain\username**). Windows Domain accounts password authentication requires connectivity to LFDS or LDAP server.

```
POST https://{APIServerHostName}/LFRepositoryAPI/v1/Repositories/{repositoryId}/Token
Content-Type: application/x-www-form-urlencoded

grant_type=password&username={username}&password={password}
```

{: .note }
**Note:** You can make this request from the Swagger Playground. Navigate to the installed Laserfiche API Server Swagger Playground page: https://_{APIServerHostName}_/LFRepositoryAPI/swagger/index.html and expand the Token section to find the /Token API. Click the Try it out button and fill in the request parameters to send the request.

If successful, the API will return a 200 HTTP response status code and the response body will contain an access token.

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

Include the access token in the Bearer Authorization header when accessing the Laserfiche API like so:

```
GET https://{APIServerHostName}/LFRepositoryAPI/v1/Repositories/{repositoryId}/Entries/{entryId}
Authorization: Bearer {accessToken}
```

{: .note }
**Note:** To add the access token to each request on the Swagger Playground, scroll to the top of the page, click the Authorize button, and enter the access token in the dialog box.

Now you're ready to make any Laserfiche API call.

## Try out your installation with a sample application

Try our [Sample Projects](../libraries/) to learn how to use our client libraries to access your self-hosted Laserfiche API Server.
