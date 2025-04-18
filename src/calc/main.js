let rawData = ``

let lines = rawData.trim().split("\n")
let headerLines = lines.shift()
let dataLines = lines;


let headers = headerLines.split(",")

let processedData = dataLines.map(line => {
    let values = line.split(',')
    let rowObject = {}

    headers.forEach((header,index) => {
        let stringValue = values[index]
        let processedValue;
        if (header === "Residential" || header === "Business" || header === "Total") {
            processedValue = parseInt(stringValue, 10)
        } else if (header === "Age: 25-34") {
            processedValue = parseFloat(stringValue.replace("%", "")) / 100
        } else if (header === "Size" || header === "Cost") {
            processedValue = parseFloat(stringValue.replace("$", ""))
        } else if (header === "Income") {
            processedValue = parseFloat(stringValue.replace("$", "").replace("k", "")) * 1000
        } else {
            processedValue = stringValue
        }
        rowObject[header] = processedValue
    })

    return rowObject;
})

console.log(processedData)

