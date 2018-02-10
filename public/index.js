document.addEventListener('DOMContentLoaded', init, false);

function init() {
    $('#play').click(function() {       
		var videoName = $('input[name=video]:checked').val();
		var xhr = new XMLHttpRequest();		
		xhr.responseType = 'blob'; //so you can access the response like a normal URL		
		xhr.onreadystatechange = function () {
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				var video = document.getElementById('videoPlayer');				
			    video.src = URL.createObjectURL(xhr.response);
			    video.play();				
			}
		};		
		xhr.open('POST', 'api/stream', true);		
		xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
		xhr.send(JSON.stringify({name:videoName}));
    });
}