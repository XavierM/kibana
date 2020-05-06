"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const embeddable_root_1 = require("./embeddable_root");
class EmbeddableFactoryRenderer extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: undefined,
        };
    }
    componentDidMount() {
        const factory = this.props.getEmbeddableFactory(this.props.type);
        if (factory === undefined) {
            this.setState({
                loading: false,
                error: i18n_1.i18n.translate('embeddableApi.errors.factoryDoesNotExist', {
                    defaultMessage: 'Embeddable factory of {type} does not exist. Ensure all neccessary plugins are installed and enabled.',
                    values: {
                        type: this.props.type,
                    },
                }),
            });
            return;
        }
        factory.create(this.props.input).then(embeddable => {
            this.embeddable = embeddable;
            this.setState({ loading: false });
        });
    }
    render() {
        return (react_1.default.createElement(embeddable_root_1.EmbeddableRoot, { embeddable: this.embeddable, loading: this.state.loading, error: this.state.error }));
    }
}
exports.EmbeddableFactoryRenderer = EmbeddableFactoryRenderer;
