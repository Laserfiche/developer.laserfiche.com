---
layout: default
title: OData Table API
nav_order: 1
parent: Laserfiche APIs
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# OData Table API

## Overview

The Lookup Table OData API allows users to interact with data stored in lookup tables in Laserfiche Cloud. It follows the [OData version 4 standard](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html) which allows you to use that standard to access and perform CRUD on your Laserfiche Lookup Tables from any application. Major use cases include reporting in Power BI or Excel. For more information on how to use an OData API [see the OData documentation](https://www.odata.org/getting-started/basic-tutorial/). You can explore the API using the [Swagger playground](./../../api/playground/). Lookup tables are secured using project-based security.

## Try it out

Use [swagger](./../playground/) to explore the API's possibilities.

In order to authenticate, follow the instructions in [Authenticate to the Swagger playground](./../authentication/guide_authenticating-to-the-swagger-playground/) or [Authenticate to the Laserfiche API](./../authentication/). The table API supports both Bearer access token authentication and Basic username/password authentication for use with applications like Excel and Power BI. Those details can be found in the links above.

There are some security considerations to keep in mind when using the table API which are noted below.

## Security

The Table API is secured using project-based security. This will match the already existing security for resources in process automation (learn more [here](https://doc.laserfiche.com/laserfiche.documentation/en-us/Default.htm#../Subsystems/ProcessAutomation/Content/Resources/Teams/projects.htm?TocPath=Process%2520Automation%257CTeams%257CProjects%257C_____0)). To perform actions on a specific table the user or service principal must have access to the project that the table is a member of, OR global resources if the table is a global resource. In addition, all users of the API will need to have some form of “Process Automation” role through ACS to access tables, which is detailed below. One additional security detail to note - for the OAuth application to perform actions on the specified table, it will also need to have access to the project in which the table resides using scopes specified in the developer console. This is in addition to the existing table scopes (Read/Write).

### How security works

In order to authenticate, follow the steps for [Authenticating to the Laserfiche API](./../authentication/). The important part for the table API is the scopes. You must configure table and project scopes in the developer console and ensure you are requesting the correct scopes when requesting an access token.

**Security is the intersection of:**

1. The scope parameter in the access token
   - This scope is the intersection of the scopes that are configured in developer console, the scopes that were requested when obtaining an access token, and the projects that the signed-in user has access to.
   - Both table read/write scopes AND project scopes must be selected.
1. The project access of the signed-in user or service principal

   - A user AND application must have access to the specified project in order to access tables under that project
   - Users have different rights for project resources based on their project role

     | Role               | Table Rights                 | API rights  |
     | ------------------ | ---------------------------- | ----------- |
     | Team Analyst       | View, Update                 | Read, Write |
     | Team Developer     | View, Update, Delete, Export | Read, Write |
     | Team Manager       | View                         | Read        |
     | Team Viewer        | View                         | Read        |
     | Team Member        | None                         | None        |
     | External Developer | View, Update, Delete, Export | Read, Write |

**There are three steps to ensuring your application will have your desired access.**

1. Add scopes in developer console
   - Note: You must be a Process Automation Administrator to view all projects. If you are not, you may not see any projects, or only see a subset.
   - Select the projects that you would like the app to have access to. These are the ONLY projects the app will have access to, even if the user has access to more projects so ensure all the tables you want to access are within the specified projects. If you want to grant access to global resources, add “Global”
   - Note: While the app will have access to these projects, the effective rights will be the intersection of the application’s rights AND the user’s rights (for service applications the user is the service principal, for Web Apps and SPAs the user is the signed-in user).
1. Verify user's access rights
   - Any user that is using the app must have process automation rights. This includes service principals.
   - Go to the Account Administration page and ensure the user has “Access to Process Automation” as a minimum. In order to have access to Global resources they must have at least the “Process Asset Administrator” role. See the following links for more information on the rights needed to access Project/Team resources.
     - [Managing Account Administration](https://doc.laserfiche.com/laserfiche.documentation/en-us/Default.htm#../Subsystems/ProcessAutomation/Content/Resources/Managing-Account-Administration.htm)
     - [Getting Started with Team Management](https://doc.laserfiche.com/laserfiche.documentation/en-us/Default.htm#../Subsystems/ProcessAutomation/Content/Forms-Current/Getting-Started-with-Team-Management.htm)
     - [Determining Access Rights](https://doc.laserfiche.com/laserfiche.documentation/en-us/Default.htm#../Subsystems/ProcessAutomation/Content/Resources/Teams/determining-access-rights.htm)
1. Add scopes when requesting an access token.
   1. For any Web App, SPA, or a Service App generating its own access token follow the existing instructions for requesting an access token with one important note:
   - In addition to requesting table and repository scopes you will also need to specify project scopes
     - Projects scopes should be denoted "project/{project_name}".
       - Ex/ TestProject "project/TestProject"
       - Ex/ Test With Spaces "project/Test+With+Spaces"
       - The project name specified in developer console is properly encoded, just add “project/” to the beginning
     - The returned access token will contain only the scopes for projects the user has access to (either service principal or end user)
   1. For service apps using Basic Authentication (username/password) you will need to generate the username/password with both the table read/write scopes and the correct project scopes. See [creating a service app connection](./../authentication/guide_oauth-service/) for more details on requesting a username/password.

### Examples

1. An app that has read/write access to Global Resources
   - User rights: A user that has access to global resources through ACS
   - Application scopes: “Global”, “table.Read”, “table.Write”
   - Scopes when requesting the access token: “project/Global table.Read table.Write”
1. An app that has read access to Global resources (using scopes)
   - User rights: A user that has access to global resources through ACS
   - Application scopes: “Global”, “table.Read”
   - Scopes when requesting the access token: “project/Global table.Read”
1. An app that has read access to resources within a project (using access rights)
   - User rights: A user that has access to process automation AND one of the following roles in the project (Team Manager, Team Viewer)
   - Application scopes: project scope (i.e. TestProject), “table.Read”, “table.Write”
   - Scopes when requesting the access token: “project/ TestProject table.Read table.Write”
1. An app that has read access to resources within a project (using scopes)
   - User rights: User rights: A user that has access to process automation AND ANY role in the project (Team Analyst, Team Developer, Team Manager, Team Viewer, External Project Developer)
   - Application scopes: project scope (i.e. TestProject), “table.Read”, “table.Write”
   - Scopes when requesting the access token: “project/ TestProject table.Read”
   - Not that even though the user may have access to the resources, the app does NOT because the requested scopes do not include table.Write. BOTH configured scopes in developer console AND the requested scopes must contain the scope you want for it to apply.
1. An app that has write access to resources within a project
   - User rights: A user that has access to process automation AND one of the following roles in the project (Team Analyst, Team Developer, External Project Developer)
   - Application scopes: project scope (i.e. TestProject), “table.Read”, “table.Write”
   - Scopes when requesting the access token: “project/Global table.Read table.Write”
1. An app that has read/write access to Global and read access to resources within a project
   - User rights: A user that has access to global resources through ACS AND one of the following roles in the project (Team Manager, Team Viewer)
   - Application scopes: project scope (i.e. TestProject), “Global”, “table.Read”, “table.Write”
   - Scopes when requesting the access token: “project/Global project/table.Read table.Write”

### Troubleshooting Security

1. Does your user have access to the specified resource?
   - An easy way to check if you are using an end user (Web App or SPA) is to log in to process automation and verify that the user can view/edit the table you are interested in.
   - Service principals MUST have access to the correct projects if you are using a service application. For service principals you can test with an end user and verify that the service principal has access to the same project/ACS roles.
2. Does the app have access to the specified resource?
   - Check in developer console that the correct project scope is specified. You can verify in the process automation site that the table belongs to a specific project.
   - Remember if the app needs access to Global resources, you must add the “Global” project scope.
   - Ensure you have also specified that you want the table scopes (Read/Write). If you don’t specify these scopes, the project scopes will not apply
3. Are you requesting the token correctly?
   - Ensure you have added the “project/” prefix to the scopes that have been assigned in developer console
   - Ensure if there are spaces in the project name that they have been replaced with “+”. Copying directly from developer console should be the correct scope.
   - Ensure the scopes that are returned when you request the token are what you expect. If not, double check that the user has access, the app has access, and that you have requested both the table scopes that you want as well as the project scopes that you want.
