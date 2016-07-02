/**
 * Created by zhangzongshan on 16/6/30.
 */
"use strict";
define(function (require, exports, module) {


    function loadJScript() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=e35biu9blkyBwcyfYBXaI5zfwyMRjLSU&callback=init";
        document.body.appendChild(script);
    }


    function loadMap(container, pointer, dragecallback, sumbitcallback) {
        mapContainer = container;
        mapDrageCallback = dragecallback;
        mapSumbitCallback = sumbitcallback;

        mapLoadSpinkit = SpinKit.Create({
            container: $("#" + container)
            , color: '#1f548a'
        });

        if (pointer.lng != "" && pointer.lat != "") {
            mapPoinert.lng = pointer.lng;
            mapPoinert.lat = pointer.lat;
        }
        loadJScript();
    }

    return {
        loadMap: loadMap
    }
});
var mapLoadSpinkit = null;
var mapDrageCallback = null;
var mapSumbitCallback = null;
var mapContainer = null;
var mapPoinert = {
    lng: 120.17533
    , lat: 30.285734
};
function init() {
    mapLoadSpinkit.remove();
    mapLoadSpinkit = null;
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));

    var map = new BMap.Map(mapContainer);
    map.centerAndZoom(new BMap.Point(mapPoinert.lng, mapPoinert.lat), 19);
    map.addControl(new BMap.NavigationControl());        // 添加平移缩放控件

    var icon = new BMap.Icon(rootPath + 'images/Map_Marker_Ball.png', new BMap.Size(48, 48), {
        anchor: new BMap.Size(24, 48)
    });

    var mkr = new BMap.Marker(new BMap.Point(mapPoinert.lng, mapPoinert.lat), {
        icon: icon,
        enableDragging: true,
        raiseOnDrag: true
    });
    mkr.addEventListener('dragend', function (e) {
        if (typeof mapDrageCallback === 'function' && mapDrageCallback != null) {
            mapDrageCallback(e);
        }
        if (typeof mapSumbitCallback === 'function' && mapSumbitCallback != null) {
            mapSumbitCallback(e);
        }
    });

    map.addOverlay(mkr);

}