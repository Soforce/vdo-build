# Salesforce App

```
vlocity -sfdx.username vdo20 -job project.yaml cleanOrgData
vlocity -sfdx.username vdo20 -job project.yaml packUpdateSettings
vlocity -sfdx.username vdo20 -job project-pe.yaml packExport
vlocity -sfdx.username vdo20 -job project-doc.yaml packExport
vlocity -sfdx.username vdo20 -job project.yaml packExport
vlocity -sfdx.username vdo20 -job project.yaml packRetry
vlocity -sfdx.username vdo20 -job project.yaml packContinue
vlocity -sfdx.username vdo20 -job project.yaml validateLocalData --fixLocalGlobalKeys
```
```
vlocity -job project.yaml cleanOrgData -sfdx.username vdo-dvt
vlocity -job project.yaml refreshProject -sfdx.username vdo-dvt
vlocity -job project.yaml packUpdateSettings -sfdx.username vdo-dvt
vlocity -job project-pe.yaml packDeploy -sfdx.username vdo-dvt
vlocity -job project.yaml packDeploy -sfdx.username vdo-dvt
vlocity -job project-doc.yaml packDeploy -sfdx.username vdo-dvt
```


## Init
1. Execute Vlocity XOM Administration
1) Confgure for Order Management Standard
2) Apploy Record Types and Page Layout Assignments



## Fix
2. Add Picklist values of "Jeopardy Safety Interval Unit" and "Length Unit" to "AutoTask" and "Callout" record type of Orchestration Item Definition
3. Fix "Consumer Billing"."Create OSS Account" (Huawei OSS) dependency issue by setting "Dependency Item Defition" to "Create Charging Account"
4. Delete duplicate product "Tennis Channel" (VLO-TV-0923) with "c0a04c85-ab6f-81f9-fa7e-4a2aa6803ba2" globalkey
```
SELECT Id, Name, ProductCode, vlocity_cmt__GlobalKey__c FROM Product2 WHERE Name='Tennis Channel'
```
5. Clear Product2.Product_Owner__c field value
```
Product2[] pds = [SELECT Id, Product_Owner__c FROM Product2 WHERE Product_Owner__c != null];
for (Product2 pd : pds) pd.Product_Owner__c = null;
update pds;
```

6. Clear value in vlocity_cmt__EventConditionData__c field
```
vlocity_cmt__OrchestrationItemDefinition__c[] items = new List<vlocity_cmt__OrchestrationItemDefinition__c>();
for (vlocity_cmt__OrchestrationItemDefinition__c item : [SELECT Id, vlocity_cmt__EventConditionData__c, RecordType.name FROM vlocity_cmt__OrchestrationItemDefinition__c Where RecordType.Name<>'Push Event']) {
    if (item.vlocity_cmt__EventConditionData__c != null) {
        item.vlocity_cmt__EventConditionData__c = null;
        items.add(item);
    }  
}
update items;
```

7. Fix AttributeAssignment Issue
a. Delete corrupted AttributeAssignment and OverrideDefinition records with AttributeId=null
```
delete [SELECT Id FROM vlocity_cmt__AttributeAssignment__c WHERE vlocity_cmt__AttributeId__c=null];
delete [SELECT id, vlocity_cmt__OverriddenAttributeAssignmentId__c, vlocity_cmt__OverriddenAttributeAssignmentId__r.vlocity_cmt__ObjectId__c, vlocity_cmt__OverridingAttributeAssignmentId__c, vlocity_cmt__ProductId__r.Name FROM vlocity_cmt__OverrideDefinition__c where vlocity_cmt__OverrideType__c='Attribute';]
```
b. Fix duplicate AttributeAssignment records
```
select count(id), vlocity_cmt__ObjectId__c, vlocity_cmt__AttributeId__c, vlocity_cmt__AttributeId__r.Name, vlocity_cmt__IsOverride__c from vlocity_cmt__AttributeAssignment__c group by vlocity_cmt__ObjectId__c, vlocity_cmt__AttributeId__c, vlocity_cmt__AttributeId__r.Name, vlocity_cmt__IsOverride__c having count(id)>1
```
c. Fix Product with wrong Object Type (points to "Product 2 Object")
```
select Id, name, vlocity_cmt__ObjectTYpeId__c, vlocity_cmt__ObjectTypeId__r.Name from product2 where vlocity_cmt__ObjectTypeId__r.Name='Product2 Object'
```

8. Remove "bd1208f0-7217-d4ff-65ab-cd727d5cb0d4" product because it cause API limits

This guide helps Salesforce developers who are new to Visual Studio Code go from zero to a deployed app using Salesforce Extensions for VS Code and Salesforce CLI.


8. Fix card-canvas and left-profile VlocityUITemplate
Remove extra trail '}' from the *.datapack.json file
Export the two separately
```
projectPath: vlocity
manifest:
 - VlocityUITemplate/card-canvas
 - VlocityUITemplate/left-profile

```


9. DocumentTemplate needs to be imported separately
Use ExportGroupSize settings and maxDepth command arg
```
projectPath: vlocity
queries:
  - DocumentTemplate
OverrideSettings:
  DataPacks:
    DocumentTemplate:
      ExportGroupSize: 1
```

## Not Needed

## Part 1: Choosing a Development Model

There are two types of developer processes or models supported in Salesforce Extensions for VS Code and Salesforce CLI. These models are explained below. Each model offers pros and cons and is fully supported.

### Package Development Model

The package development model allows you to create self-contained applications or libraries that are deployed to your org as a single package. These packages are typically developed against source-tracked orgs called scratch orgs. This development model is geared toward a more modern type of software development process that uses org source tracking, source control, and continuous integration and deployment.

If you are starting a new project, we recommend that you consider the package development model. To start developing with this model in Visual Studio Code, see [Package Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/package-development-model). For details about the model, see the [Package Development Model](https://trailhead.salesforce.com/en/content/learn/modules/sfdx_dev_model) Trailhead module.

If you are developing against scratch orgs, use the command `SFDX: Create Project` (VS Code) or `sfdx force:project:create` (Salesforce CLI)  to create your project. If you used another command, you might want to start over with that command.

When working with source-tracked orgs, use the commands `SFDX: Push Source to Org` (VS Code) or `sfdx force:source:push` (Salesforce CLI) and `SFDX: Pull Source from Org` (VS Code) or `sfdx force:source:pull` (Salesforce CLI). Do not use the `Retrieve` and `Deploy` commands with scratch orgs.

### Org Development Model

The org development model allows you to connect directly to a non-source-tracked org (sandbox, Developer Edition (DE) org, Trailhead Playground, or even a production org) to retrieve and deploy code directly. This model is similar to the type of development you have done in the past using tools such as Force.com IDE or MavensMate.

To start developing with this model in Visual Studio Code, see [Org Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-development-model). For details about the model, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/modules/org-development-model) Trailhead module.

If you are developing against non-source-tracked orgs, use the command `SFDX: Create Project with Manifest` (VS Code) or `sfdx force:project:create --manifest` (Salesforce CLI) to create your project. If you used another command, you might want to start over with this command to create a Salesforce DX project.

When working with non-source-tracked orgs, use the commands `SFDX: Deploy Source to Org` (VS Code) or `sfdx force:source:deploy` (Salesforce CLI) and `SFDX: Retrieve Source from Org` (VS Code) or `sfdx force:source:retrieve` (Salesforce CLI). The `Push` and `Pull` commands work only on orgs with source tracking (scratch orgs).

## The `sfdx-project.json` File

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

The most important parts of this file for getting started are the `sfdcLoginUrl` and `packageDirectories` properties.

The `sfdcLoginUrl` specifies the default login URL to use when authorizing an org.

The `packageDirectories` filepath tells VS Code and Salesforce CLI where the metadata files for your project are stored. You need at least one package directory set in your file. The default setting is shown below. If you set the value of the `packageDirectories` property called `path` to `force-app`, by default your metadata goes in the `force-app` directory. If you want to change that directory to something like `src`, simply change the `path` value and make sure the directory you’re pointing to exists.

```json
"packageDirectories" : [
    {
      "path": "force-app",
      "default": true
    }
]
```

## Part 2: Working with Source

For details about developing against scratch orgs, see the [Package Development Model](https://trailhead.salesforce.com/en/content/learn/modules/sfdx_dev_model) module on Trailhead or [Package Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/package-development-model).

For details about developing against orgs that don’t have source tracking, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/modules/org-development-model) module on Trailhead or [Org Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-development-model).

## Part 3: Deploying to Production

Don’t deploy your code to production directly from Visual Studio Code. The deploy and retrieve commands do not support transactional operations, which means that a deployment can fail in a partial state. Also, the deploy and retrieve commands don’t run the tests needed for production deployments. The push and pull commands are disabled for orgs that don’t have source tracking, including production orgs.

Deploy your changes to production using [packaging](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp.htm) or by [converting your source](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_source.htm#cli_reference_convert) into metadata format and using the [metadata deploy command](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_mdapi.htm#cli_reference_deploy).