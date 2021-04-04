<template>
<div>
  <div class="sample-tutorial">
      <gc-spread-sheets class="sample-spreadsheets" @editChange="handleChange" @workbookInitialized="initSpread">
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
                  <input type="button" id="loadExcel" value="导入文件" class="button" @click="loadExcel">
                  <p>
                    只可以导入和模板格式相同的表格，否则会出错
                  </p>
              </div>
              <div class="inputContainer">
                  <el-input v-model="exportFileName" placeholder="请输入导出文件名"></el-input>
                  <input type="button" id="saveExcel" value="导出文件" class="button" @click="saveExcel">
              </div>
          </div>
      </div>
  </div>
  <input type="file">
  <el-button @click="renderDoc"> 确认 </el-button>
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
import axios from 'axios'

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
  name: 'test',
  data: function () {
    return {
      spread: null,
      importExcelFile: null,
      exportFileName: 'export.xlsx',
      password: ''
    }
  },
  created: async function () {
    this.importExcelFile = (await axios.get('http://template.moonyoung.top/template1.xlsx', {responseType: 'blob'})).data
    this.loadExcel()
  },
  methods: {
    initSpread: function (spread) {
      this.spread = spread
      spread.options.calcOnDemand = true
    },
    changeFileDemo (e) {
      this.importExcelFile = e.target.files[0]
      console.log(this.importExcelFile)
    },
    changePassword (e) {
      this.password = e.target.value
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

    handleChange (sender, args) {
      if (args && args.col !== 0) {
        this.spread.sheets[1].setValue(args.row, 0, args.row)
      }
    },

    getExcelData () {
      let clints = []
      for (let i = 1; this.spread.sheets[1].getValue(i, 0); i++) {
        let rowData = {}
        rowData.number = this.spread.sheets[1].getValue(i, 0)
        rowData.id = this.spread.sheets[1].getValue(i, 1)
        rowData.name = this.spread.sheets[1].getValue(i, 2)
        rowData.a = this.spread.sheets[1].getValue(i, 3)
        rowData.b = this.spread.sheets[1].getValue(i, 4)
        rowData.c = this.spread.sheets[1].getValue(i, 5)
        rowData.d = this.spread.sheets[1].getValue(i, 6)
        rowData.total = this.spread.sheets[1].getValue(i, 7)
        clints.push(rowData)
      }
      return clints
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
            clints: this.getExcelData()
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
  height: 30px;
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
