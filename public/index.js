document.addEventListener('DOMContentLoaded', init, false);

function init() {
    $('#play').click(function() {       
		var videoName = $('input[name=video]:checked').val();
		var video = document.getElementById('videoPlayer');	
		video.src = "./api/stream?videoName=" + videoName;
		video.play();
    });
}