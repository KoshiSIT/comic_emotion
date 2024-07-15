import csv from "csvtojson";
import * as fs from "fs";

const csvFilePath = "../../static/csv/emotion.csv";
const jsonFilePath = "../../static/json/emotion.json";

const convertCsvToJson = async () => {
  try {
    const jsonObj = await csv().fromFile(csvFilePath);
    fs.writeFile(jsonFilePath, JSON.stringify(jsonObj, null, 2), (err: any) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been saved.");
      }
    });
  } catch (err) {
    console.error("Error converting CSV to JSON:", err);
  }
};

convertCsvToJson();
