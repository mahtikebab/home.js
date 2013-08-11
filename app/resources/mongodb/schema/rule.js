var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var RuleCondition = new Schema({
    before: {
        delay: {type: Number, default: 0}
    },
    script: {type: String }, //
    after: {
        delay: {type: Number, default: 0}
    }
});
var RuleAction = new Schema({
    action: {type: String}, //Action uuid
});
var Rule = new Schema({
    uuid : {type: String, index: true},
    name  :  { type: String, required: true },
    created: {
        user: {type: String},
        timestamp: {type: Date, default: Date.now}
    },
    modified: {
        user: {type: String},
        timestamp: {type: Date, default: Date.now}
    },
    device :  { type: String },
    conditions: [ RuleCondition ],
    actions: [RuleAction]
}).pre('save', function (next) {
   if( this.isNew )
    this.uuid = uuid.v1();
   next();
});

module.exports = Rule;