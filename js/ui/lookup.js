"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    window = require("../core/utils/window").getWindow(),
    support = require("../core/utils/support"),
    commonUtils = require("../core/utils/common"),
    domUtils = require("../core/utils/dom"),
    each = require("../core/utils/iterator").each,
    extend = require("../core/utils/extend").extend,
    inkRipple = require("./widget/utils.ink_ripple"),
    messageLocalization = require("../localization/message"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    eventUtils = require("../events/utils"),
    DropDownList = require("./drop_down_editor/ui.drop_down_list"),
    themes = require("./themes"),
    clickEvent = require("../events/click"),
    Popover = require("./popover"),
    TextBox = require("./text_box"),
    ChildDefaultTemplate = require("./widget/child_default_template");

var LOOKUP_CLASS = "dx-lookup",
    LOOKUP_SEARCH_CLASS = "dx-lookup-search",
    LOOKUP_SEARCH_WRAPPER_CLASS = "dx-lookup-search-wrapper",
    LOOKUP_FIELD_CLASS = "dx-lookup-field",
    LOOKUP_ARROW_CLASS = "dx-lookup-arrow",
    LOOKUP_FIELD_WRAPPER_CLASS = "dx-lookup-field-wrapper",
    LOOKUP_POPUP_CLASS = "dx-lookup-popup",
    LOOKUP_POPUP_WRAPPER_CLASS = "dx-lookup-popup-wrapper",
    LOOKUP_POPUP_SEARCH_CLASS = "dx-lookup-popup-search",
    LOOKUP_POPOVER_MODE = "dx-lookup-popover-mode",
    LOOKUP_EMPTY_CLASS = "dx-lookup-empty",
    LOOKUP_POPUP_VALIDATION_MESSAGE = "dx-lookup-validation-message",
    LOOKUP_POPUP_INVALID_CLASS = "dx-lookup-invalid";

var POPUP_OPTION_MAP = {
    "popupWidth": "width",
    "popupHeight": "height"
};


/**
* @name dxlookup
* @isEditor
* @publicName dxLookup
* @inherits dxDropDownList
* @module ui/lookup
* @export default
*/
var Lookup = DropDownList.inherit({
    _supportedKeys: function() {
        return extend(this.callBase(), {
            space: function(e) {
                e.preventDefault();
                this._validatedOpening();
            },
            enter: function() {
                this._validatedOpening();
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxLookupOptions_title
            * @publicName title
            * @type string
            * @default ""
            */
            title: "",

            /**
            * @name dxLookupOptions_titleTemplate
            * @publicName titleTemplate
            * @type template|function
            * @default "title"
            * @type_function_param1 titleElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            titleTemplate: "title",

            /**
            * @name dxLookupOptions_onTitleRendered
            * @publicName onTitleRendered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 titleElement:dxElement
            * @action
            */
            onTitleRendered: null,

            /**
            * @name dxLookupOptions_placeholder
            * @publicName placeholder
            * @type string
            * @default "Select"
            */
            placeholder: messageLocalization.format("Select"),

            /**
            * @name dxLookupOptions_searchPlaceholder
            * @publicName searchPlaceholder
            * @type string
            * @default "Search"
            */
            searchPlaceholder: messageLocalization.format("Search"),

            /**
            * @name dxLookupOptions_searchEnabled
            * @publicName searchEnabled
            * @type boolean
            * @default true
            */
            searchEnabled: true,

            /**
            * @name dxLookupOptions_cleanSearchOnOpening
            * @publicName cleanSearchOnOpening
            * @type boolean
            * @default true
            */
            cleanSearchOnOpening: true,

            /**
            * @name dxLookupOptions_fullScreen
            * @publicName fullScreen
            * @type boolean
            * @default false
            */
            fullScreen: false,

            /**
            * @name dxLookupOptions_showCancelButton
            * @publicName showCancelButton
            * @type boolean
            * @default true
            */
            showCancelButton: true,

            /**
            * @name dxLookupOptions_cancelButtonText
            * @publicName cancelButtonText
            * @type string
            * @default "Cancel"
            */

            /**
            * @name dxLookupOptions_showClearButton
            * @publicName showClearButton
            * @type boolean
            * @default false
            */
            showClearButton: false,

            /**
            * @name dxLookupOptions_clearButtonText
            * @publicName clearButtonText
            * @type string
            * @default "Clear"
            */
            clearButtonText: messageLocalization.format("Clear"),

            /**
            * @name dxLookupOptions_applyButtonText
            * @publicName applyButtonText
            * @type string
            * @default "Done"
            */
            applyButtonText: messageLocalization.format("Done"),

            /**
             * @name dxLookupOptions_popupWidth
             * @publicName popupWidth
             * @type number|string|function
             * @default function() {return $(window).width() * 0.8 }
             * @type_function_return number|string
             */
            popupWidth: function() { return $(window).width() * 0.8; },

            /**
             * @name dxLookupOptions_popupHeight
             * @publicName popupHeight
             * @type number|string|function
             * @default function() { return $(window).height() * 0.8 }
             * @type_function_return number|string
             */
            popupHeight: function() { return $(window).height() * 0.8; },

            /**
            * @name dxLookupOptions_shading
            * @publicName shading
            * @type boolean
            * @default true
            */
            shading: true,

            /**
            * @name dxLookupOptions_closeOnOutsideClick
            * @publicName closeOnOutsideClick
            * @type boolean|function
            * @default false
            * @type_function_return boolean
            */
            closeOnOutsideClick: false,

            /**
            * @name dxLookupOptions_position
            * @publicName position
            * @type positionConfig
            * @default undefined
            */
            position: undefined,

            /**
            * @name dxLookupOptions_animation
            * @publicName animation
            * @type object
            * @default undefined
            */
            animation: {
                /**
                * @name dxLookupOptions_animation_show
                * @publicName show
                * @type animationConfig
                * @default undefined
                */
                /**
                * @name dxLookupOptions_animation_hide
                * @publicName hide
                * @type animationConfig
                * @default undefined
                */
            },

            /**
            * @name dxLookupOptions_pullRefreshEnabled
            * @publicName pullRefreshEnabled
            * @type boolean
            * @default false
            */
            pullRefreshEnabled: false,

            /**
            * @name dxLookupOptions_useNativeScrolling
            * @publicName useNativeScrolling
            * @type boolean
            * @default true
            */
            useNativeScrolling: true,

            /**
            * @name dxLookupOptions_pullingDownText
            * @publicName pullingDownText
            * @type string
            * @default "Pull down to refresh..."
            */
            pullingDownText: messageLocalization.format("dxList-pullingDownText"),

            /**
            * @name dxLookupOptions_pulledDownText
            * @publicName pulledDownText
            * @type string
            * @default "Release to refresh..."
            */
            pulledDownText: messageLocalization.format("dxList-pulledDownText"),

            /**
            * @name dxLookupOptions_refreshingText
            * @publicName refreshingText
            * @type string
            * @default "Refreshing..."
            */
            refreshingText: messageLocalization.format("dxList-refreshingText"),

            /**
            * @name dxLookupOptions_pageLoadingText
            * @publicName pageLoadingText
            * @type string
            * @default "Loading..."
            */
            pageLoadingText: messageLocalization.format("dxList-pageLoadingText"),

            /**
            * @name dxLookupOptions_onScroll
            * @publicName onScroll
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @type_function_param1_field6 scrollOffset:object
            * @type_function_param1_field7 reachedLeft:boolean
            * @type_function_param1_field8 reachedRight:boolean
            * @type_function_param1_field9 reachedTop:boolean
            * @type_function_param1_field10 reachedBottom:boolean
            * @action
            */
            onScroll: null,

            /**
            * @name dxLookupOptions_onPullRefresh
            * @publicName onPullRefresh
            * @extends Action
            * @action
            */
            onPullRefresh: null,

            /**
            * @name dxLookupOptions_onPageLoading
            * @publicName onPageLoading
            * @extends Action
            * @action
            */
            onPageLoading: null,

            /**
            * @name dxLookupOptions_pageLoadMode
            * @publicName pageLoadMode
            * @type Enums.ListPageLoadMode
            * @default "scrollBottom"
            */
            pageLoadMode: "scrollBottom",

            /**
            * @name dxLookupOptions_nextButtonText
            * @publicName nextButtonText
            * @type string
            * @default "More"
            */
            nextButtonText: messageLocalization.format("dxList-nextButtonText"),

            /**
            * @name dxLookupOptions_grouped
            * @publicName grouped
            * @type boolean
            * @default false
            */
            grouped: false,

            /**
            * @name dxLookupOptions_groupTemplate
            * @publicName groupTemplate
            * @type template|function
            * @default "group"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            groupTemplate: "group",

            /**
            * @name dxLookupOptions_usePopover
            * @publicName usePopover
            * @type boolean
            * @default false
            */
            usePopover: false,

            showDropDownButton: false,

            /**
            * @name dxLookupOptions_showPopupTitle
            * @publicName showPopupTitle
            * @type boolean
            * @default true
            */
            showPopupTitle: true,

            /**
            * @name dxLookupOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @type boolean
            * @default false
            * @inheritdoc
            */
            focusStateEnabled: false

            /**
            * @name dxLookupOptions_onValueChanged
            * @publicName onValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field7 event:event
            * @action
            */

            /**
            * @name dxLookupOptions_fieldTemplate
            * @publicName fieldTemplate
            * @type template|function
            * @default null
            * @type_function_param1 selectedItem:object
            * @type_function_param2 fieldElement:dxElement
            * @type_function_return string|Node|jQuery
            */

            /**
            * @name dxLookupOptions_acceptCustomValue
            * @publicName acceptCustomValue
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_readOnly
            * @publicName readOnly
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onFocusIn
            * @publicName onFocusIn
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onFocusOut
            * @publicName onFocusOut
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onKeyDown
            * @publicName onKeyDown
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onKeyPress
            * @publicName onKeyPress
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onKeyUp
            * @publicName onKeyUp
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onChange
            * @publicName onChange
            * @action
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onInput
            * @publicName onInput
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onCut
            * @publicName onCut
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onCopy
            * @publicName onCopy
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onPaste
            * @publicName onPaste
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_onEnterKey
            * @publicName onEnterKey
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_maxlength
            * @publicName maxLength
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxLookupOptions_spellcheck
            * @publicName spellcheck
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxLookupOptions_applyValueMode
            * @publicName applyValueMode
            * @type Enums.EditorApplyValueMode
            * @hidden false
            * @inheritdoc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return !support.nativeScrolling;
                },
                options: {
                    /**
                    * @name dxLookupOptions_useNativeScrolling
                    * @publicName useNativeScrolling
                    * @default false @for desktop
                    * @default true @for Mac
                    */
                    useNativeScrolling: false
                }
            },
            {
                device: function(device) {
                    return !devices.isSimulator() && devices.real().platform === "generic" && device.platform === "generic";
                },
                options: {
                    /**
                    * @name dxLookupOptions_usePopover
                    * @publicName usePopover
                    * @default true @for desktop|iOS
                    */
                    usePopover: true,
                    /**
                    * @name dxLookupOptions_popupHeight
                    * @publicName popupHeight
                    * @default 'auto' @for desktop|iPad
                    */
                    popupHeight: "auto"
                }
            },
            {
                device: function(device) {
                    return device.platform === "win" && device.phone && device.version && device.version[0] === 8;
                },
                options: {
                    /**
                    * @name dxLookupOptions_showCancelButton
                    * @publicName showCancelButton
                    */
                    showCancelButton: false,
                    /**
                    * @name dxLookupOptions_fullScreen
                    * @publicName fullScreen
                    */
                    fullScreen: true
                }
            },
            {
                device: function(device) {
                    return device.platform === "win" && !device.phone && device.version && device.version[0] === 8;
                },
                options: {
                    popupWidth: function() { return $(window).width(); }
                }
            },
            {
                device: { platform: "ios", phone: true },
                options: {
                    /**
                    * @name dxLookupOptions_fullScreen
                    * @publicName fullScreen
                    * @default true @for iPhone
                    */
                    fullScreen: true
                }
            },
            {
                device: { platform: "ios", tablet: true },
                options: {
                    /**
                    * @name dxLookupOptions_popupWidth
                    * @publicName popupWidth
                    * @default function() { return Math.min($(window).width(), $(window).height()) * 0.4; } @for iPad
                    */
                    popupWidth: function() { return Math.min($(window).width(), $(window).height()) * 0.4; },

                    popupHeight: "auto",

                    usePopover: true,
                    useInkRipple: false
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxLookupOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    * @inheritdoc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return /android5/.test(themes.current());
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["group"] = new ChildDefaultTemplate("group", this);
        this._defaultTemplates["title"] = new ChildDefaultTemplate("title", this);
    },

    _initMarkup: function() {
        this.$element()
            .addClass(LOOKUP_CLASS)
            .toggleClass(LOOKUP_POPOVER_MODE, this.option("usePopover"));
        this._renderSubmitElement();
        this.callBase();
    },

    _inputWrapper: function() {
        return this.$element().find("." + LOOKUP_FIELD_WRAPPER_CLASS);
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.$element());
    },

    _dataSourceOptions: function() {
        return extend(this.callBase(), {
            paginate: true
        });
    },


    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _fireContentReadyAction: commonUtils.noop, // TODO: why not symmetric to other dropdowns?

    _popupWrapperClass: function() {
        return "";
    },

    _renderInput: function() {
        var fieldClickAction = this._createAction((function() {
            this._toggleOpenState();
        }).bind(this));

        this._$field = $("<div>").addClass(LOOKUP_FIELD_CLASS);
        eventsEngine.on(this._$field, eventUtils.addNamespace(clickEvent.name, this.NAME), function(e) {
            fieldClickAction({ event: e });
        });

        var $arrow = $("<div>").addClass(LOOKUP_ARROW_CLASS);

        this._$fieldWrapper = $("<div>").addClass(LOOKUP_FIELD_WRAPPER_CLASS)
            .append(this._$field)
            .append($arrow)
            .appendTo(this.$element());

        this.option("useInkRipple") && this._renderInkRipple();
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render();
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        var config = {
            element: this._inputWrapper(),
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _renderField: function() {
        var fieldTemplate = this._getTemplateByOption("fieldTemplate");

        if(fieldTemplate && this.option("fieldTemplate")) {
            this._renderFieldTemplate(fieldTemplate);
            return;
        }

        this._$field.text(this.option("displayValue") || this.option("placeholder"));
        this.$element().toggleClass(LOOKUP_EMPTY_CLASS, !this.option("selectedItem"));
    },

    _renderFieldTemplate: function(template) {
        this._$field.empty();
        var data = this._fieldRenderData();
        template.render({
            model: data,
            container: domUtils.getPublicElement(this._$field)
        });
    },

    _fieldRenderData: function() {
        return this.option("selectedItem");
    },

    _popupShowingHandler: function() {
        var validationError;

        if(this._$popupValidationMessage) {
            validationError = this.option("validationError");
            if(validationError && validationError.message) {
                this._$popupValidationMessage.text(validationError.message);
                this._popup.$content().addClass(LOOKUP_POPUP_INVALID_CLASS);
            } else {
                this._popup.$content().removeClass(LOOKUP_POPUP_INVALID_CLASS);
            }
        }

        this.callBase.apply(this, arguments);
        if(this.option("cleanSearchOnOpening")) {
            if(this.option("searchEnabled") && this._searchBox.option("value")) {
                this._searchBox.option("value", "");
                this._searchCanceled();
            }
            this._list && this._list.option("focusedElement", null);
        }

        this._attachSearchChildProcessor();
    },

    _renderPopup: function() {
        if(this.option("usePopover") && !this.option("fullScreen")) {
            this._renderPopover();
        } else {
            this.callBase();
        }

        this._$popup.addClass(LOOKUP_POPUP_CLASS);
        this._popup._wrapper().addClass(LOOKUP_POPUP_WRAPPER_CLASS);
    },

    _popupOptionMap: function(optionName) {
        return POPUP_OPTION_MAP[optionName] || optionName;
    },

    _renderPopover: function() {
        this._popup = this._createComponent(this._$popup, Popover, extend(this._popupConfig(), {
            showEvent: null,
            hideEvent: null,
            target: this.$element(),
            fullScreen: false,
            shading: false,
            closeOnTargetScroll: true,
            width: this._isInitialOptionValue("popupWidth") ? (function() { return this.$element().outerWidth(); }).bind(this) : this._popupConfig().width
        }));

        this._popup.on({
            "showing": this._popupShowingHandler.bind(this),
            "shown": this._popupShownHandler.bind(this),
            "hiding": this._popupHidingHandler.bind(this),
            "hidden": this._popupHiddenHandler.bind(this)
        });

        this._popup.option("onContentReady", this._contentReadyHandler.bind(this));
        this._contentReadyHandler();
    },

    _popupHidingHandler: function() {
        this.callBase();
        this.option("focusStateEnabled") && this.focus();
    },

    _preventFocusOnPopup: commonUtils.noop,

    _popupConfig: function() {
        var result = extend(this.callBase(), {
            showTitle: this.option("showPopupTitle"),
            title: this.option("title"),
            titleTemplate: this._getTemplateByOption("titleTemplate"),
            onTitleRendered: this.option("onTitleRendered"),

            toolbarItems: this._getPopupToolbarItems(),

            fullScreen: this.option("fullScreen"),
            shading: this.option("shading"),
            closeOnTargetScroll: false,
            closeOnOutsideClick: this.option("closeOnOutsideClick"),
            onPositioned: null
        });

        delete result.animation;
        delete result.position;

        result.maxHeight = function() { return $(window).height(); };

        each(["position", "animation", "popupWidth", "popupHeight"], (function(_, optionName) {
            if(this.option(optionName) !== undefined) {
                result[this._popupOptionMap(optionName)] = this.option(optionName);
            }
        }).bind(this));

        return result;
    },

    _getPopupToolbarItems: function() {
        var buttonsConfig = this.option("applyValueMode") === "useButtons"
            ? this._popupToolbarItemsConfig()
            : [];

        var cancelButton = this._getCancelButtonConfig();
        if(cancelButton) {
            buttonsConfig.push(cancelButton);
        }

        var clearButton = this._getClearButtonConfig();
        if(clearButton) {
            buttonsConfig.push(clearButton);
        }

        return this._applyButtonsLocation(buttonsConfig);
    },

    _popupToolbarItemsConfig: function() {
        return [
            {
                shortcut: "done",
                options: {
                    onClick: this._applyButtonHandler.bind(this),
                    text: this.option("applyButtonText")
                }
            }
        ];
    },

    _getCancelButtonConfig: function() {
        return this.option("showCancelButton") ? {
            shortcut: "cancel",
            onClick: this._cancelButtonHandler.bind(this),
            options: { text: this.option("cancelButtonText") }
        } : null;
    },

    _getClearButtonConfig: function() {
        return this.option("showClearButton") ? {
            shortcut: "clear",
            onClick: this._resetValue.bind(this),
            options: { text: this.option("clearButtonText") }
        } : null;
    },

    _applyButtonHandler: function() {
        this.option("value", this._valueGetter(this._currentSelectedItem()));
        this.callBase();
    },

    _cancelButtonHandler: function() {
        this._refreshSelected();
        this.callBase();
    },

    _refreshPopupVisibility: function() {
        if(this.option("opened")) {
            this._updatePopupHeight();
        }
    },

    _dimensionChanged: function() {
        if(this.option("usePopover") && !this.option("popupWidth")) {
            this.option("popupWidth", this.$element().width());
        }

        this.callBase();
    },

    _updatePopupDimensions: function() {
        this._updatePopupHeight();
    },

    _input: function() {
        return this._$searchBox || this.callBase();
    },

    _renderPopupContent: function() {
        if(this._popup.NAME === "dxPopup") {
            this._$popupValidationMessage = $("<div>").addClass(LOOKUP_POPUP_VALIDATION_MESSAGE).appendTo(this._popup.$content());
        }
        this.callBase();
        this._renderSearch();

        this._attachSearchChildProcessor();
    },

    _attachSearchChildProcessor: function() {
        if(this.option("searchEnabled") && this._searchBox) {
            this._listKeyboardProcessor = this._searchBox._keyboardProcessor.attachChildProcessor();
            this._setListOption("_keyboardProcessor", this._listKeyboardProcessor);
        } else {
            this._setListOption("_keyboardProcessor", undefined);
        }
    },

    _renderSearch: function() {
        this._$searchWrapper && this._$searchWrapper.remove();
        delete this._$searchWrapper;

        this._$searchBox && this._$searchBox.remove();
        delete this._$searchBox;

        delete this._searchBox;

        if(this.option("searchEnabled")) {
            var $searchWrapper = this._$searchWrapper = $("<div>").addClass(LOOKUP_SEARCH_WRAPPER_CLASS);

            var $searchBox = this._$searchBox = $("<div>").addClass(LOOKUP_SEARCH_CLASS)
                .appendTo($searchWrapper);

            var currentDevice = devices.current(),
                searchMode = currentDevice.android && currentDevice.version[0] >= 5 ? "text" : "search";

            this._searchBox = this._createComponent($searchBox, TextBox, {
                mode: searchMode,
                showClearButton: true,
                valueChangeEvent: this.option("valueChangeEvent"),
                onValueChanged: this._searchHandler.bind(this)
            });

            this._registerSearchKeyHandlers();

            $searchWrapper.insertBefore(this._$list);
        }

        this._renderSearchVisibility();
        this._setSearchPlaceholder();
    },

    _selectListItemHandler: function(e) {
        var $itemElement = $(this._list.option("focusedElement"));

        if(!$itemElement.length) {
            return;
        }

        e.preventDefault();
        this._selectListItem(e.itemData, $itemElement);
    },

    _registerSearchKeyHandlers: function() {
        this._searchBox.registerKeyHandler("escape", this.close.bind(this));
        this._searchBox.registerKeyHandler("enter", this._selectListItemHandler.bind(this));
        this._searchBox.registerKeyHandler("space", this._selectListItemHandler.bind(this));
        this._searchBox.registerKeyHandler("end", commonUtils.noop);
        this._searchBox.registerKeyHandler("home", commonUtils.noop);
    },

    _renderSearchVisibility: function() {
        if(this._popup) {
            this._popup._wrapper().toggleClass(LOOKUP_POPUP_SEARCH_CLASS, this.option("searchEnabled"));
        }
    },

    _setSearchPlaceholder: function() {
        if(!this._$searchBox) {
            return;
        }

        var minSearchLength = this.option("minSearchLength");
        var placeholder = this.option("searchPlaceholder");

        if(minSearchLength && placeholder === messageLocalization.format("Search")) {
            placeholder = messageLocalization.getFormatter("dxLookup-searchPlaceholder")(minSearchLength);
        }

        this._searchBox.option("placeholder", placeholder);
    },

    _setAriaTargetForList: commonUtils.noop,

    _renderList: function() {
        this.callBase();

        this._list.registerKeyHandler("escape", (function() {
            this.close();
        }).bind(this));
    },

    _listConfig: function() {
        return extend(this.callBase(), {
            tabIndex: 0,
            grouped: this.option("grouped"),
            groupTemplate: this._getTemplateByOption("groupTemplate"),
            pullRefreshEnabled: this.option("pullRefreshEnabled"),
            useNativeScrolling: this.option("useNativeScrolling"),
            pullingDownText: this.option("pullingDownText"),
            pulledDownText: this.option("pulledDownText"),
            refreshingText: this.option("refreshingText"),
            pageLoadingText: this.option("pageLoadingText"),
            onScroll: this.option("onScroll"),
            onPullRefresh: this.option("onPullRefresh"),
            onPageLoading: this.option("onPageLoading"),
            pageLoadMode: this.option("pageLoadMode"),
            nextButtonText: this.option("nextButtonText"),
            _keyboardProcessor: this._listKeyboardProcessor,
            onFocusIn: this._onFocusInHandler.bind(this),
            onSelectionChanged: this._getSelectionChangedHandler()
        });
    },

    _getSelectionChangedHandler: function() {
        return this.option("showSelectionControls") ? this._selectionChangeHandler.bind(this) : commonUtils.noop;
    },

    _onFocusInHandler: function() {
        this._setListOption("_keyboardProcessor", undefined);
    },

    _listContentReadyHandler: function() {
        this.callBase.apply(this, arguments);
        this._refreshSelected();
    },

    _setFocusPolicy: function() {
        if(!this.option("focusStateEnabled")) {
            return;
        }

        if(this.option("searchEnabled")) {
            this._searchBox.focus();
        } else {
            eventsEngine.trigger(this._$list, "focus");
        }
    },

    _attachChildKeyboardEvents: commonUtils.noop,

    _focusTarget: function() {
        return this._$field;
    },

    _keyboardEventBindingTarget: function() {
        return this._$field;
    },

    _listItemClickHandler: function(e) {
        this._selectListItem(e.itemData, e.event.currentTarget);
    },

    _selectListItem: function(itemData, target) {
        this._list.selectItem(target);

        if(this.option("applyValueMode") === "instantly") {
            this._applyButtonHandler();
        }
    },

    _currentSelectedItem: function() {
        return this.option("grouped")
            ? this._list.option("selectedItems[0]").items[0]
            : this._list.option("selectedItems[0]");
    },

    _resetValue: function() {
        this.option("value", null);
        this.option("opened", false);
    },

    _searchValue: function() {
        return this.option("searchEnabled") && this._searchBox ? this._searchBox.option("value") : "";
    },

    _renderInputValue: function() {
        return this.callBase().always((function() {
            this._renderField();
            this._refreshSelected();
            this._setSubmitValue();
        }).bind(this));
    },

    _setSubmitValue: function() {
        var value = this.option("value"),
            submitValue = this.option("valueExpr") === "this" ? this._displayGetter(value) : value;

        this._$submitElement.val(submitValue);
    },

    _renderPlaceholder: function() {
        if(this.$element().find("input").length === 0) {
            return;
        }

        this.callBase();
    },

    _clean: function() {
        this._$fieldWrapper.remove();
        this._$searchBox = null;
        this.callBase();
    },

    _optionChanged: function(args) {
        var name = args.name;
        var value = args.value;

        switch(name) {
            case "searchEnabled":
                this._popup && this._renderSearch();
                this._attachSearchChildProcessor();
                break;
            case "searchPlaceholder":
                this._setSearchPlaceholder();
                break;
            case "minSearchLength":
                this._setSearchPlaceholder();
                this.callBase.apply(this, arguments);
                break;
            case "title":
            case "titleTemplate":
            case "onTitleRendered":
            case "shading":
            case "animation":
            case "position":
            case "closeOnOutsideClick":
                this._setPopupOption(name);
                break;
            case "fullScreen":
            case "usePopover":
            case "placeholder":
                this._invalidate();
                break;
            case "clearButtonText":
            case "showClearButton":
            case "showCancelButton":
                this._setPopupOption("toolbarItems", this._getPopupToolbarItems());
                break;
            case "applyValueMode":
                this.callBase.apply(this, arguments);
                break;
            case "popupWidth":
                this._setPopupOption("popupWidth", value === "auto" ? this.initialOption("popupWidth") : value);
                break;
            case "popupHeight":
                this._setPopupOption("popupHeight", value === "auto" ? this.initialOption("popupHeight") : value);
                break;
            case "pullRefreshEnabled":
            case "useNativeScrolling":
            case "pullingDownText":
            case "pulledDownText":
            case "refreshingText":
            case "pageLoadingText":
            case "onScroll":
            case "onPullRefresh":
            case "onPageLoading":
            case "nextButtonText":
            case "grouped":
            case "groupTemplate":
                this._setListOption(name);
                break;
            case "pageLoadMode":
                this._setListOption("pageLoadMode", this.option("pageLoadMode"));
                break;
            case "cleanSearchOnOpening":
                break;
            default:
                this.callBase.apply(this, arguments);
        }
    },

    focus: function() {
        this.option("opened") ? this._setFocusPolicy() : eventsEngine.trigger(this._focusTarget(), "focus");
    },

    field: function() {
        return this._$field;
    }
});

registerComponent("dxLookup", Lookup);

module.exports = Lookup;
