/**
 * DroidScript Exit Dialog Studio Engine
 * Uses XMLHttpRequest for local file compatibility and verified DroidScript API bindings.
 */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // Icon / Graphic Controls
  const iconSource = document.getElementById("icon-source");
  const panelRemix = document.getElementById("panel-remixicon");
  const panelFA = document.getElementById("panel-fontawesome");
  const panelImage = document.getElementById("panel-image");

  const faSelect = document.getElementById("fa-select");
  const faCustomWrap = document.getElementById("fa-custom-wrap");
  const faCustomInput = document.getElementById("fa-custom-input");

  const remixSearch = document.getElementById("remix-search");
  const remixUnicodeVal = document.getElementById("remix-unicode-val");
  const remixDropdown = document.getElementById("remix-dropdown");

  const imgPath = document.getElementById("img-path");
  const imgSize = document.getElementById("img-size");
  const imgSizeVal = document.getElementById("img-size-val");

  // Title Controls
  const titleText = document.getElementById("title-text");
  const titleColor = document.getElementById("title-color");
  const titleColorVal = document.getElementById("title-color-val");
  const titleSize = document.getElementById("title-size");

  // Background Form Controls
  const bgMode = document.getElementById("bg-mode");
  const gradDirection = document.getElementById("grad-direction");
  const flowControlGroup = document.getElementById("flow-control-group");
  const colorPrimary = document.getElementById("color-primary");
  const colorPrimaryVal = document.getElementById("color-primary-val");
  const lblColorPrimary = document.getElementById("lbl-color-primary");
  const colorSecondary = document.getElementById("color-secondary");
  const colorSecondaryVal = document.getElementById("color-secondary-val");
  const secColorGroup = document.getElementById("sec-color-group");
  const cardRadius = document.getElementById("card-radius");
  const radiusVal = document.getElementById("radius-val");
  const cardWidth = document.getElementById("card-width");
  const widthVal = document.getElementById("width-val");

  // DroidScript Engine Options
  const exitType = document.getElementById("exit-type");
  const cancelBehavior = document.getElementById("cancel-behavior");
  const chkNoDim = document.getElementById("chk-nodim");
  const chkWebview = document.getElementById("chk-webview");
  const previewCanvas = document.getElementById("preview-canvas");

  // Message Form Controls
  const msgText = document.getElementById("msg-text");
  const msgColor = document.getElementById("msg-color");
  const msgColorVal = document.getElementById("msg-color-val");
  const msgSize = document.getElementById("msg-size");

  // Button Form Controls
  const btnAbortText = document.getElementById("btn-abort-text");
  const btnConfirmText = document.getElementById("btn-confirm-text");
  const btnAbortBg = document.getElementById("btn-abort-bg");
  const btnAbortBgVal = document.getElementById("btn-abort-bg-val");
  const btnConfirmBg = document.getElementById("btn-confirm-bg");
  const btnConfirmBgVal = document.getElementById("btn-confirm-bg-val");
  const btnAbortColor = document.getElementById("btn-abort-color");
  const btnAbortColorVal = document.getElementById("btn-abort-color-val");
  const btnConfirmColor = document.getElementById("btn-confirm-color");
  const btnConfirmColorVal = document.getElementById("btn-confirm-color-val");

  // Live Preview Elements
  const liveGraphicSlot = document.getElementById("live-graphic-slot");
  const liveTitleText = document.getElementById("live-title-text");
  const liveMsgText = document.getElementById("live-msg-text");
  const liveBtnAbort = document.getElementById("live-btn-abort");
  const liveBtnConfirm = document.getElementById("live-btn-confirm");

  // Output Elements
  const codeOutput = document.getElementById("code-output");
  const btnCopy = document.getElementById("btn-copy");
  const btnReset = document.getElementById("btn-reset");
  const copyStatus = document.getElementById("copy-status");

  // In-memory RemixIcon fallback dictionary
  let remixIconMap = {
    "ri-error-warning-line": "\\uEA4A",
    "error-warning-line": "\\uEA4A",
    "ri-shut-down-line": "\\uF153",
    "shut-down-line": "\\uF153",
    "ri-alert-line": "\\uEA21",
    "alert-line": "\\uEA21",
    "ri-logout-box-r-line": "\\uEEB3",
    "logout-box-r-line": "\\uEEB3",
    "ri-close-circle-line": "\\uEB7D",
    "close-circle-line": "\\uEB7D",
    "ri-question-line": "\\uF042",
    "question-line": "\\uF042",
    "ri-delete-bin-line": "\\uEC1E",
    "delete-bin-line": "\\uEC1E"
  };

  // Load external JSON via XMLHttpRequest (Works with http://, https://, and file:///)
  function loadIconDatabase() {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "assets/data/remixicon-unicode.json", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // Status 200 (HTTP OK) or Status 0 (Local file:// read success)
          if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
            try {
              const data = JSON.parse(xhr.responseText);
              remixIconMap = Object.assign({}, remixIconMap, data);
              updateGenerator();
            } catch (err) {
              // Retain in-memory fallback
            }
          }
        }
      };
      xhr.send(null);
    } catch (e) {
      // Retain in-memory fallback
    }
  }

  loadIconDatabase();

  // Color sync helper
  function bindColorPair(picker, textInput) {
    if (!picker || !textInput) return;
    picker.addEventListener("input", () => {
      textInput.value = picker.value;
      updateGenerator();
    });
    textInput.addEventListener("input", () => {
      if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
        picker.value = textInput.value;
      }
      updateGenerator();
    });
  }

  bindColorPair(colorPrimary, colorPrimaryVal);
  bindColorPair(colorSecondary, colorSecondaryVal);
  bindColorPair(titleColor, titleColorVal);
  bindColorPair(msgColor, msgColorVal);
  bindColorPair(btnAbortBg, btnAbortBgVal);
  bindColorPair(btnConfirmBg, btnConfirmBgVal);
  bindColorPair(btnAbortColor, btnAbortColorVal);
  bindColorPair(btnConfirmColor, btnConfirmColorVal);

  // Switch Graphic Header Mode
  iconSource.addEventListener("change", () => {
    const val = iconSource.value;
    panelFA.style.display = val === "fontawesome" ? "flex" : "none";
    panelRemix.style.display = val === "remixicon" ? "flex" : "none";
    panelImage.style.display = val === "image" ? "flex" : "none";
    updateGenerator();
  });

  // FontAwesome custom option toggle
  faSelect.addEventListener("change", () => {
    faCustomWrap.style.display = faSelect.value === "custom" ? "flex" : "none";
    updateGenerator();
  });

  // RemixIcon Live Search & Autocomplete
  remixSearch.addEventListener("input", () => {
    const query = remixSearch.value.trim().toLowerCase();
    const cleanQuery = query.startsWith("ri-") ? query.slice(3) : query;

    if (remixIconMap[query]) {
      remixUnicodeVal.value = remixIconMap[query];
    } else if (remixIconMap[cleanQuery]) {
      remixUnicodeVal.value = remixIconMap[cleanQuery];
    } else if (/^\\u[0-9a-f]{4}$/i.test(query)) {
      remixUnicodeVal.value = query.toUpperCase();
    }

    renderAutocomplete(query);
    updateGenerator();
  });

  function renderAutocomplete(query) {
    if (!query) {
      remixDropdown.style.display = "none";
      return;
    }

    const matches = Object.keys(remixIconMap)
      .filter((k) => k.startsWith("ri-") && k.includes(query))
      .slice(0, 8);

    if (matches.length === 0) {
      remixDropdown.style.display = "none";
      return;
    }

    remixDropdown.innerHTML = "";
    matches.forEach((name) => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.innerHTML = `<span><i class="${name} autocomplete-item-icon"></i> ${name}</span><code>${remixIconMap[name]}</code>`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        remixSearch.value = name.replace("ri-", "");
        remixUnicodeVal.value = remixIconMap[name];
        remixDropdown.style.display = "none";
        updateGenerator();
      });
      remixDropdown.appendChild(item);
    });

    remixDropdown.style.display = "block";
  }

  // Close autocomplete on click outside
  document.addEventListener("click", (e) => {
    if (!remixSearch.contains(e.target) && !remixDropdown.contains(e.target)) {
      remixDropdown.style.display = "none";
    }
  });

  // Switch Background Mode (Linear, Radial, Solid)
  bgMode.addEventListener("change", () => {
    const mode = bgMode.value;
    flowControlGroup.style.display = mode === "linear" ? "flex" : "none";
    secColorGroup.style.display = mode === "solid" ? "none" : "flex";
    lblColorPrimary.textContent =
      mode === "solid"
        ? "Solid Background Color"
        : mode === "radial"
          ? "Inner Center Color"
          : "Start Color";
    updateGenerator();
  });

  // Attach update listeners to standard inputs
  const allControls = [
    gradDirection,
    cardRadius,
    cardWidth,
    exitType,
    cancelBehavior,
    chkNoDim,
    chkWebview,
    titleText,
    titleSize,
    msgText,
    msgSize,
    btnAbortText,
    btnConfirmText,
    faCustomInput,
    imgPath,
    imgSize
  ];

  allControls.forEach((ctrl) => {
    if (ctrl) ctrl.addEventListener("input", updateGenerator);
  });

  function updateGenerator() {
    // 1. Synchronize text indicators
    if (radiusVal) radiusVal.textContent = cardRadius.value;
    if (widthVal) widthVal.textContent = cardWidth.value;
    if (imgSizeVal) imgSizeVal.textContent = imgSize.value;

    // 2. Map Preview CSS Background
    const mode = bgMode.value;
    let cssBackground = colorPrimary.value;

    if (mode === "linear") {
      const flow = gradDirection.value;
      let cssAngle = "to bottom";
      if (flow === "Bottom-Top") cssAngle = "to top";
      if (flow === "Left-Right") cssAngle = "to right";
      if (flow === "Right-Left") cssAngle = "to left";
      if (flow === "TL-BR") cssAngle = "135deg";
      if (flow === "TR-BL") cssAngle = "225deg";

      cssBackground = `linear-gradient(${cssAngle}, ${colorPrimary.value}, ${colorSecondary.value})`;
    } else if (mode === "radial") {
      cssBackground = `radial-gradient(circle at center, ${colorPrimary.value} 0%, ${colorSecondary.value} 100%)`;
    }

    // 3. Update CSS Variables (Preserves layout responsiveness)
    root.style.setProperty("--dlg-bg", cssBackground);
    root.style.setProperty("--dlg-radius", `${cardRadius.value}px`);
    root.style.setProperty("--dlg-title-color", titleColor.value);
    root.style.setProperty("--dlg-title-size", `${titleSize.value}px`);
    root.style.setProperty("--dlg-msg-color", msgColor.value);
    root.style.setProperty("--dlg-msg-size", `${msgSize.value}px`);
    root.style.setProperty("--dlg-abort-bg", btnAbortBg.value);
    root.style.setProperty("--dlg-abort-color", btnAbortColor.value);
    root.style.setProperty("--dlg-confirm-bg", btnConfirmBg.value);
    root.style.setProperty("--dlg-confirm-color", btnConfirmColor.value);

    // NoDim backdrop simulation
    if (previewCanvas) {
      previewCanvas.style.background = chkNoDim.checked
        ? "transparent"
        : "radial-gradient(circle at center, rgba(30, 35, 56, 0.9) 0%, rgba(10, 12, 18, 0.95) 100%)";
    }

    // 4. Update Graphic Slot in Live Preview
    const currentSource = iconSource.value;
    if (currentSource === "fontawesome") {
      let faTag =
        faSelect.value === "custom"
          ? faCustomInput.value.trim()
          : faSelect.value;
      if (!faTag.startsWith("fa-")) faTag = `fa-${faTag}`;
      // Map legacy aliases for web preview
      if (faTag === "fa-warning") faTag = "fa-triangle-exclamation";
      if (faTag === "fa-sign-out") faTag = "fa-right-from-bracket";
      liveGraphicSlot.innerHTML = `<i class="fa-solid ${faTag} icon-slot"></i>`;
    } else if (currentSource === "remixicon") {
      let iconClass = remixSearch.value.trim().toLowerCase();
      if (!iconClass.startsWith("ri-")) iconClass = `ri-${iconClass}`;
      liveGraphicSlot.innerHTML = `<i class="${iconClass} icon-slot"></i>`;
    } else if (currentSource === "image") {
      liveGraphicSlot.innerHTML = `<div class="preview-app-icon"><i class="ri-image-line"></i></div>`;
    } else {
      liveGraphicSlot.innerHTML = "";
    }

    // 5. Update preview texts
    if (liveTitleText) liveTitleText.textContent = titleText.value;
    if (liveMsgText) liveMsgText.textContent = msgText.value;
    if (liveBtnAbort) liveBtnAbort.textContent = btnAbortText.value;
    if (liveBtnConfirm) liveBtnConfirm.textContent = btnConfirmText.value;

    // 6. Build DroidScript code output
    buildDroidScriptOutput();
  }

  function buildDroidScriptOutput() {
    if (!codeOutput) return;

    const isWebview = chkWebview.checked;
    const mode = bgMode.value;
    const currentSource = iconSource.value;
    const cleanTitle = titleText.value.replace(/"/g, '\\"');
    const cleanMsg = msgText.value.replace(/"/g, '\\"');

    // Dialog Options
    const optionsArray = ["NoTitle"];
    if (cancelBehavior.value === "NoCancel") optionsArray.push("NoCancel");
    if (cancelBehavior.value === "AutoCancel") optionsArray.push("AutoCancel");
    if (chkNoDim.checked) optionsArray.push("NoDim");
    const optionsString = optionsArray.join(",");

    // Background snippet
    let cardInitSnippet = "";
    let layInitSnippet = "";

    if (mode === "solid") {
      cardInitSnippet = `    var cardDlg = app.CreateLayout("Card");\n    cardDlg.SetCornerRadius(${cardRadius.value});\n    cardDlg.SetBackColor("${colorPrimary.value}");`;
      layInitSnippet = `    var layDlg = app.CreateLayout("Linear", "Vertical");\n    layDlg.SetPadding(0.05, 0.04, 0.05, 0.035);`;
    } else if (mode === "radial") {
      cardInitSnippet = `    var cardDlg = app.CreateLayout("Card");\n    cardDlg.SetCornerRadius(${cardRadius.value});\n    cardDlg.SetBackColor("#00000000");`;
      layInitSnippet = `    var layDlg = app.CreateLayout("Linear", "Vertical");\n    layDlg.SetPadding(0.05, 0.04, 0.05, 0.035);\n    layDlg.SetBackGradientRadial(0.5, 0.5, 0.8, "${colorPrimary.value}", "${colorSecondary.value}", "${colorSecondary.value}");`;
    } else {
      cardInitSnippet = `    var cardDlg = app.CreateLayout("Card");\n    cardDlg.SetCornerRadius(${cardRadius.value});\n    cardDlg.SetBackColor("#00000000");`;
      layInitSnippet = `    var layDlg = app.CreateLayout("Linear", "Vertical");\n    layDlg.SetPadding(0.05, 0.04, 0.05, 0.035);\n    layDlg.SetBackGradient("${colorPrimary.value}", "${colorSecondary.value}", "${colorSecondary.value}", "${gradDirection.value}");`;
    }

    // Header Graphic & Title Construction
    let headerCodeSnippet = "";
    if (currentSource === "fontawesome") {
      let faTag =
        faSelect.value === "custom"
          ? faCustomInput.value.trim()
          : faSelect.value;
      if (!faTag.startsWith("fa-")) faTag = `fa-${faTag}`;

      headerCodeSnippet = `    // FontAwesome icon rendered via DroidScript built-in "FontAwesome" option
    var txtTitle = app.CreateText("[${faTag}]  ${cleanTitle}", ${cardWidth.value}, -1, "FontAwesome,Left,Bold");
    txtTitle.SetTextColor("${titleColor.value}");
    txtTitle.SetTextSize(${titleSize.value});
    txtTitle.SetMargins(0.02, 0, 0.02, 0.015);
    layDlg.AddChild(txtTitle);`;
    } else if (currentSource === "remixicon") {
      const cleanUnicode = remixUnicodeVal.value.replace(/"/g, '\\"');
      headerCodeSnippet = `    var txtTitle = app.CreateText("${cleanUnicode}  ${cleanTitle}", ${cardWidth.value}, -1, "Left,Bold");
    txtTitle.SetFontFile("assets/fonts/remixicon.ttf");
    txtTitle.SetTextColor("${titleColor.value}");
    txtTitle.SetTextSize(${titleSize.value});
    txtTitle.SetMargins(0.02, 0, 0.02, 0.015);
    layDlg.AddChild(txtTitle);`;
    } else if (currentSource === "image") {
      const cleanImgPath = imgPath.value.replace(/"/g, '\\"');
      headerCodeSnippet = `    // Header Layout for App Icon Image + Title
    var layHeader = app.CreateLayout("Linear", "Horizontal,VCenter");
    layHeader.SetSize(${cardWidth.value}, -1);
    layHeader.SetMargins(0.02, 0, 0.02, 0.015);

    var imgIcon = app.CreateImage("${cleanImgPath}", ${imgSize.value}, -1);
    imgIcon.SetMargins(0, 0, 0.03, 0);
    layHeader.AddChild(imgIcon);

    var txtTitle = app.CreateText("${cleanTitle}", -1, -1, "Left,Bold");
    txtTitle.SetTextColor("${titleColor.value}");
    txtTitle.SetTextSize(${titleSize.value});
    layHeader.AddChild(txtTitle);
    layDlg.AddChild(layHeader);`;
    } else {
      // Text Only
      headerCodeSnippet = `    var txtTitle = app.CreateText("${cleanTitle}", ${cardWidth.value}, -1, "Left,Bold");
    txtTitle.SetTextColor("${titleColor.value}");
    txtTitle.SetTextSize(${titleSize.value});
    txtTitle.SetMargins(0.02, 0, 0.02, 0.015);
    layDlg.AddChild(txtTitle);`;
    }

    const exitSnippet =
      exitType.value === "kill" ? "app.Exit(true);" : "app.Exit();";

    const dscriptCode = `var lay, web, customDlg;

function OnStart() {
    lay = app.CreateLayout("Linear", "VCenter,FillXY");

    ${
      isWebview
        ? `web = app.CreateWebView(1, 1, "Progress");
    web.SetOnProgress(web_OnProgress);
    lay.AddChild(web);

    app.AddLayout(lay);
    web.LoadUrl("https://google.com");`
        : `// Main Application Layout
    var txtMain = app.CreateText("Application Running", -1, -1, "Bold");
    txtMain.SetTextSize(20);
    lay.AddChild(txtMain);
    app.AddLayout(lay);`
    }

    // Intercept native hardware back key
    app.EnableBackKey(false);
    
    // Initialize Dialog Engine
    CreateExitDialog();
    
    app.ShowPopup("Press the back key to test");
}

${
  isWebview
    ? `function web_OnProgress(progress) {
    app.Debug("progress = " + progress);
}\n`
    : ""
}
function CreateExitDialog() {
    customDlg = app.CreateDialog("", "${optionsString}");
    // Transparent window background eliminates rectangular outer borders
    customDlg.SetBackColor("#00000000"); 

${cardInitSnippet}

${layInitSnippet}

${headerCodeSnippet}

    var txtMsg = app.CreateText("${cleanMsg}", ${cardWidth.value}, -1, "Left,MultiLine");
    txtMsg.SetTextColor("${msgColor.value}"); 
    txtMsg.SetTextSize(${msgSize.value});
    txtMsg.SetMargins(0.02, 0, 0.02, 0.05);
    layDlg.AddChild(txtMsg);

    var layBtn = app.CreateLayout("Linear", "Horizontal,Right");
    layBtn.SetSize(${cardWidth.value}, -1); 
    
    // CANCEL Button
    var btnNo = app.CreateButton("${btnAbortText.value}", 0.24, 0.055, "Custom");
    btnNo.SetStyle("${btnAbortBg.value}", "${btnAbortBg.value}", ${cardRadius.value}, "${btnAbortBg.value}", 0, 0); 
    btnNo.SetTextColor("${btnAbortColor.value}"); 
    btnNo.SetTextSize(12);
    btnNo.SetMargins(0, 0, 0.03, 0); 
    btnNo.SetOnTouch(btnNo_OnTouch);
    layBtn.AddChild(btnNo);

    // EXIT Button
    var btnYes = app.CreateButton("${btnConfirmText.value}", 0.26, 0.055, "Custom");
    btnYes.SetStyle("${btnConfirmBg.value}", "${btnConfirmBg.value}", ${cardRadius.value}, "${btnConfirmBg.value}", 0, 0); 
    btnYes.SetTextColor("${btnConfirmColor.value}"); 
    btnYes.SetTextSize(12);
    btnYes.SetOnTouch(btnYes_OnTouch);
    layBtn.AddChild(btnYes);

    // Assemble Nesting: Linear -> Card -> CustomDialog
    layDlg.AddChild(layBtn);
    cardDlg.AddChild(layDlg);
    customDlg.AddLayout(cardDlg);
}

function OnBack() {
    ${
      isWebview
        ? `if (web.CanGoBack()) {
        web.Back();
        return;
    }`
        : `// Handle navigation stack if needed`
    }
    customDlg.Show();
}

function btnNo_OnTouch() {
    customDlg.Dismiss();
}

function btnYes_OnTouch() {
    customDlg.Dismiss();
    ${exitSnippet}
}`;

    codeOutput.textContent = dscriptCode;
  }

  // Copy to Clipboard Action
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      navigator.clipboard.writeText(codeOutput.textContent).then(() => {
        if (copyStatus) {
          copyStatus.textContent = "Copied to clipboard!";
          setTimeout(() => {
            copyStatus.textContent = "";
          }, 2500);
        }
      });
    });
  }

  // Reset Page
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      window.location.reload();
    });
  }

  // Initial Boot
  updateGenerator();
});