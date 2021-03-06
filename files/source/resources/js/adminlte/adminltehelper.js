var AdminLTEHelper = {
    "__externalFiles": [],
    "__externalFilesCompletedCallback": null,
    "initializeApplication": function () {
        $("#buttonWidgetConfig").off("click").on("click", function () {
            $("#modal-WidgetList").modal();
        });
    },
    "initializeSideMenu": function () {
        $(".main-sidebar .active").removeClass("active");

        var mainFolder = document.body.getAttribute("data-main-folder");
        var strPageURL = window.Router.currentRoute.path;

        strPageURL = strPageURL.replace(("/" + mainFolder), "");

        if ((strPageURL.length > 0)
                && (strPageURL[0] == '/')) {
            strPageURL = strPageURL.substr(1);
        }

        if ("" == strPageURL) {
            return;
        }

        if (("login" == strPageURL)
                || ("forgotpassword" == strPageURL)
                || "profile" == strPageURL) {
            return;
        }

        var PageURL = document.getElementById("pageurl" + strPageURL);
        if (PageURL == undefined) {
            return;
        }

        if ($(PageURL).hasClass("child_menu")) {
            var strParentPageURL = PageURL.getAttribute("data-parent-url");
            if (null === document.getElementById("parentpageurl" + strParentPageURL)) {
                window.location.href = URLPrefix + "home";
            }

            if ("" != strParentPageURL) {
                $(".parentPageLI").removeClass("menu-open").addClass("menu-close");
                $("#parentpageurl" + strParentPageURL).addClass("active");
                $("#parentpageurl" + strParentPageURL).parent().removeClass("menu-close").addClass("menu-open");
            }
        }   

        $(PageURL).addClass("active");
    },
    "initializeFormElements": function () {

    },
    "loadCSS": function (url) {
        if(document.createStyleSheet) {
            document.createStyleSheet(url);
        } else {
            var c=document.createElement("link");
            c.href = url;
            c.rel = "stylesheet";
            c.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(c);
        }
    },
    "loadJS": function (url, callback) {
        $.getScript(url, function() {
            if (callback) {
                callback(url);
            }
        });
    },
    "getMainFolder": function () {
        if (document.body.getAttribute("data-main-folder")) {
            return document.body.getAttribute("data-main-folder");
        } else {
            return "";
        }
    },
    "getURL": function (url) {
        return ("/" + AdminLTEHelper.getMainFolder() + "/" + url);
    },
    "getAPIURL": function (url) {
        return ("/" + AdminLTEHelper.getMainFolder() + "/api/" + url);
    },
    "getCSRFToken": function () {
        return $('meta[name="csrf-token"]').attr('content');
    },
    "doVueApplicationMounted": function () {
        AdminLTEHelper.initializeSideMenu();
        AdminLTEHelper.initializeFormElements();
    },
    "doVueApplicationUpdate": function () {
        AdminLTEHelper.initializeSideMenu();
        AdminLTEHelper.initializeFormElements();
    },
    "doVueMenuApplicationMounted": function () {

    },
    "doVueMenuApplicationUpdate": function () {

    },
    "loadExternalFiles": function (files, completedCallback) {
        var fileCount = files.length;
        AdminLTEHelper.__externalFiles = files.slice();
        AdminLTEHelper.__externalFilesCompletedCallback = completedCallback;
        var file = "";
        var extension = "";

        for (var i = 0; i < fileCount; i++) {
            file = files[i];
            extension = file.split('.').pop();
            extension = extension.toLowerCase();

            if ("css" == extension) {
                AdminLTEHelper.loadCSS(file);
                AdminLTEHelper.doExternalFileLoad(file);
            } else {
                AdminLTEHelper.loadJS(file,
                        AdminLTEHelper.doExternalFileLoad);
            }
        }
    },
    "decodeHTMLEntities": function (text) {
        var element = document.createElement('div');

        if(text && typeof text === 'string') {
            // strip script/html tags
            text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, "");
            text = text.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, "");
            element.innerHTML = text;
            text = element.textContent;
            element.textContent = "";
        }

        return text;
    },
    "encodeHTMLEntities": function (text) {
        text = String(text);

        var map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return text.replace(/[&<>"']/g, function(m) {
            return map[m];
        });
    },
    "doExternalFileLoad": function (file) {
        var fileIndex = AdminLTEHelper.__externalFiles.indexOf(file);
        if (fileIndex > -1) {
            AdminLTEHelper.__externalFiles.splice(
                    fileIndex,
                    1);
        }

        if (0 == AdminLTEHelper.__externalFiles.length) {
            if (AdminLTEHelper.__externalFilesCompletedCallback) {
                AdminLTEHelper.__externalFilesCompletedCallback();
            }
        }
    },
    "initializeMediaJS": function() {
        AdminLTEHelper.initializeDropzone();
        
        $(".buttonBrowseFile").off("click").on("click", function () {
            AdminLTEHelper.doBrowseButtonClick(this);
        });
    
        $("#modelEditPage_fileTemplate").on("htmldbrender", function (event) {
            AdminLTEHelper.doFileTemplateRender(this, event);
        });
    
        $("#modelEditPage_imageTemplate").on("htmldbrender", function (event) {
            AdminLTEHelper.doFileTemplateRender(this, event);
        });
    },    
    "initializeDropzone": function() {
        if (!document.getElementById("dropzone-data")) {
            return;
        }
        
        var origin = window.location.origin;
        var mainFolder = AdminLTEHelper.getMainFolder();
        var uploadURL = document.getElementById("dropzone-data").getAttribute("upload-url");
        uploadURL = (origin + "/" + mainFolder + uploadURL + "?_token=" + AdminLTEHelper.getCSRFToken());
        
        var dropzoneElements = $("div.divDropzone");
        var dropzoneElement = null;
        var dropzoneElementCount = dropzoneElements.length;
        var dropzoneObject = null;
    
        for (var i = 0; i < dropzoneElementCount; i++) {
            dropzoneElement = dropzoneElements[i];
            dropzoneObject = new Dropzone(dropzoneElement, {
                "url": uploadURL,
                "complete": function (fileObject) {
                    var responseObject = JSON.parse(String(fileObject.xhr.responseText).trim());
                    if (responseObject.errorCount > 0) {      
                        AdminLTEHelper.showErrorDialog(responseObject.lastError);
                    } else {
                        AdminLTEHelper.selectUploadedFiles(responseObject.lastMessage);
                    }
                }
            });
    
            dropzoneObject.on("sending", function(file, xhr, formData) {
                formData.append("target", document.getElementById("dropzone-data").getAttribute("data-target-field"));
                formData.append("media_type", document.getElementById("dropzone-data").getAttribute("data-media-type"));
            });
        }
    },    
     "doFileTemplateRender": function(sender, event) {
        var targets = event.detail.targets;
        var target = null;
        var targetCount = targets.length;
    
        if (0 == targetCount) {
            return;
        }
    
        for (var i = 0; i < targetCount; i++) {
            target = document.getElementById(targets[i]);
    
            if (!target) {
                return;
            }
    
            if (target.children.length > 0) {
                $(".aDeleteFileListItem", target).off("click").on("click", function () {
                    AdminLTEHelper.doDeleteFileListItemLinkClick(this);
                });
    
                $(target).sortable({
                        items: "li",
                        handle: ".grippy",
                        update: function (event, ui) {
                            AdminLTEHelper.updateFileListInput(this);
                        }
                });
                
                $(target).disableSelection();
    
                target.style.display = "block";
            }
        }
    },
    "selectUploadedFiles": function (file_data) {
        var fileData = file_data.split("#");
        var fileId = fileData[0];
        var fileName = fileData[1];
        var filePath = fileData[2];
        
        var mediaType = 1;
        var imageFileExtensions = ["jpg", "jpeg", "png", "gif"];
        var fileExtension = String(fileName.split('.').pop()).toLowerCase();
        if (imageFileExtensions.indexOf(fileExtension) != -1) {
            mediaType = 2;
        } else {
            mediaType = 1;
        }
    
        var targetFileListId = document.getElementById("dropzone-data").getAttribute("data-target-file-list");
        var targetFileList = document.getElementById(targetFileListId);
        var inputElement = document.getElementById(targetFileList.getAttribute("data-target-input-id"));
        var mediaType = inputElement.getAttribute("data-media-type");
        var maxFileCount = inputElement.getAttribute("data-max-file-count");
        var currentValue = inputElement.value;
        var currentFileCount = 0;
        if ("" != currentValue) {
            var temp = currentValue.split(",");
            currentFileCount = temp.length;
        }
    
        if ((maxFileCount > 0) && (maxFileCount == currentFileCount)) {
            return false;
        }
    
        var innerElement = document.createElement('li');
        innerElement.id ="liFileListItem" + fileId;
        innerElement.className ="collection-item liMediaType" + mediaType;
        innerElement.setAttribute('data-object-id', fileId);
        innerElement.setAttribute('data-file-name', fileName);
        innerElement.setAttribute('data-file-path', filePath);
        innerElement.setAttribute('data-media-type', mediaType);
    
        var templateHTML = document.getElementById("ulFileListTemplate").innerHTML;
        templateHTML = templateHTML.replace(/__ID__/g, fileId);
        templateHTML = templateHTML.replace(/__MEDIA_TYPE__/g, mediaType);
        templateHTML = templateHTML.replace(/__FILE_NAME__/g, fileName);
        innerElement.innerHTML = templateHTML;
    
        targetFileList.appendChild(innerElement);
    
        AdminLTEHelper.updateFileListUL(targetFileList);
        AdminLTEHelper.updateFileListInput(targetFileList);
    },
    "updateFileListUL": function (targetFileList) {
        var imageFileExtensions = ["jpg", "jpeg", "png", "gif"];
        var elementLIList = $(">li", targetFileList);
        var elementLIListCount = elementLIList.length;
        var elementLI = null;
        var fileName = "";
        var filePath = "";
        var fileExtension = "";
        var imageFile = false;
        var src = "";
    
        $(".aDeleteFileListItem", targetFileList).off("click").on("click", function () {
            AdminLTEHelper.doDeleteFileListItemLinkClick(this);
        });
    
        for (var i = 0; i < elementLIListCount; i++) {
            elementLI = elementLIList[i];
            fileName = elementLI.getAttribute("data-file-name");
            filePath = elementLI.getAttribute("data-file-path");
            fileExtension = String(fileName.split('.').pop()).toLowerCase();
            
            if (imageFileExtensions.indexOf(fileExtension) != -1) {
                src = (__storageURL + filePath);
            } else {
                src = AdminLTEHelper.getDefaultImageSRC(fileExtension);
            }
    
            $(".imgFileListItemFileURL", elementLI).attr("src", src);
            $(".aFileListItemFileURL", elementLI).attr("href", (__storageURL + filePath));
        }
    
        if (elementLIListCount > 0) {
            targetFileList.style.display = "block";
            $(targetFileList).sortable({
                    items: "li",
                    handle: ".grippy",
                    update: function (event, ui) {
                        AdminLTEHelper.updateFileListInput(this);
                    }
            });
            
            $(targetFileList).disableSelection();
        } else {
            targetFileList.style.display = "none";
        }
    },
    "getDefaultImageSRC": function (extension) {
        return  (__publicAssetsURL + "img/adminlte/" + extension + ".png");
    },    
    "doDeleteFileListItemLinkClick": function(element) {
        if (!element) {
            return;
        }
    
        var elementUL = element.parentNode.parentNode;
    
        $(element.parentNode).detach();
    
        if (0 == $(">li", elementUL).length) {
            elementUL.style.display = "none";
        }
    
        AdminLTEHelper.updateFileListInput(elementUL);
    },
    "updateFileListInputs": function() {
    
        var fileLists = $("#formObject .ulFileList");
        var fileListCount = fileLists.length;
    
        for (var i = 0; i < fileListCount; i++) {
            AdminLTEHelper.updateFileListInput(fileLists[i].getAttribute("id"));
        }
    
    },
    "updateFileListInput": function(targetFileList) {
        var targetFileListInputId = targetFileList.getAttribute("data-target-input-id");
        var targetFileListInput = document.getElementById(targetFileListInputId);
    
        targetFileListInput.value = "";
    
        var targetFileListItems = $(">li", targetFileList);
        var targetFileListItemCount = targetFileListItems.length;
        var targetFileListItem = null;
        var fileListInputValue = "";
    
        for (var i = 0; i < targetFileListItemCount; i++) {
            targetFileListItem = targetFileListItems[i];
    
            if (fileListInputValue != "") {
                fileListInputValue += ",";
            }
    
            fileListInputValue += targetFileListItem.getAttribute("data-object-id");
        }
    
        targetFileListInput.value = fileListInputValue;
        targetFileListInput.dispatchEvent(new Event('input'));
    },
    "doBrowseButtonClick": function(sender) {
        if (!sender) {
            return;
        }
        
        var targetFileListElementId = sender.getAttribute("data-target-file-list");
        var targetFileListElement = document.getElementById(targetFileListElementId);
    
        var targetInputElementId = targetFileListElement.getAttribute("data-target-input-id");
        var targetInputElement = document.getElementById(targetInputElementId)
        var targetField = targetInputElement.getAttribute("data-target-field");
        var mediaType = targetInputElement.getAttribute("data-media-type");
    
        document.getElementById("dropzone-data").setAttribute("data-target-file-list", targetFileListElement.id);
        document.getElementById("dropzone-data").setAttribute("data-target-field", targetField);
        document.getElementById("dropzone-data").setAttribute("data-media-type", mediaType);
    
        $("#divDropzone").trigger("click");
    },
    "initializePageFiles": function (files) {
        if (undefined === files || 0 == files.length) {
            return;
        }

        files.forEach(file => {
            AdminLTEHelper.initializeFile(file);
        });
    },
    "initializeFile": function (file) {
        var property = file["object_property"];
        var fileId = file["id"];
        var fileName = file["file_name"];
        var filePath = file["path"];
        var mediaType = file["media_type"];
    
        var targetFileList = document.getElementById("ul" + property + "FileList");
    
        var innerElement = document.createElement('li');
        innerElement.id ="liFileListItem" + fileId;
        innerElement.className ="collection-item liMediaType" + mediaType;
        innerElement.setAttribute('data-object-id', fileId);
        innerElement.setAttribute('data-file-name', fileName);
        innerElement.setAttribute('data-file-path', filePath);
        innerElement.setAttribute('data-media-type', mediaType);
    
        var templateHTML = document.getElementById("ulFileListTemplate").innerHTML;
        templateHTML = templateHTML.replace(/__ID__/g, fileId);
        templateHTML = templateHTML.replace(/__MEDIA_TYPE__/g, mediaType);
        templateHTML = templateHTML.replace(/__FILE_NAME__/g, fileName);
        innerElement.innerHTML = templateHTML;
    
        targetFileList.appendChild(innerElement);
    
        AdminLTEHelper.updateFileListUL(targetFileList);
    },
    "humanFileSize": function(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    },
    "generateGUID": function(strPrefix) {
        var dtNow = new Date();
        var strToken0 = String(dtNow.getUTCFullYear())
        + String((dtNow.getUTCMonth() + 1))
        + String(dtNow.getUTCDate())
        + String(dtNow.getHours())
        + String(dtNow.getMinutes())
        + String(dtNow.getSeconds());
        var strToken1 = 'xxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
        var strToken2 = 'xxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});  
        return strPrefix + strToken0 + strToken1 + strToken2;
    },
    "updateLocationPicker": function(sender) {
        var senderId = sender.id;
        var currentLatitude = 41.015;
        var currentLongitude = 28.979;
        var mapElement = document.getElementById(senderId + "-MapObject");

        if (sender.value != "") {
            coordinates = String(sender.value).split(",");
            if (2 == coordinates.length) {
                currentLatitude = parseFloat(coordinates[0]);
                currentLongitude = parseFloat(coordinates[1]);
            }
        }

        var tmRefreshTimer = $(mapElement).data("tmRefreshTimer");
        clearTimeout(tmRefreshTimer);
        tmRefreshTimer = setTimeout(function () {
            google.maps.event.trigger(mapElement, "resize");

            document.getElementById(senderId + "-Latitude").value = currentLatitude;
            document.getElementById(senderId + "-Longitude").value = currentLongitude;

            $(mapElement).locationpicker({
                location: {
                    latitude: currentLatitude,
                    longitude: currentLongitude
                },
                locationName: "",
                radius: 500,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [],
                mapOptions: {},
                scrollwheel: true,
                inputBinding: {
                    latitudeInput: $(document.getElementById(senderId+ "-Latitude")),
                    longitudeInput: $(document.getElementById(senderId+ "-Longitude")),
                    radiusInput: null,
                    locationNameInput: $(document.getElementById(senderId+ "-Address"))
                },
                enableAutocomplete: true,
                enableAutocompleteBlur: false,
                autocompleteOptions: null,
                addressFormat: 'postal_code',
                enableReverseGeocode: true,
                draggable: true,
                onchanged: function (currentLocation, radius, isMarkerDropped) {
                    sender.value = currentLocation.latitude + "," + currentLocation.longitude;
                    sender.dispatchEvent(new Event('input'));
                },
                onlocationnotfound: function(locationName) {},
                oninitialized: function (component) {},
                // must be undefined to use the default gMaps marker
                markerIcon: undefined,
                markerDraggable: true,
                markerVisible : true
            });
        }, 100);

        $(mapElement).data("tmRefreshTimer", tmRefreshTimer);
    },
    "showGoogleMap": function(sender, lat, lng) {
        var place = {lat: lat, lng: lng};
        
        // The map, centered at Uluru
        var map = new google.maps.Map(sender, {zoom: 16, center: place});

        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: place, map: map});
    },
    "initializeTextEditor": function() {
        $(".textarea.vue-editor").summernote({
            "font-styles": false,
            "height": 150,
            codemirror: {
                theme: "monokai"
            },
            callbacks: {
                onBlur: function() {
                    this.dispatchEvent(new Event('input'));
                }
            }
        });
        
        // editor içeriği yenilenmiyorsa aşağıdaki denenebilir
        /*$(sender).summernote({
            "font-styles": false,
            "height": 150,
            codemirror: {
                theme: "monokai"
            }
        });

        $(sender).summernote("code", event.detail.value);*/
    },
    "updateSwitch": function(sender) {
        $(sender).bootstrapSwitch("state", sender.checked);
        $(".fake-switch-container").hide();

        $(sender).on('switchChange.bootstrapSwitch', function (event, state) {
            sender.dispatchEvent(new Event('change'));
        });
    },
    "initializeShowPhoto": function() {
        $(".showBigPhoto").off("click").on("click", function() {
            AdminLTEHelper.doShowBigPhotoClick(this);
        });
    },
    "doShowBigPhotoClick": function(sender) {   
        if (!sender) {  
            return; 
        }   
        document.getElementById("popup-photo").src = sender.src;    
        $("#galleryModal").modal();
    },
    "activateSearchLoader": function(search_input) {
        var labelContainer = $(".labelSearchBar", search_input.parentNode)[0];
        $("button > i", labelContainer).css("display", "none");
        $("button > img", labelContainer).css("display", "block");
    },
    "deactivateSearchLoader": function(search_input) {
        var labelContainer = $(".labelSearchBar", search_input.parentNode)[0];
        $("button > img", labelContainer).css("display", "none");
        $("button > i", labelContainer).css("display", "inline-block");
    },
    "cleanSortButtons": function(container) {
        $(".button-table-sort", container).removeClass("sorted");
        $(".button-table-sort > .sorting.active", container).removeClass("active");
        $(".button-table-sort > .sorting.default", container).addClass("active");
    },
    "activateSortLoader": function(buttonId) {
        var button = document.getElementById(buttonId);
        var sortButtonsContainer = button.parentNode.parentNode;
        AdminLTEHelper.cleanSortButtons(sortButtonsContainer);
        
        var query = "#" + buttonId;
        $(query).addClass("sorted");

        query = query + " > .sorting";
        $(query).removeClass("active");
        query = query + ".loading";
        $(query).addClass("active");
    },
    "deactivateSortLoader": function(buttonId, direction) {
        var query = "#" + buttonId + " > .sorting";
        $(query).removeClass("active");

        query = query + "." + direction;
        $(query).addClass("active");
    },
    "setDefaultSortButton": function(buttonId) {
        var query = "#" + buttonId;
        $(query).addClass("sorted");

        query = query + " > .sorting";
        $(query).removeClass("active");

        query = query + ".desc";
        $(query).addClass("active");
    },
    "getURLQuery": function(sender) {
        var query = "";

        if ("" != sender["search_text"]) {
            query = query + (("" == query) ? "?" : "&");
            query = query + 's=' + sender["search_text"];
        }
        
        if ("" != sender["current_page"]) {
            query = query + (("" == query) ? "?" : "&");
            query = query + 'p=' + sender["current_page"];
        }

        if ("" != sender["sort_variable"]) {
            query = query + (("" == query) ? "?" : "&");
            query = query + 'v=' + sender["sort_variable"];
        }

        if ("" != sender["sort_direction"]) {
            query = query + (("" == query) ? "?" : "&");
            query = query + 'd=' + sender["sort_direction"];
        }

        return query;
    },

    "doCheckAllCheckboxClick": function(sender) {
        if (!sender) {
            return;
        }
        
        var model = sender.getAttribute("data-model");
        var tbodyElement = document.getElementById("tbody" + model + "RecordList");

        $(".select_row", tbodyElement).prop("checked", sender.checked);

        AdminLTEHelper.updateCheckboxStates(sender, model);
    },
    "doCheckboxClick": function(sender) {
        if (!sender) {
            return;
        }
        
        var model = sender.getAttribute("data-model");
        var checkAllElement = document.getElementById("select_" + model + "_rows");
        AdminLTEHelper.updateCheckboxStates(checkAllElement, model);
    },
    "updateCheckboxStates": function(checkAllElement, model) {
        var tbodyElement = document.getElementById("tbody" + model + "RecordList");
        var buttonNew = document.getElementById("buttonNew" + model);
        var buttonDelete = document.getElementById("buttonDelete" + model);

        var checkboxCount = $(".select_row", tbodyElement).length;
        var selectedCount = $(".select_row:checked", tbodyElement).length;
        
        if (0 == selectedCount) {
            $(checkAllElement).prop("checked", false);
            
            $(buttonDelete).hide();
            $(buttonNew).show();
        } else {
            $(".selected-count", buttonDelete).html(selectedCount);
            
            $(buttonNew).hide();
            $(buttonDelete).show();

            if (selectedCount == checkboxCount) {
                $(checkAllElement).prop("checked", true);
            } else {
                $(checkAllElement).prop("checked", false);
            }
        }
    },
    "cleanCheckedBoxes": function(model) {
        var tbodyElement = document.getElementById("tbody" + model + "RecordList");
        $(".select_row", tbodyElement).prop("checked", false);
        
        var checkAllElement = document.getElementById("select_" + model + "_rows");
        AdminLTEHelper.updateCheckboxStates(checkAllElement, model);
    },
    "getTableSelectedRowIds": function(model) {
        var tbodyElement = document.getElementById("tbody" + model + "RecordList");
        var selectedCheckboxes = $(".select_row:checked", tbodyElement);
        var selectedCount = selectedCheckboxes.length;
        var selectedIds = [];
        for (var i = 0; i < selectedCount; i++) {
            selectedIds.push(selectedCheckboxes[i].getAttribute("data-row-id"));
        }

        return selectedIds;
    },
    "initializePreferencesPage": function (preferences) {
        AdminLTEHelper.fillPreferencesInputs(preferences);

        //checked: $('.main-header').hasClass('border-bottom-0')
        $("#formPreferences-main-header_border-bottom-0").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.main-header').addClass('border-bottom-0');
            } else {
                $('.main-header').removeClass('border-bottom-0');
            }
        });
        
        //checked: $('body').hasClass('text-sm')
        $("#formPreferences-body_text-sm").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('body').addClass('text-sm');
            } else {
                $('body').removeClass('text-sm');
            }
        });
        
        //checked: $('.main-header').hasClass('text-sm')
        $("#formPreferences-main-header_text-sm").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.main-header').addClass('text-sm');
            } else {
                $('.main-header').removeClass('text-sm');
            }
        });
        
        //checked: $('.nav-sidebar').hasClass('text-sm')
        $("#formPreferences-nav-sidebar_text-sm").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.nav-sidebar').addClass('text-sm');
            } else {
                $('.nav-sidebar').removeClass('text-sm');
            }
        });
    
        //checked: $('.main-footer').hasClass('text-sm')
        $("#formPreferences-main-footer_text-sm").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.main-footer').addClass('text-sm');
            } else {
                $('.main-footer').removeClass('text-sm');
            }
        });
    
        //checked: $('.nav-sidebar').hasClass('nav-flat')
        $("#formPreferences-nav-sidebar_nav-flat").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.nav-sidebar').addClass('nav-flat');
            } else {
                $('.nav-sidebar').removeClass('nav-flat');
            }
        });
    
        //checked: $('.nav-sidebar').hasClass('nav-legacy')
        $("#formPreferences-nav-sidebar_nav-legacy").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.nav-sidebar').addClass('nav-legacy');
            } else {
                $('.nav-sidebar').removeClass('nav-legacy');
            }
        });
    
        //checked: $('.nav-sidebar').hasClass('nav-compact')
        $("#formPreferences-nav-sidebar_nav-compact").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.nav-sidebar').addClass('nav-compact');
            } else {
                $('.nav-sidebar').removeClass('nav-compact');
            }
        });
    
        //checked: $('.nav-sidebar').hasClass('nav-child-indent')
        $("#formPreferences-nav-sidebar_nav-child-indent").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.nav-sidebar').addClass('nav-child-indent');
            } else {
                $('.nav-sidebar').removeClass('nav-child-indent');
            }
        });
    
        //checked: $('.main-sidebar').hasClass('sidebar-no-expand')
        $("#formPreferences-main-sidebar_sidebar-no-expand").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.main-sidebar').addClass('sidebar-no-expand');
            } else {
                $('.main-sidebar').removeClass('sidebar-no-expand');
            }
        });
    
        //checked: $('.brand-link').hasClass('text-sm')
        $("#formPreferences-brand-link_text-sm").off("click").on("click", function () {
            if ($(this).is(':checked')) {
                $('.brand-link').addClass('text-sm');
            } else {
                $('.brand-link').removeClass('text-sm');
            }
        });
        
        var navbar_dark_skins = [
            'navbar-primary',
            'navbar-secondary',
            'navbar-info',
            'navbar-success',
            'navbar-danger',
            'navbar-indigo',
            'navbar-purple',
            'navbar-pink',
            'navbar-navy',
            'navbar-lightblue',
            'navbar-teal',
            'navbar-cyan',
            'navbar-dark',
            'navbar-gray-dark',
            'navbar-gray'
        ];
    
        var navbar_light_skins = [
            'navbar-light',
            'navbar-warning',
            'navbar-white',
            'navbar-orange'
        ];
     
        var navbar_all_colors = navbar_dark_skins.concat(navbar_light_skins);
        var logo_skins = navbar_all_colors;
    
        $("#container_navbar_variants > div").off("click").on("click", function () {
            var $main_header = $('.main-header');
    
            // clean
            $main_header.removeClass('navbar-dark').removeClass('navbar-light');
    
            navbar_all_colors.map(function (color) {
                $main_header.removeClass(color)
            });
            
            // set
            var header_type = this.getAttribute("data-header-type");
            var color = this.getAttribute("data-color");
    
            $main_header.addClass(header_type).addClass(color);
    
            $("#formPreferences-navbar_variants").val((header_type + " " + color));

            $("#container_navbar_variants > div").removeClass("active");
            $(this).addClass("active");
        });
    
        var sidebar_colors = [
            'bg-primary',
            'bg-warning',
            'bg-info',
            'bg-danger',
            'bg-success',
            'bg-indigo',
            'bg-lightblue',
            'bg-navy',
            'bg-purple',
            'bg-fuchsia',
            'bg-pink',
            'bg-maroon',
            'bg-orange',
            'bg-lime',
            'bg-teal',
            'bg-olive'
        ];
    
        var accent_colors = [
            'accent-primary',
            'accent-warning',
            'accent-info',
            'accent-danger',
            'accent-success',
            'accent-indigo',
            'accent-lightblue',
            'accent-navy',
            'accent-purple',
            'accent-fuchsia',
            'accent-pink',
            'accent-maroon',
            'accent-orange',
            'accent-lime',
            'accent-teal',
            'accent-olive'
        ];
    
        var sidebar_skins = [
            'sidebar-dark-primary',
            'sidebar-dark-warning',
            'sidebar-dark-info',
            'sidebar-dark-danger',
            'sidebar-dark-success',
            'sidebar-dark-indigo',
            'sidebar-dark-lightblue',
            'sidebar-dark-navy',
            'sidebar-dark-purple',
            'sidebar-dark-fuchsia',
            'sidebar-dark-pink',
            'sidebar-dark-maroon',
            'sidebar-dark-orange',
            'sidebar-dark-lime',
            'sidebar-dark-teal',
            'sidebar-dark-olive',
            'sidebar-light-primary',
            'sidebar-light-warning',
            'sidebar-light-info',
            'sidebar-light-danger',
            'sidebar-light-success',
            'sidebar-light-indigo',
            'sidebar-light-lightblue',
            'sidebar-light-navy',
            'sidebar-light-purple',
            'sidebar-light-fuchsia',
            'sidebar-light-pink',
            'sidebar-light-maroon',
            'sidebar-light-orange',
            'sidebar-light-lime',
            'sidebar-light-teal',
            'sidebar-light-olive'
        ];
        
        $("#container_accent_variants > div").off("click").on("click", function () {
            var $body = $('body');
    
            // clean
            accent_colors.map(function (skin) {
                $body.removeClass(skin)
            })
    
            // set
            var color = this.getAttribute("data-color");
    
            $body.addClass(color);
    
            $("#formPreferences-accent_variants").val(color);

            $("#container_accent_variants > div").removeClass("active");
            $(this).addClass("active");
        });
        
        $("#container_sidebar_variants_dark > div").off("click").on("click", function () {
            var $sidebar = $('.main-sidebar');
    
            // clean
            sidebar_skins.map(function (skin) {
                $sidebar.removeClass(skin)
            })
    
            // set
            var color = this.getAttribute("data-color");
            var sidebar_class = 'sidebar-dark-' + color.replace('bg-', '');
    
            $sidebar.addClass(sidebar_class);
    
            $("#formPreferences-sidebar_variants").val(sidebar_class);

            $("#container_sidebar_variants_dark > div").removeClass("active");
            $("#container_sidebar_variants_light > div").removeClass("active");
            $(this).addClass("active");
        });
    
        $("#container_sidebar_variants_light > div").off("click").on("click", function () {
            var $sidebar = $('.main-sidebar');
    
            // clean
            sidebar_skins.map(function (skin) {
                $sidebar.removeClass(skin)
            })
    
            // set
            var color = this.getAttribute("data-color");
            var sidebar_class = 'sidebar-light-' + color.replace('bg-', '');
    
            $sidebar.addClass(sidebar_class);
    
            $("#formPreferences-sidebar_variants").val(sidebar_class);

            $("#container_sidebar_variants_dark > div").removeClass("active");
            $("#container_sidebar_variants_light > div").removeClass("active");
            $(this).addClass("active");
        });
    
        $("#container_logo_variants > div").off("click").on("click", function () {
            var $logo = $('.brand-link');
    
            // clean
            logo_skins.map(function (skin) {
                $logo.removeClass(skin)
            })
    
            // set
            var color = this.getAttribute("data-color");
    
            $logo.addClass(color);
    
            $("#formPreferences-logo_variants").val(color);

            $("#container_logo_variants > div").removeClass("active");
            $(this).addClass("active");
        });
    
        $("#clear_logo").off("click").on("click", function () {
            var $logo = $('.brand-link');
    
            // clean
            logo_skins.map(function (skin) {
                $logo.removeClass(skin)
            })
    
            $("#formPreferences-logo_variants").val("");
        });
    },
    "fillPreferencesInputs": function (preferences) {
        if (1 == preferences["main-header_border-bottom-0"]) {
            document.getElementById("formPreferences-main-header_border-bottom-0").checked = true;
        }
    
        if (1 == preferences["body_text-sm"]) {
            document.getElementById("formPreferences-body_text-sm").checked = true;
        }
    
        if (1 == preferences["main-header_text-sm"]) {
            document.getElementById("formPreferences-main-header_text-sm").checked = true;
        }
    
        if (1 == preferences["nav-sidebar_text-sm"]) {
            document.getElementById("formPreferences-nav-sidebar_text-sm").checked = true;
        }
    
        if (1 == preferences["main-footer_text-sm"]) {
            document.getElementById("formPreferences-main-footer_text-sm").checked = true;
        }
    
        if (1 == preferences["nav-sidebar_nav-flat"]) {
            document.getElementById("formPreferences-nav-sidebar_nav-flat").checked = true;
        }
    
        if (1 == preferences["nav-sidebar_nav-legacy"]) {
            document.getElementById("formPreferences-nav-sidebar_nav-legacy").checked = true;
        }
    
        if (1 == preferences["nav-sidebar_nav-compact"]) {
            document.getElementById("formPreferences-nav-sidebar_nav-compact").checked = true;
        }
    
        if (1 == preferences["nav-sidebar_nav-child-indent"]) {
            document.getElementById("formPreferences-nav-sidebar_nav-child-indent").checked = true;
        }
    
        if (1 == preferences["main-sidebar_sidebar-no-expand"]) {
            document.getElementById("formPreferences-main-sidebar_sidebar-no-expand").checked = true;
        }
    
        if (1 == preferences["brand-link_text-sm"]) {
            document.getElementById("formPreferences-brand-link_text-sm").checked = true;
        }
    
        document.getElementById("formPreferences-navbar_variants").value = preferences["navbar_variants"];
        var navbar_variants = preferences["navbar_variants"].split(" ");
        var selectorText = "#container_navbar_variants > div"
            + "[data-header-type='" + navbar_variants[0] + "']"
            + "[data-color='" + navbar_variants[1] + "']";
        $(selectorText).addClass("active");

        document.getElementById("formPreferences-accent_variants").value = preferences["accent_variants"];
        selectorText = "#container_accent_variants > div"
            + "[data-color='" + preferences["accent_variants"] + "']";
        $(selectorText).addClass("active");

        var sidebar_variants = preferences["sidebar_variants"];
        document.getElementById("formPreferences-sidebar_variants").value = sidebar_variants;
        if(sidebar_variants.includes("sidebar-dark")) {
            var color = sidebar_variants.replace("sidebar-dark", "bg");
            selectorText = "#container_sidebar_variants_dark div"
                + "[data-color='" + color + "']";
            $(selectorText).addClass("active");
        } else {
            var color = sidebar_variants.replace("sidebar-light", "bg");
            selectorText = "#container_sidebar_variants_light div"
                + "[data-color='" + color + "']";
            $(selectorText).addClass("active");
        }

        document.getElementById("formPreferences-logo_variants").value = preferences["logo_variants"];
        selectorText = "#container_logo_variants > div"
            + "[data-color='" + preferences["logo_variants"] + "']";
        $(selectorText).addClass("active");
    },
    "getPreferences": function () {    
        var preferences = {};
        preferences["main-header_border-bottom-0"] = (document.getElementById("formPreferences-main-header_border-bottom-0").checked) ? 1 : 0;
        preferences["body_text-sm"] = (document.getElementById("formPreferences-body_text-sm").checked) ? 1 : 0;
        preferences["main-header_text-sm"] = (document.getElementById("formPreferences-main-header_text-sm").checked) ? 1 : 0;
        preferences["nav-sidebar_text-sm"] = (document.getElementById("formPreferences-nav-sidebar_text-sm").checked) ? 1 : 0;
        preferences["main-footer_text-sm"] = (document.getElementById("formPreferences-main-footer_text-sm").checked) ? 1 : 0;
        preferences["nav-sidebar_nav-flat"] = (document.getElementById("formPreferences-nav-sidebar_nav-flat").checked) ? 1 : 0;
        preferences["nav-sidebar_nav-legacy"] = (document.getElementById("formPreferences-nav-sidebar_nav-legacy").checked) ? 1 : 0;
        preferences["nav-sidebar_nav-compact"] = (document.getElementById("formPreferences-nav-sidebar_nav-compact").checked) ? 1 : 0;
        preferences["nav-sidebar_nav-child-indent"] = (document.getElementById("formPreferences-nav-sidebar_nav-child-indent").checked) ? 1 : 0;
        preferences["main-sidebar_sidebar-no-expand"] = (document.getElementById("formPreferences-main-sidebar_sidebar-no-expand").checked) ? 1 : 0;
        preferences["brand-link_text-sm"] = (document.getElementById("formPreferences-brand-link_text-sm").checked) ? 1 : 0;
        preferences["navbar_variants"] = document.getElementById("formPreferences-navbar_variants").value;
        preferences["accent_variants"] = document.getElementById("formPreferences-accent_variants").value;
        preferences["sidebar_variants"] = document.getElementById("formPreferences-sidebar_variants").value;
        preferences["logo_variants"] = document.getElementById("formPreferences-logo_variants").value;
    
        return preferences;
    },
    "doSearchWidget": function(sender) {
        if (!sender) {
            return;
        }

        var searchText = sender.value;

        $("#ulWidgetEditor > li").css("display", "none");

        var arrLI = $("#ulWidgetEditor > li");
        var countLI = arrLI.length;
        var searchedElement = null;
        var searchedText = "";

        for (var i = 0; i < countLI; i++) {
            searchedElement = $(".widget-search", arrLI[i])[0];
            searchedText = searchedElement.innerHTML;

            if (searchedText.search(new RegExp(searchText, "i")) != -1) {
                searchedElement.parentNode.parentNode.style.display = "block";
            }
        }
    }
}

module.exports = AdminLTEHelper;