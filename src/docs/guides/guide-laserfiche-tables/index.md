---
layout: default
title: Working with Reporting Applications
nav_order: 8
has_children: false
parent: Guides
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Accessing Lookup Tables from Reporting Applications

The Laserfiche Lookup Table API supports the OData 4 standard, which enables it to be used with popular reporting applications like PowerBI, Tableau, and Excel. This guide will walk you through how to connect to your Lookup Tables from these tools, but these instructions should generally apply to most reporting tools that support connecting to data via the OData standard. If this is your first time working with the Lookup Table API, it is recommended that you review the [table API overview](./../../api/odata-api-reference/) first.

## 1. Configure a Lookup Table

Lookup Tables are configured in `Process Automation -> Data Management -> Lookup Tables` and belong to either `Global` or a specific Process Automation Project which defines the security scope. You can read more about Projects in Process Automation [here](https://doc.laserfiche.com/laserfiche.documentation/en-us/Default.htm#../Subsystems/ProcessAutomation/Content/Resources/Teams/projects.htm?TocPath=Process%2520Automation%257CTeams%257CProjects%257C_____0).

{: .note }
**Note:** The security scopes e.g. `project/Global` or `project/YourProjectName` and `table.Read` must be configured in the Service App and included in the credentials.

## 2. Obtain a Service Principal Account and Key

- Select an existing Service Principal account or create a new one. The service principal must have the Process Automation Administrator role in order to access global resources. See the [Table API security overview](./../../api/odata-api-reference/#security) for details on what roles the service principal must have if using resources within a project instead of global resources.
- In Account Administration, generate a Service Principal key for the account (record the key string, you'll need it later).

{: .note }
**Note:** The service principal must have Process Automation Administrator role in order to access global resources.

## 3. Create your App in the Laserfiche Developer Console

- Create a Service App and credentials to represent the integration with your reporting tools.
  - Follow instructions [here](./../../api/authentication/guide_oauth-service/) on creating a Service App in the Laserfiche Developer Console and generating an access key. Use the service principal and service principal key that you generated in the previous step when generating your credentials.
  - Determine what process automation scopes you will need by reviewing the [Table API security overview](./../../api/odata-api-reference/#security). These scopes will need to be configured in developer console and used when generating your username/password.

{: .note }
**Note:** It is important to follow the instructions for the Username/Password authentication method, as that is the only authentication method that is supported by most reporting tools like PowerBI, Excel, or Tableau.

**The following screenshots show how to generate a username/password to access global resources:**

   1. Create Service App in Developer Console

      ![Create developer console application](./assets/images/DevConsoleCreateApp.png){: width="500" }

   1. Configure OAuth Scopes for Service App in the Authentication tab

      ![Set scopes in developer console](./assets/images/DevConsoleScopes.png){: width="800"}

   1. Create Access Key for Service App: Select username/password

      ![Create key in developer console](./assets/images/DevConsoleCreateKey.png){: width="500"}

   1. Input Service Principal Key and scopes to generate credentials

      ![Generate username and password](./assets/images/DevConsoleKeyandScopes.png){: width="600"}

## 4. Create an OData Connection to the Laserfiche API

At this point, you should be ready to set up your reporting tool of choice to access your Lookup Table data. In the steps below we will configure Excel and PowerBI, but the steps should be very similar for most other OData compliant applications.

### Excel (Microsoft Office 365)

1. From the "Data" tab in the Office Ribbon, select the "Get Data" button, then "From Other Sources…", then "From OData Feed".

   ![Excel OData feed](./assets/images/ExcelOdataFeed.png){: width="500"}

1. In the Odata Feed window, enter the appropriate URL (see below) for your Laserfiche Cloud environment and click "OK".

   - US Cloud Customers: <https://api.laserfiche.com/odata4/table/>
   - CA Cloud Customers: <https://api.laserfiche.ca/odata4/table/>
   - EU Cloud Customers: <https://api.eu.laserfiche.com/odata4/table/>

   ![Input OData URL in Excel](./assets/images/ExcelOdataFeedURL.png){: width="600"}

1. In the next window, select "Basic" from the side navigation options, then enter the Username and Password you created in the Developer Console previously. In the "Select which level to apply these settings to" drop down, you can select the URL that most closely matches the URLs in step 2 above.

   ![Input OData API credentials in Excel](./assets/images/ExcelOdataFeedCreds.png){: width="600"}

1. In the Navigator window you should now see all the Lookup Tables that your app has access to view. You can now select a table and click the "Load" button. In our example, we will select the "BuildingPermits" table.

   ![Navigate OData feed](./assets/images/ExcelOdataNavigator.png){: width="700"}

1. The Lookup Table rows should now be loaded into a new sheet in your Excel file. You can work with the data within Excel to build reports and analyze.

### PowerBI Desktop

1. In PowerBI Desktop, select "Get data" from the "Home" tab in the Office Ribbon, then select the "OData Feed" option.

   ![PowerBI OData Feed](./assets/images/PowerBIOData.png){: width="500"}

1. In the Odata Feed window, enter the appropriate URL (see below) for your Laserfiche Cloud environment and click "OK".

   - US Cloud Customers: <https://api.laserfiche.com/odata4/table/>
   - CA Cloud Customers: <https://api.laserfiche.ca/odata4/table/>
   - EU Cloud Customers: <https://api.eu.laserfiche.com/odata4/table/>

   ![Input OData URL in PowerBI](./assets/images/PowerBIODataFeedURL.png){: width="700"}

1. In the next window, select "Basic" from the side navigation options, then enter the Username and Password you created in the Developer Console previously. In the "Select which level to apply these settings to" drop down, you can select the URL that most closely matches the URLs in step 2 above.

   ![Input OData credentials in PowerBI](./assets/images/PowerBICreds.png){: width="700"}

1. In the Navigator window you should now see all the Lookup Tables that your app has access to view. You can now select a table and click the "Load" button. In our example, we will select the "BuildingPermits" table.

   ![Navigate OData feed](./assets/images/ExcelOdataNavigator.png){: width="700"}

1. You should now see the schema for your Lookup Table in the Data pane. You can now select individual columns from your table to drag onto the PowerBI canvas and build your visualizations and reports.

   ![View OData feed data](./assets/images/PowerBIODataFeedDataPane.png){: width="500"}

### Tableau

1. From the Tableau "Connect" screen, under the "To a Server" heading, select "More...", then "OData".

   ![Tableau OData menu](./assets/images/TableauOdataMenu.png){: width="600"}

1. In the Odata window, enter the appropriate URL (see below) for your Laserfiche Cloud environment. Then select the "Basic" authentication option and enter the Username and Password you created in the Developer Console.

   - US Cloud Customers: <https://api.laserfiche.com/odata4/table/>
   - CA Cloud Customers: <https://api.laserfiche.ca/odata4/table/>
   - EU Cloud Customers: <https://api.eu.laserfiche.com/odata4/table/>

   ![Enter OData credentials in Tableau](./assets/images/TableauCreds.png){: width="500"}

1. You should now see the schema for your Lookup Table in the main Tableau canvas. You can now select individual columns from your table to drag onto the canvas and build your visualizations and reports.

   ![View OData schema in Tableau](./assets/images/TableauSchema.png){: width="800"}
