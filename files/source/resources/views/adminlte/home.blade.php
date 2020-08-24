@include('adminlte.head')
<body class="hold-transition sidebar-mini layout-fixed text-sm" data-main-folder="{{ config('adminlte.main_folder') }}" template-created="0">
    @include('adminlte.header')
    <div id="mainVueApplication">
        <router-view></router-view>
        <vue-progress-bar></vue-progress-bar>
    </div>
    
    <div>
        <div id="widgetModalTitleDefault" class="d-none">{{ __('Widget Item') }}</div>
        <div id="widgetModalTitleinfobox" class="d-none">{{ __('Infobox Widget') }}</div>
        <div id="widgetModalTitlerecordlist" class="d-none">{{ __('Record List Widget') }}</div>
        <div id="widgetModalTitlerecordgraph" class="d-none">{{ __('Record Graph') }}</div>

        <div id="widgetLabelDefault" class="d-none">{{ __('empty') }}</div>
        <div id="widgetLabelinfobox" class="d-none">{{ __('infobox') }}</div>
        <div id="widgetLabelrecordlist" class="d-none">{{ __('record list') }}</div>
        <div id="widgetLabelrecordgraph" class="d-none">{{ __('record graph') }}</div>

        <div id="recordgraphLabel" class="d-none">{{ __('Record Count') }}</div>
        <script type="text/html" id="modelRecordListSearchTemplate">
            <div id="tbody__MODEL__RecordList-searchForm"
                class="input-group input-group-sm divSearchBar htmldb-section float-right"
                data-htmldb-table="Session__MODEL__HTMLDB"
                style="margin-bottom:1rem;">
                <input type="search"
                    id="searchText" name="searchText"
                    class="form-control float-right inputSearchBar htmldb-input-save"
                    placeholder="{{ __('Search') }}"
                    data-htmldb-table="Session__MODEL__HTMLDB"
                    data-htmldb-input-field="searchText"
                    data-htmldb-refresh-table="__MODEL__HTMLDB"
                    data-htmldb-table-defaults='{"page":0}'
                    data-htmldb-value="@{{searchText}}"
                    data-htmldb-save-delay="1000">

                <div class="input-group-append labelSearchBar">
                    <button type="button" class="btn btn-default ">
                        <img class="imgLoader" src="/img/adminlte/loader.svg" width="14" height="14"/>
                        <i class="fas fa-search text-primary"></i>
                    </button>
                </div>
            </div>
        </script>
        <script type="text/html" id="modelRecordListTemplate">
            <div class="table-responsive">
                <table id="table__MODEL__RecordList" class="table table-striped table-bordered table-hover __TABLE_RECORD_LIST_CLASS__">
                    <thead>
                        <tr>__TH__</tr>
                    </thead>
                    <tbody id="tbody__MODEL__RecordList" data-onlylastrecord="__ONLYLASTRECORD__">
                        <tr v-for="__VFOR__" :key="__KEY__">
                            __RECORDLIST_TD__
                        </tr>
                    </tbody>
                </table>
            </div>
        </script>
        <script type="text/html" id="thCheckboxTemplate">
            <th class="text-center show_by_permission">
                <div class="icheck-primary d-inline">
                    <input type="checkbox"
                        id="tbody__MODEL__RecordList-select_all_row"
                        class="select_all_row"
                        data-model="__MODEL__"
                        data-tbody-id="tbody__MODEL__RecordList"
                        data-button-container="tbody__MODEL__RecordList-action_buttons">
                    <label for="tbody__MODEL__RecordList-select_all_row"></label>
                </div>
            </th>
        </script>
        <script type="text/html" id="thTemplate">
            <th>
                <button type="button"
                    class="buttonSortColumn buttonTableColumn buttonTableColumn0 htmldb-button-sort"
                    data-htmldb-table="Session__MODEL__HTMLDB"
                    data-htmldb-sort-field="sortingColumn"
                    data-htmldb-sort-value="__VALUE__"
                    data-htmldb-direction-field="sortingASC"
                    data-htmldb-refresh-table="__MODEL__HTMLDB"
                    data-htmldb-table-defaults='{"page":0}'>
                    <span>__COLUMN__</span>&nbsp;
                    <span class="sorting sorting-loading">
                        <img class="imgLoader" src="/img/adminlte/loader.svg" width="14" height="14"/>
                    </span>
                    <span class="sorting sorting-default text-muted">
                        <i class="fa fa-caret-down"></i>
                    </span>
                    <span class="sorting sorting-desc text-primary">
                        <i class="fa fa-caret-down"></i>
                    </span>
                    <span class="sorting sorting-asc text-primary">
                        <i class="fa fa-caret-up"></i>
                    </span>
                </button>
            </th>
        </script>
        <script type="text/html" id="thLastRecordTemplate">
            <th>
                <span>__COLUMN__</span>&nbsp;
            </th>
        </script>
        <script type="text/html" id="thButtonTemplate">
            <th class="text-center th-btn-1">
                <button type="button"
                    id="buttonNew__MODEL__"
                    data-href="/{{ config('adminlte.main_folder') }}/__MODEL_LOWERCASE__/edit/new"
                    class="btn btn-primary btn-xs btn-on-table show_by_permission">
                    <i class="fa fa-plus"></i> <span class="hidden-xxs">{{ __('Add') }}</span>
                </button>
                <button type="button"
                    id="buttonDelete__MODEL__"
                    href="javascript:void(0);"
                    class="btn btn-danger btn-xs btn-on-table button-model-delete show_by_permission"
                    data-target-input="formDelete__MODEL__-idcsv"
                    data-tbody-id="tbody__MODEL__RecordList"
                    data-model="__MODEL__"
                    style="display:none;">
                    <i class="fa fa-trash"></i> <span class="hidden-xxs">{{ __('Delete') }}</span> <span class="selected-count"></span>
                </button>
            </th>
        </script>
        <script type="text/html" id="tdCheckboxTemplate">
            <td class="text-center show_by_permission">
                <div class="icheck-primary d-inline">
                    <input type="checkbox"
                        id="tbody__MODEL__RecordList-select_row__ID__"
                        data-model="__MODEL__"
                        data-object-id="__ID__"
                        class="select_row">
                    <label for="tbody__MODEL__RecordList-select_row__ID__"></label>
                </div>
            </td>
        </script>
        <script type="text/html" id="tdTemplate">
            <td>__VALUE__</td>
        </script>
        <script type="text/html" id="tdLastRecordTemplate">
            <td>__VALUE__</td>
        </script>
        <script type="text/html" id="tdButtonTemplate">
            <td class="text-center">
                <a class="btn btn-outline-primary btn-xs btn-on-table" href="/{{ config('adminlte.main_folder') }}/__MODEL_LOWERCASE__detail/@{{__URL_KEY__}}">
                    <i class="fa fa-info-circle"></i> <span class="hidden-xxs">{{ __('Detail') }}</span>
                </a>
            </td>
        </script>
    </div>
    <script src="/js/adminlte/app.js"></script>
    <script src="/js/adminlte/custom.js"></script>
</body>
</html>