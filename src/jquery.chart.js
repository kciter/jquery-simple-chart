
(function($) {
	var url = '';
	var jsonData = '';
	var width = '';
	var height = '';
	var type = ''; // Bar, Line ...
	var minValue = 0;
	var maxValue = 0;
	var step = 0;
	var data = '';
	var preData = '';
	var dataCount = 0;
	var count = 0;
	
	var intWidth = 0;
	var intHeight = 0;
	
	var baseCtx = 0;
	
	$.fn.chart = function(setting) {
		init(this, setting);
		
		var dataCheck = false;
		if (preData != '') {
			$.each(data, function(i) {
				if( data[i] != preData[i] ) {
					dataCheck = true;
				}
			});
		}
		
		if (dataCheck == false) {
			drawAxis(this);
			drawPointGraph(this);
			drawOverlay(this);
		} else {
			var startTime = new Date();
			var that = this;
			
			var temp = data;
			data = preData;
			preData = temp;
			
			drawAxis(that);
			
			function frame(delta) {
				var time = new Date() - startTime;
				var progress = time / 1000
				if (progress > 1) progress = 1
				
				$.each(data, function(i) {
					if (data[i] != preData[i]) {
						data[i] = data[i]+(preData[i]-data[i])*progress;
					}
				})
				
				left = Math.sin(Math.acos(progress))*-100;
				
				if (baseCtx != 0) {
					baseCtx.clearRect(0, 0, intWidth, intHeight);
				}
			
				drawPointGraph(that);
				
				if (progress == 1) {
					clearInterval(id);
				}
			}
			
			baseCtx.clearRect(0, 0, intWidth, intHeight);
			drawPointGraph(that);
			drawOverlay(that);
			
			var id = setInterval(frame, 10);
		}
		
		return this;
	};
	
	function init(obj, setting) {
		/* 초기화 */
		if (setting['url']) {
			url = setting['url'];
		}
		jsonData = setting['data'];
		width = setting['width'];
		height = setting['height'];
		type = setting['type']; // Bar, Line ...
		minValue = setting['minValue'];
		maxValue = setting['maxValue'];
		step = setting['step'];
		data = '';
		preData = '';
		
		intWidth = parseInt(width);
		intHeight = parseInt(height);
		
		obj.css('width', width);
		obj.css('height', height);
		
		obj.addClass('chart');
		
		/* 이전 데이터 불러오기 */
		if (obj.children('.data').text() != '') {
			preData = JSON.parse( obj.children('.data').html() );
			$.each(preData, function(i) {
				preData[i] = parseInt(preData[i]);
			});
		}
		/* // */
		
		obj.html("\
			<canvas class='base' width='"+width+"' height='"+height+"'></canvas>\
			<canvas class='overlay' width='"+width+"' height='"+height+"'></canvas>\
			<div class='xaxis'></div>\
			<div class='yaxis'></div>\
			<div class='data'></div>\
		");
		/* // */
		
		/* 데이터 가져오기 */
		if (url != '') {
			$.ajaxSetup({ async: false });
			$.getJSON( url, function( jsonData ) {
				data = jsonData;
			});
		} else {
			data = jsonData;
		}
		/* // */
		
		/* 데이터 저장 */
		obj.children('.data').text( JSON.stringify(data) );
		/* // */
		
		$.each(data, function(i) {
			data[i] = parseInt(data[i]);
		});
	}
	
	function drawAxis(obj) {
		/* 축 생성 */
		dataCount = 0;
		count = 0;
		$.each(data, function(i) { ++dataCount; });
		$.each(data, function(i) {
			xaxisData = document.createElement('div');
			
			$(xaxisData).addClass('xaxisData');
			$(xaxisData).html(i);
			$(xaxisData).css('width', intWidth/dataCount);
			$(xaxisData).css('left', ((intWidth-40)/(dataCount-1))*count+35-((intWidth-40)/(dataCount-1))/2);
			$(xaxisData).css('top', intHeight-20);
			
			obj.children('.xaxis').append(xaxisData);
			
			++count;
		});
		count = 0;
		for (var i=minValue; i<=maxValue; i+=step ) {
			yaxisData = document.createElement('div');
			
			$(yaxisData).addClass('yaxisData');
			$(yaxisData).html(i);
			$(yaxisData).css('width', '20px');
			$(yaxisData).css('left', '5px');
			$(yaxisData).css('top', intHeight-((intHeight-36)/((maxValue-minValue)/step))*count-36);
			
			obj.children('.yaxis').append(yaxisData);
			
			++count;
		}
		/* // */
	}
	
	function drawPointGraph(obj) {
		/* 선 긋기 */
		baseCtx = obj.children('.base')[0].getContext("2d");
		
		baseCtx.lineWidth = 1;
		
		baseCtx.beginPath();
		baseCtx.moveTo(35,0);
		baseCtx.lineTo(35,intHeight-35);
		baseCtx.strokeStyle = "#777";
		baseCtx.stroke();
		baseCtx.closePath();
		
		baseCtx.beginPath();
		baseCtx.moveTo(35,intHeight-35);
		baseCtx.lineTo(((intWidth-40)/dataCount)*(dataCount)+35,intHeight-35);
		baseCtx.strokeStyle = "#777";
		baseCtx.stroke();
		baseCtx.closePath();
		
		// x축
		count = 0;
		$.each(data, function(i) {
			baseCtx.beginPath();
			baseCtx.moveTo(35,intHeight-((intHeight-36)/((maxValue-minValue)/step))*count-36);
			baseCtx.lineTo(((intWidth-40)/dataCount)*(dataCount)+35,intHeight-((intHeight-36)/((maxValue-minValue)/step))*count-36);
			baseCtx.strokeStyle = "#ddd";
			baseCtx.stroke();
			++count;
		});
		// y축
		count = 0;
		$.each(data, function(i) {
			baseCtx.beginPath();
			baseCtx.moveTo(((intWidth-40)/(dataCount-1))*count+35,0);
			baseCtx.lineTo(((intWidth-40)/(dataCount-1))*count+35,intHeight-35);
			baseCtx.strokeStyle = "#ddd";
			baseCtx.stroke();
			++count;
		});
		/* // */
	
		/* 라인 그리기 */
		count = 0;
		var preX, preY;
		$.each(data, function(i) {
			baseCtx.beginPath();
			
			baseCtx.moveTo(((intWidth-40)/(dataCount-1))*count+35,(intHeight-36)-data[i]/(maxValue-minValue)*(intHeight-36));
			baseCtx.lineTo(preX, preY);
			baseCtx.strokeStyle = "#444";
			baseCtx.lineWidth = 2;
			baseCtx.stroke();
			
			preX = ((intWidth-40)/(dataCount-1))*count+35;
			preY = (intHeight-36)-data[i]/(maxValue-minValue)*(intHeight-36);
			
			++count;
		});
		/* // */
		
		/* 포인트 그리기 */
		count = 0;
		$.each(data, function(i) {
			baseCtx.beginPath();
			baseCtx.arc(((intWidth-40)/(dataCount-1))*count+35,(intHeight-36)-data[i]/(maxValue-minValue)*(intHeight-36),3,0,2*Math.PI,false);
			if (data[i] >= 150) {
				baseCtx.strokeStyle = "#000";
				baseCtx.fillStyle = "#00f";
			} else if (data[i] < 150 && data[i] >= 100) {
				baseCtx.strokeStyle = "#000";
				baseCtx.fillStyle = "#0f0";
			} else if (data[i] < 100) {
				baseCtx.strokeStyle = "#000";
				baseCtx.fillStyle = "#f00";
			}
			baseCtx.stroke();
			baseCtx.fill();
			baseCtx.closePath();
			
			++count;
		})
		/* // */
	}
	
	function drawOverlay(obj) {
		/* 오버레이 */
		var overlayCtx = obj.children('.overlay')[0].getContext("2d");
		var overlayCanvas = obj.children('.overlay')[0];
		
		overlayCtx.font = 'bold 10pt Nanum Gothic';
		overlayCtx.font
		
		var pointData = new Array();
		count = 0;
		$.each(data, function(i) {
			pointData[count] = new Array();
			pointData[count]['x'] = ((intWidth-40)/(dataCount-1))*count+35;
			pointData[count]['y'] = (intHeight-36)-data[i]/(maxValue-minValue)*(intHeight-36);
			pointData[count]['data'] = i + ': ' + data[i];
			++count;
		});
		
		$(overlayCanvas).mousemove(function(e) {
			overlayCtx.clearRect(0, 0, intWidth, intHeight);
			var mx = e.offsetX;
			var my = e.offsetY;
			
			for (var i=0; i<dataCount; i++ ) {
				if (pointData[i]['x']-6 < mx && pointData[i]['x']+6 > mx &&
					pointData[i]['y']-6 < my && pointData[i]['y']+6 > my ) {
					
					if ( intWidth < mx+pointData[i]['data'].length*9 ) {
						overlayCtx.beginPath();
						overlayCtx.rect(mx-pointData[i]['data'].length*9-4, my-15, pointData[i]['data'].length*9+2, 20);
						overlayCtx.fillStyle = 'white';
						overlayCtx.fill();
						overlayCtx.lineWidth = 2;
						overlayCtx.strokeStyle = 'black';
						overlayCtx.stroke();
						overlayCtx.fillStyle = 'black';
						overlayCtx.fillText(pointData[i]['data'], mx-pointData[i]['data'].length*9, my);
						overlayCtx.closePath();
					} else {
						overlayCtx.beginPath();
						overlayCtx.rect(mx-4, my-15, pointData[i]['data'].length*9+2, 20);
						overlayCtx.fillStyle = 'white';
						overlayCtx.fill();
						overlayCtx.lineWidth = 2;
						overlayCtx.strokeStyle = 'black';
						overlayCtx.stroke();
						overlayCtx.fillStyle = 'black';
						overlayCtx.fillText(pointData[i]['data'], mx, my);
						overlayCtx.closePath();
					}
				}
			}
		});
		/* // */
	}
})(jQuery);