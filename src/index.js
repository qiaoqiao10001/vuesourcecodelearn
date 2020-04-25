import {initMixins} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifeCycle'

import {initGlobalApi} from './initGlobalAPI/index'

function Vue(options){
  this._init(options);
}

initMixins(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalApi(Vue)
export default Vue;