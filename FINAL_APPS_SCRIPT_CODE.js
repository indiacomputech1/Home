// FINAL VERSION - Handles URL-encoded data (no CORS issues)
// Copy this ENTIRE code to Google Apps Script

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
    let data = {};
    
    // Parse incoming data - handle URL-encoded format
    if (e.postData && e.postData.contents) {
      const contents = e.postData.contents;
      
      // Try JSON first
      try {
        data = JSON.parse(contents);
      } catch (jsonError) {
        // Parse as URL-encoded string: "name=value&email=value&phone=value"
        if (contents && contents.length > 0) {
          const params = contents.split('&');
          for (let i = 0; i < params.length; i++) {
            if (params[i]) {
              const pair = params[i].split('=');
              if (pair.length >= 2) {
                const key = decodeURIComponent(pair[0].replace(/\+/g, ' '));
                const value = decodeURIComponent(pair.slice(1).join('=').replace(/\+/g, ' '));
                data[key] = value;
              }
            }
          }
        }
      }
    } else if (e.parameter) {
      // Fallback to parameter
      data = e.parameter;
    }
    
    // Check if we have data
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No data received',
        debug: {
          hasPostData: !!e.postData,
          hasContents: !!(e.postData && e.postData.contents),
          contents: e.postData ? e.postData.contents : 'none',
          hasParameter: !!e.parameter
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extract all fields safely
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const service = String(data.service || '').trim();
    const message = String(data.message || '').trim();
    
    // Prepare row
    const row = [
      new Date(),
      name,
      email,
      phone,
      service,
      message
    ];
    
    // Save to sheet
    sheet.appendRow(row);
    
    // Format phone column as text
    const lastRow = sheet.getLastRow();
    if (lastRow > 0) {
      sheet.getRange(lastRow, 4).setNumberFormat('@');
    }
    
    // Success!
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

