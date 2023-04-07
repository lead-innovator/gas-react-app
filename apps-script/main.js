function doGet() {
    return HtmlService
        .createTemplateFromFile("index")
        .evaluate()
        .addMetaTag("viewport", "width=device-width, initial-scale=1.0, shrink-to-fit=no")
}

/*************************************************************
 Server function to append play timing to google sheet
 Parameters:
 ss_name: name of the spreadsheet
 sheet_name: name of the sheet in spreadsheet with ss_name
 cell_data: cell data to be appended
 **************************************************************/
function appendSpreadSheetData(ss_name, sheet_name, cell_data) {
    var files = DriveApp.getFilesByName(ss_name);
    var ss = files.hasNext() ? SpreadsheetApp.openById(files.next().getId()) : SpreadsheetApp.create(ss_name)
    var sheet = ss.getSheetByName(sheet_name)
    if (sheet == null) {
        sheet = ss.insertSheet(sheet_name)
    }
    sheet.appendRow([cell_data])
}

/*************************************************************
 Server function to query play timing from google sheet
 Parameters:
    ss_name: name of the spreadsheet
    sheet_name: name of the sheet in spreadsheet with ss_name
**************************************************************/
function querySpreadSheetData(ss_name, sheet_name) {
    var files = DriveApp.getFilesByName(ss_name);
    var ss = files.hasNext() ? SpreadsheetApp.openById(files.next().getId()) : null
    var sheet = ss != null ? ss.getSheetByName(sheet_name) : null
    if (sheet == null) {
        return ""
    } else {
        values = sheet.getDataRange().getValues()
        result = ""
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < values[i].length; j++) {
                if (values[i][j]) {
                    result = result + values[i][j] + ' '
                }
            }
            result = result + "\n"
        }
        return result;
    }
}
