# Split cell with multiple lines into columns

The following example shows how to split cell with multiple lines into columns by using the ["GetValue"](https://api.onlyoffice.com/docbuilder/spreadsheetapi/apirange/getvalue) and ["SetValue"](https://api.onlyoffice.com/docbuilder/spreadsheetapi/apirange/setvalue) methods of the ["ApiRange"](https://api.onlyoffice.com/docbuilder/spreadsheetapi/apirange) class.

## Executing from a browser (for plugins and macros)

1. Open the **Plugins** tab and click **Macros**.
2. Paste the next code in your script:

   ```javascript
    let ws = Api.GetActiveSheet();
    // cell with such data
    let cell = ws.GetRange("A1");
    // set value into the cell for example
    cell.SetValue('123\n456\n789');
    let value = cell.GetValue();
    let arr = value.split('\n');
    let column = cell.GetCol();
    let row = cell.GetRow();
    arr.forEach( (elem, index) => {
        let newColumn = column + index;
        let range = ws.GetCells(row, newColumn);
        range.SetValue(elem);
    });
   ```

   Or you can set array at once:
   
   ```javascript
    let ws = Api.GetActiveSheet();
    // cell with such data
    let cell = ws.GetRange('B2');
    // set value into the cell for example
    cell.SetValue('123\n456\n789');
    let value = cell.GetValue();
    let arr = value.split('\n');
    let columnStart = cell.GetCol();
    let row = cell.GetRow();
    let columnEnd = columnStart + arr.length - 1;
    let range = ws.GetRange(ws.GetCells(row, columnStart), ws.GetCells(row, columnEnd));
    range.SetValue(arr);
   ```


3. Press the **Run** button to run your script.
