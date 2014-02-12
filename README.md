jquery-simple-chart
===================

사용방법
--------
1. 스크립트와 스타일시트를 불러옵니다.
   <code>&lt;link rel="stylesheet" type="text/css" href="resources/styles/jquery.chart.css"&gt;</code>
   <code>&lt;script type="text/javascript" src="resources/scripts/jquery.chart.js"&gt;&lt;/script&gt;</code>
2. HTML Element를 생성합니다.
   <code>&lt;div id="chart"&gt;&lt;/div&gt;</code>
3. 데이터를 생성합니다.<br>
   <code>var data = { 
					"1월" : 40, 
					"2월" : 30, 
					"3월" : 70, 
					"4월" : 100, 
					"5월" : 140, <br>
					"6월" : 180, 
					"7월" : 200, 
					"8월" : 160, 
					"9월" : 100, 
					"10월" : 60, 
					"11월" : 40, 
					"12월" : 60 
				};</code>
4. 차트를 생성합니다.
   ```
   $('#chart').chart({
					data: data,
					width: '800px',
					height: '500px',
					minValue: 0,
					maxValue: 250,
					step: 50
				});```
