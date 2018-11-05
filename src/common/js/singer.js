/*
* @Author: Administrator
* @Date:   2018-06-05 16:42:41
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-05 18:32:17
*/
export default class Singer{
    constructor({id,name}){
        this.id=id
        this.name=name                  
        this.avatar=`https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
    }
}
