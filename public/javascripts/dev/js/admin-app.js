(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,rows,-1,i);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}return parsers[0];}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}return text;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}return lookup;}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[£$€?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if (c.dateFormat == "pt") {s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");} else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);

},{}],2:[function(require,module,exports){
require('./config/mainapp-config-loader.coffee');

window.NZ = new Marionette.Application;

require('./entity/admin-entity-loader.coffee');

require('./admin/admin-app-loader.coffee');

require('./admin-init.coffee');

NZ.start();



},{"./admin-init.coffee":3,"./admin/admin-app-loader.coffee":4,"./config/mainapp-config-loader.coffee":10,"./entity/admin-entity-loader.coffee":13}],3:[function(require,module,exports){
NZ.addRegions({
  mainContentRegion: '#page-content'
});

NZ.reqres.setHandler("default:region", function() {
  return NZ.mainContentRegion;
});

NZ.commands.setHandler("register:instance", function(instance, id) {
  return NZ.register(instance, id);
});

NZ.commands.setHandler("unregister:instance", function(instance, id) {
  return NZ.unregister(instance, id);
});

NZ.on("start", function(options) {
  return NZ.vent.trigger('start:router');
});



},{}],4:[function(require,module,exports){
require('./router/admin-router-app.coffee');

require('./places/admin-edit-places-controller.coffee');



},{"./places/admin-edit-places-controller.coffee":5,"./router/admin-router-app.coffee":9}],5:[function(require,module,exports){
var RegionController,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('./admin-edit-places-view.coffee');

RegionController = require('../../config/region-controller.coffee');

NZ.AdminEditPlacesController = (function(superClass) {
  extend(AdminEditPlacesController, superClass);

  function AdminEditPlacesController() {
    return AdminEditPlacesController.__super__.constructor.apply(this, arguments);
  }

  AdminEditPlacesController.prototype.initialize = function(options) {
    var collectionPromise;
    this.region = NZ.mainContentRegion;
    if (options.model != null) {
      this.model = options.model;
    } else {
      this.model = new Backbone.Model({
        id: '0',
        name: 'Country'
      });
    }
    console.log(this.model);
    collectionPromise = NZ.request('get:places:list', this.model.id);
    return collectionPromise.then((function(_this) {
      return function(collection) {
        _this.collection = collection;
        _this.view = _this._getPlacesView();
        _this.listenTo(_this.view, 'save:new:place', _this.saveNewPlace);
        _this.listenTo(_this.view, 'go:back', _this.goBack);
        return _this.show(_this.view);
      };
    })(this));
  };

  AdminEditPlacesController.prototype._getPlacesView = function() {
    return new NZ.AdminEditPlacesView({
      model: this.model,
      collection: this.collection
    });
  };

  AdminEditPlacesController.prototype.goBack = function() {
    var promise;
    if (this.model.get('parent') === '0') {
      return NZ.execute('show:places:app:controller');
    } else {
      promise = NZ.request('get:place:by:id', this.model.get('parent'));
      return promise.then(function(model) {
        return NZ.execute('show:places:app:controller', {
          model: model
        });
      });
    }
  };

  AdminEditPlacesController.prototype.saveNewPlace = function(data) {
    var promise;
    data.parent = this.model.id;
    promise = NZ.request('create:places', data);
    return promise.then((function(_this) {
      return function(place) {
        _this.collection.add(place);
        return _this.view.triggerMethod('new:place:saved');
      };
    })(this), (function(_this) {
      return function(place, error) {
        console.log(error.message);
        return _this.view.triggerMethod('new:place:error');
      };
    })(this));
  };

  return AdminEditPlacesController;

})(RegionController);

NZ.commands.setHandler('show:places:app:controller', function(options) {
  return new NZ.AdminEditPlacesController(options);
});



},{"../../config/region-controller.coffee":12,"./admin-edit-places-view.coffee":7}],6:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    return "		  	<button class=\"btn btn-success places-back\"><i class=\"glyphicon glyphicon-menu-left\"></i> Back</button\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=helpers.helperMissing, alias2="function", buffer = 
  "<div class=\"well well-lg\">\r\n		<div class=\"panel panel-default\">\r\n		  <div class=\"panel-heading\">\r\n";
  stack1 = ((helper = (helper = helpers.notCountry || (depth0 != null ? depth0.notCountry : depth0)) != null ? helper : alias1),(options={"name":"notCountry","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.notCountry) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		    <h3 class=\"panel-title\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3>\r\n		  </div>\r\n		  <div class=\"panel-body\">\r\n		    <table class=\"table table-bordered table-striped table-hover\">\r\n		    	<thead>\r\n		    		<tr>\r\n		    			<th>Sr. No</th>\r\n		    			<th>Name</th>\r\n		    			<th>Latitude</th>\r\n		    			<th>Longitude</th>\r\n		    			<th>Action</th>\r\n		    					    			\r\n		    		</tr>\r\n		    	</thead>\r\n		    	<tbody class=\"child-view-holder\">\r\n		    		\r\n		    		\r\n		    	</tbody>\r\n		    	<tfoot>\r\n		    		<tr class=\"new-place\">\r\n		    			<td></td>\r\n		    			<td><input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Place name\"></td>\r\n		    			<td><input type=\"text\" class=\"form-control\" name=\"lat\" placeholder=\"latitude\"></td>\r\n		    			<td><input type=\"text\" class=\"form-control\" name=\"long\" placeholder=\"longitude\"></td>\r\n		    			<td colspan=\"2\"><button type=\"button\" class=\"btn btn-primary add-new-place\"><i class=\"glyphicon glyphicon-plus-sign\"></i> Add Place</button></td>\r\n		    			\r\n\r\n		    		</tr>\r\n		    	</tfoot>\r\n		    </table>\r\n		  </div>\r\n		</div>\r\n\r\n	</div>";
},"useData":true});

},{"hbsfy/runtime":22}],7:[function(require,module,exports){
var AdminSinglePlaceView, CompositeTemplate, SingleViewTemplate,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

CompositeTemplate = require('./admin-edit-places-template.hbs');

SingleViewTemplate = require('./single-place-edit-template.hbs');

require('../../../../bower_components/tablesorter/jquery.tablesorter.min.js');

AdminSinglePlaceView = (function(superClass) {
  extend(AdminSinglePlaceView, superClass);

  function AdminSinglePlaceView() {
    return AdminSinglePlaceView.__super__.constructor.apply(this, arguments);
  }

  AdminSinglePlaceView.prototype.tagName = 'tr';

  AdminSinglePlaceView.prototype.className = 'existing-place';

  AdminSinglePlaceView.prototype.template = SingleViewTemplate;

  AdminSinglePlaceView.prototype.events = {
    'click .view-place': 'viewPlace',
    'click .delete-place': 'deletePlace',
    'click .edit-place': 'editPlace',
    'click .save-place': 'savePlace',
    'click .cancel-place': 'cancelPlace'
  };

  AdminSinglePlaceView.prototype.mixinTemplateHelpers = function(data) {
    data = AdminSinglePlaceView.__super__.mixinTemplateHelpers.call(this, data);
    data.index = this.index;
    data.viewEditPlace = this.viewEditPlace;
    return data;
  };

  AdminSinglePlaceView.prototype.initialize = function(options) {
    this.index = options.index;
    return this.viewEditPlace = true;
  };

  AdminSinglePlaceView.prototype.viewPlace = function() {
    return NZ.execute('show:places:app:controller', {
      model: this.model
    });
  };

  AdminSinglePlaceView.prototype.deletePlace = function() {
    return this.model.destroy();
  };

  AdminSinglePlaceView.prototype.editPlace = function() {
    this.viewEditPlace = false;
    return this.render();
  };

  AdminSinglePlaceView.prototype.savePlace = function() {
    var lat, long, name;
    this.$el.find(' input').parent().removeClass('has-error');
    name = this.$el.find(' input[name="name"]').val();
    lat = parseFloat(this.$el.find(' input[name="lat"]').val());
    long = parseFloat(this.$el.find(' input[name="long"]').val());
    if (name !== '' && lat < 90 && lat > -90 && long < 180 && long > -180) {
      this.model.set({
        name: name,
        lat: lat,
        long: long
      });
      this.model.save().then((function(_this) {
        return function() {
          console.log(_this);
          _this.viewEditPlace = true;
          return _this.render();
        };
      })(this));
    }
    if (name === '') {
      this.$el.find(' input[name="name"]').parent().addClass('has-error');
    }
    if (lat < -90 || lat > 90 || _.isNaN(lat)) {
      this.$el.find(' input[name="lat"]').parent().addClass('has-error');
    }
    if (long < -180 || long > 180 || _.isNaN(long)) {
      return this.$el.find(' input[name="long"]').parent().addClass('has-error');
    }
  };

  AdminSinglePlaceView.prototype.cancelPlace = function() {
    this.viewEditPlace = true;
    return this.render();
  };

  return AdminSinglePlaceView;

})(Marionette.ItemView);

NZ.AdminEditPlacesView = (function(superClass) {
  extend(AdminEditPlacesView, superClass);

  function AdminEditPlacesView() {
    return AdminEditPlacesView.__super__.constructor.apply(this, arguments);
  }

  AdminEditPlacesView.prototype.className = 'admin-place-edit';

  AdminEditPlacesView.prototype.template = CompositeTemplate;

  AdminEditPlacesView.prototype.childView = AdminSinglePlaceView;

  AdminEditPlacesView.prototype.childViewContainer = '.child-view-holder';

  AdminEditPlacesView.prototype.childViewOptions = function(model, index) {
    return {
      index: index + 1
    };
  };

  AdminEditPlacesView.prototype.events = {
    'click .add-new-place': 'addNewPlace',
    'click .places-back': 'goBack'
  };

  AdminEditPlacesView.prototype.mixinTemplateHelpers = function(data) {
    data = AdminEditPlacesView.__super__.mixinTemplateHelpers.call(this, data);
    if (this.model.id !== '0') {
      data.notCountry = true;
    }
    return data;
  };

  AdminEditPlacesView.prototype.onShow = function() {
    return this.$el.find('table').tablesorter();
  };

  AdminEditPlacesView.prototype.goBack = function() {
    return this.trigger('go:back');
  };

  AdminEditPlacesView.prototype.addNewPlace = function() {
    var lat, long, name;
    this.$el.find('.new-place input').parent().removeClass('has-error');
    name = this.$el.find('.new-place input[name="name"]').val();
    lat = parseFloat(this.$el.find('.new-place input[name="lat"]').val());
    long = parseFloat(this.$el.find('.new-place input[name="long"]').val());
    if (name !== '' && lat < 90 && lat > -90 && long < 180 && long > -180) {
      console.log(name);
      console.log(lat);
      console.log(long);
      this.trigger('save:new:place', {
        name: name,
        lat: lat,
        long: long
      });
    }
    if (name === '') {
      this.$el.find('.new-place input[name="name"]').parent().addClass('has-error');
    }
    if (lat < -90 || lat > 90 || _.isNaN(lat)) {
      this.$el.find('.new-place input[name="lat"]').parent().addClass('has-error');
    }
    if (long < -180 || long > 180 || _.isNaN(long)) {
      return this.$el.find('.new-place input[name="long"]').parent().addClass('has-error');
    }
  };

  AdminEditPlacesView.prototype.onNewPlaceSaved = function() {
    return this.$el.find('.new-place input').val('');
  };

  return AdminEditPlacesView;

})(Marionette.CompositeView);



},{"../../../../bower_components/tablesorter/jquery.tablesorter.min.js":1,"./admin-edit-places-template.hbs":6,"./single-place-edit-template.hbs":8}],8:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<td>"
    + alias3(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "</td>\r\n<td>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\r\n<td>"
    + alias3(((helper = (helper = helpers.lat || (depth0 != null ? depth0.lat : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lat","hash":{},"data":data}) : helper)))
    + "</td>\r\n<td>"
    + alias3(((helper = (helper = helpers['long'] || (depth0 != null ? depth0['long'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"long","hash":{},"data":data}) : helper)))
    + "</td>\r\n<td><button type=\"button\" class=\"btn btn-primary edit-place\"><i class=\"glyphicon glyphicon-pencil\"></i> Edit</button> \r\n<button type=\"button\" class=\"btn btn-danger delete-place\">Delete</button> \r\n<button type=\"button\" class=\"btn btn-success view-place\"><i class=\"glyphicon glyphicon-eye-open\"></i> View</button></td>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<td>"
    + alias3(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "</td>\r\n<td><input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Place name\" value=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"></td>\r\n<td><input type=\"text\" class=\"form-control\" name=\"lat\" placeholder=\"latitude\" value=\""
    + alias3(((helper = (helper = helpers.lat || (depth0 != null ? depth0.lat : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lat","hash":{},"data":data}) : helper)))
    + "\"></td>\r\n<td><input type=\"text\" class=\"form-control\" name=\"long\" placeholder=\"longitude\" value=\""
    + alias3(((helper = (helper = helpers['long'] || (depth0 != null ? depth0['long'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"long","hash":{},"data":data}) : helper)))
    + "\"></td>\r\n\r\n<td ><button type=\"button\" class=\"btn btn-primary save-place\"><i class=\"glyphicon glyphicon-plus-sign\"></i> Save Place</button>\r\n<button type=\"button\" class=\"btn btn-danger cancel-place\"><i class=\"glyphicon glyphicon-plus-sign\"></i> Cancel</button>\r\n</td>\r\n\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=helpers.helperMissing, alias2="function", alias3=helpers.blockHelperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.viewEditPlace || (depth0 != null ? depth0.viewEditPlace : depth0)) != null ? helper : alias1),(options={"name":"viewEditPlace","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.viewEditPlace) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.viewEditPlace || (depth0 != null ? depth0.viewEditPlace : depth0)) != null ? helper : alias1),(options={"name":"viewEditPlace","hash":{},"fn":this.noop,"inverse":this.program(3, data, 0),"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.viewEditPlace) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});

},{"hbsfy/runtime":22}],9:[function(require,module,exports){
var Controller,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NZ.AdminRouter = (function(superClass) {
  extend(AdminRouter, superClass);

  function AdminRouter() {
    return AdminRouter.__super__.constructor.apply(this, arguments);
  }

  AdminRouter.prototype.appRoutes = {
    '': 'showMain',
    'places': 'showPlaces',
    'login': 'showLogin',
    '*path': 'error'
  };

  AdminRouter.prototype.onRoute = function(name, path, args) {
    var user;
    user = NZ.request("get:current:user");
    if (path === '*path') {
      return NZ.navigate('', {
        trigger: true
      });
    }
  };

  return AdminRouter;

})(Marionette.AppRouter);

Controller = {
  error: function() {},
  showPlaces: function() {
    return NZ.execute('show:places:app:controller');
  },
  showMain: function() {
    return NZ.navigate('places', {
      trigger: true
    });
  },
  showLogin: function() {
    var user;
    user = NZ.request("get:current:user");
    if (user == null) {
      return NZ.execute('show:login:controller', {
        region: NZ.mainContentRegion
      });
    } else {
      return NZ.navigate('', {
        trigger: true
      });
    }
  }
};

NZ.vent.on('start:router', function() {
  console.log('start');
  new NZ.AdminRouter({
    controller: Controller
  });
  return NZ.startHistory({
    pushState: true,
    root: '/admin'
  });
});



},{}],10:[function(require,module,exports){
require('./marionette-config.coffee');



},{"./marionette-config.coffee":11}],11:[function(require,module,exports){
_.extend(Marionette.Application.prototype, {
  navigate: function(route, options) {
    if (options == null) {
      options = {};
    }
    return Backbone.history.navigate(route, options);
  },
  getCurrentRoute: function() {
    var frag;
    frag = Backbone.history.fragment;
    if (_.isEmpty(frag)) {
      return null;
    } else {
      return frag;
    }
  },
  startHistory: function(data) {
    if (data == null) {
      data = null;
    }
    if (Backbone.history) {
      if (data) {
        return Backbone.history.start(data);
      } else {
        return Backbone.history.start();
      }
    }
  },
  register: function(instance, id) {
    if (this._registry == null) {
      this._registry = {};
    }
    return this._registry[id] = instance;
  },
  unregister: function(instance, id) {
    return delete this._registry[id];
  },
  resetRegistry: function() {
    var controller, key, msg, oldCount, ref;
    oldCount = this.getRegistrySize();
    ref = this._registry;
    for (key in ref) {
      controller = ref[key];
      controller.region.close();
    }
    msg = "There were " + oldCount + " controllers in the registry, there are now " + (this.getRegistrySize());
    if (this.getRegistrySize() > 0) {
      return console.warn(msg, this._registry);
    } else {
      return console.log(msg);
    }
  },
  getRegistrySize: function() {
    return _.size(this._registry);
  },
  createEventObject: function() {
    return {
      vent: new Backbone.Wreqr.EventAggregator(),
      command: new Backbone.Wreqr.Commands(),
      reqres: new Backbone.Wreqr.RequestResponse()
    };
  }
});

_.extend(Marionette.Region.prototype, {
  hide: function() {
    return this.$el.hide();
  },
  unhide: function() {
    return this.$el.show();
  }
});



},{}],12:[function(require,module,exports){
var RegionController,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

RegionController = (function(superClass) {
  extend(RegionController, superClass);

  function RegionController(options) {
    if (options == null) {
      options = {};
    }
    this.region = options.region || NZ.request("default:region");
    this._instance_id = _.uniqueId("controller");
    NZ.commands.execute("register:instance", this, this._instance_id);
    RegionController.__super__.constructor.call(this, options);
  }

  RegionController.prototype.destroy = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    delete this.region;
    delete this.options;
    NZ.commands.execute("unregister:instance", this, this._instance_id);
    return RegionController.__super__.destroy.call(this, args);
  };

  RegionController.prototype.show = function(view, options) {
    if (options == null) {
      options = {};
    }
    _.defaults(options, {
      loading: false,
      region: this.region
    });
    this._setMainView(view);
    return this._manageView(view, options);
  };

  RegionController.prototype._setMainView = function(view) {
    if (this._mainView) {
      return;
    }
    this._mainView = view;
    return this.listenTo(view, "destroy", this.destroy);
  };

  RegionController.prototype._manageView = function(view, options) {
    return options.region.show(view);
  };

  return RegionController;

})(Marionette.Controller);

module.exports = RegionController;



},{}],13:[function(require,module,exports){
require('./places.coffee');



},{"./places.coffee":14}],14:[function(require,module,exports){
var API, placesCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NZ.PlacesModel = (function(superClass) {
  extend(PlacesModel, superClass);

  function PlacesModel() {
    return PlacesModel.__super__.constructor.apply(this, arguments);
  }

  PlacesModel.prototype.name = 'place';

  PlacesModel.prototype.idAttribute = '_id';

  PlacesModel.prototype.urlRoot = '/places';

  return PlacesModel;

})(Backbone.Model);

NZ.PlacesCollection = (function(superClass) {
  extend(PlacesCollection, superClass);

  function PlacesCollection() {
    return PlacesCollection.__super__.constructor.apply(this, arguments);
  }

  PlacesCollection.prototype.model = NZ.PlacesModel;

  PlacesCollection.prototype.url = '/places';

  return PlacesCollection;

})(Backbone.Collection);

placesCollection = new NZ.PlacesCollection;

API = {
  getPlacesList: function(parent) {
    var promise;
    promise = new Promise(function(resolve, reject) {
      var collection, existingModels;
      collection = new NZ.PlacesCollection;
      existingModels = placesCollection.filter(function(place) {
        return place.get('parent') === parent;
      });
      console.log(existingModels);
      collection.add(existingModels);
      if (!collection.size()) {
        return collection.fetch({
          data: {
            parent: parent
          },
          success: function(fetchedCollection) {
            placesCollection.add(fetchedCollection.models);
            return resolve(fetchedCollection);
          },
          error: function(coll, response) {
            return reject(response);
          }
        });
      } else {
        return resolve(collection);
      }
    });
    return promise;
  },
  getPlaceById: function(id) {
    var promise;
    promise = new Promise(function(resolve, reject) {
      var model;
      model = placesCollection.get(id);
      if (model) {
        return resolve(model);
      } else {
        model = new NZ.PlacesModel({
          id: id
        });
        return model.fetch({
          success: function(model) {
            return resolve(model);
          },
          error: function(model, response) {
            return reject(response);
          }
        });
      }
    });
    return promise;
  },
  createPlaces: function(data) {
    var place, promise;
    place = new NZ.PlacesModel(data);
    console.log(data);
    promise = new Promise(function(resolve, reject) {
      return place.save(null, {
        success: function(model) {
          placesCollection.add(model);
          return resolve(model);
        },
        error: function(model, error) {
          return reject(model, error);
        }
      });
    });
    return promise;
  }
};

NZ.reqres.setHandler('get:places:list', function(parent) {
  return API.getPlacesList(parent);
});

NZ.reqres.setHandler('create:places', function(data) {
  return API.createPlaces(data);
});

NZ.reqres.setHandler('get:place:by:id', function(id) {
  return API.getPlaceById(id);
});



},{}],15:[function(require,module,exports){
(function (global){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

/*jshint -W040 */
/* istanbul ignore next */
var root = typeof global !== 'undefined' ? global : window,
    $Handlebars = root.Handlebars;
/* istanbul ignore next */
Handlebars.noConflict = function() {
  if (root.Handlebars === Handlebars) {
    root.Handlebars = $Handlebars;
  }
};

Handlebars['default'] = Handlebars;

exports["default"] = Handlebars;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./handlebars/base":16,"./handlebars/exception":17,"./handlebars/runtime":18,"./handlebars/safe-string":19,"./handlebars/utils":20}],16:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "3.0.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 6;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn) {
    if (toString.call(name) === objectType) {
      if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function(name) {
    delete this.helpers[name];
  },

  registerPartial: function(name, partial) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      if (typeof partial === 'undefined') {
        throw new Exception('Attempting to register a partial as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function(name) {
    delete this.partials[name];
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(/* [args, ]options */) {
    if(arguments.length === 1) {
      // A missing field in a {{foo}} constuct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
        options = {data: data};
      }

      return fn(context, options);
    }
  });

  instance.registerHelper('each', function(context, options) {
    if (!options) {
      throw new Exception('Must pass iterator to #each');
    }

    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    var contextPath;
    if (options.data && options.ids) {
      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    function execIteration(key, i, last) {
      if (data) {
        data.key = key;
        data.index = i;
        data.first = i === 0;
        data.last  = !!last;

        if (contextPath) {
          data.contextPath = contextPath + key;
        }
      }

      ret = ret + fn(context[key], {
        data: data,
        blockParams: Utils.blockParams([context[key], key], [contextPath + key, null])
      });
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          execIteration(i, i, i === context.length-1);
        }
      } else {
        var priorKey;

        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array. 
            if (priorKey) {
              execIteration(priorKey, i-1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey) {
          execIteration(priorKey, i-1, true);
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    var fn = options.fn;

    if (!Utils.isEmpty(context)) {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
        options = {data:data};
      }

      return fn(context, options);
    } else {
      return options.inverse(this);
    }
  });

  instance.registerHelper('log', function(message, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, message);
  });

  instance.registerHelper('lookup', function(obj, field) {
    return obj && obj[field];
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 1,

  // Can be overridden in the host environment
  log: function(level, message) {
    if (typeof console !== 'undefined' && logger.level <= level) {
      var method = logger.methodMap[level];
      (console[method] || console.log).call(console, message);
    }
  }
};
exports.logger = logger;
var log = logger.log;
exports.log = log;
var createFrame = function(object) {
  var frame = Utils.extend({}, object);
  frame._parent = object;
  return frame;
};
exports.createFrame = createFrame;
},{"./exception":17,"./utils":20}],17:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line,
      column;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],18:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;
var createFrame = require("./base").createFrame;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new Exception("No environment passed to template");
  }
  if (!templateSpec || !templateSpec.main) {
    throw new Exception('Unknown template object: ' + typeof templateSpec);
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  var invokePartialWrapper = function(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new Exception("The partial " + options.name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    strict: function(obj, name) {
      if (!(name in obj)) {
        throw new Exception('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function(i) {
      return templateSpec[i];
    },

    programs: [],
    program: function(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = program(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(this, i, fn);
      }
      return programWrapper;
    },

    data: function(data, depth) {
      while (data && depth--) {
        data = data._parent;
      }
      return data;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = Utils.extend({}, common, param);
      }

      return ret;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  var ret = function(context, options) {
    options = options || {};
    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      depths = options.depths ? [context].concat(options.depths) : [context];
    }

    return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
  };
  ret.isTop = true;

  ret._setup = function(options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
    }
  };

  ret._child = function(i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new Exception('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new Exception('must pass parent depths');
    }

    return program(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

exports.template = template;function program(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  var prog = function(context, options) {
    options = options || {};

    return fn.call(container,
        context,
        container.helpers, container.partials,
        options.data || data,
        blockParams && [options.blockParams].concat(blockParams),
        depths && [context].concat(depths));
  };
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

exports.program = program;function resolvePartial(partial, context, options) {
  if (!partial) {
    partial = options.partials[options.name];
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

exports.resolvePartial = resolvePartial;function invokePartial(partial, context, options) {
  options.partial = true;

  if(partial === undefined) {
    throw new Exception("The partial " + options.name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? createFrame(data) : {};
    data.root = context;
  }
  return data;
}
},{"./base":16,"./exception":17,"./utils":20}],19:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],20:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
/* istanbul ignore next */
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.
function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

exports.indexOf = indexOf;
function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string && string.toHTML) {
    return string.toHTML();
  } else if (string == null) {
    return "";
  } else if (!string) {
    return string + '';
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;function blockParams(params, ids) {
  params.path = ids;
  return params;
}

exports.blockParams = blockParams;function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}

exports.appendContextPath = appendContextPath;
},{}],21:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime').default;

},{"./dist/cjs/handlebars.runtime":15}],22:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":21}]},{},[2]);
