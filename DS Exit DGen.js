var lay, web, customDlg;

function OnStart() {
    lay = app.CreateLayout("Linear", "VCenter,FillXY");

    web = app.CreateWebView(1, 1, "Progress");
    web.SetOnProgress(web_OnProgress);
    lay.AddChild(web);

    app.AddLayout(lay);
    web.LoadUrl("https://google.com");

    // Intercept native hardware back key
    app.EnableBackKey(false);
    
    // Initialize Dialog Engine
    CreateExitDialog();
    
    app.ShowPopup("Press the back key to test");
}

function web_OnProgress(progress) {
    app.Debug("progress = " + progress);
}

function CreateExitDialog() {
    customDlg = app.CreateDialog("", "NoTitle,NoCancel");
    // Transparent window background eliminates rectangular outer borders
    customDlg.SetBackColor("#00000000"); 

    var cardDlg = app.CreateLayout("Card");
    cardDlg.SetCornerRadius(20);
    cardDlg.SetBackColor("#00000000");

    var layDlg = app.CreateLayout("Linear", "Vertical");
    layDlg.SetPadding(0.05, 0.04, 0.05, 0.035);
    layDlg.SetBackGradient("#19198f", "#2e2e7a", "#2e2e7a", "Top-Bottom");

    // FontAwesome icon rendered via DroidScript built-in "FontAwesome" option
    var txtTitle = app.CreateText("[fa-warning]  TERMINATE?", 0.75, -1, "FontAwesome,Left,Bold");
    txtTitle.SetTextColor("#319057");
    txtTitle.SetTextSize(22);
    txtTitle.SetMargins(0.02, 0, 0.02, 0.015);
    layDlg.AddChild(txtTitle);

    var txtMsg = app.CreateText("Connection will be severed. Do you want to close this instance?", 0.75, -1, "Left,MultiLine");
    txtMsg.SetTextColor("#ffffff"); 
    txtMsg.SetTextSize(14);
    txtMsg.SetMargins(0.02, 0, 0.02, 0.05);
    layDlg.AddChild(txtMsg);

    var layBtn = app.CreateLayout("Linear", "Horizontal,Right");
    layBtn.SetSize(0.75, -1); 
    
    // CANCEL Button
    var btnNo = app.CreateButton("ABORT", 0.24, 0.055, "Custom");
    btnNo.SetStyle("#2a2a3c", "#2a2a3c", 20, "#2a2a3c", 0, 0); 
    btnNo.SetTextColor("#89b4fa"); 
    btnNo.SetTextSize(12);
    btnNo.SetMargins(0, 0, 0.03, 0); 
    btnNo.SetOnTouch(btnNo_OnTouch);
    layBtn.AddChild(btnNo);

    // EXIT Button
    var btnYes = app.CreateButton("CONFIRM", 0.26, 0.055, "Custom");
    btnYes.SetStyle("#f38ba8", "#f38ba8", 20, "#f38ba8", 0, 0); 
    btnYes.SetTextColor("#11111b"); 
    btnYes.SetTextSize(12);
    btnYes.SetOnTouch(btnYes_OnTouch);
    layBtn.AddChild(btnYes);

    // Assemble Nesting: Linear -> Card -> CustomDialog
    layDlg.AddChild(layBtn);
    cardDlg.AddChild(layDlg);
    customDlg.AddLayout(cardDlg);
}

function OnBack() {
    if (web.CanGoBack()) {
        web.Back();
        return;
    }
    customDlg.Show();
}

function btnNo_OnTouch() {
    customDlg.Dismiss();
}

function btnYes_OnTouch() {
    customDlg.Dismiss();
    app.Exit();
}