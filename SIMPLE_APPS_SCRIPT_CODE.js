// SIMPLE VERSION - Copy this ENTIRE code to Google Apps Script

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Script is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Get sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse incoming data
    let data = {};
    
    // Check if we have postData with contents (JSON from script.js)
    if (e.postData && e.postData.contents) {
      try {
        // Try to parse as JSON
        data = JSON.parse(e.postData.contents);
      } catch (e) {
        // If not JSON, return error
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Failed to parse JSON: ' + e.toString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } else if (e.parameter) {
      // Fallback to parameter
      data = e.parameter;
    }
    
    // Check if we have data
    if (!data || !data.name) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No data received',
        received: {
          hasPostData: !!e.postData,
          hasContents: !!(e.postData && e.postData.contents),
          contents: e.postData ? e.postData.contents : 'none',
          hasParameter: !!e.parameter,
          parameter: e.parameter || 'none'
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extract all fields safely
    const row = [
      new Date(),
      data.name || '',
      data.email || '',
      String(data.phone || ''),
      data.service || '',
      data.message || ''
    ];
    
    // Save to sheet
    sheet.appendRow(row);
    
    // Format phone as text
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 4).setNumberFormat('@');
    
    // Success!
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Saved successfully',
      saved: {
        name: data.name,
        email: data.email,
        phone: data.phone
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

