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

(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define(["./bglib-errors"], factory);
  } else {
    module.exports = factory(require("./bglib-errors"));
  }
}(this, function(errorHandler) {

    var isNode = typeof Buffer !== "undefined";

    function readUInt16LE(arr, offset) {
      return isNode ? arr.readUInt16LE(offset) : new DataView(arr.buffer).getInt16(offset, true);
    }

    function readUInt8(arr, offset) {
      return isNode ? arr.readUInt8(offset) : new DataView(arr.buffer).getUint8(offset);
    }

    function readInt8(arr, offset) {
      return isNode ? arr.readInt8(offset) : new DataView(arr.buffer).getInt8(offset);
    }


    /***************************************
    *		SYSTEM RESPONSES
    ****************************************/
    var _bgResponseReset = function(params) {
        this.dfu = readUInt8(params,0);
    }
    var _bgResponseHello = function(params) {

    }
    var _bgResponseAddressGet = function(params) {
        this.address = params;
    }

    var _bgResponseGetCounters = function(params) {
        this.txok = readUInt8(params,0);
        this.txretry = readUInt8(params,1);
        this.rxok = readUInt8(params,2);
        this.rxfail = readUInt8(params,3);
        this.mbuf = readUInt8(params,4);
    }

    var _bgResponseGetConnections = function(params) {
        this.maxconn = readUInt8(params,0);
    }

    var _bgResponseGetInfo = function(params) {
        this.major = readUInt16LE(params,0)
        this.minor = readUInt16LE(params,2)
        this.patch = readUInt16LE(params,4)
        this.build = readUInt16LE(params,6)
        this.llversion = readUInt16LE(params,8)
        this.protocol_version = readUInt8(params,10);
        this.hw = readUInt8(params,11);
    }

    var _bgResponseEndpointTx = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }

    var _bgResponseWhitelistAppend = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseWhitelistRemove = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseWhitelistClear = function(params) {

    }
    var _bgResponseEndpointRx = function(params) {
        this.result  = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.size = readUInt8(params,2);
    }
    var _bgResponseSetWatermarks = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }

    /***************************************
    *		PS RESPONSES
    ****************************************/

    var _bgResponsePSDefrag = function(params) {

    }
    var _bgResponsePSDump = function(params) {

    }
    var _bgResponsePSEraseAll = function(params) {

    }
    var _bgResponsePSSave = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponsePSLoad = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.value = params.slice(3, 3 + params[2]);
    }
    var _bgResponsePSErase = function(params) {

    }

    /***************************************
    *		Attribute Database
    ****************************************/
    var _bgResponseAttributesWrite = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseAttributesRead = function(params) {
        this.handle = readUInt16LE(params,0)
        this.offset = readUInt16LE(params,2)
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,4));
        this.value = params.slice(7, 7 + params[6]);
    }
    var _bgResponseAttributesReadType = function(params) {
        this.handle = readUInt16LE(params,0)
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,2));
        this.value = params.slice(5, 5 + params[4]);
    }
    var _bgResponseAttributesUserReadResponse= function(params) {

    }
    var _bgResponseAttributesUserWriteResponse = function(params) {

    }

    /***************************************
    *		Connection
    ****************************************/
    var _bgResponseConnectionDisconnect = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseConnectionGetRSSI = function(params) {
        this.connection = readUInt8(params,0);
        this.rssi = readInt8(params,(1);
    }
    var _bgResponseConnectionUpdate = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseConnectionVersionUpdate = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }

    var _bgResponseConnectionGetStatus = function(params) {
        this.connection = readUInt8(params,0);
    }

    /***************************************
    *		Attribute Client
    ****************************************/
    var _bgResponseAttClientFindByTypeValue = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientReadByGroupType = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientReadByType = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientFindInformation = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));

    }
    var _bgResponseAttClientReadByHandle = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientAttributeWrite = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientWriteCommand = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientIndicateConfirm = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseAttClientReadLong = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientPrepareWrite = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientExecuteWrite = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseAttClientReadMultiple = function(params) {
        this.connection = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }

    /***************************************
    *		Security Manager
    ****************************************/
    var _bgResponseSMEncryptStart = function(params) {
        this.handle = readUInt8(params,0);
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,1));
    }
    var _bgResponseSMSetBondableMode = function(params) {

    }
    var _bgResponseSMDeleteBonding = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseSMPasskeyEntry = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseSMGetBonds = function(params) {
        this.bonds = readUInt8(params,0);
    }
    var _bgResponseSMSetOOBData = function(params) {

    }

    var _bgResponsesSetParameters = function(params) {

    }

    /***************************************
    *		Generic Access Profile
    ****************************************/
    var _bgResponseGAPSetPrivacyFlags = function(params) {

    }
    var _bgResponseGAPSetMode = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPDiscover= function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPConnectDirect = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.connection_handle = readUInt8(params,2);
    }
    var _bgResponseGAPEndProcedure = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPConnectSelective = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.connection_handle = readUInt8(params,2);
    }
    var _bgResponseGAPSetFiltering = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPSetScanParameters = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPSetAdvParameters = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPSetAdvData = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseGAPSetDirectedConnectableMode = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }

    /***************************************
    *			Hardware
    ****************************************/
    var _bgResponseHWIOPortConfigIRQ = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWSetSoftTimer = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWADCRead = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWIOPortConfigDirection = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWIOPortConfigFunction = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWIOPortConfigPull = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWIOPortWrite = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWIOPortRead = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.port = readUInt8(params,2);
        this.data = readUInt8(params,3);
    }
    var _bgResponseHWSPIConfig = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseHWIOSPITransfer = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.channel = readUInt8(params,2);
        this.data = params.slice(4, 4 + params[3]);
    }
    var _bgResponseHWI2CRead = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
        this.data = params.slice(3, 3 + params[2]);
    }
    var _bgResponseHWI2CWrite = function(params) {
        this.written = readUInt8(params,0);
    }
    var _bgResponseHWSetTxPower = function(params) {

    }
    var _bgResponseHWTimerComparator = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }

    /***************************************
    *			Test
    ****************************************/
    var _bgResponseTestChannelMode = function(params) {

    }

    var _bgResponseTestGetChannelMap = function(params) {
        this.channel_map = readUInt8(params,0);
    }

    /***************************************
    *			DFU
    ****************************************/
    var _bgResponseDFUFlashSetAddress = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseDFUFlashUpload = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }
    var _bgResponseDFUFlashUploadFinish = function(params) {
        this.result = errorHandler.getErrorFromCode(readUInt16LE(params,0));
    }

    /***************************************
    *			Test
    ****************************************/
    var _bgResponstTestChannelMode = function(params) {

    }


    // Responses dict. Do not change the order of this. It will fuck things up
    // It's ordered by command id
    // TODO: Somehow link the indexes to the consts of BGLib.
    var Responses = {

        // System Repsonses
        0 	: 	[_bgResponseReset, _bgResponseHello, _bgResponseAddressGet,
        null, null, _bgResponseGetCounters,
        _bgResponseGetConnections, null, _bgResponseGetInfo,
        _bgResponseEndpointTx, _bgResponseWhitelistAppend, _bgResponseWhitelistRemove,
        _bgResponseWhitelistClear, _bgResponseEndpointRx, _bgResponseSetWatermarks],

        // Persistent Store Responses
        1 	: 	[_bgResponsePSDefrag, _bgResponsePSDump, _bgResponsePSEraseAll,
        _bgResponsePSSave, _bgResponsePSLoad, _bgResponsePSErase],

        // Attribute Database Responses
        2 	: 	[_bgResponseAttributesWrite, _bgResponseAttributesRead, _bgResponseAttributesReadType,
        _bgResponseAttributesUserReadResponse, _bgResponseAttributesUserWriteResponse],

        // Connection Responses
        3	: 	[_bgResponseConnectionDisconnect, _bgResponseConnectionGetRSSI, _bgResponseConnectionUpdate,
        _bgResponseConnectionVersionUpdate, null, null, null, _bgResponseConnectionGetStatus],

        // Attribute Client Responses
        4	: [_bgResponseAttClientFindByTypeValue, _bgResponseAttClientReadByGroupType, _bgResponseAttClientReadByType,
        _bgResponseAttClientFindInformation, _bgResponseAttClientReadByHandle, _bgResponseAttClientAttributeWrite,
        _bgResponseAttClientWriteCommand, _bgResponseAttClientIndicateConfirm, _bgResponseAttClientReadLong,
        _bgResponseAttClientPrepareWrite, _bgResponseAttClientExecuteWrite, _bgResponseAttClientReadMultiple],

        // Security Manager Responses
        5 	: 	[_bgResponseSMEncryptStart, _bgResponseSMSetBondableMode, _bgResponseSMDeleteBonding,
        _bgResponsesSetParameters, _bgResponseSMPasskeyEntry, _bgResponseSMGetBonds,
        _bgResponseSMSetOOBData],

        // GAP Responses
        6 	: 	[_bgResponseGAPSetPrivacyFlags, _bgResponseGAPSetMode, _bgResponseGAPDiscover,
        _bgResponseGAPConnectDirect, _bgResponseGAPEndProcedure,  _bgResponseGAPConnectSelective,
        _bgResponseGAPSetFiltering, _bgResponseGAPSetScanParameters, _bgResponseGAPSetAdvParameters,
        _bgResponseGAPSetAdvData, _bgResponseGAPSetDirectedConnectableMode],

        // Hardware Responses
        7	: 	[_bgResponseHWIOPortConfigIRQ, _bgResponseHWSetSoftTimer, _bgResponseHWADCRead,
        _bgResponseHWIOPortConfigDirection, _bgResponseHWIOPortConfigFunction, _bgResponseHWIOPortConfigPull,
        _bgResponseHWIOPortWrite, _bgResponseHWIOPortRead, _bgResponseHWSPIConfig,
        _bgResponseHWIOSPITransfer, _bgResponseHWI2CRead, _bgResponseHWI2CWrite,
        _bgResponseHWSetTxPower, _bgResponseHWTimerComparator],

        // Test Responses
        8 	: 	[null, null, null, null,_bgResponseTestGetChannelMap ,null ,_bgResponseTestChannelMode],

        // DFU Responses
        9	: 	[null, _bgResponseDFUFlashSetAddress, _bgResponseDFUFlashUpload,
        _bgResponseDFUFlashUploadFinish],

    }

    return {
        Responses: Responses
    }
}));
