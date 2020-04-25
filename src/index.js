import {initMixins} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifeCycle'
function Vue(options){
  this._init(options);
}

initMixins(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
export default Vue;