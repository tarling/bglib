// Copyright 2014 Technical Machine, Inc. See the COPYRIGHT
// file at the top-level directory of this distribution.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

// Copyright 2014 Technical Machine, Inc. See the COPYRIGHT
// file at the top-level directory of this distribution.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

(function (root, deps, factory) {
  if(typeof define === "function" && define.amd) {
    define(deps, factory);
  } else {
    module.exports = factory.apply(deps.map(require));
  }
}(this, ["./bglib-errors", "./data-utils", "bleadvertise"], function(errorHandler, dataUtils, dataParser) {

    /***************************************
    *		SYSTEM Events
    ****************************************/
    var _bgEventSystemBoot = function(params) {
        this.major = dataUtils.readUInt16LE(params,0);
        this.minor = dataUtils.readUInt16LE(params,2);
        this.patch = dataUtils.readUInt16LE(params,4);
        this.build = dataUtils.readUInt16LE(params,6);
        this.ll_version = dataUtils.readUInt16LE(params,8);
        this.protocol_version = dataUtils.readUInt8(params,10);
        this.hw = dataUtils.readUInt8(params,11);
    }

    var _bgEventSystemEndpointWatermarkRx = function(params) {
        this.endpoint = dataUtils.readUInt8(params,0);
        this.data = dataUtils.readUInt8(params,1);
    }
    var _bgEventSystemEndpointWatermarkTx = function(params) {
        this.endpoint = dataUtils.readUInt8(params,0);
        this.data = dataUtils.readUInt8(params,1);
    }
    var _bgEventSystemScriptFailure = function(params) {
        this.address = dataUtils.readUInt16LE(params,0);
        this.reason = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,2));
    }
    var _bgEventSystemNoLicenseKey = function(params) {

    }
    var _bgEventSystemProtocolError = function(params) {
        this.reason = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,0));
    }

    /***************************************
    *		Persistent Storage Events
    ****************************************/

    var _bgEventFlashPSKey = function(params) {
        this.key = dataUtils.readUInt16LE(params,0);
        this.value = params.slice(3, params[2]);
    }

    /***************************************
    *		Attribute Database Events
    ****************************************/

    var _bgEventAttributesValue = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.reason = dataUtils.readUInt8(params,1);
        this.handle = dataUtils.readUInt16LE(params,2);
        this.offset = dataUtils.readUInt16LE(params,4);
        this.value = params.slice(7, 7 + params[6]);
    }
    var _bgEventAttributesUserReadRequest = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.handle = dataUtils.readUInt16LE(params,1);
        this.offset = dataUtils.readUInt16LE(params,3);
        this.maxsize =dataUtils.readUInt8(params,5);
    }
    var _bgEventAtributesStatus = function(params) {
        this.handle = dataUtils.readUInt16LE(params,0);
        this.flags = dataUtils.readUInt8(params,2);
    }
    /***************************************
    *		Connection Events
    ****************************************/
    var _bgEventConnectionStatus = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.flags = dataUtils.readUInt8(params,1);
        this.address = params.slice(2, 8);
        this.address_type = dataUtils.readUInt8(params,8);
        this.conn_interval = dataUtils.readUInt16LE(params,9);
        this.timeout = dataUtils.readUInt16LE(params,11);
        this.latency = dataUtils.readUInt16LE(params,13);
        this.bonding = dataUtils.readUInt8(params,15);
    }
    var _bgEventConnectionVersionInd = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.version_nr = dataUtils.readUInt8(params,1);
        this.comp_id = dataUtils.readUInt16LE(params,2);
        this.sub_vers_nr = dataUtils.readUInt16LE(params,4)
    }
    var _bgEventConnectionFeatureInd = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.features = params.slice(1, params.length);
    }

    var _bgEventConnectionDisconnected = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.reason = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,1));
    }

    /***************************************
    *		Attribute Client Events
    ****************************************/

    var _bgEventAttClientIndicated = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.attrhandle = dataUtils.readUInt16LE(params,1)
    }
    var _bgEventAttClientProcedureCompleted = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,1));
        this.chrhandle = dataUtils.readUInt16LE(params,3);
    }
    var _bgEventAttClientGroupFound = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.start = dataUtils.readUInt16LE(params,1);
        this.end = dataUtils.readUInt16LE(params,3);
        this.uuid = params.slice(6, 6 + params[5]);
    }

    var _bgEventAttClientFindInformationFound = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.chrhandle = dataUtils.readUInt16LE(params,1);
        this.uuid = params.slice(4, 4 + params[3]);
    }
    var _bgEventAttClientAttributeValue = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.atthandle = dataUtils.readUInt16LE(params,1);
        this.type = dataUtils.readUInt8(params,3);
        this.value = params.slice(5, 5 + params[4]);
    }
    var _bgEventAttClientReadMultipleResponse = function(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.handles = params.slice(2, 2 + params[1]);
    }
    /***************************************
    *		Security Manager Events
    ****************************************/
    var _bgEventSMBondingFail = function(params) {
        this.handle = dataUtils.readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,1));
    }
    var _bgEventSMPasskeyDisplay = function(params) {
        this.handle = dataUtils.readUInt8(params,0);
        this.passkey = dataUtils.readUInt32LE(params,1);
    }
    var _bgEventSMPasskeyRequest = function(params) {
        this.handle = dataUtils.readUInt8(params,0);
    }
    var _bgEventSMBondStatus = function(params) {
        this.bond = dataUtils.readUInt8(params,0);
        this.keysize = dataUtils.readUInt8(params,1);
        this.mitm = dataUtils.readUInt8(params,2);
        this.keys = dataUtils.readUInt8(params,3);
    }
    /***************************************
    *		GAP Events
    ****************************************/
    var _bgEventGAPScanResponse = function(params) {
        this.rssi = dataUtils.readInt8(params,0);
        this.packet_type = dataUtils.readUInt8(params,1);
        this.sender = params.slice(2, 8);
        this.address_type = dataUtils.readUInt8(params,8);
        this.bond = dataUtils.readUInt8(params,9);
        this.data = dataParser.parseBE(params.slice(10, params.length));
    }
    /***************************************
    *		Hardware Events
    ****************************************/
    var _bgEventHWIOPortStatus = function(params){
        this.timestamp = dataUtils.readUInt32LE(params,0);
        this.port = dataUtils.readUInt8(params,4);
        this.irq = dataUtils.readUInt8(params,5);
        this.state = dataUtils.readInt8(params, 6);
    }
    var _bgEventhWSoftTimer = function(params) {
        this.handle = dataUtils.readUint8(params, 0)
    }

    var _bgEventHWADCResult = function(params) {
        this.input = dataUtils.readUInt8(params,0);
        this.value = dataUtils.readInt16LE(params, 1);
    }

    /***************************************
    *		DFU Events
    ****************************************/
    var _bgEventDFUBoot = function(params) {
        this.version = dataUtils.readUInt32LE(params,0);
    }

    var Events = {
        // System Events
        0: [_bgEventSystemBoot, null, _bgEventSystemEndpointWatermarkRx,
    _bgEventSystemEndpointWatermarkTx, _bgEventSystemScriptFailure, _bgEventSystemNoLicenseKey,
    _bgEventSystemProtocolError],

        // PS Events
        1: [_bgEventFlashPSKey],

        // Attribute Database Events
        2: [_bgEventAttributesValue, _bgEventAttributesUserReadRequest, _bgEventAtributesStatus],

        // Connection Events
        3: [_bgEventConnectionStatus, _bgEventConnectionVersionInd,  _bgEventConnectionFeatureInd,
        null, _bgEventConnectionDisconnected],

        // Attribute Client Events
        4: [_bgEventAttClientIndicated, _bgEventAttClientProcedureCompleted,_bgEventAttClientGroupFound,
        null, _bgEventAttClientFindInformationFound, _bgEventAttClientAttributeValue,
        _bgEventAttClientReadMultipleResponse],

        // Security Manager Events
        5: [null, _bgEventSMBondingFail, _bgEventSMPasskeyDisplay,
        _bgEventSMPasskeyRequest, _bgEventSMBondStatus],

        // GAP Events
        6: [_bgEventGAPScanResponse],

        // Hardware Events
        7: [_bgEventHWIOPortStatus, _bgEventhWSoftTimer, _bgEventHWADCResult],

        8: null,

        9: [_bgEventDFUBoot]
    }

    return {
        Events: Events
    }
}));
