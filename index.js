
var http=require("http");
var convert = require('xml-js'); 
//var parseString = require('xml2js').parseString;




//Q启动服务器
var server=new http.Server();
var action='reUploadData'
var resp='<root type="response" biz="'+action+'"><collector id="A1-4-1"><response><status>1</status><srvTime>'+formatDate()+'</srvTime><errorCode>200</errorCode></response></collector></root>'


// console.log("resp:"+resp)
server.on("request",function(req,res){
   // console.log(req);
    // console.log(req.httpVersion);
     console.log(req.headers);
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.trailers);
    // console.log(req.complete);

    var recevieData=''
    
    req.on('data', (chunk) => {
       // console.log(`接收到 ${chunk.length} 个字节的数据`);
        recevieData+=chunk
       // console.log("data on data:"+recevieData.length)
      });


      req.on('end', async () => {
        console.log("req on end.recevieData,length"+recevieData.length);
        
        var str=recevieData.toString("utf8")
        var xml = str.replace(/(&lt;)|(&gt\;)|(&#xA;)/g, function(matchStr) {
            var tokenMap = {
                '&lt;' : '<',
                '&gt;' : '>' ,
                '&#xA;':"",
            };
            return tokenMap[matchStr];
        });

       // console.log(xml)

        var result = convert.xml2json(xml, {compact: true, spaces: 0});
        var SOAPObj=JSON.parse(result)
        console.log(result)
        var SOAPData=SOAPObj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]
  
        var keyArr=[]
        for(var key in SOAPData){
            keyArr.push(key)
        }
        if(SOAPData[keyArr[0]]!==undefined){
           // console.log()
           action=SOAPData[keyArr[0]]["arg0"]["root"]["_attributes"]["biz"]
           collectorId=SOAPData[keyArr[0]]["arg0"]["root"]["collector"]["_attributes"]["id"]
           resp='<root type="response" biz="'+action+'"><collector id="'+collectorId+'"/><response><status>1</status><daqCycle>15</daqCycle><srvTime>'+formatDate()+'</srvTime><errorCode>200</errorCode></response></root>'
           var SoapEnv=''
            if(action=='syncDevice'){
                console.log("get syncDevice")
               // SoapEnv='<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns2:syncDeviceResponse xmlns:ns2="http://i.soap.park.hertz.com/"><return><![CDATA['+resp+']></return></ns2:syncDeviceResponse></soap:Body></soap:Envelope>'
                SoapEnv='<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns2:syncDeviceResponse xmlns:ns2="http://i.soap.park.hertz.com/"><return><![CDATA['+resp+']]></return></ns2:syncDeviceResponse></soap:Body></soap:Envelope>'

            }else if(action=='reUploadData'){
               // resp='<root type="response" biz="'+action+'"><collector id="'+collectorId+'"/><response><status>1</status><daqCycle>15</daqCycle><srvTime>'+formatDate()+'</srvTime><errorCode>200</errorCode></response></root>'
               console.log("get reUploadData") 
               SoapEnv='<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns2:reUploadDataResponse xmlns:ns2="http://i.soap.park.hertz.com/"><return><![CDATA['+resp+']]></return></ns2:reUploadDataResponse></soap:Body></soap:Envelope>'
       
            }else if(action=='uploadData'){
                //resp='<root type="response" biz="'+action+'"><collector id="'+collectorId+'"/><response><status>1</status><daqCycle>15</daqCycle><srvTime>'+formatDate()+'</srvTime><errorCode>200</errorCode></response></root>'
                console.log("get uploaddata")  
                SoapEnv='<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns2:uploadDataResponse xmlns:ns2="http://i.soap.park.hertz.com/"><return><![CDATA['+resp+']]></return></ns2:uploadDataResponse></soap:Body></soap:Envelope>'
            }
                    console.log(SoapEnv)
        }else(
            SoapEnv="-1"
        )


        res.writeHead(200,{
            "content-type":'text/xml; charset=utf-8'
        });
        res.write(SoapEnv);
        res.end();
      });


});
server.listen(3000);

function formatDate(){
    var t = new Date()
    var Y=t.getFullYear()
    var M=t.getMonth()
    M=M<10?('0'+M):M
    var D=t.getDate()
    D=D<10?('0'+D):D
    var h=t.getHours()
    h=h<10?('0'+h):h
    var m=t.getMinutes()
    m=m<10?('0'+m):m
    var s=t.getSeconds()
    s=s<10?('0'+s):s
    var ms=t.getMilliseconds()

    return Y+"-"+M+"-"+D+" "+h+":"+m+":"+s+"."+ms
}