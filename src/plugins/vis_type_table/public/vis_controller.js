"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const angular_1 = tslib_1.__importDefault(require("angular"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const get_inner_angular_1 = require("./get_inner_angular");
const table_vis_legacy_module_1 = require("./table_vis_legacy_module");
const innerAngularName = 'kibana/table_vis';
function getTableVisualizationControllerClass(core, context) {
    return class TableVisualizationController {
        constructor(domeElement, vis) {
            this.$rootScope = null;
            this.el = jquery_1.default(domeElement);
            this.vis = vis;
        }
        getInjector() {
            if (!this.injector) {
                const mountpoint = document.createElement('div');
                mountpoint.setAttribute('style', 'height: 100%; width: 100%;');
                this.injector = angular_1.default.bootstrap(mountpoint, [innerAngularName]);
                this.el.append(mountpoint);
            }
            return this.injector;
        }
        async initLocalAngular() {
            if (!this.tableVisModule) {
                const [coreStart] = await core.getStartServices();
                this.tableVisModule = get_inner_angular_1.getAngularModule(innerAngularName, coreStart, context);
                table_vis_legacy_module_1.initTableVisLegacyModule(this.tableVisModule);
            }
        }
        async render(esResponse, visParams) {
            await this.initLocalAngular();
            return new Promise(async (resolve, reject) => {
                if (!this.$rootScope) {
                    const $injector = this.getInjector();
                    this.$rootScope = $injector.get('$rootScope');
                    this.$compile = $injector.get('$compile');
                }
                const updateScope = () => {
                    if (!this.$scope) {
                        return;
                    }
                    this.$scope.vis = this.vis;
                    this.$scope.visState = { params: visParams };
                    this.$scope.esResponse = esResponse;
                    this.$scope.visParams = visParams;
                    this.$scope.renderComplete = resolve;
                    this.$scope.renderFailed = reject;
                    this.$scope.resize = Date.now();
                    this.$scope.$apply();
                };
                if (!this.$scope && this.$compile) {
                    this.$scope = this.$rootScope.$new();
                    this.$scope.uiState = this.vis.getUiState();
                    updateScope();
                    this.el.find('div').append(this.$compile(this.vis.type.visConfig.template)(this.$scope));
                    this.$scope.$apply();
                }
                else {
                    updateScope();
                }
            });
        }
        destroy() {
            if (this.$rootScope) {
                this.$rootScope.$destroy();
                this.$rootScope = null;
            }
        }
    };
}
exports.getTableVisualizationControllerClass = getTableVisualizationControllerClass;
