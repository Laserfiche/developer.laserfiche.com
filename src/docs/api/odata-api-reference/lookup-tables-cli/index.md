---
layout: default
title: LookupTables CLI
nav_order: 1
parent: OData Table API
grand_parent: Laserfiche APIs
---

<!--© 2024 Laserfiche.
See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.-->

# Lookup Tables CLI For Laserfiche Cloud

## Overview

LookupTables command line utility is an executable available for Windows or Linux with the following capabilities:

- List Lookup Tables names.
- Query a Lookup Table and optionally saves the result in a CSV or JSON file.
- Replaces all the rows in a Lookup Table with the ones from a CSV or XLSX file. See [Lookup Tables documentation](https://doc.laserfiche.com/laserfiche.documentation/en-us/Default.htm#../Subsystems/ProcessAutomation/Content/Resources/Entities/lookup-tables.htm) for more information.

Open source [GitHub project](https://github.com/Laserfiche/lf-lookup-tables-cli)

## Download and installation

1. Download LookupTables CLI for your operating system:

   - [lookuptables-win-x64.zip](./lookuptables-win-x64.zip)
   - [lookuptables-linux-x64.zip](./lookuptables-linux-x64.zip)

1. Extract folder on target machine
1. On Linux, give `LookupTables` file execute permissions, for example

   ```sh
   sudo chmod 744 LookupTables
   ```

## Usage examples

### Show help and usage information

Windows:

```sh
.\LookupTables.exe -?
```

Linux:

```sh
./LookupTables -?
```

### List all the lookup tables in the Global context

```sh
./LookupTables.exe list-lookup-tables  --project-scope "project/Global"  --service-principal-key "<ENTER Service Principal Key>" --access-key-base64string "<ENTER base-64 Access Key string>"
```
