var _ = require('lodash');
var DiffMatchPatch = require('diff-match-patch');
var dmp = new DiffMatchPatch();

module.exports = VersionableText;

function VersionableText (text) {
  this.text = text;
  this.versions = [];
}

VersionableText.prototype = {
  addVersion: addVersion,
  getVersion: getVersion,
  getLatest: getLatest,
  getLastVersionNumber: getLastVersionNumber,
  getPatchesUntil: getPatchesUntil,
  buildPatches: buildPatches
};

function addVersion (text, num) {
  var number = num || this.getLastVersionNumber() + 1;
  var patches = this.buildPatches(number, text);
  this.versions.push({ number: number, patches: patches });
}

function getVersion (number) {
  var patches = this.getPatchesUntil(number);
  if (!patches.length) return;
  return _.first(dmp.patch_apply(patches, this.text));
}

function getLatest () {
  return this.getVersion(this.getLastVersionNumber());
}

function getLastVersionNumber () {
  return _.chain(this.versions).max('number').result('number').value() || 0;
}

function getPatchesUntil (number) {
  return _(this.versions).filter(underVersion).pluck('patches').flatten().value();

  function underVersion (version) {
    return version.number <= number;
  }
}

function buildPatches (number, text) {
  var previousText = this.getVersion(number) || this.text;
  var diff = dmp.diff_main(previousText, text);
  return dmp.patch_make(previousText, text, diff);
}

