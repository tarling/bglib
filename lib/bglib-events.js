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
    module.exports = factory.apply(root, deps.map(require));
  }
}(this, ["./bglib-errors", "buffer-data-utils", "bleadvertise"], function(errorHandler, dataUtils, dataParser) {

    /***************************************
    *		SYSTEM Events
    ****************************************/
    function _bgEventSystemBoot(params) {
        this.major = dataUtils.readUInt16LE(params,0);
        this.minor = dataUtils.readUInt16LE(params,2);
        this.patch = dataUtils.readUInt16LE(params,4);
        this.build = dataUtils.readUInt16LE(params,6);
        this.ll_version = dataUtils.readUInt16LE(params,8);
        this.protocol_version = dataUtils.readUInt8(params,10);
        this.hw = dataUtils.readUInt8(params,11);
    }

    function _bgEventSystemEndpointWatermarkRx(params) {
        this.endpoint = dataUtils.readUInt8(params,0);
        this.data = dataUtils.readUInt8(params,1);
    }
    function _bgEventSystemEndpointWatermarkTx(params) {
        this.endpoint = dataUtils.readUInt8(params,0);
        this.data = dataUtils.readUInt8(params,1);
    }
    function _bgEventSystemScriptFailure(params) {
        this.address = dataUtils.readUInt16LE(params,0);
        this.reason = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,2));
    }
    function _bgEventSystemNoLicenseKey(params) {

    }
    function _bgEventSystemProtocolError(params) {
        this.reason = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,0));
    }

    /***************************************
    *		Persistent Storage Events
    ****************************************/

    function _bgEventFlashPSKey(params) {
        this.key = dataUtils.readUInt16LE(params,0);
        this.value = params.slice(3, params[2]);
    }

    /***************************************
    *		Attribute Database Events
    ****************************************/

    function _bgEventAttributesValue(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.reason = dataUtils.readUInt8(params,1);
        this.handle = dataUtils.readUInt16LE(params,2);
        this.offset = dataUtils.readUInt16LE(params,4);
        this.value = params.slice(7, 7 + params[6]);
    }
    function _bgEventAttributesUserReadRequest(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.handle = dataUtils.readUInt16LE(params,1);
        this.offset = dataUtils.readUInt16LE(params,3);
        this.maxsize =dataUtils.readUInt8(params,5);
    }
    function _bgEventAtributesStatus(params) {
        this.handle = dataUtils.readUInt16LE(params,0);
        this.flags = dataUtils.readUInt8(params,2);
    }
    /***************************************
    *		Connection Events
    ****************************************/
    function _bgEventConnectionStatus(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.flags = dataUtils.readUInt8(params,1);
        this.address = params.slice(2, 8);
        this.address_type = dataUtils.readUInt8(params,8);
        this.conn_interval = dataUtils.readUInt16LE(params,9);
        this.timeout = dataUtils.readUInt16LE(params,11);
        this.latency = dataUtils.readUInt16LE(params,13);
        this.bonding = dataUtils.readUInt8(params,15);
    }
    function _bgEventConnectionVersionInd(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.version_nr = dataUtils.readUInt8(params,1);
        this.comp_id = dataUtils.readUInt16LE(params,2);
        this.sub_vers_nr = dataUtils.readUInt16LE(params,4)
    }
    function _bgEventConnectionFeatureInd(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.features = params.slice(1, params.length);
    }

    function _bgEventConnectionDisconnected(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.reason = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,1));
    }

    /***************************************
    *		Attribute Client Events
    ****************************************/

    function _bgEventAttClientIndicated(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.attrhandle = dataUtils.readUInt16LE(params,1)
    }
    function _bgEventAttClientProcedureCompleted(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,1));
        this.chrhandle = dataUtils.readUInt16LE(params,3);
    }
    function _bgEventAttClientGroupFound(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.start = dataUtils.readUInt16LE(params,1);
        this.end = dataUtils.readUInt16LE(params,3);
        this.uuid = params.slice(6, 6 + params[5]);
    }

    function _bgEventAttClientFindInformationFound(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.chrhandle = dataUtils.readUInt16LE(params,1);
        this.uuid = params.slice(4, 4 + params[3]);
    }
    function _bgEventAttClientAttributeValue(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.atthandle = dataUtils.readUInt16LE(params,1);
        this.type = dataUtils.readUInt8(params,3);
        this.value = params.slice(5, 5 + params[4]);
    }
    function _bgEventAttClientReadMultipleResponse(params) {
        this.connection = dataUtils.readUInt8(params,0);
        this.handles = params.slice(2, 2 + params[1]);
    }
    /***************************************
    *		Security Manager Events
    ****************************************/
    function _bgEventSMBondingFail(params) {
        this.handle = dataUtils.readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(dataUtils.readUInt16LE(params,1));
    }
    function _bgEventSMPasskeyDisplay(params) {
        this.handle = dataUtils.readUInt8(params,0);
        this.passkey = dataUtils.readUInt32LE(params,1);
    }
    function _bgEventSMPasskeyRequest(params) {
        this.handle = dataUtils.readUInt8(params,0);
    }
    function _bgEventSMBondStatus(params) {
        this.bond = dataUtils.readUInt8(params,0);
        this.keysize = dataUtils.readUInt8(params,1);
        this.mitm = dataUtils.readUInt8(params,2);
        this.keys = dataUtils.readUInt8(params,3);
    }
    /***************************************
    *		GAP Events
    ****************************************/

    function ua2hexArr(ua) {
        var h = [];
        for (var i = 0; i < ua.length; i++) {
            h.push(ua[i].toString(16));
        }
        return h;
    }


    function _bgEventGAPScanResponse(params) {
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
    function _bgEventHWIOPortStatus(params){
        this.timestamp = dataUtils.readUInt32LE(params,0);
        this.port = dataUtils.readUInt8(params,4);
        this.irq = dataUtils.readUInt8(params,5);
        this.state = dataUtils.readInt8(params, 6);
    }
    function _bgEventhWSoftTimer(params) {
        this.handle = dataUtils.readUint8(params, 0)
    }

    function _bgEventHWADCResult(params) {
        this.input = dataUtils.readUInt8(params,0);
        this.value = dataUtils.readInt16LE(params, 1);
    }

    /***************************************
    *		DFU Events
    ****************************************/
    function _bgEventDFUBoot(params) {
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
