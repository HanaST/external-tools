var glimpse = angular.module("glimpse", ["ngResource", "ngAnimate", "vAccordion"]);

glimpse.controller("mainCtrl", function ($rootScope, $scope, $window, $timeout, AtomsFactory) {
    // Global vars
    var divDockManager, dockManager;
    var toolboxPanel, atomDetailsPanel, terminalPanel, threeDPanel, jsonPanel, planarPanel, schemePanel, tabularPanel, filtersPanel, settingsPanel;
    var documentManagerNode, toolboxNode, jsonNode, threeDNode, terminalNode, planarNode, atomDetailsNode, settingsDialog, filtersDialog;

    var planarView1;

    // Functions
    $scope.getAtoms = function () {
        AtomsFactory.pullAtoms(function () {
            $scope.atoms = AtomsFactory.atoms;
        });
    };

    var panelResized = function () {
        $scope.settings.planar.size = {
            width: planarView1.getBoundingClientRect().width,
            height: planarView1.getBoundingClientRect().height
        };
    };

    // Event Handlers
    $window.onresize = function (e) {
        dockManager.resize(window.innerWidth - (divDockManager.clientLeft + divDockManager.offsetLeft), window.innerHeight - (divDockManager.clientTop + divDockManager.offsetTop));
    };

    // Onload event handler
    $window.onload = function () {
        // Init dockManager
        divDockManager = document.getElementById("dock_manager");
        dockManager = new dockspawn.DockManager(divDockManager);
        dockManager.initialize();

        $window.onresize();

        // Create PanelContainers
        toolboxPanel = new dockspawn.PanelContainer(document.getElementById("toolbox_panel"), dockManager);
        atomDetailsPanel = new dockspawn.PanelContainer(document.getElementById("atom_details_panel"), dockManager);
        terminalPanel = new dockspawn.PanelContainer(document.getElementById("terminal_panel"), dockManager);
        threeDPanel = new dockspawn.PanelContainer(document.getElementById("three_d_panel"), dockManager);
        jsonPanel = new dockspawn.PanelContainer(document.getElementById("json_panel"), dockManager);
        planarPanel = new dockspawn.PanelContainer(document.getElementById("planar_panel"), dockManager);
        schemePanel = new dockspawn.PanelContainer(document.getElementById("scheme_panel"), dockManager);
        tabularPanel = new dockspawn.PanelContainer(document.getElementById("tabular_panel"), dockManager);
        filtersPanel = new dockspawn.PanelContainer(document.getElementById("filters_panel"), dockManager);
        settingsPanel = new dockspawn.PanelContainer(document.getElementById("settings_panel"), dockManager);

        // Dock windows
        documentManagerNode = dockManager.context.model.documentManagerNode;

        jsonNode = dockManager.dockFill(documentManagerNode, jsonPanel);
        //threeDNode = dockManager.dockFill(documentManagerNode, threeDPanel);
        planarNode = dockManager.dockFill(documentManagerNode, planarPanel);
        //dockManager.dockFill(documentManagerNode, scheme_window);
        //dockManager.dockFill(documentManagerNode, tabular_window);
        terminalNode = dockManager.dockDown(documentManagerNode, terminalPanel, 0.2);
        toolboxNode = dockManager.dockLeft(documentManagerNode, toolboxPanel);
        atomDetailsNode = dockManager.dockRight(documentManagerNode, atomDetailsPanel);

        // Init frequently used DOM elements
        planarView1 = document.getElementById("planar-view-1");

        // Translate jquery events into angular
        $(document)
            .on("dockspawn.panelResized", function (event) {
                if (event.sender == planarPanel)
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast("panelResized");
                    });
            })
            .on("dockspawn.panelUndock", function (event) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast("panelUndock");
                });
            });

        $timeout(panelResized);


        //$scope.showPanel('planar_settings');
    };


    $scope.$on('panelResized', panelResized);
    $scope.$on('panelUndock', function () {
        $timeout(panelResized);
    });

    $scope.showPanel = function (panel) {
        if (panel == 'filters') {
            filtersDialog = new dockspawn.Dialog(filtersPanel, dockManager);
            filtersDialog.setPosition(window.innerWidth - filtersPanel._cachedWidth, window.innerHeight - filtersPanel._cachedHeight);
        } else if (panel == 'planar_settings') {
            settingsDialog = new dockspawn.Dialog(settingsPanel, dockManager);
            settingsDialog.setPosition(window.innerWidth - settingsPanel._cachedWidth, window.innerHeight - settingsPanel._cachedHeight);
        }
    };


    // Init
    $scope.atoms = [];
    $scope.tool = "select";
    $scope.settings = {
        planar: {
            size: {width: 0, height: 0},
            force: {
                charge: -300,
                friction: 10,
                linkStrength: 0,
                linkDistance: 20,
                gravity: 0.15
            }
        }
    };
    $scope.selectedIndices = [];
    $scope.filter = [];


    $scope.getAtoms();
})
;