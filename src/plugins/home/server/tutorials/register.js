"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const system_logs_1 = require("./system_logs");
const system_metrics_1 = require("./system_metrics");
const apache_logs_1 = require("./apache_logs");
const apache_metrics_1 = require("./apache_metrics");
const elasticsearch_logs_1 = require("./elasticsearch_logs");
const iis_logs_1 = require("./iis_logs");
const kafka_logs_1 = require("./kafka_logs");
const logstash_logs_1 = require("./logstash_logs");
const nginx_logs_1 = require("./nginx_logs");
const nginx_metrics_1 = require("./nginx_metrics");
const mysql_logs_1 = require("./mysql_logs");
const mysql_metrics_1 = require("./mysql_metrics");
const mongodb_metrics_1 = require("./mongodb_metrics");
const osquery_logs_1 = require("./osquery_logs");
const php_fpm_metrics_1 = require("./php_fpm_metrics");
const postgresql_metrics_1 = require("./postgresql_metrics");
const postgresql_logs_1 = require("./postgresql_logs");
const rabbitmq_metrics_1 = require("./rabbitmq_metrics");
const redis_logs_1 = require("./redis_logs");
const redis_metrics_1 = require("./redis_metrics");
const suricata_logs_1 = require("./suricata_logs");
const docker_metrics_1 = require("./docker_metrics");
const kubernetes_metrics_1 = require("./kubernetes_metrics");
const uwsgi_metrics_1 = require("./uwsgi_metrics");
const netflow_1 = require("./netflow");
const traefik_logs_1 = require("./traefik_logs");
const ceph_metrics_1 = require("./ceph_metrics");
const aerospike_metrics_1 = require("./aerospike_metrics");
const couchbase_metrics_1 = require("./couchbase_metrics");
const dropwizard_metrics_1 = require("./dropwizard_metrics");
const elasticsearch_metrics_1 = require("./elasticsearch_metrics");
const etcd_metrics_1 = require("./etcd_metrics");
const haproxy_metrics_1 = require("./haproxy_metrics");
const kafka_metrics_1 = require("./kafka_metrics");
const kibana_metrics_1 = require("./kibana_metrics");
const memcached_metrics_1 = require("./memcached_metrics");
const munin_metrics_1 = require("./munin_metrics");
const vsphere_metrics_1 = require("./vsphere_metrics");
const windows_metrics_1 = require("./windows_metrics");
const windows_event_logs_1 = require("./windows_event_logs");
const golang_metrics_1 = require("./golang_metrics");
const logstash_metrics_1 = require("./logstash_metrics");
const prometheus_metrics_1 = require("./prometheus_metrics");
const zookeeper_metrics_1 = require("./zookeeper_metrics");
const uptime_monitors_1 = require("./uptime_monitors");
const cloudwatch_logs_1 = require("./cloudwatch_logs");
const aws_metrics_1 = require("./aws_metrics");
const mssql_metrics_1 = require("./mssql_metrics");
const nats_metrics_1 = require("./nats_metrics");
const nats_logs_1 = require("./nats_logs");
const zeek_logs_1 = require("./zeek_logs");
const coredns_metrics_1 = require("./coredns_metrics");
const coredns_logs_1 = require("./coredns_logs");
const auditbeat_1 = require("./auditbeat");
const iptables_logs_1 = require("./iptables_logs");
const cisco_logs_1 = require("./cisco_logs");
const envoyproxy_logs_1 = require("./envoyproxy_logs");
const couchdb_metrics_1 = require("./couchdb_metrics");
const consul_metrics_1 = require("./consul_metrics");
const cockroachdb_metrics_1 = require("./cockroachdb_metrics");
const traefik_metrics_1 = require("./traefik_metrics");
const aws_logs_1 = require("./aws_logs");
const activemq_logs_1 = require("./activemq_logs");
const activemq_metrics_1 = require("./activemq_metrics");
const azure_metrics_1 = require("./azure_metrics");
const ibmmq_logs_1 = require("./ibmmq_logs");
const stan_metrics_1 = require("./stan_metrics");
const envoyproxy_metrics_1 = require("./envoyproxy_metrics");
const ibmmq_metrics_1 = require("./ibmmq_metrics");
const statsd_metrics_1 = require("./statsd_metrics");
const redisenterprise_metrics_1 = require("./redisenterprise_metrics");
const openmetrics_metrics_1 = require("./openmetrics_metrics");
const oracle_metrics_1 = require("./oracle_metrics");
exports.builtInTutorials = [
    system_logs_1.systemLogsSpecProvider,
    system_metrics_1.systemMetricsSpecProvider,
    apache_logs_1.apacheLogsSpecProvider,
    apache_metrics_1.apacheMetricsSpecProvider,
    elasticsearch_logs_1.elasticsearchLogsSpecProvider,
    iis_logs_1.iisLogsSpecProvider,
    kafka_logs_1.kafkaLogsSpecProvider,
    logstash_logs_1.logstashLogsSpecProvider,
    nginx_logs_1.nginxLogsSpecProvider,
    nginx_metrics_1.nginxMetricsSpecProvider,
    mysql_logs_1.mysqlLogsSpecProvider,
    mysql_metrics_1.mysqlMetricsSpecProvider,
    mongodb_metrics_1.mongodbMetricsSpecProvider,
    osquery_logs_1.osqueryLogsSpecProvider,
    php_fpm_metrics_1.phpfpmMetricsSpecProvider,
    postgresql_metrics_1.postgresqlMetricsSpecProvider,
    postgresql_logs_1.postgresqlLogsSpecProvider,
    rabbitmq_metrics_1.rabbitmqMetricsSpecProvider,
    redis_logs_1.redisLogsSpecProvider,
    redis_metrics_1.redisMetricsSpecProvider,
    suricata_logs_1.suricataLogsSpecProvider,
    docker_metrics_1.dockerMetricsSpecProvider,
    kubernetes_metrics_1.kubernetesMetricsSpecProvider,
    uwsgi_metrics_1.uwsgiMetricsSpecProvider,
    netflow_1.netflowSpecProvider,
    traefik_logs_1.traefikLogsSpecProvider,
    ceph_metrics_1.cephMetricsSpecProvider,
    aerospike_metrics_1.aerospikeMetricsSpecProvider,
    couchbase_metrics_1.couchbaseMetricsSpecProvider,
    dropwizard_metrics_1.dropwizardMetricsSpecProvider,
    elasticsearch_metrics_1.elasticsearchMetricsSpecProvider,
    etcd_metrics_1.etcdMetricsSpecProvider,
    haproxy_metrics_1.haproxyMetricsSpecProvider,
    kafka_metrics_1.kafkaMetricsSpecProvider,
    kibana_metrics_1.kibanaMetricsSpecProvider,
    memcached_metrics_1.memcachedMetricsSpecProvider,
    munin_metrics_1.muninMetricsSpecProvider,
    vsphere_metrics_1.vSphereMetricsSpecProvider,
    windows_metrics_1.windowsMetricsSpecProvider,
    windows_event_logs_1.windowsEventLogsSpecProvider,
    golang_metrics_1.golangMetricsSpecProvider,
    logstash_metrics_1.logstashMetricsSpecProvider,
    prometheus_metrics_1.prometheusMetricsSpecProvider,
    zookeeper_metrics_1.zookeeperMetricsSpecProvider,
    uptime_monitors_1.uptimeMonitorsSpecProvider,
    cloudwatch_logs_1.cloudwatchLogsSpecProvider,
    aws_metrics_1.awsMetricsSpecProvider,
    mssql_metrics_1.mssqlMetricsSpecProvider,
    nats_metrics_1.natsMetricsSpecProvider,
    nats_logs_1.natsLogsSpecProvider,
    zeek_logs_1.zeekLogsSpecProvider,
    coredns_metrics_1.corednsMetricsSpecProvider,
    coredns_logs_1.corednsLogsSpecProvider,
    auditbeat_1.auditbeatSpecProvider,
    iptables_logs_1.iptablesLogsSpecProvider,
    cisco_logs_1.ciscoLogsSpecProvider,
    envoyproxy_logs_1.envoyproxyLogsSpecProvider,
    couchdb_metrics_1.couchdbMetricsSpecProvider,
    consul_metrics_1.consulMetricsSpecProvider,
    cockroachdb_metrics_1.cockroachdbMetricsSpecProvider,
    traefik_metrics_1.traefikMetricsSpecProvider,
    aws_logs_1.awsLogsSpecProvider,
    activemq_logs_1.activemqLogsSpecProvider,
    activemq_metrics_1.activemqMetricsSpecProvider,
    azure_metrics_1.azureMetricsSpecProvider,
    ibmmq_logs_1.ibmmqLogsSpecProvider,
    ibmmq_metrics_1.ibmmqMetricsSpecProvider,
    stan_metrics_1.stanMetricsSpecProvider,
    envoyproxy_metrics_1.envoyproxyMetricsSpecProvider,
    statsd_metrics_1.statsdMetricsSpecProvider,
    redisenterprise_metrics_1.redisenterpriseMetricsSpecProvider,
    openmetrics_metrics_1.openmetricsMetricsSpecProvider,
    oracle_metrics_1.oracleMetricsSpecProvider,
];
