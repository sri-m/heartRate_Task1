"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
/* Problem Statement :
Calculate the minimum, maximum and median beats per minute and the latest data timestamp (timestamp of the last
measurement in the day) for each day. Output should look like this
[
{
"date": "2023-04-28”,
"min": 60,
"max": 119,
"median": 81,
"latestDataTimestamp": "2023-04-28T21:54:00"
}, …..
]
The output needs to be written to a file “output.json”.
*/
// Step 1: Read the input file
var inputFileName = "heartrate.json";
var measurements = readJsonFile(inputFileName);
// Step 2 : Group the measurements by date
var measurementByDataMap = {};
measurements.forEach(function (measurement) {
    var dateWithTime = measurement.timestamps.startTime.split('T');
    if (!measurementByDataMap[dateWithTime[0]]) {
        measurementByDataMap[dateWithTime[0]] = [];
    }
    measurementByDataMap[dateWithTime[0]].push(measurement);
});
// Step 3: Calculate statistics for each day
var finalResult = [];
var _loop_1 = function (date) {
    var beatsPerMinuteArray = [];
    var startTimeArray = [];
    var measurementsArray = measurementByDataMap[date];
    measurementsArray.forEach(function (element) {
        beatsPerMinuteArray.push(element.beatsPerMinute);
        startTimeArray.push(element.timestamps.startTime);
    });
    var min = Math.min.apply(Math, beatsPerMinuteArray);
    var max = Math.max.apply(Math, beatsPerMinuteArray);
    var median = calculateMedian(beatsPerMinuteArray);
    var latestDataTimestamp = calculateLatestTimeStamp(startTimeArray);
    finalResult.push({ date: date, min: min, max: max, median: median, latestDataTimestamp: latestDataTimestamp });
};
for (var date in measurementByDataMap) {
    _loop_1(date);
}
// Step 4 : Write the output file
var outputFile = 'output.json';
fs.writeFileSync(outputFile, JSON.stringify(finalResult));
console.log(finalResult);
/**
 * Reads the contents of a JSON file and returns the parsed data.
 * Throws an error if the file name is empty or if the file does not exist.
 * @param inputFileName The name of the JSON file to read.
 * @returns The parsed JSON data.
 * @throws {Error} If the file name is empty or if the file does not exist.
 */
function readJsonFile(inputFileName) {
    if (!inputFileName) {
        throw new Error("File name cannot be empty");
    }
    if (!fs.existsSync(inputFileName)) {
        throw new Error("File " + inputFileName + " does not exists!");
    }
    var rawData = fs.readFileSync('heartrate.json', 'utf8');
    return JSON.parse(rawData);
}
/**
 * Calculates the median value of an array of numbers.
 * @param {number[]} beatsPerMinuteArray - An array of numbers representing beats per minute.
 * @returns {number | null} The median value of the array, or null if the array is empty.
 */
function calculateMedian(beatsPerMinuteArray) {
    // Check if the array is empty
    if (beatsPerMinuteArray.length === 0) {
        return null;
    }
    // Sorting the array in ascending order
    beatsPerMinuteArray.sort(function (a, b) { return a - b; });
    var midIndex = Math.floor(beatsPerMinuteArray.length / 2);
    // If the array has odd length, return the middle element
    if (beatsPerMinuteArray.length % 2 === 1) {
        return beatsPerMinuteArray[midIndex];
    }
    else {
        // If the array has even length, return the average of the two middle elements
        return (beatsPerMinuteArray[midIndex - 1] + beatsPerMinuteArray[midIndex]) / 2;
    }
}
function calculateLatestTimeStamp(startTimeArray) {
    // Sort the timestamps in descending order
    var sortedTimestamps = startTimeArray.sort(function (a, b) { return new Date(b).getTime() - new Date(a).getTime(); });
    // Get the latest timestamp (first element after sorting)
    var latestTimestamp = sortedTimestamps[0];
    return latestTimestamp;
}
