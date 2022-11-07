const fs = require('fs');
const axios = require('axios')
const CodeGen = require('swagger-js-codegen').CodeGen;
const envPath = process.env.API_GEN_ENV !== undefined ? `.${process.env.API_GEN_ENV}` : ''
require('dotenv').config({ path: '.env' + envPath })
console.log(`SWAGGER_URL : ${process.env.SWAGGER_URL}`)


axios.get(process.env.SWAGGER_URL)
.then((res) => {
  let swagger = res.data
  swagger.swagger = '2.0'
  const reactjsSourceCode  = CodeGen.getCustomCode({
    // moduleName: 'Test',
    className: 'request',
    swagger: swagger,
    template: {
        class: fs.readFileSync('./.api-gen/template/custom-class.mustache', 'utf-8'),
        method: fs.readFileSync('./.api-gen/template/custom-method.mustache', 'utf-8'),
        //type: fs.readFileSync('./.api-gen/template/custom-type.mustache', 'utf-8')
    }
  });

  fs.writeFileSync('./src/lib/request.js', reactjsSourceCode)
  console.log('api generator finished')

})
.catch((err) => {
  return console.error(err)
})


//var filePath = './.api-gen/test.json';
//var swagger = JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
// var nodejsSourceCode = CodeGen.getNodeCode({ className: 'Test', swagger: swagger });
// var angularjsSourceCode = CodeGen.getAngularCode({ className: 'Test', swagger: swagger });
//var reactjsSourceCode = CodeGen.getReactCode({ className: 'Test', swagger: swagger });
// var tsSourceCode = CodeGen.getTypescriptCode({ className: 'Test', swagger: swagger, imports: ['../../typings/tsd.d.ts'] });
