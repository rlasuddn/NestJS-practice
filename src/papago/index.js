//파파고 api 예제
var express = require("express")
var app = express()
var client_id = "YOUR_CLIENT_ID"
var client_secret = "YOUR_CLIENT_SECRET"
var query = "번역할 문장을 입력하세요."
app.get("/translate", function (req, res) {
    var api_url = "https://openapi.naver.com/v1/papago/n2mt"
    var request = require("request")
    var options = {
        url: api_url,
        form: { source: "ko", target: "en", text: query },
        headers: { "X-Naver-Client-Id": client_id, "X-Naver-Client-Secret": client_secret },
    }
    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" })
            res.end(body)
        } else {
            res.status(response.statusCode).end()
            console.log("error = " + response.statusCode)
        }
    })
})
// const text = "I'm from U.S.A. This is a sentence. So is this one.";
// const sentences = text.split(/\b\.\s+\b/);

// console.log(sentences);
// // output: ["I'm from U.S.A.", "This is a sentence.", "So is this one."]
