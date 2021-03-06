$(document).ready(function() {
    
    var form = $("#edit-form");
    var sitemap = new Atomic.editor.EditLink();
    var anchorEditor = new Atomic.editor.EditAnchor();
    var addGallery = new Atomic.editor.AddGalleryLink();
    var summaryEditor = null;
    
    var contentEditor = null;
    contentEditor = new Atomic.editor.Editor("content-editor-content", "content-editor-textarea", "content-editor-toolbar", sitemap, anchorEditor, addGallery);
    $("#content-editor-content").remove();
        
    function updateForm() {
        var content = null;
        content = contentEditor.editor.getValue(true);
        
        var summary = null;
        if (summaryEditor) {
            summary = summaryEditor.editor.getValue(true);
        }
        
        var name = $("input[name='name']", form).val();
        form.attr("action", name);
        $("textarea[name='content']", form).val(content);
        if (summary) {
            $("textarea[name='summary']", form).val(summary);
        }
    }
    
    
    $("#summary-editor-tab").click(function (e) {
        e.preventDefault();
        if (!summaryEditor) {
            summaryEditor = new Atomic.editor.Editor("summary-editor-content", "summary-editor-textarea", "summary-editor-toolbar", sitemap, anchorEditor, addGallery);
            $("#summary-editor-content").remove();
        }
        $(this).tab('show');
    });
    $("#content-editor-tab").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $("#edit-form-saveAndClose").click(function(ev) {
//        if (!form.checkValidity()) {
//            return;
//        }
        if (contentEditor) {
            contentEditor.deactivate();
        }
        updateForm();
        $("input[name='action']", form).val("store");
        form.submit();
        return false;
    });
    $("#edit-form-save").click(function (ev) {
        ev.preventDefault();
        
//        if (!form.checkValidity())
//            return;
        if (contentEditor) {
            contentEditor.deactivate();
        }
        updateForm();
        $("input[name='action']", form).val("store");
        var data = form.serialize() + "&unlock=false";
        $.ajax({
            type: "POST",
            url: "modules/store.xql",
            data: data,
            complete: function() {
                $.log("Store completed");
                if (contentEditor) {
                    contentEditor.activate();
                }
            }
        });
    });
    $("#edit-form-cancel").click(function(ev) {
        $("input[name='action']", form).val("unlock");
        form.submit();
    });
    
    Atomic.Form.validator(form, ["name"]);
    
    form.submit(function () {
        var wikiId = $("input[name='name']", this).val();
        var filename = $("input[name='resource']", this).val();
        
        if (wikiId === "") {
            return false;
        }
        if (filename === "") {
            filename = wikiId + ".atom";
            $("input[name='resource']", this).val(filename);
        }
        
        return true;
    });
});