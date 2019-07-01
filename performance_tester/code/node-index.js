// @ts-nocheck
const maxAPI = require('max-api');
const { MESSAGE_TYPES } = maxAPI

maxAPI.addHandler(MESSAGE_TYPES.BANG, maxAPI.outletBang);

