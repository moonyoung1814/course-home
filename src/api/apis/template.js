import axios from '../axios'
import templateUrl from '../urls/template'

export default {
  getTemplate () {
    return axios.get(templateUrl.getTemplate)
  }
}
