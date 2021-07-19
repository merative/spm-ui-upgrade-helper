# Replacing font-faces in SPM

## Documentation ID

259811

## Version Hop

To v8.0

## Component

Core and Multiple Other Components

## How to tell if you are affected

Customers using SPMs font-faces in their CSS will be affected by this migration. Perform a search across all components for the following. If any references are found in your code base, then you are affected.

- helvetica-neue-ibm.css
- HelvNeueLightforIBM
- HelvNeueRomanforIBM
- HelvNeueMediumforIBM
- HelvNeueBoldforIBM

## Context of the Change

These SPM font variables were deprecated in a previous release and are now being removed from the product.

- HelvNeueLightforIBM
- HelvNeueRomanforIBM
- HelvNeueMediumforIBM
- HelvNeueBoldforIBM

Any instances of the above variables in custom code should be replaced with one of the following generic font-faces as outlined below. Alternatively, one of the unmodifiable infrastructure properties described for Step 2b may be used for non-IEG components. The recommended approach is option 2b for non-IEG components when the font-family specified by IBM is desired.

- MainRegularFontforIBM
- MainBoldFontforIBM

## How to upgrade

The following paragraphs detail the checks that should be performed on the customers code base and the changes that may be required. 

### Step 1

The CSS file 'helvetica-neue-ibm.css' has been removed from the below locations. Search for references to this file across all custom pages. Any imports of this file should be replaced with 'main-ibm-font.css'. The new font CSS file ('main-ibm-font.css') will also exist at these locations. 

- JDE/CuramCDEJ/lib/curam/web/themes/curam/fonts/
- Webclient/components/CitizenContextViewer/Context/FlexWidgets/resources/fonts

| Search for             | Replace with      |
| ---------------------- | ----------------- |
| helvetica-neue-ibm.css | main-ibm-font.css |

### Step 2

The following sections detail the approach that should be taken to complete this upgrade. The steps involved in this approach are 'find & replace' tasks. You should consider compiling a list of affected CSS attributes and decide in advance whether the optional step 2b should be implemented before making these changes.

### Step 2a - Using the SPM defined font-faces

This section details how to update your CSS to use the new SPM font-faces directly. 

All components should be checked for references to the removed values and updated. The following table shows what searches should be made and the appropriate replacement.

| Search for           | Replace with          |
| -------------------- | --------------------- |
| HelvNeueLightforIBM  | MainRegularFontforIBM |
| HelvNeueRomanforIBM  | MainRegularFontforIBM |
| HelvNeueMediumforIBM | MainRegularFontforIBM |
| HelvNeueBoldforIBM   | MainBoldFontforIBM    |

### Step 2b - Using internal infrastructure properties

This section is an optional step that can be made to CSS attributes. These properties can be used instead of the literal SPM font-faces used above in step 2a.  Please note that this option cannot be used for CSS that is applied to IEG pages. For IEG pages use option 2a.

In implementing this option, you will make use of SPMs internal infrastructure properties to leverage the unmodifiable SPM value for your font family. The advantage of using these properties is that they will automatically inherit changes to the SPM font family value, should any changes be made to it in the future.

When using these properties, they should replace the entire font-family value rather than only replacing the SPM font-face as done in 2a.

For example, the following table shows the change needed for a medium weighted font. 

| Description | Pre v8.0 update | Post update |
| ----------- | --------------- | ----------- |
| Change from literal fonts in the font attribute to inheriting the font family from the internal infrastructure property | font: 15px HelvNeueMediumforIBM,Arial,sans-serif; | font: 15px $infrastructure_main-regular_font-family; |
| Change from literal fonts in the font-family attribute to inheriting the font family from the internal infrastructure property | font-family: HelvNeueMediumforIBM,Arial,sans-serif; | font-family: $infrastructure_main-regular_font-family;

See below a list of the available weights and properties that can be used in your (non-IEG) CSS.

| Font weight | Template Engine Property for font-family |
| ----------- | ---------------------------------------- |
| Regular     | infrastructure_main-regular_font-family  |
| Bold        | infrastructure_main-bold_font-family     |


The value for these properties is defined in SPM and should not be changed for any reason as this would remove any future benefit of getting updates to these properties in future SPM releases.

### Verification

On completion of the above upgrade steps there should be no instances of the pattern "HelvNeue*forIBM" in the CSS associated with the SPM application. In order to verify the changes have been made correctly, load the application pages that use the affected CSS and inspect the affected elements using the browser development tools.

The font or font-family attributes should now be using one of the new SPM font-faces. 

If you implemented option 2b, then the font or font-family attributes value should be using one of the complete *SPM Font Family* options shown in the table below. 

| Weight | Infrastructure Property | SPM Font Family |
| ------ | ----------------------- | --------------- |
| Regular | infrastructure_main-regular_font-family | MainRegularFontforIBM, 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Droid Sans', Helvetica, Arial, sans-serif |
| Bold | infrastructure_main-bold_font-family | MainBoldFontforIBM, 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Droid Sans', Helvetica, Arial, sans-serif |

These font family values are the SPM values for v8.0 and are subject to change in future releases. The release notes should be consulted for details of these changes.

Using the browsers development tools, verify that the computed font is one of the expected Main*FontforIBM fonts, where the weight matches that of the previously used font-face.
