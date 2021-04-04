<template>
<div>
  <div class="sample-tutorial">
      <gc-spread-sheets class="sample-spreadsheets" @workbookInitialized="initSpread">
          <gc-worksheet>
          </gc-worksheet>
      </gc-spread-sheets>
      <div class="options-container">
          <div class="option-row">
              <div class="inputContainer">
                  <input type="checkbox" id="incremental" @change="changeIncremental" checked/>
                  <label for="incremental">Incremental Loading</label>
                  <p class="summary" id="loading-container">
                      Loading progress:
                      <input style="width: 231px;" id="loadingStatus" type="range" name="points" min="0" max="100" value="0" step="0.01"/>
                  </p>
                  <input type="file" id="fileDemo" class="input" @change="changeFileDemo">
                  <input type="button" id="loadExcel" value="import" class="button" @click="loadExcel">
              </div>
              <div class="inputContainer">
                  <input id="exportFileName" value="export.xlsx" class="input" @change="changeExportFileName">
                  <input type="button" id="saveExcel" value="export" class="button" @click="saveExcel">
              </div>
          </div>
          <div class="option-row">
              <div class="group">
                  <label>Password:
                      <input type="password" id="password" @change="changePassword">
                  </label>
              </div>
          </div>
      </div>
  </div>
  <el-button @click="renderDoc"> 确认 </el-button>
  <el-button @click="handleClick"> 测试 </el-button>
</div>
</template>

<script>
import '@grapecity/spread-sheets-resources-zh'
import '@grapecity/spread-sheets-vue'
import GC from '@grapecity/spread-sheets'
import '@grapecity/spread-sheets-charts'
import { IO } from '@grapecity/spread-excelio'
import saveExcel from '@/utils/saveFile'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'

function loadFile (url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}
// import {
//   jsonData
// } from './data'
// import './styles.css'

GC.Spread.Common.CultureManager.culture('zh-cn')

window.GC = GC

export default({
  name: 'app',
  data: function () {
    return {
      spread: null,
      importExcelFile: null,
      exportFileName: 'export.xlsx',
      password: ''
    }
  },
  methods: {
    initSpread: function (spread) {
      this.spread = spread
      spread.options.calcOnDemand = true
      let sheet = this.spread.sheets[0]
      sheet.suspendPaint()
      sheet.setValue(0, 0, '序号')
      sheet.setValue(0, 1, '学号')
      sheet.setValue(0, 2, '姓名')
      sheet.setValue(0, 3, '团队表现')
      sheet.setValue(0, 4, '作品')
      sheet.setValue(0, 5, '答辩')
      sheet.setValue(0, 6, '文档')
      sheet.setValue(0, 7, '总评')
      sheet.resumePaint()
      // spread.fromJSON(jsonData)
    },
    changeFileDemo (e) {
      this.importExcelFile = e.target.files[0]
    },
    changePassword (e) {
      this.password = e.target.value
    },
    changeExportFileName (e) {
      this.exportFileName = e.target.value
    },
    changeIncremental (e) {
      document.getElementById('loading-container').style.display = e.target.checked ? 'block' : 'none'
    },
    loadExcel (e) {
      let spread = this.spread
      let excelIo = new IO()
      let excelFile = this.importExcelFile
      let password = this.password

      let incrementalEle = document.getElementById('incremental')
      let loadingStatus = document.getElementById('loadingStatus')
      // here is excel IO API
      excelIo.open(excelFile, function (json) {
        let workbookObj = json
        if (incrementalEle.checked) {
          spread.fromJSON(workbookObj, {
            incrementalLoading: {
              loading: function (progress) {
                progress = progress * 100
                loadingStatus.value = progress
              },
              loaded: function () {
              }
            }
          })
        } else {
          spread.fromJSON(workbookObj)
        }
      }, function (e) {
        // process error
        alert(e.errorMessage)
      }, {
        password: password
      })
    },
    saveExcel (e) {
      let spread = this.spread
      let excelIo = new IO()

      let fileName = this.exportFileName
      let password = this.password
      if (fileName.substr(-5, 5) !== '.xlsx') {
        fileName += '.xlsx'
      }

      let json = spread.toJSON()

      // here is excel IO API
      excelIo.save(json, function (blob) {
        saveExcel(blob, fileName)
      }, function (e) {
        // process error
        console.log(e)
      }, {
        password: password
      })
    },
    handleClick () {
      // console.log(this.spread)
      console.log(this.spread.sheets[1].getValue('4', '3'))
    },

    renderDoc () {
      loadFile(
        'http://template.moonyoung.top/table-demo.docx',
        (error, content) => {
          if (error) {
            throw error
          }
          var zip = new PizZip(content)
          var doc = new Docxtemplater().loadZip(zip)
          doc.setData({
            clints: [
              {
                number: 1,
                id: this.spread.sheets[1].getValue('4', '0'),
                name: this.spread.sheets[1].getValue('4', '2'),
                a: this.spread.sheets[1].getValue('4', '10'),
                b: this.spread.sheets[1].getValue('4', '11'),
                c: this.spread.sheets[1].getValue('4', '12'),
                d: this.spread.sheets[1].getValue('4', '13'),
                total: this.spread.sheets[1].getValue('4', '14')
              },
              {
                number: 2,
                id: this.spread.sheets[1].getValue('5', '0'),
                name: this.spread.sheets[1].getValue('5', '2'),
                a: this.spread.sheets[1].getValue('5', '10'),
                b: this.spread.sheets[1].getValue('5', '11'),
                c: this.spread.sheets[1].getValue('5', '12'),
                d: this.spread.sheets[1].getValue('5', '13'),
                total: this.spread.sheets[1].getValue('5', '14')
              }
            ]
          })
          try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
          } catch (error) {
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
            if (error.properties && error.properties.errors instanceof Array) {
              const errorMessages = error.properties.errors
                .map(function (error) {
                  return error.properties.explanation
                })
                .join('\n')
              console.log('errorMessages', errorMessages)
              // errorMessages is a humanly readable message looking like this :
              // 'The tag beginning with "foobar" is unopened'
            }
            throw error
          }
          var out = doc.getZip().generate({
            type: 'blob',
            mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }) // Output the document using Data-URI
          saveAs(out, 'output.docx')
        }
      )
    }
  }
})


</script>
<style scoped>
.sample-tutorial {
   position: relative;
   height: 500px;
   overflow: hidden;
}

.sample-spreadsheets {
  width: calc(100% - 280px);
  height: 100%;
  overflow: hidden;
  float: left;
}

.options-container {
  float: right;
  width: 280px;
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  background: #fbfbfb;
  overflow: auto;
}

.sample-options {
  z-index: 1000;
}

.inputContainer {
  width: 100%;
  height: auto;
  border: 1px solid #eee;
  padding: 6px 12px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.input {
  font-size: 14px;
  height: 20px;
  border: 0;
  outline: none;
  background: transparent;
}

.button {
  height: 30px;
  padding: 6px 12px;
  width: 80px;
  margin-top: 6px;
}

.group {
  padding: 12px;
}

.group input {
  padding: 4px 12px;
}
body {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
