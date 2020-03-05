"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var constants_1 = require("../utils/constants");
var drive_1 = __importDefault(require("../classes/drive"));
/**
 * Class with Windows specific logic to get disk info.
 */
var Windows = /** @class */ (function () {
    function Windows() {
    }
    /**
     * Execute specific Windows command to get disk info.
     *
     * @return {Drive[]} List of drives and their info.
     */
    Windows.run = function () {
        var drives = [];
        var buffer = child_process_1.execSync(constants_1.Constants.WINDOWS_COMMAND).toString();
        var lines = buffer.split('\r\r\n');
        var newDiskIteration = false;
        var caption = '';
        var description = '';
        var freeSpace = 0;
        var size = 0;
        var driveType = 0;
        var volumeName = '';
        lines.forEach(function (value) {
            if (value !== '') {
                var tokens = value.split('=');
                var section = tokens[0];
                var data = tokens[1];
                switch (section) {
                    case 'Caption':
                        caption = data;
                        newDiskIteration = true;
                        break;
                    case 'Description':
                        description = data;
                        break;
                    case 'FreeSpace':
                        freeSpace = isNaN(parseFloat(data)) ? 0 : +data;
                        break;
                    case 'Size':
                        size = isNaN(parseFloat(data)) ? 0 : +data;
                        break;
                    case 'DriveType':
                        driveType = isNaN(parseFloat(data)) ? 0 : +data;
                        break;
                    case 'VolumeName':
                        volumeName = data;
                        break;
                }
            }
            else {
                if (newDiskIteration) {
                    var used = (size - freeSpace);
                    var percent = '0%';
                    if (size > 0) {
                        percent = Math.round((used / size) * 100) + '%';
                    }
                    var d = new drive_1.default(description, size, used, freeSpace, percent, caption, driveType == 2, volumeName);
                    drives.push(d);
                    newDiskIteration = false;
                    caption = '';
                    description = '';
                    freeSpace = 0;
                    size = 0;
                    driveType = 0;
                    volumeName = '';
                }
            }
        });
        return drives;
    };
    return Windows;
}());
exports.Windows = Windows;
