---
layout: default
title: Getting Started
nav_order: 2
redirect_from:
  - guides/guide_getting-started.html
  - guide_getting-started.html
has_children: true
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Getting Started with the Laserfiche API

The Laserfiche API is a set of RESTful web APIs that allow you to build custom integrations between third-party applications and Laserfiche. These frequently asked questions and how-to guides will help you start building seamless integrations with Laserfiche.

Want to jump right in and start making some API calls now? Check out our guide to using our Swagger Playground.

## Authenticate to the Swagger Playground

Follow our step-by-step guide to authenticate and interact with our Swagger Playground. [Learn More](../../api/authentication/guide_authenticating-to-the-swagger-playground/)

Looking for core repository functionality? Learn how you can authenticate to the Laserfiche API, create some folders, write field values and import documents to your repository.

## Authenticate to the Laserfiche API

Learn how to create a secure connection to Laserfiche and authenticate each API request. [Learn More](../../api/authentication/guide_authenticate-to-the-laserfiche-api/)

## Create Folders

Create the folder structure in your repository. [Learn More](../../guides/documents-and-folders/guide_creating-folders/)

## Write Field Values

Assign values to Laserfiche fields. [Learn More](../../guides/metadata/guide_write-field-values/)

## Import documents

Learn how to import documents. [Learn More](../../guides/documents-and-folders/guide_importing-documents/)

## Where can I use the Laserfiche API?

The Laserfiche API is available for Laserfiche Cloud and [Self-Hosted](../../api/server/) Laserfiche instances.

## What can I build with the Laserfiche API?

Leverage the Laserfiche API to build integrations with other enterprise platforms and implement custom end-to-end solutions. Currently, the Laserfiche API supports calls that allow you to interact with your Laserfiche repository and lookup tables, but we are looking expand the Laserfiche API to all parts of the Laserfiche suite. Here are just a few examples of what you can build:

- **GIS mapping system integration.** A government department wants to use a GIS mapping system to provide a front end to users to show relevant property information such as building type, location, inspection information, zoning data, etc. They'd also like to enable users to view any related Laserfiche documents associated with a certain property address to enable a smoother, more centralized user experience. Using the Laserfiche API, an integration could be built out where the GIS system makes a call out to the Laserfiche repository to retrieve the relevant information and files to pass into the GIS system user interface.
- **ERP integration.** An AP department uses an ERP platform to manage accounting transactions. As part of an invoice processing solution, they'd like to be able to store invoices directly in Laserfiche for compliance and archival purposes. Otherwise, AP employees must manually transfer invoices out from the ERP, taking time away from more valuable tasks. The Laserfiche API can be leveraged to develop an integration that automatically pushes invoices from the ERP to the Laserfiche repository, allowing for a more efficient solution that better supports compliance.
- **CRM integration.** The sales department uses a CRM platform to manage all customer data. They'd like to store copies of all customer emails and communications in the Laserfiche repository. With the Laserfiche API, an integration can automatically push customer-related documents from the CRM platform to the repository for archival and retention.

## Next Steps:

- Check out our [Guides](../../guides/) page for more walk-throughs and tutorials about the Laserfiche API.
- If you're new to RESTful web APIs, check out our [overview](../../api/guide_overview-of-the-laserfiche-api/) to learn what the API looks like and how it works.
