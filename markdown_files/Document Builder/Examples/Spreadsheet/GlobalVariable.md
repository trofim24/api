# How to use GlobalVariable

The following example shows how to use [GlobalVariable](https://api.onlyoffice.com/docbuilder/howitworks/globalvariable). In this example we save [Address](https://api.onlyoffice.com/docbuilder/spreadsheetapi/apirange/getaddress) of [ApiRange](https://api.onlyoffice.com/docbuilder/spreadsheetapi/apirange) into GlobalVariable and get it back in other file.

## Executing from a Document Builder

1. Create file with ".docbuilder" extension.
2. Paste the next code in your file:

   ```javascript
   builder.CreateFile("xlsx");
   let oWorksheet = Api.GetSheet("Sheet1");
   let oRange = oWorksheet.GetUsedRange();
   // save address into the GlobalVariable
   GlobalVariable["RA"] = oRange.GetAddress();
   builder.SaveFile("xlsx", "sample1.xlsx");
   builder.CloseFile();

   builder.CreateFile("xlsx");
   // get address from the GlobalVariable
   let address = GlobalVariable["RA"];
   let oWorksheet = Api.GetSheet("Sheet1");
   let oRange = oWorksheet.GetRange("A1:D1");
   let arr = [1, 2, 3, 4];
   oRange.SetValue(arr);
   let oRestoredRange = Api.GetRange(address);
   oRestoredRange.Insert("down")
   builder.SaveFile("xlsx", "sample2.xlsx");
   builder.CloseFile();
   ```

3. **Run** your file in Document builder.
