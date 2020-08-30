var https= require('https');
var url = require('url');
var convert = require('xml-js'); 
var CronJob = require('cron').CronJob;
var MongoClient = require('mongodb').MongoClient;
const urlStr = "mongodb://root:654321@192.168.1.240:27017/DbHzip?authMechanism=SCRAM-SHA-1&authSource=admin";
console.log("begin query")
//只取
var uploadObj=function(id,e,e1,e2,e3){
    this.id=id
    this.e=e
    this.e1=e1
    this.e2=e2
    this.e3=e3
}
//查询时间
var t=new Date()
t.setDate(30)
//t.setHours(t.getHours()-1)
t.setHours(8)
t.setMinutes(30,0,0)
mongoQuery(t.toISOString()).then(()=>{
    console.log("handle end")
}).catch(e=>{
    console.log(err)
})
//{"ammeterNo":"","readings":"","status":true,createTime:""}

//定时执行
// //每小时过10分钟，上传整点数据
// new CronJob('30 15 * * * *', ()=> {
//         var t=new Date()
//         //t.setDate(12)
//         t.setMinutes(0,0,0)
//         mongoQuery(t.toISOString()).then(upload).catch(e=>{
//             console.log(err)
//         })  
//   }, null, true, 'Asia/Chongqing');



//Mongo读取数据

function mongoQuery(seletcTime){
    var p=new Promise((resolve,reject)=>{
        console.log("mongoQuery begin.")
        MongoClient.connect(urlStr, { useNewUrlParser: true,useUnifiedTopology: true}, function(err, db) {
            if (err) throw err;
            var selectTimeStr=new Date(seletcTime)
           // selectTimeStr.setHours(selectTimeStr.getHours())
            console.log("selectTime ISO:"+ selectTimeStr.toISOString())
            var dbo = db.db("DbHzip");

           // var whereStr = {devId:'1704398557000397',$or:[{sampleTime:{$lt:"2019-05-03"}},{sampleTime:{$gt:"2019-05-01"}}]}//{"devId":'1704398557000397'};  // 查询条件
           var collector='daq_source_xml'
           whereStr ={"sampleTime":new Date(seletcTime)}//{devId:{$in:idArr},sampleTime:{$lte:endTimeStr,$gt:beginTimeStr}}//
            console.log(whereStr)
           //whereStr={devId queryArr[i].id,sampleTime:{$lte:endTimeStr,$gt:beginTimeStr}}
           dbo.collection(collector).find(whereStr).toArray(function(err, result) {
               console.log("return result:"+result.length)
                if(err) {
                    //throw err
                    console.log("mongo err")
                    reject(err)
                }else{
                   
                    
                     console.log("mongo query handle begin")
                    
                     //console.log(arr1.root.device.length)
                
                     var a1=result[0].xml
                     var arr1 =JSON.parse(convert.xml2json(a1, {compact: true, spaces: 0}));
                    //console.log(result[0].xml)
                      console.log(
                        //设备Id  
                        arr1.root.collector.device[0]._attributes.id,
                        //根据设备参数个数判断设备类型，单相长度5，三相 长度6，多功能，长度1

                        arr1.root.collector.device[0].data.length,
                        //设备值
                        arr1.root.collector.device[0].data[1]._text


                      )

                        //遍历数据包
                        for(var devNum=0;i<result.length;i++){

                            //处理数据包内容

                        }

                      if(arr1.root.collector.device[0].data.length==5){
                        
                    }


                     // var calArr=[]
                    // for(var i =0;i<result.length;i++){
                    //    calArr[i]=new uploadObj(result[i].devId,result[i].end,true,(new Date(result[i].sampleTime)).toLocaleString())
                       
 
                  //  }
                  // console.log("calArr:")
                   // console.log(calArr[0])
                    resolve("ok")
                // resolve(JSON.stringify(result))
                }
                db.close();

            });
        }); 



    })
    return p

}

